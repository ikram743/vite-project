// components/admin/AdminSidebar.tsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiHome,
  FiUsers,
  FiHeart,
  FiPackage,
  FiTruck,
  FiBell,
  FiBarChart2,
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

interface AdminSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  collapsed,
  setCollapsed,
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const navItems = [
    { path: "/admin", icon: FiHome, label: "Dashboard" },
    { path: "/admin/donors", icon: FiUsers, label: "Donateurs" },
    { path: "/admin/beneficiaries", icon: FiHeart, label: "Bénéficiaires" },
    { path: "/admin/surplus", icon: FiPackage, label: "Surplus" },
    { path: "/admin/distributions", icon: FiTruck, label: "Distributions" },
    { path: "/admin/notifications", icon: FiBell, label: "Notifications" },
    { path: "/admin/impact", icon: FiBarChart2, label: "Impact" },
    { path: "/admin/settings", icon: FiSettings, label: "Paramètres" },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-gradient-to-b from-primary-800 to-primary-900 text-white transition-all duration-300 z-50 shadow-2xl ${collapsed ? "w-20" : "w-64"}`}
    >
      {/* Logo Section with FontAwesome Leaf Icon */}
      <div
        className={`p-5 border-b border-primary-700 ${collapsed ? "text-center" : ""}`}
      >
        <div className="flex items-center gap-3">
          <i className="fas fa-leaf text-2xl text-primary-300"></i>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col"
            >
              <span className="text-xl font-bold">FoodShare</span>
              <span className="text-xs text-primary-300">Administration</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center hover:bg-primary-400 transition-all duration-200 shadow-lg hover:shadow-xl z-50 group"
      >
        {collapsed ? (
          <FiChevronRight className="w-3 h-3 text-white group-hover:scale-110 transition" />
        ) : (
          <FiChevronLeft className="w-3 h-3 text-white group-hover:scale-110 transition" />
        )}
      </button>

      {/* Navigation */}
      <nav className="p-4 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/admin"}
            onMouseEnter={() => setHoveredItem(item.label)}
            onMouseLeave={() => setHoveredItem(null)}
            title={collapsed ? item.label : ""}
          >
            {({ isActive }) => (
              <>
                <div
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-xl mb-1.5 transition-all duration-200 ${
                    isActive
                      ? "bg-primary-700/80 text-white shadow-lg"
                      : "text-primary-200 hover:bg-primary-700/50 hover:text-white"
                  } ${collapsed ? "justify-center" : ""} group`}
                >
                  <item.icon
                    className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${collapsed ? "mx-auto" : ""}`}
                  />
                  {!collapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}

                  {/* Tooltip for collapsed mode */}
                  {collapsed && hoveredItem === item.label && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-50 animate-fade-in">
                      {item.label}
                    </div>
                  )}
                </div>

                {/* Active indicator */}
                {isActive && !collapsed && (
                  <div className="absolute left-0 w-1 h-8 bg-white rounded-r-full"></div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-4 border-t border-primary-700 ${collapsed ? "text-center" : ""}`}
      >
        <div className="flex items-center gap-2 text-primary-300 text-xs">
          <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
          {!collapsed && <span>v2.0.0 | Système opérationnel</span>}
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
