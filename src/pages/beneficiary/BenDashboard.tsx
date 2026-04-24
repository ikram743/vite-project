import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BenSidebar from '../../components/beneficiary/BenSidebar';

// Import professional icons
import { 
  FaChartLine, FaBox, FaCalendarCheck, FaCheckCircle, 
  FaLeaf, FaStore, FaMapMarkerAlt, FaClock, FaStar,
  FaArrowRight, FaBell, FaUserCircle, FaUtensils,
  FaBreadSlice, FaAppleAlt, FaCarrot, FaTachometerAlt,
  FaTimesCircle, FaCheck, FaExclamationTriangle
} from 'react-icons/fa';
import { 
  HiOutlineTrendingUp, HiOutlineLocationMarker, 
  HiOutlineCalendar, HiOutlineClock 
} from 'react-icons/hi';
import { MdRestaurant, MdLocalCafe, MdEmojiFoodBeverage } from 'react-icons/md';

// تعريف أنواع البيانات
interface Reservation {
  id: number;
  food: string;
  donor: string;
  time: string;
  location: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface RecentItem {
  id: number;
  name: string;
  donor: string;
  quantity: string;
  expiry: string;
  location: string;
  icon: JSX.Element;
}

const BenDashboard = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [userName] = useState('Ahmed');

  const [stats] = useState({
    available: 12,
    reservations: 3,
    completed: 8,
    mealsSaved: 125
  });

  const [recentItems] = useState<RecentItem[]>([
    { id: 1, name: 'Ready Meals', donor: 'Al Salam Restaurant', quantity: '50 meals', expiry: '2024-12-31', location: 'Algiers', icon: <MdEmojiFoodBeverage className="text-3xl text-primary-600" /> },
    { id: 2, name: 'Fresh Bread', donor: 'Al Noor Bakery', quantity: '100 pieces', expiry: '2024-12-30', location: 'Oran', icon: <FaBreadSlice className="text-3xl text-secondary-500" /> },
    { id: 3, name: 'Vegetables', donor: 'Al Fallah Market', quantity: '30 kg', expiry: '2024-12-29', location: 'Constantine', icon: <FaCarrot className="text-3xl text-green-600" /> },
  ]);

