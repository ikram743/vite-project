import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './DonorSidebar.css';

const DonorSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-pie', path: '/donor/dashboard' },
    { id: 'surplus', label: 'My Surplus', icon: 'fa-box', path: '/donor/surplus' },
    { id: 'add', label: 'Add Surplus', icon: 'fa-plus-circle', path: '/donor/add-surplus' },
    { id: 'reservations', label: 'Reservations', icon: 'fa-calendar-check', path: '/donor/reservations' },
    { id: 'history', label: 'History', icon: 'fa-history', path: '/donor/history' },
    { id: 'statistics', label: 'Statistics', icon: 'fa-chart-bar', path: '/donor/statistics' },
    { id: 'profile', label: 'Profile', icon: 'fa-user', path: '/donor/profile' },
    { id: 'settings', label: 'Settings', icon: 'fa-cog', path: '/donor/settings' }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside className="donor-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <i className="fas fa-leaf"></i>
          <span>FoodShare</span>
        </div>
        <p className="sidebar-subtitle">Donor Dashboard</p>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => handleNavigation(item.path)}
          >
            <i className={`fas ${item.icon}`}></i>
            <span>{item.label}</span>
          </button>
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

export default DonorSidebar;