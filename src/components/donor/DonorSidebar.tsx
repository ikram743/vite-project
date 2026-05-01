
// src/components/donor/DonorSidebar.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  FaChartLine, FaBox, FaCalendarCheck, FaHistory, 
  FaUser, FaCog, FaSignOutAlt, FaHome, FaLeaf, 
  FaChartBar, FaBell
} from 'react-icons/fa';
import { HiOutlineUser } from 'react-icons/hi';

interface DonorSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const DonorSidebar: React.FC<DonorSidebarProps> = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState('Donor');
  const [businessName, setBusinessName] = useState('');

  // تحديد العنصر النشط بناءً على المسار الحالي
  const getActiveMenuFromPath = (path: string) => {
    if (path.includes('/dashboard') || path === '/donor') return 'dashboard';
    if (path.includes('/surplus')) return 'surplus';
    if (path.includes('/reservations')) return 'reservations';
    if (path.includes('/history')) return 'history';
    if (path.includes('/statistics')) return 'statistics';
    if (path.includes('/notifications')) return 'notifications';
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
        setUserName(user.name || user.user?.name || 'Donor');
        setBusinessName(user.businessName || user.organizationName || '');
      } catch (e) {
        console.error('Error parsing user:', e);
      }
    }
  }, []);

  const navItems = [
    { id: 'dashboard', path: 'dashboard', icon: <FaChartLine size={18} />, label: 'Dashboard' },
    { id: 'surplus', path: 'surplus', icon: <FaBox size={18} />, label: 'My Surplus' },
    { id: 'reservations', path: 'reservations', icon: <FaCalendarCheck size={18} />, label: 'Reservations' },
    { id: 'history', path: 'history', icon: <FaHistory size={18} />, label: 'History' },
    { id: 'statistics', path: 'statistics', icon: <FaChartBar size={18} />, label: 'Statistics' },
    { id: 'notifications', path: 'notifications', icon: <FaBell size={18} />, label: 'Notifications' },
    { id: 'profile', path: 'profile', icon: <FaUser size={18} />, label: 'Profile' },
    { id: 'settings', path: 'settings', icon: <FaCog size={18} />, label: 'Settings' },
  ];

  const handleNavigation = (item: typeof navItems[0]) => {
    setActiveMenu(item.id);
    navigate(`/donor/${item.path}`);
  };

  // ✅ دالة تسجيل الخروج الكامل
  const handleLogout = () => {
    // مسح جميع بيانات المستخدم من localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('rememberMe');
    
    // مسح sessionStorage إذا كان موجود
    sessionStorage.clear();
    
    // عرض رسالة نجاح
    toast.success('👋 Logged out successfully!');
    
    // التوجيه إلى صفحة تسجيل الدخول
    navigate('/login', { replace: true });
  };

  // ✅ دالة العودة إلى الصفحة الرئيسية مع تسجيل الخروج
  const handleBackToHome = () => {
    // مسح جميع بيانات المستخدم من localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('rememberMe');
    
    // مسح sessionStorage إذا كان موجود
    sessionStorage.clear();
    
    // عرض رسالة نجاح
    toast.success('👋 Returned to home page');
    
    // التوجيه إلى الصفحة الرئيسية
    navigate('/', { replace: true });
  };

  return (
    <aside className={`fixed left-0 top-0 h-full bg-gradient-to-b from-primary-700 to-primary-900 text-white transition-all duration-300 z-50 shadow-xl flex flex-col ${collapsed ? 'w-20' : 'w-64'}`}>
      {/* Logo */}
      <div className={`flex-shrink-0 p-5 border-b border-primary-600 ${collapsed ? 'text-center' : ''}`}>
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavigation(navItems[0])}>
          <FaLeaf className="text-2xl text-secondary-400" />
          {!collapsed && <span className="text-xl font-bold">FoodShare</span>}
        </div>
        {!collapsed && (
          <p className="text-xs text-primary-300 mt-1">Donor Portal</p>
        )}
      </div>

      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-secondary-500 rounded-full flex items-center justify-center text-white text-xs shadow-md hover:bg-secondary-400 transition-colors z-50"
      >
        {collapsed ? '→' : '←'}
      </button>

      {/* User Info */}
      {!collapsed && (
        <div className="flex-shrink-0 mx-4 mt-6 p-3 bg-white/10 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-secondary-500 to-accent-500 rounded-full flex items-center justify-center text-lg shadow-lg">
            👤
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{userName}</p>
            {businessName && (
              <p className="text-xs text-primary-300 truncate">{businessName}</p>
            )}
          </div>
        </div>
      )}

      {/* Donor Stats when collapsed */}
      {collapsed && (
        <div className="flex-shrink-0 flex justify-center gap-2 mt-4">
          <div className="text-center">
            <div className="w-8 h-8 bg-secondary-500/20 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-secondary-400">💰</span>
            </div>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-secondary-500/20 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-secondary-400">📦</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
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

      {/* Footer Buttons */}
      <div className={`flex-shrink-0 p-4 border-t border-primary-600/30 ${collapsed ? 'text-center' : ''}`}>
        {/* Back to Home Button - يقوم بتسجيل الخروج والعودة للصفحة الرئيسية */}
        <button 
          onClick={handleBackToHome}
          className={`flex items-center gap-3 text-primary-200 hover:text-white transition-colors mb-3 w-full ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Back to home' : ''}
        >
          <FaHome size={16} />
          {!collapsed && <span className="text-sm">Back to home</span>}
        </button>
        
        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className={`flex items-center gap-3 text-primary-200 hover:text-red-300 transition-colors w-full ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Logout' : ''}
        >
          <FaSignOutAlt size={16} />
          {!collapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default DonorSidebar;