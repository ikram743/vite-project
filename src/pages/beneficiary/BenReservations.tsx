// src/pages/beneficiary/BenReservations.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BenSidebar from '../../components/beneficiary/BenSidebar';
import { FaSpinner, FaStore, FaBox, FaCalendarAlt, FaMapMarkerAlt, FaEye } from 'react-icons/fa';
import { getMyRequests } from '../../lib/API';
import toast from 'react-hot-toast';

interface Request {
  id: string;
  donation: {
    id: string;
    foodType: string;
    unit: string;
    pickupAddress: string;
    pickupTime?: string;
    donor: {
      user: {
        name: string;
      };
    };
  };
  requestedQuantity: number;
  status: string;
  requestDate: string;
  notes?: string;
}

const BenReservations = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMyRequests();
      console.log('Requests response:', response);
      
      let requestsData = [];
      if (response && response.requests) {
        requestsData = response.requests;
      } else if (response && response.data) {
        requestsData = response.data;
      } else if (Array.isArray(response)) {
        requestsData = response;
      }
      
      setRequests(requestsData);
    } catch (err: any) {
      console.error('Error loading requests:', err);
      setError(err.message || 'Failed to load reservations');
      toast.error('Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'APPROVED': return 'bg-green-100 text-green-700';
      case 'PENDING': return 'bg-green-100 text-green-700';
      case 'REJECTED': return 'bg-green-100 text-green-700';
      case 'COLLECTED':
      case 'COMPLETED':
      case 'DELIVERED': return 'bg-green-100 text-green-700';
      case 'CANCELLED': return 'bg-green-100 text-green-700';
      default: return 'bg-green-100 text-green-700';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'APPROVED': return 'Approved';
      case 'PENDING': return 'Pending';
      case 'REJECTED': return 'Rejected';
      case 'COLLECTED': return 'Collected';
      case 'COMPLETED': return 'Completed';
      case 'DELIVERED': return 'Delivered';
      case 'CANCELLED': return 'Cancelled';
      default: return status;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    return 'bg-green-100 text-green-700 border-green-200';
  };

  const filteredRequests = requests.filter(req => {
    if (filter === 'all') return true;
    if (filter === 'pending') return req.status === 'PENDING';
    if (filter === 'approved') return req.status === 'APPROVED';
    if (filter === 'completed') return req.status === 'COLLECTED' || req.status === 'COMPLETED';
    if (filter === 'rejected') return req.status === 'REJECTED';
    return true;
  });

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'PENDING').length,
    approved: requests.filter(r => r.status === 'APPROVED').length,
    collected: requests.filter(r => r.status === 'COLLECTED' || r.status === 'COMPLETED').length,
    rejected: requests.filter(r => r.status === 'REJECTED').length,
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <BenSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <FaSpinner className="animate-spin text-4xl text-green-600 mx-auto mb-4" />
              <p className="text-gray-500">Loading your reservations...</p>
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
          <div className="mb-6">
            <div className="flex items-center gap-2 text-green-600 mb-1">
              <FaCalendarAlt className="text-sm" />
              <span className="text-xs font-medium uppercase tracking-wide">Reservations</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">My Reservations</h1>
            <p className="text-gray-500 mt-1">View and manage your food reservations</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
              <button onClick={loadRequests} className="ml-3 underline">Try again</button>
            </div>
          )}

          {/* Stats Cards - كلها خضراء */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-green-100">
              <div className="text-2xl font-bold text-green-600">{stats.total}</div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-green-100">
              <div className="text-2xl font-bold text-green-600">{stats.pending}</div>
              <div className="text-sm text-gray-500">Pending</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-green-100">
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
              <div className="text-sm text-gray-500">Approved</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-green-100">
              <div className="text-2xl font-bold text-green-600">{stats.collected}</div>
              <div className="text-sm text-gray-500">Collected</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-green-100">
              <div className="text-2xl font-bold text-green-600">{stats.rejected}</div>
              <div className="text-sm text-gray-500">Rejected</div>
            </div>
          </div>

          {/* Filter Buttons - كلها خضراء */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <button 
              onClick={() => setFilter('all')} 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === 'all' ? 'bg-green-600 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-green-50 border border-green-200'
              }`}
            >
              All ({stats.total})
            </button>
            <button 
              onClick={() => setFilter('pending')} 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === 'pending' ? 'bg-green-600 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-green-50 border border-green-200'
              }`}
            >
              Pending ({stats.pending})
            </button>
            <button 
              onClick={() => setFilter('approved')} 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === 'approved' ? 'bg-green-600 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-green-50 border border-green-200'
              }`}
            >
              Approved ({stats.approved})
            </button>
            <button 
              onClick={() => setFilter('completed')} 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === 'completed' ? 'bg-green-600 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-green-50 border border-green-200'
              }`}
            >
              Collected ({stats.collected})
            </button>
            <button 
              onClick={() => setFilter('rejected')} 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === 'rejected' ? 'bg-green-600 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-green-50 border border-green-200'
              }`}
            >
              Rejected ({stats.rejected})
            </button>
          </div>

          {/* Reservations List */}
          {filteredRequests.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCalendarAlt className="text-3xl text-green-400" />
              </div>
              <p className="text-gray-500 text-lg">No reservations found</p>
              <p className="text-gray-400 text-sm mt-1 mb-5">
                {requests.length === 0 
                  ? "You haven't made any reservations yet" 
                  : `No ${filter} reservations at the moment`}
              </p>
              <button 
                onClick={() => navigate('/beneficiary/surplus')} 
                className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Browse Food Surplus
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((req) => (
                <div 
                  key={req.id} 
                  className="bg-white rounded-xl p-5 shadow-sm border border-green-100 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => navigate(`/beneficiary/reservations/${req.id}`)}
                >
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="font-semibold text-gray-800 text-lg">
                          {req.donation?.foodType || 'Food Item'}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeClass(req.status)}`}>
                          {getStatusText(req.status)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm mt-3">
                        <p className="text-gray-600 flex items-center gap-2">
                          <FaStore className="text-green-500 text-xs" />
                          Donor: {req.donation?.donor?.user?.name || 'Unknown'}
                        </p>
                        <p className="text-gray-600 flex items-center gap-2">
                          <FaBox className="text-green-500 text-xs" />
                          Quantity: {req.requestedQuantity} {req.donation?.unit || 'kg'}
                        </p>
                        <p className="text-gray-600 flex items-center gap-2">
                          <FaMapMarkerAlt className="text-green-500 text-xs" />
                          Pickup: {req.donation?.pickupAddress || 'Address not specified'}
                        </p>
                        <p className="text-gray-600 flex items-center gap-2">
                          <FaCalendarAlt className="text-green-500 text-xs" />
                          Requested: {new Date(req.requestDate).toLocaleDateString()}
                        </p>
                      </div>
                      
                      {req.notes && (
                        <p className="text-gray-500 text-sm mt-3 italic">📝 {req.notes}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        className="px-4 py-2 bg-green-50 text-green-600 rounded-lg text-sm hover:bg-green-100 transition-colors flex items-center gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/beneficiary/reservations/${req.id}`);
                        }}
                      >
                        <FaEye size={12} /> Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BenReservations;