import React, { useState } from 'react';
import BenHeader from '../../components/beneficiary/BenHeader';
import BenSidebar from '../../components/beneficiary/BenSidebar';
import SurplusCard from '../../components/beneficiary/SurplusCard';
import './BenDashboard.css';

const BenDashboard: React.FC = () => {
  const [stats] = useState({
    availableSurplus: 24,
    myReservations: 8,
    completedPickups: 16,
    savedMeals: 245
  });

  const [nearbySurplus] = useState([
    { id: 1, title: 'Fresh Bread', donor: 'Artisan Bakery', distance: 0.5, quantity: '10 kg', expiry: '2026-03-15', category: 'Bakery' },
    { id: 2, title: 'Mixed Vegetables', donor: 'Green Market', distance: 1.2, quantity: '8 kg', expiry: '2026-03-14', category: 'Vegetables' },
    { id: 3, title: 'Prepared Meals', donor: 'Restaurant El Djazair', distance: 2.1, quantity: '15 portions', expiry: '2026-03-13', category: 'Prepared Food' },
  ]);

  const [recentReservations] = useState([
    { id: 1, title: 'Fresh Bread', donor: 'Artisan Bakery', date: '2026-03-10', status: 'confirmed' },
    { id: 2, title: 'Vegetables', donor: 'Green Market', date: '2026-03-09', status: 'pending' },
    { id: 3, title: 'Fruits', donor: 'Fresh Mart', date: '2026-03-08', status: 'completed' },
  ]);

  return (
    <div className="ben-dashboard">
      <BenHeader />
      
      <div className="dashboard-main container">
        <BenSidebar />
        
        <div className="dashboard-content">
          {/* أزرار التنقل - فوق كل المحتوى */}
          <div className="navigation-buttons">
            <button className="nav-btn back-btn" onClick={() => window.history.back()}>
              <i className="fas fa-arrow-left"></i> Back
            </button>
            <button className="nav-btn home-btn" onClick={() => window.location.href = '/'}>
              <i className="fas fa-home"></i> Home
            </button>
          </div>

          <div className="welcome-section">
            <div>
              <h1>Welcome back, Association Nour! 👋</h1>
              <p>Here's what's available near you</p>
            </div>
            <div className="location-badge">
              <i className="fas fa-map-marker-alt"></i> Algiers, 3 km radius
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#e8f5e9' }}>
                <i className="fas fa-box" style={{ color: '#2ecc71' }}></i>
              </div>
              <div className="stat-details">
                <h3>{stats.availableSurplus}</h3>
                <p>Available Surplus</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#fff3e0' }}>
                <i className="fas fa-clock" style={{ color: '#f39c12' }}></i>
              </div>
              <div className="stat-details">
                <h3>{stats.myReservations}</h3>
                <p>My Reservations</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#e8eaf6' }}>
                <i className="fas fa-check-circle" style={{ color: '#3498db' }}></i>
              </div>
              <div className="stat-details">
                <h3>{stats.completedPickups}</h3>
                <p>Completed Pickups</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#fef5f5' }}>
                <i className="fas fa-utensils" style={{ color: '#e74c3c' }}></i>
              </div>
              <div className="stat-details">
                <h3>{stats.savedMeals}</h3>
                <p>Meals Saved</p>
              </div>
            </div>
          </div>

          <div className="nearby-section">
            <div className="section-header">
              <h2>Nearby Surplus</h2>
              <a href="/beneficiary/surplus" className="view-all">View all <i className="fas fa-arrow-right"></i></a>
            </div>
            <div className="surplus-grid">
              {nearbySurplus.map(item => (
                <SurplusCard key={item.id} surplus={item} />
              ))}
            </div>
          </div>

          <div className="recent-section">
            <div className="section-header">
              <h2>Recent Reservations</h2>
              <a href="/beneficiary/reservations" className="view-all">View all <i className="fas fa-arrow-right"></i></a>
            </div>
            <div className="reservations-list">
              {recentReservations.map(item => (
                <div key={item.id} className="reservation-item">
                  <div className="reservation-info">
                    <h4>{item.title}</h4>
                    <p>{item.donor} • {item.date}</p>
                  </div>
                  <span className={`status-badge ${item.status}`}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenDashboard;