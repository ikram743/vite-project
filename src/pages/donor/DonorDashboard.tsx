// src/pages/donor/DonorDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DonorSidebar from '../../components/donor/DonorSidebar';
import { 
  FaChartLine, FaBox, FaCalendarCheck, FaCheckCircle, 
  FaLeaf, FaArrowRight, FaBell, FaUtensils, FaBreadSlice, 
  FaCarrot, FaClock, FaSpinner, FaUserCircle, FaHistory
} from 'react-icons/fa';
import { HiOutlineLocationMarker, HiOutlineCalendar, HiOutlineClock } from 'react-icons/hi';
import { MdRestaurant, MdEmojiFoodBeverage } from 'react-icons/md';
import { getMyDonations, getReceivedRequests, getProfile } from '../../lib/API';
import toast from 'react-hot-toast';

interface RecentSurplus {
  id: string;
  name: string;
  quantity: string;
  expiry: string;
  status: 'available' | 'reserved' | 'completed';
  icon: JSX.Element;
}

interface Reservation {
  id: string;
  food: string;
  beneficiary: string;
  time: string;
  location: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

const DonorDashboard = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [userName, setUserName] = useState('Donor');
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const [stats, setStats] = useState({
    activeSurplus: 0,
    pendingReservations: 0,
    completedDonations: 0,
    mealsDonated: 0
  });

