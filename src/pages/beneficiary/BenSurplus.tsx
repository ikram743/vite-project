// src/pages/beneficiary/BenSurplus.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BenSidebar from '../../components/beneficiary/BenSidebar';
import { FaSpinner, FaStore, FaBox, FaCalendarAlt, FaMapMarkerAlt, FaSearch, FaFilter, FaUtensils } from 'react-icons/fa';
import { getDonations, createRequest, getWilayas } from '../../lib/API';
import toast from 'react-hot-toast';

interface Donation {
  id: string;
  foodType: string;
  description?: string;
  totalQuantity: number;
  unit: string;
  expirationDate: string;
  pickupAddress: string;
  pickupTime?: string;
  requiresRefrigeration?: boolean;
  donor: {
    user: {
      name: string;
    };
  };
}

const BenSurplus = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [wilayas, setWilayas] = useState<any[]>([]);
  const [selectedWilaya, setSelectedWilaya] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [reserving, setReserving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWilayas = async () => {
      try {
        const data = await getWilayas();
        setWilayas(data);
      } catch (error) {
        console.error('Error loading wilayas:', error);
      }
    };
    loadWilayas();
    loadDonations();
  }, []);

  const loadDonations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getDonations(1, 50);
      console.log('Donations response:', response);
      
      let donationsData = [];
      if (response && response.donations) {
        donationsData = response.donations;
      } else if (response && response.data) {
        donationsData = response.data;
      } else if (Array.isArray(response)) {
        donationsData = response;
      }
      
      setDonations(donationsData);
    } catch (err: any) {
      console.error('Error loading donations:', err);
      setError(err.message || 'Failed to load donations');
      toast.error('Failed to load food surplus');
    } finally {
      setLoading(false);
    }
  };

  const filteredDonations = donations.filter((donation) => {
    const matchesSearch = donation.foodType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          donation.donor?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWilaya = !selectedWilaya || donation.pickupAddress?.toLowerCase().includes(selectedWilaya.toLowerCase());
    return matchesSearch && matchesWilaya;
  });

  const handleReserveClick = (donation: Donation) => {
    setSelectedDonation(donation);
    setQuantity(1);
    setNotes('');
    setShowModal(true);
  };

  const handleConfirmReserve = async () => {
    if (!selectedDonation) return;
    
    if (quantity > selectedDonation.totalQuantity) {
      toast.error(`Maximum quantity is ${selectedDonation.totalQuantity} ${selectedDonation.unit}`);
      return;
    }
    
    setReserving(true);
    try {
      const response = await createRequest(selectedDonation.id, quantity, notes);
      console.log('Reservation response:', response);
      
      if (response?.success || response?.request || response?.data) {
        toast.success('Reservation created successfully! 🎉');
        setShowModal(false);
        loadDonations(); // Refresh the list
      } else {
        const errorMsg = response?.message || 'Failed to create reservation';
        toast.error(errorMsg);
      }
    } catch (err: any) {
      console.error('Error creating reservation:', err);
      toast.error(err.message || 'Failed to create reservation');
    } finally {
      setReserving(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `${diffDays} days left`;
    return date.toLocaleDateString();
  };

  const getExpiryColor = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (diffDays <= 1) return 'text-red-600 bg-red-50';
    if (diffDays <= 3) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <BenSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <FaSpinner className="animate-spin text-4xl text-primary-600 mx-auto mb-4" />
              <p className="text-gray-500">Loading available food surplus...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <BenSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-primary-600 mb-1">
              <FaUtensils className="text-sm" />
              <span className="text-xs font-medium uppercase tracking-wide">Food Surplus</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Available Food Surplus</h1>
            <p className="text-gray-500 mt-1">Browse and reserve food donations near you</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
              <button onClick={loadDonations} className="ml-3 underline">Try again</button>
            </div>
          )}

          {/* Search and Filter */}
          <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-100">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by food or donor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              <div>
                <div className="relative">
                  <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={selectedWilaya}
                    onChange={(e) => setSelectedWilaya(e.target.value)}
                    className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All Wilayas</option>
                    {wilayas.map((w) => (
                      <option key={w.code} value={w.name}>{w.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Donations Grid */}
          {filteredDonations.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUtensils className="text-3xl text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">No food surplus available</p>
              <p className="text-gray-400 text-sm mt-1">
                {searchTerm || selectedWilaya 
                  ? "Try adjusting your search or filter" 
                  : "Check back later for new donations"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredDonations.map((donation) => (
                <div key={donation.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800 text-lg">{donation.foodType}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getExpiryColor(donation.expirationDate)}`}>
                      {formatDate(donation.expirationDate)}
                    </span>
                  </div>
                  
                  <p className="text-primary-600 text-sm mt-1 flex items-center gap-1">
                    <FaStore className="text-xs" /> {donation.donor?.user?.name || 'Donor'}
                  </p>
                  
                  <div className="flex flex-wrap gap-3 text-sm text-gray-500 mt-3">
                    <span className="flex items-center gap-1"><FaBox className="text-xs" /> {donation.totalQuantity} {donation.unit}</span>
                    <span className="flex items-center gap-1"><FaCalendarAlt className="text-xs" /> {new Date(donation.expirationDate).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><FaMapMarkerAlt className="text-xs" /> {donation.pickupAddress.split(',')[0]}</span>
                  </div>
                  
                  {donation.requiresRefrigeration && (
                    <span className="inline-block mt-2 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                      ❄️ Requires refrigeration
                    </span>
                  )}
                  
                  {donation.description && (
                    <p className="text-gray-500 text-sm mt-2 line-clamp-2">{donation.description}</p>
                  )}
                  
                  <button
                    onClick={() => handleReserveClick(donation)}
                    className="w-full mt-4 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                  >
                    Reserve Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Reservation Modal */}
      {showModal && selectedDonation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Reserve Food</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            
            <div className="mb-4 space-y-2">
              <p className="text-gray-600"><strong className="text-gray-800">Food:</strong> {selectedDonation.foodType}</p>
              <p className="text-gray-600"><strong className="text-gray-800">Donor:</strong> {selectedDonation.donor?.user?.name}</p>
              <p className="text-gray-600"><strong className="text-gray-800">Available:</strong> {selectedDonation.totalQuantity} {selectedDonation.unit}</p>
              <p className="text-gray-600"><strong className="text-gray-800">Pickup:</strong> {selectedDonation.pickupAddress}</p>
              {selectedDonation.pickupTime && (
                <p className="text-gray-600"><strong className="text-gray-800">Pickup Time:</strong> {selectedDonation.pickupTime}</p>
              )}
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity ({selectedDonation.unit})</label>
              <input
                type="number"
                min="1"
                max={selectedDonation.totalQuantity}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any special instructions or requirements..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowModal(false)} 
                className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={reserving}
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmReserve} 
                disabled={reserving}
                className="flex-1 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {reserving ? <FaSpinner className="animate-spin" /> : null}
                {reserving ? 'Reserving...' : 'Confirm Reservation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BenSurplus;