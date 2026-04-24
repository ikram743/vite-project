
// import React, { useState, useEffect } from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import toast from 'react-hot-toast';

// interface BenSidebarProps {
//   collapsed: boolean;
//   setCollapsed: (collapsed: boolean) => void;
// }

// const BenSidebar: React.FC<BenSidebarProps> = ({ collapsed, setCollapsed }) => {
//   const navigate = useNavigate();
//   const [userName, setUserName] = useState('Ahmed');
//   const [todayStats, setTodayStats] = useState({ meals: 12, pickups: 5 });

//   const navItems = [
//     { path: '/beneficiary/dashboard', icon: 'fa-chart-line', label: 'Dashboard', color: 'text-primary-400' },
//     { path: '/beneficiary/surplus', icon: 'fa-boxes', label: 'Food Surplus', color: 'text-secondary-400' },
//     { path: '/beneficiary/reservations', icon: 'fa-calendar-check', label: 'Reservations', color: 'text-accent-400' },
//     { path: '/beneficiary/history', icon: 'fa-history', label: 'History', color: 'text-primary-400' },
//     { path: '/beneficiary/profile', icon: 'fa-user', label: 'Profile', color: 'text-secondary-400' },
//     { path: '/beneficiary/settings', icon: 'fa-cog', label: 'Settings', color: 'text-accent-400' },
//   ];

//   const handleLogout = () => {
//     toast.success('👋 Logged out successfully!');
//     setTimeout(() => navigate('/auth'), 1000);
//   };

//   return (
//     <motion.aside
//       initial={{ x: -20, opacity: 0 }}
//       animate={{ x: 0, opacity: 1 }}
//       className={`fixed left-0 top-0 h-full bg-gradient-to-b from-primary-700 to-primary-900 text-white transition-all duration-300 z-50 shadow-2xl ${
//         collapsed ? 'w-20' : 'w-64'
//       }`}
//     >
//       {/* Logo */}
//       <div className={`p-5 border-b border-primary-600/30 ${collapsed ? 'text-center' : ''}`}>
//         <motion.div
//           whileHover={{ scale: 1.05 }}
//           className="flex items-center gap-3 cursor-pointer"
//           onClick={() => navigate('/beneficiary/dashboard')}
//         >
//           <i className="fas fa-leaf text-2xl text-secondary-400"></i>
//           {!collapsed && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="flex flex-col"
//             >
//               <span className="text-xl font-bold bg-gradient-to-r from-white to-secondary-200 bg-clip-text text-transparent">
//                 FoodShare
//               </span>
//               <span className="text-xs text-primary-300">Beneficiary Portal</span>
//             </motion.div>
//           )}
//         </motion.div>
//       </div>

//       {/* Collapse Button */}
//       <motion.button
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.9 }}
//         onClick={() => setCollapsed(!collapsed)}
//         className="absolute -right-3 top-20 w-6 h-6 bg-secondary-500 rounded-full flex items-center justify-center hover:bg-secondary-400 transition-all duration-200 shadow-lg hover:shadow-xl z-50"
//       >
//         <i className={`fas fa-chevron-${collapsed ? 'right' : 'left'} text-white text-xs`}></i>
//       </motion.button>

//       {/* User Info (when expanded) */}
//       {!collapsed && (
//         <motion.div
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mx-4 mt-4 p-3 bg-white/10 rounded-xl flex items-center gap-3"
//         >
//           <div className="w-10 h-10 bg-gradient-to-r from-secondary-500 to-accent-500 rounded-full flex items-center justify-center text-lg shadow-lg">
//             👤
//           </div>
//           <div>
//             <p className="text-sm font-semibold">{userName}</p>
//             <p className="text-xs text-primary-300">Active Member</p>
//           </div>
//         </motion.div>
//       )}

//       {/* Today's Impact Card */}
//       {!collapsed && (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="mx-4 mt-4 p-3 bg-gradient-to-r from-secondary-500/20 to-accent-500/20 rounded-xl border border-white/10"
//         >
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-xs text-primary-300">Today's Impact</span>
//             <i className="fas fa-chart-line text-secondary-400 text-xs"></i>
//           </div>
//           <div className="flex justify-between items-center">
//             <div>
//               <p className="text-xl font-bold">{todayStats.meals}</p>
//               <p className="text-xs text-primary-300">Meals Saved</p>
//             </div>
//             <div className="w-px h-8 bg-white/20"></div>
//             <div className="text-right">
//               <p className="text-xl font-bold">{todayStats.pickups}</p>
//               <p className="text-xs text-primary-300">Pickups</p>
//             </div>
//           </div>
//         </motion.div>
//       )}

