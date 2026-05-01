import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DonorSidebar from '../../components/donor/DonorSidebar';
import { FaSave, FaTimes, FaSpinner } from 'react-icons/fa';
import { createDonation, getDonationUnits } from '../../lib/API';
import toast from 'react-hot-toast';

const DonorAddSurplus = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [units, setUnits] = useState<{ value: string; label: string }[]>([]);
  const [locationLoading, setLocationLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    foodType: '',
    category: '',
    totalQuantity: '',
    unit: 'kg',
    expirationDate: '',
    pickupTime: '',
    pickupAddress: '',
    description: '',
    requiresRefrigeration: false,
    handlingInstructions: '',
    latitude: '',
    longitude: ''
  });

  // Fetch units on component mount
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await getDonationUnits();
        console.log('Units response:', response);
        
        if (response?.data?.units) {
          setUnits(response.data.units);
        } else if (response?.units) {
          setUnits(response.units);
        } else if (Array.isArray(response)) {
          const formattedUnits = response.map((unit: string) => ({ value: unit, label: unit }));
          setUnits(formattedUnits);
        }
      } catch (error) {
        console.error('Error fetching units:', error);
      }
    };
    fetchUnits();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError(null);
  };

  // Geocode address to get coordinates
  const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  // Get user's current location
  const getCurrentLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({
            ...prev,
            latitude: latitude.toString(),
            longitude: longitude.toString()
          }));
          
          // Reverse geocode to get address
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
            const data = await response.json();
            if (data && data.display_name) {
              setFormData(prev => ({
                ...prev,
                pickupAddress: data.display_name
              }));
            }
          } catch (error) {
            console.error('Reverse geocoding error:', error);
          }
          
          setLocationLoading(false);
          toast.success('Location detected successfully');
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Unable to get your location. Please enter address manually.');
          setLocationLoading(false);
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
      setLocationLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.foodType) throw new Error('Food title is required');
      if (!formData.category) throw new Error('Category is required');
      if (!formData.totalQuantity || parseFloat(formData.totalQuantity) <= 0) throw new Error('Valid quantity is required');
      if (!formData.expirationDate) throw new Error('Expiration date is required');
      if (!formData.pickupAddress) throw new Error('Pickup address is required');

      // Geocode address to get coordinates
      let coordinates: [number, number] = [0, 0];
      if (formData.latitude && formData.longitude) {
        coordinates = [parseFloat(formData.longitude), parseFloat(formData.latitude)];
      } else {
        const geoResult = await geocodeAddress(formData.pickupAddress);
        if (geoResult) {
          coordinates = [geoResult.lng, geoResult.lat];
        }
      }

      // Prepare data for backend - matching the backend schema
      const donationData = {
        foodType: formData.foodType,
        category: formData.category.toLowerCase(),
        totalQuantity: parseFloat(formData.totalQuantity),
        unit: formData.unit,
        expirationDate: formData.expirationDate,
        pickupAddress: formData.pickupAddress,
        description: formData.description || undefined,
        requiresRefrigeration: formData.requiresRefrigeration,
        handlingInstructions: formData.handlingInstructions || undefined,
        pickupLocation: {
          type: "Point" as const,
          coordinates: coordinates
        }
      };

      console.log('Sending donation data:', donationData);
      const response = await createDonation(donationData);
      console.log('Create donation response:', response);
      
      if (response?.success || response?.data || response?.donation) {
        toast.success('Food surplus added successfully! 🎉');
        navigate('/donor/surplus');
      } else {
        const errorMsg = response?.message || 'Failed to create donation';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err: any) {
      console.error('Error creating donation:', err);
      const errorMsg = err.message || 'An error occurred while adding the surplus';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Category options mapping
  const categoryOptions = [
    { value: 'bakery', label: '🥖 Bakery' },
    { value: 'vegetables', label: '🥬 Vegetables' },
    { value: 'fruits', label: '🍎 Fruits' },
    { value: 'meals', label: '🍲 Prepared Food' },
    { value: 'dairy', label: '🥛 Dairy' },
    { value: 'meat', label: '🍖 Meat' },
    { value: 'other', label: '📦 Other' }
  ];

  // Unit options (fallback if API doesn't return)
  const defaultUnits = [
    { value: 'kg', label: 'Kilogrammes (kg)' },
    { value: 'g', label: 'Grammes (g)' },
    { value: 'L', label: 'Litres (L)' },
    { value: 'mL', label: 'Millilitres (mL)' },
    { value: 'pieces', label: 'Pièces' },
    { value: 'units', label: 'Unités' },
    { value: 'meals', label: 'Repas' },
    { value: 'boxes', label: 'Boîtes' }
  ];

  const displayUnits = units.length > 0 ? units : defaultUnits;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DonorSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Add New Surplus</h1>
            <p className="text-gray-500 mt-1">Share your food surplus with those in need</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Food Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Food Title *</label>
                  <input 
                    type="text" 
                    name="foodType" 
                    value={formData.foodType} 
                    onChange={handleChange} 
                    placeholder="e.g., Fresh Bread, Mixed Vegetables"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" 
                    required 
                    disabled={loading}
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select 
                    name="category" 
                    value={formData.category} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required 
                    disabled={loading}
                  >
                    <option value="">Select category</option>
                    {categoryOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                  <input 
                    type="number" 
                    name="totalQuantity" 
                    value={formData.totalQuantity} 
                    onChange={handleChange} 
                    step="0.1"
                    min="0.1"
                    placeholder="e.g., 5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" 
                    required 
                    disabled={loading}
                  />
                </div>

                {/* Unit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit *</label>
                  <select 
                    name="unit" 
                    value={formData.unit} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    disabled={loading}
                  >
                    {displayUnits.map(unit => (
                      <option key={unit.value} value={unit.value}>{unit.label}</option>
                    ))}
                  </select>
                </div>

                {/* Expiry Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date *</label>
                  <input 
                    type="date" 
                    name="expirationDate" 
                    value={formData.expirationDate} 
                    onChange={handleChange} 
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" 
                    required 
                    disabled={loading}
                  />
                </div>

                {/* Pickup Time (optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Pickup Time</label>
                  <input 
                    type="time" 
                    name="pickupTime" 
                    value={formData.pickupTime} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" 
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-400 mt-1">Optional: Specify preferred pickup time</p>
                </div>

                {/* Location */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Address *</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      name="pickupAddress" 
                      placeholder="e.g., Algiers, 123 Street, Building Name"
                      value={formData.pickupAddress} 
                      onChange={handleChange} 
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" 
                      required 
                      disabled={loading}
                    />
                    <button 
                      type="button"
                      onClick={getCurrentLocation}
                      disabled={locationLoading || loading}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm whitespace-nowrap disabled:opacity-50"
                    >
                      {locationLoading ? '⏳ Loading...' : '📍 Use my location'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Full address where beneficiaries can pick up the food</p>
                </div>

                {/* Requires Refrigeration */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="requiresRefrigeration" 
                      checked={formData.requiresRefrigeration} 
                      onChange={handleChange} 
                      className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                      disabled={loading}
                    />
                    <span className="text-sm text-gray-700">❄️ Requires refrigeration</span>
                  </label>
                </div>

                {/* Handling Instructions */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Handling Instructions</label>
                  <textarea 
                    name="handlingInstructions" 
                    rows={2} 
                    value={formData.handlingInstructions} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" 
                    placeholder="e.g., Keep refrigerated, Handle with care, Allergen information..."
                    disabled={loading}
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Description</label>
                  <textarea 
                    name="description" 
                    rows={3} 
                    value={formData.description} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" 
                    placeholder="Any additional details about the food (ingredients, allergens, etc.)..."
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => navigate('/donor/surplus')} 
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                  disabled={loading}
                >
                  <FaTimes /> Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                  {loading ? 'Adding...' : 'Add Surplus'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DonorAddSurplus;