import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DonorHeader from '../../components/donor/DonorHeader';
import DonorSidebar from '../../components/donor/DonorSidebar';
import './DonorDashboard.css';

const DonorStatistics: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const stats = {
    totalDonations: 156,
    totalQuantity: 845,
    totalBeneficiaries: 47,
    averageRating: 4.7,
    activeDonors: 23,
    successRate: 94
  };

  const monthlyData = [
    { month: 'Jan', donations: 12, quantity: 65 },
    { month: 'Feb', donations: 18, quantity: 92 },
    { month: 'Mar', donations: 24, quantity: 128 },
    { month: 'Apr', donations: 22, quantity: 115 },
    { month: 'May', donations: 28, quantity: 145 },
    { month: 'Jun', donations: 32, quantity: 168 },
  ];

  const categoryData = [
    { category: 'Bakery', count: 45, percentage: 29 },
    { category: 'Vegetables', count: 38, percentage: 24 },
    { category: 'Fruits', count: 32, percentage: 21 },
    { category: 'Prepared Food', count: 28, percentage: 18 },
    { category: 'Dairy', count: 13, percentage: 8 }
  ];

  const maxDonations = Math.max(...monthlyData.map(d => d.donations));

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

          <div className="statistics-header">
            <div>
              <h1>Statistics & Analytics</h1>
              <p>Track your impact and donation patterns</p>
            </div>
            <div className="period-selector">
              <button 
                className={`period-btn ${selectedPeriod === 'week' ? 'active' : ''}`}
                onClick={() => setSelectedPeriod('week')}
              >
                Week
              </button>
              <button 
                className={`period-btn ${selectedPeriod === 'month' ? 'active' : ''}`}
                onClick={() => setSelectedPeriod('month')}
              >
                Month
              </button>
              <button 
                className={`period-btn ${selectedPeriod === 'year' ? 'active' : ''}`}
                onClick={() => setSelectedPeriod('year')}
              >
                Year
              </button>
            </div>
          </div>

          {/* بطاقات الإحصائيات */}
          <div className="stats-main-grid">
            <div className="stat-main-card">
              <div className="stat-main-icon" style={{ background: '#e8f5e9' }}>
                <i className="fas fa-box" style={{ color: '#2ecc71' }}></i>
              </div>
              <div className="stat-main-info">
                <span className="stat-main-label">Total Donations</span>
                <span className="stat-main-value">{stats.totalDonations}</span>
              </div>
            </div>

            <div className="stat-main-card">
              <div className="stat-main-icon" style={{ background: '#e8eaf6' }}>
                <i className="fas fa-weight" style={{ color: '#3498db' }}></i>
              </div>
              <div className="stat-main-info">
                <span className="stat-main-label">Total Quantity (kg)</span>
                <span className="stat-main-value">{stats.totalQuantity}</span>
              </div>
            </div>

            <div className="stat-main-card">
              <div className="stat-main-icon" style={{ background: '#fff3e0' }}>
                <i className="fas fa-users" style={{ color: '#f39c12' }}></i>
              </div>
              <div className="stat-main-info">
                <span className="stat-main-label">Beneficiaries</span>
                <span className="stat-main-value">{stats.totalBeneficiaries}</span>
              </div>
            </div>

            <div className="stat-main-card">
              <div className="stat-main-icon" style={{ background: '#fef5f5' }}>
                <i className="fas fa-star" style={{ color: '#e74c3c' }}></i>
              </div>
              <div className="stat-main-info">
                <span className="stat-main-label">Average Rating</span>
                <span className="stat-main-value">{stats.averageRating}</span>
              </div>
            </div>
          </div>

          {/* الرسم البياني */}
          <div className="chart-container">
            <h2>Monthly Donations</h2>
            <div className="bar-chart">
              {monthlyData.map((item, index) => (
                <div key={index} className="chart-column">
                  <div 
                    className="bar donations-bar"
                    style={{ height: `${(item.donations / maxDonations) * 150}px` }}
                  >
                    <span className="bar-value">{item.donations}</span>
                  </div>
                  <span className="chart-label">{item.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* توزيع الفئات */}
          <div className="analytics-card">
            <h3>Categories Distribution</h3>
            <div className="category-list">
              {categoryData.map((item, index) => (
                <div key={index} className="category-item">
                  <div className="category-info">
                    <span className="category-name">{item.category}</span>
                    <span className="category-count">{item.count} items</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="category-percentage">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorStatistics;