// src/components/beneficiary/BenSidebar.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  FaChartLine, FaBox, FaCalendarCheck, FaHistory, 
  FaUser, FaCog, FaSignOutAlt, FaHome, FaLeaf
} from 'react-icons/fa';
import { HiOutlineUser } from 'react-icons/hi';

interface BenSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const BenSidebar: React.FC<BenSidebarProps> = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState('Beneficiary');

  // تحديد العنصر النشط بناءً على المسار الحالي
  const getActiveMenuFromPath = (path: string) => {
    if (path.includes('/dashboard')) return 'dashboard';
    if (path.includes('/surplus')) return 'surplus';
    if (path.includes('/reservations')) return 'reservations';
    if (path.includes('/history')) return 'history';
    if (path.includes('/profile')) return 'profile';
    if (path.includes('/settings')) return 'settings';
    return 'dashboard';
  };

  const [activeMenu, setActiveMenu] = useState(getActiveMenuFromPath(location.pathname));

  // تحديث activeMenu عندما يتغير المسار
  useEffect(() => {
    setActiveMenu(getActiveMenuFromPath(location.pathname));
  }, [location.pathname]);

  useEffect(() => {
    // جلب اسم المستخدم من localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserName(user.name || user.user?.name || 'Beneficiary');
      } catch (e) {
        console.error('Error parsing user:', e);
      }
    }
  }, []);

  const navItems = [
    { id: 'dashboard', path: '/beneficiary/dashboard', icon: <FaChartLine size={18} />, label: 'Dashboard' },
    { id: 'surplus', path: '/beneficiary/surplus', icon: <FaBox size={18} />, label: 'Food Surplus' },
    { id: 'reservations', path: '/beneficiary/reservations', icon: <FaCalendarCheck size={18} />, label: 'Reservations' },
    { id: 'history', path: '/beneficiary/history', icon: <FaHistory size={18} />, label: 'History' },
    { id: 'profile', path: '/beneficiary/profile', icon: <FaUser size={18} />, label: 'Profile' },
    { id: 'settings', path: '/beneficiary/settings', icon: <FaCog size={18} />, label: 'Settings' },
  ];

  const handleNavigation = (item: typeof navItems[0]) => {
    setActiveMenu(item.id);
    navigate(item.path);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
    sessionStorage.clear();
    toast.success('👋 Logged out successfully!');
    navigate('/login', { replace: true });
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <aside className={`fixed left-0 top-0 h-full bg-gradient-to-b from-primary-700 to-primary-900 text-white transition-all duration-300 z-50 shadow-xl flex flex-col ${collapsed ? 'w-20' : 'w-64'}`}>
      {/* Logo - ثابت في الأعلى */}
      <div className={`flex-shrink-0 p-5 border-b border-primary-600 ${collapsed ? 'text-center' : ''}`}>
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavigation(navItems[0])}>
          <FaLeaf className="text-2xl text-secondary-400" />
          {!collapsed && <span className="text-xl font-bold">FoodShare</span>}
        </div>
        {!collapsed && (
          <p className="text-xs text-primary-300 mt-1">Beneficiary Portal</p>
        )}
      </div>

      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-secondary-500 rounded-full flex items-center justify-center text-white text-xs shadow-md hover:bg-secondary-400 transition-colors z-50"
      >
        {collapsed ? '→' : '←'}
      </button>

      {/* User Info - ثابت */}
      {!collapsed && (
        <div className="flex-shrink-0 mx-4 mt-6 p-3 bg-white/10 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-secondary-500 to-accent-500 rounded-full flex items-center justify-center text-lg shadow-lg">
            👤
          </div>
          <div>
            <p className="text-sm font-semibold">{userName}</p>
            <p className="text-xs text-primary-300">Active member</p>
          </div>
        </div>
      )}

      {/* Today's Impact - ثابت */}
      {!collapsed && (
        <div className="flex-shrink-0 mx-4 mt-4 p-3 bg-secondary-500/20 rounded-xl border border-secondary-500/30">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-primary-300">Today's impact</span>
            <FaChartLine className="text-secondary-400 text-xs" />
          </div>
          <div className="flex justify-between">
            <div>
              <p className="text-xl font-bold">12</p>
              <p className="text-xs text-primary-300">Meals saved</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold">5</p>
              <p className="text-xs text-primary-300">Pickups</p>
            </div>
          </div>
        </div>
      )}

      {/* Impact icons when collapsed - ثابت */}
      {collapsed && (
        <div className="flex-shrink-0 flex justify-center gap-3 mt-4">
          <div className="text-center">
            <div className="w-8 h-8 bg-secondary-500/20 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-secondary-400">12</span>
            </div>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-secondary-500/20 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-secondary-400">5</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation - يتوسط المساحة ويتحرك مع التمرير */}
      <nav className={`flex-1 overflow-y-auto px-3 mt-6 space-y-1 scrollbar-thin scrollbar-thumb-primary-500 scrollbar-track-primary-700/30 ${collapsed ? 'px-2' : ''}`}>
        {navItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleNavigation(item)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
              activeMenu === item.id 
                ? 'bg-white/20 text-white shadow-md' 
                : 'text-primary-100 hover:bg-white/10 hover:text-white'
            } ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? item.label : ''}
          >
            <span className={`${activeMenu === item.id ? 'text-secondary-400' : 'text-primary-200'}`}>
              {item.icon}
            </span>
            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
          </div>
        ))}
      </nav>

      {/* Footer Buttons - ثابت في الأسفل */}
      <div className={`flex-shrink-0 p-4 border-t border-primary-600/30 ${collapsed ? 'text-center' : ''}`}>
        <button 
          onClick={handleBackToHome}
          className={`flex items-center gap-3 text-primary-200 hover:text-white transition-colors mb-3 ${collapsed ? 'justify-center w-full' : ''}`}
          title={collapsed ? 'Back to home' : ''}
        >
          <FaHome size={16} />
          {!collapsed && <span className="text-sm">Back to home</span>}
        </button>
        <button 
          onClick={handleLogout}
          className={`flex items-center gap-3 text-primary-200 hover:text-red-300 transition-colors ${collapsed ? 'justify-center w-full' : ''}`}
          title={collapsed ? 'Logout' : ''}
        >
          <FaSignOutAlt size={16} />
          {!collapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default BenSidebar;