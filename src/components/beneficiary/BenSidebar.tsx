import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './BenSidebar.css';

const BenSidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-pie', path: '/beneficiary/dashboard' },
    { id: 'surplus', label: 'Available Surplus', icon: 'fa-box', path: '/beneficiary/surplus' },
    { id: 'reservations', label: 'My Reservations', icon: 'fa-calendar-check', path: '/beneficiary/reservations' },
    { id: 'history', label: 'History', icon: 'fa-history', path: '/beneficiary/history' },
    { id: 'profile', label: 'Profile', icon: 'fa-user', path: '/beneficiary/profile' },
    { id: 'settings', label: 'Settings', icon: 'fa-cog', path: '/beneficiary/settings' }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    window.location.href = '/login';
  };

  return (
    <aside className="ben-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <i className="fas fa-leaf"></i>
          <span>FoodShare</span>
        </div>
        <p className="sidebar-subtitle">Beneficiary Dashboard</p>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <Link
            key={item.id}
            to={item.path}
            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
          >
            <i className={`fas ${item.icon}`}></i>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item logout" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default BenSidebar;