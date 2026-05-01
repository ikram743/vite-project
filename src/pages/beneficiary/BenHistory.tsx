import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BenSidebar from '../../components/beneficiary/BenSidebar';
import { FaStore, FaCalendar, FaBox, FaStar, FaRegStar, FaSpinner } from 'react-icons/fa';
import { getMyRequests } from '../../lib/API';

interface HistoryItem {
  id: string;
  food: string;
  donor: string;
  quantity: string;
  quantityValue: number;
  unit: string;
  date: string;
  status: 'delivered' | 'cancelled' | 'pending' | 'approved';
  rating: number;
  feedback?: string;
  donationId: string;
}

const BenHistory = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedYear, setSelectedYear] = useState('2024');
  const [showFeedback, setShowFeedback] = useState<string | null>(null);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMyRequests();
      console.log('History API response:', response);
      
      let requests = [];
      if (response && response.requests) {
        requests = response.requests;
      } else if (response && response.data) {
        requests = response.data;
      } else if (Array.isArray(response)) {
        requests = response;
      }
      
      const formattedHistory: HistoryItem[] = requests.map((req: any) => ({
        id: req.id,
        food: req.donation?.foodType || req.foodType || 'Food Item',
        donor: req.donation?.donor?.user?.name || req.donorName || req.donor?.name || 'Donor',
        quantity: `${req.requestedQuantity || req.quantity || 0} ${req.donation?.unit || req.unit || 'kg'}`,
        quantityValue: req.requestedQuantity || req.quantity || 0,
        unit: req.donation?.unit || req.unit || 'kg',
        date: req.requestDate || req.createdAt ? new Date(req.requestDate || req.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        status: mapStatus(req.status),
        rating: req.rating || 0,
        feedback: req.feedback || req.notes || '',
        donationId: req.donation?.id || req.donationId,
      }));
      
      setHistoryItems(formattedHistory);
    } catch (err: any) {
      console.error('Error loading history:', err);
      setError(err.message || 'Failed to load order history');
    } finally {
      setLoading(false);
    }
  };

  const mapStatus = (status: string): 'delivered' | 'cancelled' | 'pending' | 'approved' => {
    const upperStatus = status?.toUpperCase() || '';
    switch(upperStatus) {
      case 'COLLECTED':
      case 'COMPLETED':
      case 'DELIVERED':
        return 'delivered';
      case 'REJECTED':
      case 'CANCELLED':
        return 'cancelled';
      case 'APPROVED':
        return 'approved';
      default:
        return 'pending';
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'delivered':
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Delivered</span>;
      case 'approved':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Approved</span>;
      case 'pending':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Pending</span>;
      case 'cancelled':
        return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Cancelled</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const years = ['2024', '2023', '2022'];
  
  const filteredHistory = historyItems.filter(item => {
    const matchesYear = item.date.includes(selectedYear);
    return matchesYear;
  });
  
  const totalOrders = filteredHistory.length;
  const totalMeals = filteredHistory.reduce((sum, item) => sum + item.quantityValue, 0);
  const averageRating = filteredHistory.length > 0 
    ? (filteredHistory.reduce((sum, item) => sum + item.rating, 0) / filteredHistory.length).toFixed(1)
    : '0';

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          star <= rating ? (
            <FaStar key={star} className="text-yellow-500 text-sm" />
          ) : (
            <FaRegStar key={star} className="text-gray-300 text-sm" />
          )
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <BenSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <FaSpinner className="animate-spin text-4xl text-primary-600 mx-auto mb-4" />
              <p className="text-gray-500">Loading order history...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <BenSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
          <div className="p-6">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <p className="text-red-600">{error}</p>
              <button 
                onClick={loadHistory}
                className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Try Again
              </button>
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
            <div className="flex items-center gap-2 text-primary-600 mb-1">
              <FaCalendar className="text-sm" />
              <span className="text-xs font-medium uppercase tracking-wide">Order History</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Order History</h1>
            <p className="text-gray-500 mt-1">View your past orders and deliveries</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-primary-600">{totalOrders}</div>
              <div className="text-sm text-gray-500 mt-1">Total Orders</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-green-600">{totalMeals}</div>
              <div className="text-sm text-gray-500 mt-1">Meals Received</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-yellow-500">{averageRating}</div>
              <div className="text-sm text-gray-500 mt-1">Average Rating</div>
            </div>
          </div>

          {/* Year Filter */}
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <span className="text-sm text-gray-500 font-medium">Filter by year:</span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              {years.map(year => (
                <button 
                  key={year} 
                  onClick={() => setSelectedYear(year)} 
                  className={`px-4 py-1.5 rounded-md transition-all text-sm font-medium ${
                    selectedYear === year 
                      ? 'bg-white text-primary-600 shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          {/* History List */}
          {filteredHistory.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCalendar className="text-3xl text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">No order history found</h3>
              <p className="text-gray-400 text-sm mt-1 mb-5">
                {historyItems.length === 0 
                  ? "You haven't placed any orders yet" 
                  : `No orders found for ${selectedYear}`}
              </p>
              <button 
                onClick={() => navigate('/beneficiary/surplus')} 
                className="px-6 py-2.5 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 transition-colors"
              >
                Browse Food Surplus
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHistory.map((item) => (
                <div key={item.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <h3 className="font-semibold text-gray-800 text-lg">{item.food}</h3>
                        {getStatusBadge(item.status)}
                      </div>
                      <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
                        <FaStore className="text-xs" /> {item.donor}
                      </p>
                      <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-400">
                        <span className="flex items-center gap-1"><FaBox className="text-xs" /> {item.quantity}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><FaCalendar className="text-xs" /> {item.date}</span>
                      </div>
                      <div className="mt-2">{renderStars(item.rating)}</div>
                      {showFeedback === item.id && item.feedback && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-600 italic border-l-4 border-primary-500">
                          "{item.feedback}"
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4 pt-3 border-t border-gray-100">
                    {item.feedback && (
                      <button 
                        onClick={() => setShowFeedback(showFeedback === item.id ? null : item.id)} 
                        className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                      >
                        {showFeedback === item.id ? 'Hide Feedback' : 'View Feedback'}
                      </button>
                    )}
                    <button 
                      onClick={() => navigate('/beneficiary/surplus')} 
                      className={`${item.feedback ? 'flex-1' : 'w-full'} py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 transition-colors`}
                    >
                      Order Again
                    </button>
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

export default BenHistory;