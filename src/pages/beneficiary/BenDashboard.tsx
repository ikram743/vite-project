// src/pages/beneficiary/BenDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BenSidebar from '../../components/beneficiary/BenSidebar';
import { getMyRequests, getNotifications, getDashboardStats, getDonations } from '../../lib/API';
import { 
  FaChartLine, FaBox, FaCalendarCheck, FaCheckCircle, 
  FaLeaf, FaStore, FaUtensils, FaBreadSlice, FaCarrot, 
  FaArrowRight, FaBell, FaUserCircle, FaHistory, FaSpinner
} from 'react-icons/fa';
import { HiOutlineTrendingUp, HiOutlineLocationMarker, HiOutlineCalendar, HiOutlineClock } from 'react-icons/hi';
import toast from 'react-hot-toast';

interface Donation {
  id: string;
  name: string;
  donor: string;
  quantity: string;
  expiry: string;
  location: string;
  icon: JSX.Element;
  foodType?: string;
  donorName?: string;
  totalQuantity?: number;
  unit?: string;
  expirationDate?: string;
  pickupAddress?: string;
}

interface Request {
  id: string;
  status: string;
  donation?: {
    foodType: string;
    donor?: { user?: { name: string } };
    unit?: string;
  };
  requestedQuantity?: number;
}