  const [recentSurplus, setRecentSurplus] = useState<RecentSurplus[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [completionPercentage, setCompletionPercentage] = useState(0);

  // Helper function to get icon based on food type
  const getIconForFood = (foodType: string, category?: string) => {
    const type = foodType?.toLowerCase() || '';
    if (type.includes('bread') || type.includes('bakery') || type.includes('pain')) {
      return <FaBreadSlice className="text-3xl text-secondary-500" />;
    }
    if (type.includes('vegetable') || category === 'vegetables' || type.includes('legume')) {
      return <FaCarrot className="text-3xl text-orange-500" />;
    }
    if (type.includes('fruit') || type.includes('fruits')) {
      return <FaBreadSlice className="text-3xl text-red-500" />;
    }
    return <MdEmojiFoodBeverage className="text-3xl text-primary-600" />;
  };

  // Format date to readable string
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Format time for reservations
  const formatRequestTime = (date: Date | string) => {
    const d = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (d.toDateString() === today.toDateString()) {
      return `Today, ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else if (d.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    }
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Map backend status to frontend status
  const mapDonationStatus = (status: string): 'available' | 'reserved' | 'completed' => {
    const upperStatus = status?.toUpperCase() || '';
    switch(upperStatus) {
      case 'AVAILABLE':
      case 'ACTIVE':
      case 'OPEN':
        return 'available';
      case 'RESERVED':
      case 'PENDING':
        return 'reserved';
      case 'COMPLETED':
      case 'COLLECTED':
      case 'FINISHED':
        return 'completed';
      default:
        return 'available';
    }
  };

  const mapRequestStatus = (status: string): 'pending' | 'confirmed' | 'cancelled' => {
    const upperStatus = status?.toUpperCase() || '';
    switch(upperStatus) {
      case 'PENDING':
        return 'pending';
      case 'APPROVED':
      case 'CONFIRMED':
      case 'ACCEPTED':
        return 'confirmed';
      case 'REJECTED':
      case 'CANCELLED':
      case 'DECLINED':
        return 'cancelled';
      default:
        return 'pending';
    }
  };

  // دالة مساعدة لاستخراج المصفوفة من الاستجابة
  const extractArray = (response: any, key: string): any[] => {
    if (!response) return [];
    if (Array.isArray(response)) return response;
    if (response.data?.[key] && Array.isArray(response.data[key])) return response.data[key];
    if (response[key] && Array.isArray(response[key])) return response[key];
    if (response.data && Array.isArray(response.data)) return response.data;
    console.warn('Could not extract array from:', response);
    return [];
  };

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch user profile
        const profileResponse = await getProfile();
        console.log('Profile response:', profileResponse);
        
        if (profileResponse?.user?.name) {
          setUserName(profileResponse.user.name);
        } else if (profileResponse?.name) {
          setUserName(profileResponse.name);
        }

        // Fetch donor's donations
        const donationsResponse = await getMyDonations();
        console.log('Raw donations response:', donationsResponse);
        
        // استخراج donations بطريقة آمنة
        let donations = extractArray(donationsResponse, 'donations');
        console.log('✅ Donations array:', donations);
        console.log('✅ Donations count:', donations.length);
        
        // Fetch received requests
        const requestsResponse = await getReceivedRequests();
        console.log('Raw requests response:', requestsResponse);
        
        // استخراج requests بطريقة آمنة
        let requests = extractArray(requestsResponse, 'requests');
        console.log('✅ Requests array:', requests);
        console.log('✅ Requests count:', requests.length);

        // Calculate stats
        const activeSurplus = donations.filter((d: any) => {
          const status = d.status?.toUpperCase() || '';
          return status === 'AVAILABLE' || status === 'ACTIVE' || status === 'OPEN';
        }).length;
        
        const pendingReservations = requests.filter((r: any) => {
          const status = r.status?.toUpperCase() || '';
          return status === 'PENDING';
        }).length;
        
        const completedDonations = donations.filter((d: any) => {
          const status = d.status?.toUpperCase() || '';
          return status === 'COMPLETED' || status === 'COLLECTED' || status === 'FINISHED';
        }).length;
        
        // Calculate meals donated (1kg = 2 meals, or use meals unit directly)
        const mealsDonated = donations.reduce((total: number, d: any) => {
          const quantity = d.totalQuantity || d.quantity || 0;
          const unit = d.unit?.toUpperCase() || '';
          
          if (unit === 'MEALS' || unit === 'MEAL') {
            return total + quantity;
          }
          if (unit === 'KG' || unit === 'KILOGRAM' || unit === 'KILOGRAMS') {
            return total + (quantity * 2);
          }
          return total + quantity;
        }, 0);

        setStats({
          activeSurplus,
          pendingReservations,
          completedDonations,
          mealsDonated
        });

        // Calculate completion percentage (goal: 2000 meals)
        const percentage = Math.min((mealsDonated / 2000) * 100, 100);
        setCompletionPercentage(percentage);

        // Format recent surplus (last 3)
        const recentSurplusData = donations.slice(0, 3).map((donation: any) => ({
          id: donation.id,
          name: donation.foodType || donation.name || donation.title || 'Food Item',
          quantity: `${donation.totalQuantity || donation.quantity || 0} ${donation.unit || 'kg'}`,
          expiry: formatDate(donation.expirationDate || donation.expiryDate || donation.expiresAt || new Date()),
          status: mapDonationStatus(donation.status),
          icon: getIconForFood(donation.foodType, donation.category)
        }));

        setRecentSurplus(recentSurplusData);

        // Format recent reservations (last 3)
        const recentReservations = requests.slice(0, 3).map((request: any) => ({
          id: request.id,
          food: request.donation?.foodType || request.foodType || request.foodName || 'Food item',
          beneficiary: request.beneficiary?.user?.name || request.beneficiaryName || request.beneficiary?.name || 'Beneficiary',
          time: formatRequestTime(request.requestDate || request.createdAt || request.date || new Date()),
          location: request.donation?.pickupAddress?.split(',')[0] || request.pickupLocation || request.location || 'Algiers',
          status: mapRequestStatus(request.status)
        }));

        setReservations(recentReservations);

        // Set unread count (you can implement real notifications later)
        setUnreadCount(3);

      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        toast.error(error.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'available': 
        return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">Available</span>;
      case 'reserved': 
        return <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">Reserved</span>;
      case 'completed': 
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Completed</span>;
      case 'confirmed': 
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1"><FaCheckCircle className="text-xs" /> Confirmed</span>;
      case 'pending': 
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full flex items-center gap-1"><FaClock className="text-xs" /> Pending</span>;
      case 'cancelled': 
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Cancelled</span>;
      default: 
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <DonorSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <FaSpinner className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
              <p className="mt-4 text-gray-500">Loading dashboard...</p>
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
          
          {/* Header with greeting and notifications */}
          <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div>
              <div className="flex items-center gap-2 text-emerald-600 mb-1">
                <FaChartLine className="text-sm" />
                <span className="text-xs font-bold uppercase tracking-widest">Dashboard</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">
                {greeting}, {userName} 👋
              </h1>
              <p className="text-gray-400 text-sm font-medium">Track your donations and impact</p>
            </div>

            <div className="flex items-center gap-4">
              {/* زر الإشعارات - يفتح صفحة الإشعارات */}
              <button 
                onClick={() => navigate('/donor/notifications')}
                className="group relative w-12 h-12 flex items-center justify-center bg-gray-50 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-300"
              >
                <FaBell className="text-xl group-hover:rotate-12 transition-transform" />
                {unreadCount > 0 && (
                  <span className="absolute top-3 right-3 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border-2 border-white"></span>
                  </span>
                )}
              </button>

              {/* زر الهيستوري - يفتح صفحة التاريخ */}
              <button 
                onClick={() => navigate('/donor/history')}
                className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-300"
              >
                <FaHistory className="text-xl" />
              </button>

              {/* زر البروفيل - يفتح صفحة البروفيل */}
              <button 
                onClick={() => navigate('/donor/profile')}
                className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-300"
              >
                <FaUserCircle className="text-xl" />
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <div 
              className="group bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
              onClick={() => navigate('/donor/surplus')}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                  <FaBox className="text-primary-600 text-xl" />
                </div>
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  +{stats.activeSurplus}
                </span>
              </div>
              <div className="text-2xl font-semibold text-gray-900">{stats.activeSurplus}</div>
              <div className="text-sm text-gray-500 mt-1">Active surplus</div>
            </div>

            <div 
              className="group bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
              onClick={() => navigate('/donor/reservations')}
            >
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <FaCalendarCheck className="text-orange-600 text-xl" />
              </div>
              <div className="text-2xl font-semibold text-gray-900">{stats.pendingReservations}</div>
              <div className="text-sm text-gray-500 mt-1">Pending reservations</div>
            </div>

            <div className="group bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <FaCheckCircle className="text-green-600 text-xl" />
              </div>
              <div className="text-2xl font-semibold text-gray-900">{stats.completedDonations}</div>
              <div className="text-sm text-gray-500 mt-1">Completed donations</div>
            </div>

            <div className="group bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                <FaLeaf className="text-emerald-600 text-xl" />
              </div>
              <div className="text-2xl font-semibold text-gray-900">{stats.mealsDonated}</div>
              <div className="text-sm text-gray-500 mt-1">Meals donated</div>
              <div className="mt-2">
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${completionPercentage}%` }}></div>
                </div>
                <p className="text-xs text-gray-400 mt-1">{Math.round(completionPercentage)}% of monthly goal</p>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Surplus */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FaUtensils className="text-gray-400" />
                  <h2 className="text-lg font-semibold text-gray-900">Recent surplus</h2>
                </div>
                <button 
                  onClick={() => navigate('/donor/surplus')} 
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors"
                >
                  View all <FaArrowRight className="text-xs" />
                </button>
              </div>

              <div className="space-y-3">
                {recentSurplus.length > 0 ? (
                  recentSurplus.map((item) => (
                    <div 
                      key={item.id} 
                      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => navigate('/donor/surplus')}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{item.name}</h3>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                            <span className="flex items-center gap-1"><FaBox className="text-xs" /> {item.quantity}</span>
                            <span className="flex items-center gap-1"><HiOutlineCalendar className="text-xs" /> Expires: {item.expiry}</span>
                          </div>
                        </div>
                        {getStatusBadge(item.status)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
                    <FaUtensils className="text-4xl text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No surplus yet</p>
                    <button 
                      onClick={() => navigate('/donor/surplus/add')} 
                      className="mt-3 text-primary-600 text-sm hover:underline"
                    >
                      Create your first donation
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Reservations */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <HiOutlineClock className="text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900">Recent reservations</h2>
              </div>

              <div className="space-y-3">
                {reservations.length > 0 ? (
                  reservations.map((res) => (
                    <div 
                      key={res.id} 
                      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => navigate('/donor/reservations')}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                          <MdRestaurant className="text-primary-600 text-lg" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <h3 className="font-medium text-gray-900">{res.food}</h3>
                            {getStatusBadge(res.status)}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{res.beneficiary}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                            <span className="flex items-center gap-1"><HiOutlineClock className="text-xs" /> {res.time}</span>
                            <span className="flex items-center gap-1"><HiOutlineLocationMarker className="text-xs" /> {res.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
                    <HiOutlineClock className="text-4xl text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No reservations yet</p>
                    <p className="text-xs text-gray-400 mt-1">When beneficiaries request, they'll appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DonorDashboard;