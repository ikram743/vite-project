import React from 'react';
import { useNavigate } from 'react-router-dom';
import DonorHeader from '../../components/donor/DonorHeader';
import DonorSidebar from '../../components/donor/DonorSidebar';
import './DonorDashboard.css';

const DonorHistory: React.FC = () => {
  const navigate = useNavigate();

  const historyData = [
    { id: 1, date: '2026-03-10', item: 'Fresh Bread', beneficiary: 'Association Nour', quantity: '10 kg', status: 'completed' },
    { id: 2, date: '2026-03-09', item: 'Mixed Vegetables', beneficiary: 'Food Bank Algiers', quantity: '5 kg', status: 'completed' },
    { id: 3, date: '2026-03-08', item: 'Prepared Meals', beneficiary: 'Charity Center', quantity: '15 portions', status: 'completed' },
    { id: 4, date: '2026-03-07', item: 'Fresh Fruits', beneficiary: 'Association Nour', quantity: '8 kg', status: 'completed' },
    { id: 5, date: '2026-03-06', item: 'Dairy Products', beneficiary: 'Food Bank', quantity: '3 L', status: 'expired' },
  ];

  const getStatusClass = (status: string) => {
    return status === 'completed' ? 'status-completed' : 'status-expired';
  };

  const getStatusText = (status: string) => {
    return status === 'completed' ? 'Completed' : 'Expired';
  };

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

          <div className="page-header">
            <div>
              <h1>Donation History</h1>
              <p>Track all your past donations</p>
            </div>
          </div>

          {/* إحصائيات سريعة */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#e8f5e9' }}>
                <i className="fas fa-box" style={{ color: '#2ecc71' }}></i>
              </div>
              <div className="stat-details">
                <h3>{historyData.length}</h3>
                <p>Total Donations</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#e8eaf6' }}>
                <i className="fas fa-check-circle" style={{ color: '#3498db' }}></i>
              </div>
              <div className="stat-details">
                <h3>{historyData.filter(d => d.status === 'completed').length}</h3>
                <p>Completed</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#fff3e0' }}>
                <i className="fas fa-users" style={{ color: '#f39c12' }}></i>
              </div>
              <div className="stat-details">
                <h3>5</h3>
                <p>Beneficiaries</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#fef5f5' }}>
                <i className="fas fa-calendar" style={{ color: '#e74c3c' }}></i>
              </div>
              <div className="stat-details">
                <h3>Mar 2026</h3>
                <p>Last Month</p>
              </div>
            </div>
          </div>

          {/* قائمة التاريخ */}
          <div className="history-timeline">
            {historyData.map((item, index) => (
              <div key={item.id} className="timeline-item">
                <div className="timeline-marker">
                  <div className={`timeline-dot ${item.status}`}></div>
                  {index < historyData.length - 1 && <div className="timeline-line"></div>}
                </div>
                
                <div className="timeline-content">
                  <div className="timeline-header">
                    <div className="timeline-date">
                      <i className="fas fa-calendar-alt"></i>
                      {item.date}
                    </div>
                    <span className={`status-badge ${getStatusClass(item.status)}`}>
                      {getStatusText(item.status)}
                    </span>
                  </div>

                  <div className="donation-details">
                    <h3>{item.item}</h3>
                    <div className="details-row">
                      <div className="detail">
                        <i className="fas fa-weight"></i>
                        <span>{item.quantity}</span>
                      </div>
                      <div className="detail">
                        <i className="fas fa-user"></i>
                        <span>{item.beneficiary}</span>
                      </div>
                    </div>
                  </div>

                  <div className="timeline-actions">
                    <button className="btn-view">
                      <i className="fas fa-eye"></i> View Details
                    </button>
                    <button className="btn-contact">
                      <i className="fas fa-comment"></i> Contact
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorHistory;