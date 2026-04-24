import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DonorSidebar from '../../components/donor/DonorSidebar';
import { 
  FaChartLine, FaBox, FaCalendarCheck, FaCheckCircle, 
  FaLeaf, FaStore, FaClock, FaStar, FaArrowRight, 
  FaBell, FaUserCircle, FaUtensils, FaBreadSlice, 
  FaAppleAlt, FaCarrot, FaTachometerAlt
} from 'react-icons/fa';
import { HiOutlineTrendingUp, HiOutlineLocationMarker, HiOutlineCalendar, HiOutlineClock } from 'react-icons/hi';
import { MdRestaurant, MdLocalCafe, MdEmojiFoodBeverage } from 'react-icons/md';

interface RecentSurplus {
  id: number;
  name: string;
  quantity: string;
  expiry: string;
  status: 'available' | 'reserved' | 'completed';
  icon: JSX.Element;
}

interface Reservation {
  id: number;
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
  const [userName] = useState('Ahmed');

  const [stats] = useState({
    activeSurplus: 8,
    pendingReservations: 5,
    completedDonations: 48,
    mealsDonated: 1250
  });

  const [recentSurplus] = useState<RecentSurplus[]>([
    { id: 1, name: 'Fresh Bread', quantity: '100 pieces', expiry: '2024-12-30', status: 'available', icon: <FaBreadSlice className="text-3xl text-secondary-500" /> },
    { id: 2, name: 'Mixed Vegetables', quantity: '30 kg', expiry: '2024-12-29', status: 'available', icon: <FaCarrot className="text-3xl text-green-600" /> },
    { id: 3, name: 'Prepared Meals', quantity: '50 meals', expiry: '2024-12-31', status: 'reserved', icon: <MdEmojiFoodBeverage className="text-3xl text-primary-600" /> },
  ]);

  const [reservations] = useState<Reservation[]>([
    { id: 1, food: 'Fresh Bread', beneficiary: 'Association Nour', time: 'Today, 2:00 PM', location: 'Algiers', status: 'pending' },
    { id: 2, food: 'Vegetables', beneficiary: 'Food Bank', time: 'Tomorrow, 10:00 AM', location: 'Oran', status: 'confirmed' },
  ]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'available': return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">Available</span>;
      case 'reserved': return <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">Reserved</span>;
      case 'completed': return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Completed</span>;
      case 'confirmed': return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1"><FaCheckCircle className="text-xs" /> Confirmed</span>;
      case 'pending': return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full flex items-center gap-1"><FaClock className="text-xs" /> Pending</span>;
      default: return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DonorSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-primary-600 mb-2">
              <FaChartLine className="text-sm" />
              <span className="text-xs font-medium uppercase tracking-wide">Dashboard</span>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {greeting}, {userName} 👋
            </h1>
            <p className="text-gray-500 mt-1">Track your donations and impact</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <div className="group bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                  <FaBox className="text-primary-600 text-xl" />
                </div>
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">+3</span>
              </div>
              <div className="text-2xl font-semibold text-gray-900">{stats.activeSurplus}</div>
              <div className="text-sm text-gray-500 mt-1">Active surplus</div>
            </div>

            <div className="group bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
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
                  <div className="h-full w-[75%] bg-emerald-500 rounded-full"></div>
                </div>
                <p className="text-xs text-gray-400 mt-1">75% of monthly goal</p>
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
                <button onClick={() => navigate('/donor/surplus')} className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
                  View all <FaArrowRight className="text-xs" />
                </button>
              </div>

              <div className="space-y-3">
                {recentSurplus.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><FaBox className="text-xs" /> {item.quantity}</span>
                          <span className="flex items-center gap-1"><HiOutlineCalendar className="text-xs" /> {item.expiry}</span>
                        </div>
                      </div>
                      {getStatusBadge(item.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Reservations */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <HiOutlineClock className="text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900">Recent reservations</h2>
              </div>

              <div className="space-y-3">
                {reservations.map((res) => (
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
                        <p className="text-sm text-gray-500">{res.beneficiary}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                          <span className="flex items-center gap-1"><HiOutlineClock className="text-xs" /> {res.time}</span>
                          <span className="flex items-center gap-1"><HiOutlineLocationMarker className="text-xs" /> {res.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DonorDashboard;