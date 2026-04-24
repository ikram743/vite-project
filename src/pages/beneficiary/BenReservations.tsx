import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BenSidebar from '../../components/beneficiary/BenSidebar';
import { FaCheckCircle, FaClock, FaMapMarkerAlt, FaCalendar, FaStore } from 'react-icons/fa';

interface Reservation {
  id: number;
  food: string;
  donor: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  code: string;
  pickupLocation: string;
}

const BenReservations = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending' | 'completed'>('all');

  const reservations: Reservation[] = [
    { id: 1, food: 'Ready Meals', donor: 'Restaurant El Djazair', date: '2024-12-20', time: '14:00', status: 'confirmed', code: 'RES-001', pickupLocation: 'Alger Centre' },
    { id: 2, food: 'Fresh Bread', donor: 'Boulangerie Nour', date: '2024-12-21', time: '10:00', status: 'pending', code: 'RES-002', pickupLocation: 'Oran' },
    { id: 3, food: 'Vegetables', donor: 'Marché El Fellah', date: '2024-12-19', time: '09:00', status: 'completed', code: 'RES-003', pickupLocation: 'Constantine' },
    { id: 4, food: 'Fruits', donor: 'Fresh Market Algiers', date: '2024-12-22', time: '11:00', status: 'confirmed', code: 'RES-004', pickupLocation: 'Bab Ezzouar' },
  ];

  const filteredReservations = filter === 'all' ? reservations : reservations.filter(r => r.status === filter);
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'confirmed': return 'Confirmed';
      case 'pending': return 'Pending';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const stats = {
    total: reservations.length,
    confirmed: reservations.filter(r => r.status === 'confirmed').length,
    pending: reservations.filter(r => r.status === 'pending').length,
    completed: reservations.filter(r => r.status === 'completed').length,
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <BenSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">My Reservations</h1>
            <p className="text-gray-500 mt-1">View and manage your food reservations</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
              <div className="text-sm text-gray-500">Confirmed</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-gray-500">Pending</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-blue-600">{stats.completed}</div>
              <div className="text-sm text-gray-500">Completed</div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <button 
              onClick={() => setFilter('all')} 
              className={`px-4 py-2 rounded-lg transition-all text-sm ${filter === 'all' ? 'bg-gray-800 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
            >
              All ({stats.total})
            </button>
            <button 
              onClick={() => setFilter('confirmed')} 
              className={`px-4 py-2 rounded-lg transition-all text-sm ${filter === 'confirmed' ? 'bg-green-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
            >
              Confirmed ({stats.confirmed})
            </button>
            <button 
              onClick={() => setFilter('pending')} 
              className={`px-4 py-2 rounded-lg transition-all text-sm ${filter === 'pending' ? 'bg-yellow-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
            >
              Pending ({stats.pending})
            </button>
            <button 
              onClick={() => setFilter('completed')} 
              className={`px-4 py-2 rounded-lg transition-all text-sm ${filter === 'completed' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
            >
              Completed ({stats.completed})
            </button>
          </div>

          {/* Reservations List */}
          <div className="space-y-4">
            {filteredReservations.map((res) => (
              <div key={res.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <h3 className="font-semibold text-gray-800 text-lg">{res.food}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(res.status)}`}>
                        {res.status === 'confirmed' && <FaCheckCircle className="text-xs" />}
                        {res.status === 'pending' && <FaClock className="text-xs" />}
                        {getStatusText(res.status)}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
                      <FaStore className="text-xs" /> {res.donor}
                    </p>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-400">
                      <span className="flex items-center gap-1"><FaCalendar className="text-xs" /> {res.date}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><FaClock className="text-xs" /> {res.time}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><FaMapMarkerAlt className="text-xs" /> {res.pickupLocation}</span>
                      <span>•</span>
                      <span>Code: {res.code}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-4 pt-3 border-t border-gray-100">
                  {res.status === 'pending' && (
                    <>
                      <button className="flex-1 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 transition-colors">
                        Confirm
                      </button>
                      <button className="flex-1 py-2 bg-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-400 transition-colors">
                        Cancel
                      </button>
                    </>
                  )}
                  {res.status === 'confirmed' && (
                    <button className="flex-1 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 transition-colors">
                      Get Directions
                    </button>
                  )}
                  {res.status === 'completed' && (
                    <button className="flex-1 py-2 bg-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-300 transition-colors">
                      Leave a Review
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredReservations.length === 0 && (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
              <FaCalendar className="text-6xl text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-800">No reservations found</h3>
              <p className="text-gray-400 text-sm mt-1 mb-4">
                You don't have any {filter !== 'all' ? filter : ''} reservations
              </p>
              <button 
                onClick={() => navigate('/beneficiary/surplus')} 
                className="px-6 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 transition-colors"
              >
                Browse Food Surplus
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BenReservations;