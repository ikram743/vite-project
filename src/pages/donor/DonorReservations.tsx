import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DonorSidebar from '../../components/donor/DonorSidebar';
import { FaCheck, FaTimes, FaComment, FaEye, FaSpinner } from 'react-icons/fa';
import { getReceivedRequests, updateRequestStatus } from '../../lib/API';
import toast from 'react-hot-toast';

interface Reservation {
  id: string;
  title: string;
  beneficiary: string;
  phone: string;
  quantity: string;
  quantityValue: number;
  unit: string;
  date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  donationId: string;
  beneficiaryId: string;
}

const DonorReservations = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');

  const loadReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getReceivedRequests();
      console.log('Received requests:', response);
      
      let requests = [];
      if (response?.data?.requests) {
        requests = response.data.requests;
      } else if (response?.requests) {
        requests = response.requests;
      } else if (Array.isArray(response)) {
        requests = response;
      }
      
      const formattedReservations: Reservation[] = requests.map((req: any) => ({
        id: req.id,
        title: req.donation?.foodType || req.foodType || req.title || 'Food Item',
        beneficiary: req.beneficiary?.user?.name || req.beneficiaryName || req.beneficiary?.name || 'Beneficiary',
        phone: req.beneficiary?.user?.phone || req.beneficiary?.phone || req.phone || 'Not provided',
        quantity: `${req.requestedQuantity || req.quantity || 0} ${req.donation?.unit || req.unit || 'kg'}`,
        quantityValue: req.requestedQuantity || req.quantity || 0,
        unit: req.donation?.unit || req.unit || 'kg',
        date: req.requestDate || req.createdAt ? new Date(req.requestDate || req.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        status: mapStatus(req.status),
        notes: req.notes || req.feedback || '',
        donationId: req.donation?.id || req.donationId,
        beneficiaryId: req.beneficiary?.id || req.beneficiaryId,
      }));
      
      setReservations(formattedReservations);
    } catch (err: any) {
      console.error('Error loading reservations:', err);
      setError(err.message || 'Failed to load reservations');
      toast.error('Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  const mapStatus = (status: string): 'pending' | 'confirmed' | 'completed' | 'cancelled' => {
    const upperStatus = status?.toUpperCase() || '';
    switch(upperStatus) {
      case 'PENDING':
        return 'pending';
      case 'APPROVED':
      case 'CONFIRMED':
      case 'ACCEPTED':
        return 'confirmed';
      case 'COLLECTED':
      case 'COMPLETED':
      case 'DELIVERED':
        return 'completed';
      case 'REJECTED':
      case 'CANCELLED':
      case 'DECLINED':
        return 'cancelled';
      default:
        return 'pending';
    }
  };

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'confirmed': return 'bg-emerald-100 text-emerald-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleConfirm = async (id: string) => {
    setProcessingId(id);
    try {
      await updateRequestStatus(id, 'APPROVED');
      setReservations(prev =>
        prev.map(res =>
          res.id === id ? { ...res, status: 'confirmed' } : res
        )
      );
      toast.success('Reservation confirmed successfully!');
    } catch (err: any) {
      console.error('Error confirming reservation:', err);
      toast.error(err.message || 'Failed to confirm reservation');
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancel = async (id: string) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
    
    setProcessingId(id);
    try {
      await updateRequestStatus(id, 'REJECTED');
      setReservations(prev =>
        prev.map(res =>
          res.id === id ? { ...res, status: 'cancelled' } : res
        )
      );
      toast.success('Reservation cancelled');
    } catch (err: any) {
      console.error('Error cancelling reservation:', err);
      toast.error(err.message || 'Failed to cancel reservation');
    } finally {
      setProcessingId(null);
    }
  };

  const handleContact = (phone: string, name: string) => {
    if (phone && phone !== 'Not provided') {
      window.location.href = `tel:${phone.replace(/\s/g, '')}`;
    } else {
      toast.custom((t) => (
  <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg`}>
    📞 No phone number available for {name}
  </div>
));
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const filteredReservations = reservations.filter(res => 
    filter === 'all' || res.status === filter
  );

  const counts = {
    all: reservations.length,
    pending: reservations.filter(r => r.status === 'pending').length,
    confirmed: reservations.filter(r => r.status === 'confirmed').length,
    completed: reservations.filter(r => r.status === 'completed').length,
    cancelled: reservations.filter(r => r.status === 'cancelled').length,
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <DonorSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <FaSpinner className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
              <p className="mt-4 text-gray-500">Loading reservations...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DonorSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="p-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Reservations</h1>
          <p className="text-gray-500 mb-6">Manage your food surplus reservations</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
              <button onClick={loadReservations} className="ml-3 underline">Try again</button>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === 'all' 
                  ? 'bg-primary-600 text-white shadow-md' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              All ({counts.all})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === 'pending' 
                  ? 'bg-amber-600 text-white shadow-md' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Pending ({counts.pending})
            </button>
            <button
              onClick={() => setFilter('confirmed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === 'confirmed' 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Confirmed ({counts.confirmed})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === 'completed' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Completed ({counts.completed})
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === 'cancelled' 
                  ? 'bg-red-600 text-white shadow-md' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Cancelled ({counts.cancelled})
            </button>
          </div>

          {filteredReservations.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaComment className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">No reservations found</p>
              <p className="text-gray-400 text-sm mt-1">
                {filter === 'all' 
                  ? "When beneficiaries request your donations, they'll appear here"
                  : `No ${filter} reservations at the moment`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReservations.map((res) => (
                <div key={res.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{res.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{res.beneficiary}</p>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                        <span><i className="fas fa-phone mr-1"></i> {res.phone}</span>
                        <span><i className="fas fa-weight mr-1"></i> {res.quantity}</span>
                        <span><i className="fas fa-calendar mr-1"></i> {res.date}</span>
                      </div>
                      {res.notes && (
                        <p className="text-gray-500 text-sm mt-2 italic">📝 {res.notes}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(res.status)}`}>
                        {res.status.charAt(0).toUpperCase() + res.status.slice(1)}
                      </span>
                      <div className="flex gap-2 mt-2 flex-wrap justify-end">
                        {res.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleConfirm(res.id)}
                              disabled={processingId === res.id}
                              className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                            >
                              {processingId === res.id ? <FaSpinner className="animate-spin" size={12} /> : <FaCheck size={12} />}
                              Confirm
                            </button>
                            <button 
                              onClick={() => handleCancel(res.id)}
                              disabled={processingId === res.id}
                              className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                            >
                              {processingId === res.id ? <FaSpinner className="animate-spin" size={12} /> : <FaTimes size={12} />}
                              Cancel
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => handleContact(res.phone, res.beneficiary)}
                          className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1"
                        >
                          <FaComment size={12} /> Contact
                        </button>
                        <button 
                          onClick={() => navigate(`/donor/reservations/${res.id}`)}
                          className="px-3 py-1.5 bg-primary-50 text-primary-600 text-sm rounded-lg hover:bg-primary-100 transition-colors flex items-center gap-1"
                        >
                          <FaEye size={12} /> Details
                        </button>
                      </div>
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

export default DonorReservations;