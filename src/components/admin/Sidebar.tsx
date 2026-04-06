// components/admin/AdminSidebar.tsx
import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const AdminSidebar: React.FC = () => {
  const navItems = [
    { path: "/admin", icon: "fa-tachometer-alt", label: "Tableau de bord" },
    { path: "/admin/donors", icon: "fa-store", label: "Donateurs" },
    {
      path: "/admin/beneficiaries",
      icon: "fa-hand-holding-heart",
      label: "Bénéficiaires",
    },
    { path: "/admin/surplus", icon: "fa-boxes", label: "Surplus" },
    { path: "/admin/distributions", icon: "fa-truck", label: "Distributions" },
    { path: "/admin/notifications", icon: "fa-bell", label: "Notifications" },
    { path: "/admin/users", icon: "fa-users", label: "Utilisateurs" },
    { path: "/admin/settings", icon: "fa-cog", label: "Paramètres" },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-logo">
        <i className="fas fa-leaf"></i>
        <div className="logo-text">
          <span>FoodShare</span>
          <small>Administration</small>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/admin"}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <i className={`fas ${item.icon}`}></i>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