  const [upcomingReservations, setUpcomingReservations] = useState<Reservation[]>([
    { id: 1, food: 'Ready Meals', donor: 'Al Salam Restaurant', time: 'Today, 2:00 PM', location: 'Tunis', status: 'pending' },
    { id: 2, food: 'Fresh Bread', donor: 'Al Noor Bakery', time: 'Tomorrow, 10:00 AM', location: 'Ariana', status: 'confirmed' },
  ]);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  // دالة تأكيد الحجز
  const handleConfirmReservation = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setShowConfirmModal(true);
  };

  const confirmReservation = () => {
    if (selectedReservation) {
      setUpcomingReservations(prev =>
        prev.map(item =>
          item.id === selectedReservation.id
            ? { ...item, status: 'confirmed' }
            : item
        )
      );
    }
    setShowConfirmModal(false);
    setSelectedReservation(null);
  };

  // دالة إلغاء الحجز
  const handleCancelReservation = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setShowCancelModal(true);
  };

  const cancelReservation = () => {
    if (selectedReservation) {
      setUpcomingReservations(prev =>
        prev.map(item =>
          item.id === selectedReservation.id
            ? { ...item, status: 'cancelled' }
            : item
        )
      );
    }
    setShowCancelModal(false);
    setSelectedReservation(null);
    setCancelReason('');
  };

  const getStatusBadge = (status: 'pending' | 'confirmed' | 'cancelled') => {
    switch(status) {
      case 'confirmed':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1"><FaCheck className="text-xs" /> Confirmed</span>;
      case 'cancelled':
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full flex items-center gap-1"><FaTimesCircle className="text-xs" /> Cancelled</span>;
      default:
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full flex items-center gap-1"><FaClock className="text-xs" /> Pending</span>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <BenSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="p-8">
          {/* ========== HEADER ========== */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-primary-600 mb-2">
              <FaChartLine className="text-sm" />
              <span className="text-xs font-medium uppercase tracking-wide">Dashboard</span>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {greeting}, {userName} 👋
            </h1>
            <p className="text-gray-500 mt-1">Here's what's happening with your food surplus today</p>
          </div>

          {/* ========== STATS CARDS ========== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {/* Card 1 - Available Surplus */}
            <div className="group bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                  <FaBox className="text-primary-600 text-xl" />
                </div>
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                  <HiOutlineTrendingUp className="text-xs" /> +2
                </span>
              </div>
              <div className="text-2xl font-semibold text-gray-900">{stats.available}</div>
              <div className="text-sm text-gray-500 mt-1">Available surplus</div>
            </div>

            {/* Card 2 - Active Reservations */}
            <div className="group bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                  <FaCalendarCheck className="text-orange-600 text-xl" />
                </div>
                <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full flex items-center gap-1">
                  <HiOutlineTrendingUp className="text-xs" /> +1
                </span>
              </div>
              <div className="text-2xl font-semibold text-gray-900">{stats.reservations}</div>
              <div className="text-sm text-gray-500 mt-1">Active reservations</div>
            </div>

            {/* Card 3 - Completed Orders */}
            <div className="group bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center group-hover:bg-green-100 transition-colors">
                  <FaCheckCircle className="text-green-600 text-xl" />
                </div>
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                  <HiOutlineTrendingUp className="text-xs" /> +15%
                </span>
              </div>
              <div className="text-2xl font-semibold text-gray-900">{stats.completed}</div>
              <div className="text-sm text-gray-500 mt-1">Completed orders</div>
            </div>

            {/* Card 4 - Meals Saved */}
            <div className="group bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                  <FaLeaf className="text-emerald-600 text-xl" />
                </div>
              </div>
              <div className="text-2xl font-semibold text-gray-900">{stats.mealsSaved}</div>
              <div className="text-sm text-gray-500 mt-1">Meals saved</div>
              <div className="mt-2">
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full w-[62%] bg-emerald-500 rounded-full"></div>
                </div>
                <p className="text-xs text-gray-400 mt-1">62% of monthly goal</p>
              </div>
            </div>
          </div>

          {/* ========== TWO COLUMN LAYOUT ========== */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT COLUMN - Recent Surplus */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FaUtensils className="text-gray-400" />
                  <h2 className="text-lg font-semibold text-gray-900">Recent surplus</h2>
                </div>
                <button 
                  onClick={() => navigate('/beneficiary/surplus')}
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  View all <FaArrowRight className="text-xs" />
                </button>
              </div>

              <div className="space-y-3">
                {recentItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><FaStore className="text-xs" /> {item.donor}</span>
                          <span className="flex items-center gap-1"><HiOutlineCalendar className="text-xs" /> {item.expiry}</span>
                          <span className="flex items-center gap-1"><HiOutlineLocationMarker className="text-xs" /> {item.location}</span>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors">
                        Reserve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN - Upcoming Reservations */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <HiOutlineClock className="text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900">Upcoming pickups</h2>
              </div>

              <div className="space-y-3">
                {upcomingReservations.map((res) => (
                  <div key={res.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                        <MdRestaurant className="text-primary-600 text-lg" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900">{res.food}</h3>
                          {getStatusBadge(res.status)}
                        </div>
                        <p className="text-sm text-gray-500">{res.donor}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                          <span className="flex items-center gap-1"><HiOutlineClock className="text-xs" /> {res.time}</span>
                          <span className="flex items-center gap-1"><HiOutlineLocationMarker className="text-xs" /> {res.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      {res.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleConfirmReservation(res)}
                            className="flex-1 text-center text-sm bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors"
                          >
                            Confirm
                          </button>
                          <button 
                            onClick={() => handleCancelReservation(res)}
                            className="flex-1 text-center text-sm bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {res.status === 'confirmed' && (
                        <button 
                          className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
                          onClick={() => navigate(`/beneficiary/reservations/${res.id}`)}
                        >
                          View details →
                        </button>
                      )}
                      {res.status === 'cancelled' && (
                        <div className="w-full text-center text-sm text-gray-400 font-medium">
                          Cancelled
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ========== MODAL CONFIRM RESERVATION ========== */}
      {showConfirmModal && selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FaCheck className="text-green-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Confirm Reservation</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to confirm the reservation for <strong>{selectedReservation.food}</strong>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmReservation}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== MODAL CANCEL RESERVATION ========== */}
      {showCancelModal && selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <FaExclamationTriangle className="text-red-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Cancel Reservation</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel the reservation for <strong>{selectedReservation.food}</strong>?
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason (optional)</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                rows={2}
                placeholder="Why are you cancelling?"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Go back
              </button>
              <button
                onClick={cancelReservation}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BenDashboard;