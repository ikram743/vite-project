import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BenSidebar from '../../components/beneficiary/BenSidebar';
import { FaStore, FaCalendar, FaMapMarkerAlt, FaBox, FaClock, FaCheckCircle } from 'react-icons/fa';

interface SurplusItem {
  id: number;
  name: string;
  donor: string;
  quantity: string;
  expiry: string;
  location: string;
  category: string;
  expiringSoon: boolean;
  description?: string;
  pickupTime?: string;
  phone?: string;
}

const BenSurplus = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItem, setSelectedItem] = useState<SurplusItem | null>(null);
  const [showModal, setShowModal] = useState(false);

  const surplusItems: SurplusItem[] = [
    { 
      id: 1, name: 'Cooked Meals', donor: 'Restaurant El Djazair', quantity: '50 meals', 
      expiry: '2024-12-31', location: 'Algiers Center', category: 'Meals', expiringSoon: false,
      description: 'Fresh traditional Algerian meals (couscous, tajine)',
      pickupTime: '2:00 PM - 6:00 PM',
      phone: '+213 555 123 456'
    },
    { 
      id: 2, name: 'Fresh Bread', donor: 'Nour Bakery', quantity: '100 pieces', 
      expiry: '2024-12-30', location: 'Oran', category: 'Bakery', expiringSoon: false,
      description: 'Fresh bread baked this morning',
      pickupTime: '8:00 AM - 12:00 PM',
      phone: '+213 555 234 567'
    },
    { 
      id: 3, name: 'Mixed Vegetables', donor: 'El Fellah Market', quantity: '30 kg', 
      expiry: '2024-12-29', location: 'Constantine', category: 'Vegetables', expiringSoon: true,
      description: 'Fresh vegetables: tomatoes, potatoes, carrots, onions',
      pickupTime: '9:00 AM - 5:00 PM',
      phone: '+213 555 345 678'
    },
    { 
      id: 4, name: 'Seasonal Fruits', donor: 'Fresh Fruit Market', quantity: '25 kg', 
      expiry: '2024-12-28', location: 'Bab Ezzouar', category: 'Fruits', expiringSoon: true,
      description: 'Fresh fruits: apples, oranges, bananas',
      pickupTime: '10:00 AM - 4:00 PM',
      phone: '+213 555 456 789'
    },
    { 
      id: 5, name: 'Fresh Milk', donor: 'Dairy Farm', quantity: '50 liters', 
      expiry: '2024-12-27', location: 'Oran', category: 'Dairy', expiringSoon: true,
      description: 'Fresh pasteurized milk, refrigerated',
      pickupTime: '8:00 AM - 10:00 AM',
      phone: '+213 555 567 890'
    },
    { 
      id: 6, name: 'Rice', donor: 'Rahma Foundation', quantity: '100 kg', 
      expiry: '2024-12-31', location: 'Constantine', category: 'Grains', expiringSoon: false,
      description: 'High-quality white rice, sealed bags',
      pickupTime: '9:00 AM - 3:00 PM',
      phone: '+213 555 678 901'
    },
  ];

  const categories = ['all', 'Meals', 'Bakery', 'Vegetables', 'Fruits', 'Dairy', 'Grains'];
  const locations = ['all', 'Algiers Center', 'Oran', 'Constantine', 'Bab Ezzouar'];

  const getExpiryStatus = (expiry: string) => {
    const today = new Date();
    const expiryDate = new Date(expiry);
    const diffDays = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 1) return { text: 'Expires today', color: 'bg-red-100 text-red-700' };
    if (diffDays <= 3) return { text: `${diffDays} days left`, color: 'bg-orange-100 text-orange-700' };
    return { text: 'Fresh', color: 'bg-green-100 text-green-700' };
  };

  const filteredItems = surplusItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.donor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesLocation = filterLocation === 'all' || item.location === filterLocation;
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const handleReserveClick = (item: SurplusItem) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleConfirmReserve = () => {
    alert(`✅ ${selectedItem?.name} reserved successfully!`);
    setShowModal(false);
    setSelectedItem(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <BenSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Available Food Surplus</h1>
            <p className="text-gray-500 mt-1">Browse and reserve food donations near you</p>
          </div>

          <div className="bg-white rounded-xl p-5 mb-6 shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by food or donor..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-3 flex-wrap">
                <select 
                  className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-600"
                  value={filterCategory} 
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
                  ))}
                </select>
                <select 
                  className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-600"
                  value={filterLocation} 
                  onChange={(e) => setFilterLocation(e.target.value)}
                >
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc === 'all' ? 'All Locations' : loc}</option>
                  ))}
                </select>
                <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                  <button onClick={() => setViewMode('grid')} className={`px-3 py-1.5 rounded-md text-sm transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500'}`}>Grid</button>
                  <button onClick={() => setViewMode('list')} className={`px-3 py-1.5 rounded-md text-sm transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500'}`}>List</button>
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-400">Found {filteredItems.length} items</div>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredItems.map((item) => {
                const expiryStatus = getExpiryStatus(item.expiry);
                return (
                  <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-800 text-lg">{item.name}</h3>
                        {item.expiringSoon && <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">Expiring soon</span>}
                      </div>
                      <p className="text-gray-500 text-sm flex items-center gap-1"><FaStore className="text-gray-400 text-xs" /> Donor: {item.donor}</p>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-400 mt-3">
                        <span className="flex items-center gap-1"><FaBox className="text-xs" /> {item.quantity}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><FaMapMarkerAlt className="text-xs" /> {item.location}</span>
                        <span>•</span>
                        <span>{item.category}</span>
                      </div>
                      <div className={`inline-flex px-2 py-1 rounded-full text-xs mt-3 ${expiryStatus.color}`}>
                        <FaClock className="text-xs mr-1" /> {expiryStatus.text}
                      </div>
                      <button onClick={() => handleReserveClick(item)} className="w-full mt-4 bg-primary-600 text-white py-2 rounded-lg text-sm hover:bg-primary-700 transition-all">Reserve Now</button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-100">
                {filteredItems.map((item) => {
                  const expiryStatus = getExpiryStatus(item.expiry);
                  return (
                    <div key={item.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-all">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-gray-800">{item.name}</h3>
                          {item.expiringSoon && <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">Expiring soon</span>}
                        </div>
                        <p className="text-gray-500 text-sm mt-1 flex items-center gap-1"><FaStore className="text-xs" /> Donor: {item.donor}</p>
                        <div className="flex gap-3 text-xs text-gray-400 mt-1">
                          <span className="flex items-center gap-1"><FaBox className="text-xs" /> {item.quantity}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1"><FaMapMarkerAlt className="text-xs" /> {item.location}</span>
                          <span>•</span>
                          <span>{item.category}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${expiryStatus.color}`}><FaClock className="text-xs" /> {expiryStatus.text}</span>
                        <button onClick={() => handleReserveClick(item)} className="block mt-2 text-primary-600 text-sm hover:underline">Reserve →</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {filteredItems.length === 0 && (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
              <FaBox className="text-6xl text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-800">No food surplus found</h3>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </main>

      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">{selectedItem.name}</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center">
                  <div><p className="text-sm text-gray-500">Donor</p><p className="font-semibold text-gray-800 flex items-center gap-1"><FaStore className="text-primary-600" /> {selectedItem.donor}</p></div>
                  <div className="text-right"><p className="text-sm text-gray-500">Phone</p><p className="font-semibold text-gray-800">{selectedItem.phone}</p></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500 flex items-center gap-1"><FaBox className="text-xs" /> Quantity</p><p className="font-semibold text-gray-800">{selectedItem.quantity}</p></div>
                <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Category</p><p className="font-semibold text-gray-800">{selectedItem.category}</p></div>
                <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500 flex items-center gap-1"><FaCalendar className="text-xs" /> Expiry Date</p><p className="font-semibold text-gray-800">{selectedItem.expiry}</p></div>
                <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500 flex items-center gap-1"><FaMapMarkerAlt className="text-xs" /> Location</p><p className="font-semibold text-gray-800">{selectedItem.location}</p></div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4"><p className="text-sm text-gray-500 flex items-center gap-1"><FaClock className="text-xs" /> Pickup Time</p><p className="font-semibold text-gray-800">{selectedItem.pickupTime}</p></div>
              {selectedItem.description && (<div className="bg-gray-50 rounded-lg p-4 mb-4"><p className="text-sm text-gray-500">Description</p><p className="text-gray-700 text-sm mt-1">{selectedItem.description}</p></div>)}
              {selectedItem.expiringSoon && (<div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4"><p className="text-red-600 text-sm font-medium">⚠️ This item is expiring soon!</p><p className="text-red-500 text-xs mt-1">Please arrange pickup as soon as possible.</p></div>)}

              <div className="flex gap-3">
                <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={handleConfirmReserve} className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">Confirm Reservation</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BenSurplus;