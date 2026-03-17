import React from 'react';
import { useNavigate } from 'react-router-dom';
import DonorHeader from '../../components/donor/DonorHeader';
import DonorSidebar from '../../components/donor/DonorSidebar';
import './DonorDashboard.css';

const DonorReservations: React.FC = () => {
  const navigate = useNavigate();

  const reservations = [
    { id: 1, title: 'Fresh Bread', beneficiary: 'Association Nour', date: '2026-03-15', status: 'pending' },
    { id: 2, title: 'Mixed Vegetables', beneficiary: 'Food Bank', date: '2026-03-14', status: 'confirmed' },
    { id: 3, title: 'Prepared Meals', beneficiary: 'Charity Center', date: '2026-03-13', status: 'completed' },
  ];

  return (
    <div className="donor-dashboard">
      <DonorHeader />
      <div className="dashboard-main container">
        <DonorSidebar />
        
        <div className="dashboard-content">
          {/* أزرار التنقل */}
          <div className="navigation-buttons">
            <button className="nav-btn back-btn" onClick={() => navigate(-1)}>
              <i className="fas fa-arrow-left"></i> Back
            </button>
            <button className="nav-btn home-btn" onClick={() => navigate('/')}>
              <i className="fas fa-home"></i> Home
            </button>
          </div>

          <h1>Reservations</h1>
          <p>Manage your food surplus reservations</p>

          <div className="reservations-list">
            {reservations.map(item => (
              <div key={item.id} className="reservation-item">
                <div className="reservation-info">
                  <h3>{item.title}</h3>
                  <p>Beneficiary: {item.beneficiary}</p>
                  <p>Pickup Date: {item.date}</p>
                </div>
                <span className={`status-badge ${item.status}`}>
                  {item.status}
                </span>
                <div className="reservation-actions">
                  <button className="btn-view">View Details</button>
                  <button className="btn-contact">Contact</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorReservations;