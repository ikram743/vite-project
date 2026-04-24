import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaChartLine, FaBox, FaCalendarCheck, FaHistory, FaUser, FaCog, 
  FaSignOutAlt, FaHome, FaLeaf, FaPlusCircle, FaChartBar
} from "react-icons/fa";
import { HiOutlineUser } from "react-icons/hi";

interface DonorSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const DonorSidebar: React.FC<DonorSidebarProps> = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const navItems = [
    { id: "dashboard", path: "/donor/dashboard", icon: <FaChartLine size={18} />, label: "Dashboard" },
    { id: "surplus", path: "/donor/surplus", icon: <FaBox size={18} />, label: "My Surplus" },
    { id: "add", path: "/donor/add-surplus", icon: <FaPlusCircle size={18} />, label: "Add Surplus" },
    { id: "reservations", path: "/donor/reservations", icon: <FaCalendarCheck size={18} />, label: "Reservations" },
    { id: "history", path: "/donor/history", icon: <FaHistory size={18} />, label: "History" },
    { id: "statistics", path: "/donor/statistics", icon: <FaChartBar size={18} />, label: "Statistics" },
    { id: "profile", path: "/donor/profile", icon: <FaUser size={18} />, label: "Profile" },
    { id: "settings", path: "/donor/settings", icon: <FaCog size={18} />, label: "Settings" },
  ];

  return (
    <aside className={`fixed left-0 top-0 h-full bg-gradient-to-b from-primary-700 to-primary-900 text-white transition-all duration-300 z-50 shadow-xl flex flex-col ${collapsed ? 'w-20' : 'w-64'}`}>
      {/* Logo */}
      <div className={`p-5 border-b border-primary-600 ${collapsed ? 'text-center' : ''}`}>
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/donor/dashboard')}>
          <FaLeaf className="text-2xl text-secondary-400" />
          {!collapsed && <span className="text-xl font-bold">FoodShare</span>}
        </div>
      </div>

      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-secondary-500 rounded-full flex items-center justify-center text-white text-xs shadow-md hover:bg-secondary-400 transition-colors"
      >
        {collapsed ? '→' : '←'}
      </button>

      {/* User Info */}
      {!collapsed && (
        <div className="mx-4 mt-6 p-3 bg-white/10 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 bg-secondary-500 rounded-full flex items-center justify-center">
            <HiOutlineUser size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold">Ahmed</p>
            <p className="text-xs text-primary-300">Donor</p>
          </div>
        </div>
      )}

      {/* Today's Impact */}
      {!collapsed && (
        <div className="mx-4 mt-4 p-3 bg-secondary-500/20 rounded-xl border border-secondary-500/30">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-primary-300">Today's impact</span>
            <FaChartLine className="text-secondary-400 text-xs" />
          </div>
          <div className="flex justify-between">
            <div>
              <p className="text-xl font-bold">156</p>
              <p className="text-xs text-primary-300">Meals donated</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold">12</p>
              <p className="text-xs text-primary-300">Pickups</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation - IMPORTANT: flex-1 pushes footer to bottom */}
      <nav className="flex-1 px-3 mt-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <div
            key={item.id}
            onClick={() => { setActiveMenu(item.id); navigate(item.path); }}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all ${activeMenu === item.id ? 'bg-white/20' : 'hover:bg-white/10'} ${collapsed ? 'justify-center' : ''}`}
          >
            <span className={`${activeMenu === item.id ? 'text-secondary-400' : 'text-primary-200'}`}>{item.icon}</span>
            {!collapsed && <span className="text-sm">{item.label}</span>}
          </div>
        ))}
      </nav>

      {/* Footer -固定在底部 */}
      <div className={`border-t border-primary-600 ${collapsed ? 'text-center' : ''}`}>
        <button onClick={() => navigate('/')} className={`flex items-center gap-3 text-primary-200 hover:text-white transition-colors w-full p-4 ${collapsed ? 'justify-center' : ''}`}>
          <FaHome size={16} />
          {!collapsed && <span className="text-sm">Back to home</span>}
        </button>
        <button onClick={() => navigate('/auth')} className={`flex items-center gap-3 text-primary-200 hover:text-white transition-colors w-full pb-4 ${collapsed ? 'justify-center' : ''}`}>
          <FaSignOutAlt size={16} />
          {!collapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default DonorSidebar;