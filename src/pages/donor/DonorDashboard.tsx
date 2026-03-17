import React from 'react';
import { useNavigate } from 'react-router-dom';
import DonorHeader from '../../components/donor/DonorHeader';
import DonorSidebar from '../../components/donor/DonorSidebar';
import './DonorDashboard.css';

const DonorDashboard: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    { id: 1, icon: 'fa-box', value: '12', label: 'Active Surplus', color: '#2ecc71' },
    { id: 2, icon: 'fa-clock', value: '5', label: 'Pending Reservations', color: '#f39c12' },
    { id: 3, icon: 'fa-check-circle', value: '48', label: 'Completed Donations', color: '#3498db' },
    { id: 4, icon: 'fa-users', value: '23', label: 'Beneficiaries Helped', color: '#9b59b6' }
  ];

  const surpluses = [
    { id: 1, title: 'Fresh Bread', quantity: '10 kg', expiry: '2026-03-15', status: 'Available', requests: '?', actions: '✅' },
    { id: 2, title: 'Mixed Vegetables', quantity: '5 kg', expiry: '2026-03-12', status: 'Reserved', requests: '!', actions: '❌' },
    { id: 3, title: 'Prepared Meals', quantity: '15 portions', expiry: '2026-03-10', status: 'Completed', requests: '-', actions: '❌' },
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

          <div className="welcome-section">
            <div>
              <h1>Welcome back, Ahmed! 👋</h1>
              <p>Here's what's happening with your donations today</p>
            </div>
          </div>

          <div className="stats-grid">
            {stats.map(stat => (
              <div key={stat.id} className="stat-card">
                <div className="stat-icon" style={{ background: `${stat.color}20` }}>
                  <i className={`fas ${stat.icon}`} style={{ color: stat.color }}></i>
                </div>
                <div className="stat-details">
                  <h3>{stat.value}</h3>
                  <p>{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="surplus-section">
            <h2>My Surplus</h2>
            
            <div className="table-responsive">
              <table className="surplus-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Quantity</th>
                    <th>Expiry Date</th>
                    <th>Status</th>
                    <th>Requests</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {surpluses.map(item => (
                    <tr key={item.id}>
                      <td>{item.title}</td>
                      <td>{item.quantity}</td>
                      <td>{item.expiry}</td>
                      <td>
                        <span className={`status-badge ${item.status.toLowerCase()}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="text-center">{item.requests}</td>
                      <td className="text-center">
                        <span className="action-icon">{item.actions}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;