//       {/* Navigation */}
//       <nav className="p-4 mt-4">
//         {navItems.map((item, index) => (
//           <NavLink
//             key={item.path}
//             to={item.path}
//             end={item.path === '/beneficiary/dashboard'}
//             className={({ isActive }) =>
//               `group relative flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all duration-200 ${
//                 isActive
//                   ? 'bg-white/20 text-white shadow-lg'
//                   : 'text-primary-100 hover:bg-white/10 hover:text-white'
//               } ${collapsed ? 'justify-center' : ''}`
//             }
//             title={collapsed ? item.label : ''}
//           >
//             <i className={`fas ${item.icon} w-5 text-lg ${!collapsed && 'group-hover:scale-110 transition-transform'}`}></i>
//             {!collapsed && (
//               <motion.span
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: index * 0.05 }}
//                 className="text-sm font-medium"
//               >
//                 {item.label}
//               </motion.span>
//             )}
//             {collapsed && (
//               <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg">
//                 {item.label}
//               </div>
//             )}
//           </NavLink>
//         ))}
//       </nav>

//       {/* Footer */}
//       <div className={`absolute bottom-0 left-0 right-0 p-4 border-t border-primary-600/30 ${collapsed ? 'text-center' : ''}`}>
//         <motion.button
//           whileHover={{ scale: collapsed ? 1.1 : 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           onClick={handleLogout}
//           className={`flex items-center gap-3 text-primary-200 hover:text-white transition-colors ${collapsed ? 'justify-center w-full' : ''}`}
//         >
//           <i className="fas fa-sign-out-alt"></i>
//           {!collapsed && <span className="text-sm">Logout</span>}
//         </motion.button>
//       </div>
//     </motion.aside>
//   );
// };

// export default BenSidebar;     
    // src/components/beneficiary/BenSidebar.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', path: '/beneficiary/dashboard', icon: <FaChartLine size={18} />, label: 'Dashboard' },
    { id: 'surplus', path: '/beneficiary/surplus', icon: <FaBox size={18} />, label: 'Food Surplus' },
    { id: 'reservations', path: '/beneficiary/reservations', icon: <FaCalendarCheck size={18} />, label: 'Reservations' },
    { id: 'history', path: '/beneficiary/history', icon: <FaHistory size={18} />, label: 'History' },
    { id: 'profile', path: '/beneficiary/profile', icon: <FaUser size={18} />, label: 'Profile' },
    { id: 'settings', path: '/beneficiary/settings', icon: <FaCog size={18} />, label: 'Settings' },
  ];

  return (
    <aside className={`fixed left-0 top-0 h-full bg-gradient-to-b from-primary-700 to-primary-900 text-white transition-all duration-300 z-50 shadow-xl ${collapsed ? 'w-20' : 'w-64'}`}>
      {/* Logo */}
      <div className={`p-5 border-b border-primary-600 ${collapsed ? 'text-center' : ''}`}>
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/beneficiary/dashboard')}>
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
            <p className="text-xs text-primary-300">Active member</p>
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

      {/* Navigation */}
      <nav className="px-3 mt-6 space-y-1">
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

      {/* Footer */}
      <div className={`absolute bottom-0 left-0 right-0 p-4 border-t border-primary-600 ${collapsed ? 'text-center' : ''}`}>
        <button onClick={() => navigate('/')} className={`flex items-center gap-3 text-primary-200 hover:text-white transition-colors ${collapsed ? 'justify-center w-full' : ''}`}>
          <FaHome size={16} />
          {!collapsed && <span className="text-sm">Back to home</span>}
        </button>
        <button onClick={() => navigate('/auth')} className={`flex items-center gap-3 mt-2 text-primary-200 hover:text-white transition-colors ${collapsed ? 'justify-center w-full' : ''}`}>
          <FaSignOutAlt size={16} />
          {!collapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default BenSidebar;