const BenDashboard = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [userName, setUserName] = useState('Beneficiary');
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Stats from API
  const [stats, setStats] = useState({
    available: 0,
    reservations: 0,
    completed: 0,
    mealsSaved: 0
  });

  // Recent donations from API
  const [recentDonations, setRecentDonations] = useState<Donation[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingDonations, setLoadingDonations] = useState(false);

  // Helper function to get icon based on food type
  const getIconForFood = (foodType: string) => {
    const type = foodType?.toLowerCase() || '';
    if (type.includes('bread') || type.includes('bakery') || type.includes('pain')) {
      return <FaBreadSlice className="text-3xl text-secondary-500" />;
    }
    if (type.includes('vegetable') || type.includes('legume')) {
      return <FaCarrot className="text-3xl text-green-600" />;
    }
    if (type.includes('fruit')) {
      return <FaBreadSlice className="text-3xl text-red-500" />;
    }
    return <FaUtensils className="text-3xl text-primary-600" />;
  };

  // Format date to readable string
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    // Get user from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserName(user.name || user.user?.name || 'Beneficiary');
      } catch(e) {
        console.error('Error parsing user:', e);
      }
    }

    loadDashboardData();
    loadRecentDonations();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get dashboard stats
      try {
        const statsResponse = await getDashboardStats();
        console.log('Dashboard stats:', statsResponse);
        if (statsResponse) {
          setStats({
            available: statsResponse.activeDonations || statsResponse.totalDonations || 0,
            reservations: statsResponse.pendingRequests || statsResponse.activeReservations || 0,
            completed: statsResponse.completedDonations || statsResponse.completedOrders || 0,
            mealsSaved: statsResponse.mealsServed || statsResponse.totalMeals || 0
          });
        }
      } catch (statsError) {
        console.error('Error loading stats:', statsError);
      }

      // Get my requests for stats
      try {
        const requestsResponse = await getMyRequests();
        console.log('My requests:', requestsResponse);
        
        let requests: Request[] = [];
        if (requestsResponse?.requests) {
          requests = requestsResponse.requests;
        } else if (Array.isArray(requestsResponse)) {
          requests = requestsResponse;
        }
        
        // Calculate real stats from requests
        const pendingRequests = requests.filter((r: Request) => 
          r.status === 'PENDING' || r.status === 'pending'
        ).length;
        
        const completedRequests = requests.filter((r: Request) => 
          r.status === 'COMPLETED' || r.status === 'COLLECTED' || r.status === 'completed'
        ).length;
        
        setStats(prev => ({
          ...prev,
          reservations: pendingRequests,
          completed: completedRequests
        }));
      } catch (requestsError) {
        console.error('Error loading requests:', requestsError);
      }

      // Get notifications
      try {
        const notifResponse = await getNotifications();
        console.log('Notifications:', notifResponse);
        
        let notifs = [];
        if (notifResponse?.notifications) {
          notifs = notifResponse.notifications;
        } else if (Array.isArray(notifResponse)) {
          notifs = notifResponse;
        }
        
        setNotifications(notifs);
        const unread = notifs.filter((n: any) => !n.isRead && !n.read).length;
        setUnreadCount(unread);
      } catch (notifError) {
        console.error('Error loading notifications:', notifError);
      }
      
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const loadRecentDonations = async () => {
    try {
      setLoadingDonations(true);
      const response = await getDonations(1, 3);
      console.log('Recent donations:', response);
      
      let donations = [];
      if (response?.data?.donations) {
        donations = response.data.donations;
      } else if (response?.donations) {
        donations = response.donations;
      } else if (Array.isArray(response)) {
        donations = response;
      }
      
      const formattedDonations: Donation[] = donations.map((donation: any) => ({
        id: donation.id,
        name: donation.foodType || donation.name || 'Food Item',
        donor: donation.donor?.user?.name || donation.donorName || 'Donor',
        quantity: `${donation.totalQuantity || donation.quantity || 0} ${donation.unit || 'kg'}`,
        expiry: formatDate(donation.expirationDate || donation.expiryDate || new Date()),
        location: donation.pickupAddress?.split(',')[0] || donation.location || 'Algiers',
        icon: getIconForFood(donation.foodType),
        foodType: donation.foodType,
        donorName: donation.donor?.user?.name,
        totalQuantity: donation.totalQuantity,
        unit: donation.unit,
        expirationDate: donation.expirationDate,
        pickupAddress: donation.pickupAddress
      }));
      
      setRecentDonations(formattedDonations);
    } catch (error) {
      console.error('Error loading recent donations:', error);
    } finally {
      setLoadingDonations(false);
    }
  };

  const handleReserve = (donationId: string) => {
    navigate(`/beneficiary/surplus?donation=${donationId}`);
  };

  const handleViewAllNotifications = () => {
    setShowNotifications(false);
    navigate('/beneficiary/notifications');
  };

  const getNotificationIconBg = (type: string) => {
    switch(type) {
      case 'reservation': return 'bg-green-100';
      case 'surplus': return 'bg-blue-100';
      case 'system': return 'bg-purple-100';
      default: return 'bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <BenSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-primary-600 mx-auto mb-4" />
            <p className="text-gray-500">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <BenSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'} bg-gray-50 min-h-screen`}>
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex justify-between items-start flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 text-primary-600 mb-1">
                <FaChartLine className="text-sm" />
                <span className="text-xs font-medium uppercase tracking-wide">Dashboard</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">
                {greeting}, {userName} 👋
              </h1>
              <p className="text-gray-500 text-sm mt-1">Welcome to FoodShare Beneficiary Portal</p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Notifications Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                  title="Notifications"
                >
                  <FaBell className="text-gray-600 text-xl" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50">
                    <div className="p-4 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                          <FaBell className="text-3xl mx-auto mb-2 text-gray-300" />
                          <p className="text-sm">No notifications yet</p>
                        </div>
                      ) : (
                        notifications.slice(0, 5).map((notif: any) => (
                          <div key={notif.id} className="p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer">
                            <div className="flex gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getNotificationIconBg(notif.type)}`}>
                                <span className="text-sm">{notif.icon || '🔔'}</span>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                                <p className="text-xs text-gray-500 mt-1">{notif.message}</p>
                                <p className="text-xs text-gray-400 mt-1">{notif.time || 'Just now'}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-3 text-center border-t border-gray-100">
                      <button 
                        onClick={handleViewAllNotifications}
                        className="text-sm text-primary-600 hover:text-primary-700"
                      >
                        View all notifications →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <Link 
                to="/beneficiary/history"
                className="p-2 rounded-full hover:bg-gray-100 transition-colors block"
                title="Order History"
              >
                <FaHistory className="text-gray-600 text-xl" />
              </Link>

              <Link 
                to="/beneficiary/profile"
                className="p-2 rounded-full hover:bg-gray-100 transition-colors block"
                title="My Profile"
              >
                <FaUserCircle className="text-gray-600 text-xl" />
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center mb-3">
                <FaBox className="text-primary-600 text-xl" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.available}</div>
              <div className="text-sm text-gray-500 mt-1">Available surplus</div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center mb-3">
                <FaCalendarCheck className="text-orange-600 text-xl" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.reservations}</div>
              <div className="text-sm text-gray-500 mt-1">Active reservations</div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-3">
                <FaCheckCircle className="text-green-600 text-xl" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.completed}</div>
              <div className="text-sm text-gray-500 mt-1">Completed orders</div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center mb-3">
                <FaLeaf className="text-emerald-600 text-xl" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.mealsSaved}</div>
              <div className="text-sm text-gray-500 mt-1">Meals saved</div>
              <div className="mt-2">
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min((stats.mealsSaved / 100) * 100, 100)}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Surplus */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FaUtensils className="text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900">Recent surplus</h2>
              </div>
              <Link 
                to="/beneficiary/surplus"
                className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors"
              >
                View all <FaArrowRight className="text-xs" />
              </Link>
            </div>

            {loadingDonations ? (
              <div className="flex justify-center py-8">
                <FaSpinner className="animate-spin text-2xl text-primary-600" />
              </div>
            ) : recentDonations.length > 0 ? (
              <div className="space-y-3">
                {recentDonations.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 hover:shadow-md transition-all duration-200 border border-gray-200 cursor-pointer"
                    onClick={() => handleReserve(item.id)}
                  >
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><FaStore className="text-xs" /> {item.donor}</span>
                        <span className="flex items-center gap-1"><FaBox className="text-xs" /> {item.quantity}</span>
                        <span className="flex items-center gap-1"><HiOutlineCalendar className="text-xs" /> Expires: {item.expiry}</span>
                        <span className="flex items-center gap-1"><HiOutlineLocationMarker className="text-xs" /> {item.location}</span>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors shadow-sm">
                      Reserve
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FaUtensils className="text-4xl text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No surplus available at the moment</p>
                <p className="text-xs text-gray-400 mt-1">Check back later for new donations</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BenDashboard;