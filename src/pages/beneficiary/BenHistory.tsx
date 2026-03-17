import React, { useState } from 'react';
import BenHeader from '../../components/beneficiary/BenHeader';
import BenSidebar from '../../components/beneficiary/BenSidebar';
import './BenHistory.css';

const BenHistory: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('2026-03');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [historyData] = useState([
    {
      id: 1, title: 'Fresh Bread', donor: 'Artisan Bakery', donorPhone: '0555 12 34 56', quantity: '10 kg',
      reservationDate: '2026-03-10', pickupDate: '2026-03-11', status: 'completed', rating: 5, category: 'Bakery',
      notes: 'Fresh bread delivered in the morning'
    },
    {
      id: 2, title: 'Mixed Vegetables', donor: 'Green Market', donorPhone: '0555 78 90 12', quantity: '8 kg',
      reservationDate: '2026-03-09', pickupDate: '2026-03-10', status: 'completed', rating: 4, category: 'Vegetables',
      notes: 'Good quality vegetables'
    },
    {
      id: 3, title: 'Prepared Meals', donor: 'Restaurant El Djazair', donorPhone: '0555 34 56 78', quantity: '15 portions',
      reservationDate: '2026-03-08', pickupDate: '2026-03-09', status: 'completed', rating: 5, category: 'Prepared Food',
      notes: 'Delicious traditional meals'
    }
  ]);

  const totalPickups = historyData.filter(item => item.status === 'completed').length;
  const totalQuantity = historyData.filter(item => item.status === 'completed').reduce((acc, item) => acc + (parseInt(item.quantity) || 0), 0);
  const totalDonors = new Set(historyData.map(item => item.donor)).size;
  const averageRating = (historyData.filter(item => item.rating > 0).reduce((acc, item) => acc + item.rating, 0) / historyData.filter(item => item.rating > 0).length).toFixed(1);

  const categories = ['all', ...new Set(historyData.map(item => item.category))];

  const filteredHistory = historyData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.donor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    if (filter === 'month') return matchesSearch && matchesCategory && item.pickupDate.startsWith(selectedMonth);
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status: string) => status === 'completed' ? 'status-completed' : 'status-cancelled';
  const getStatusIcon = (status: string) => status === 'completed' ? 'fa-check-circle' : 'fa-times-circle';
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const renderStars = (rating: number) => Array(5).fill(0).map((_, i) => <i key={i} className={`fas fa-star ${i < rating ? 'star-filled' : 'star-empty'}`}></i>);

  return (
    <div className="ben-dashboard">
      <BenHeader />
      <div className="dashboard-main container">
        <BenSidebar />
        
        <div className="dashboard-content history-page">
          {/* أزرار التنقل - فوق كل المحتوى */}
          <div className="navigation-buttons">
            <button className="nav-btn back-btn" onClick={() => window.history.back()}>
              <i className="fas fa-arrow-left"></i> Back
            </button>
            <button className="nav-btn home-btn" onClick={() => window.location.href = '/'}>
              <i className="fas fa-home"></i> Home
            </button>
          </div>

          <div className="page-header">
            <h1>Donation History</h1>
            <p>Track all your past pickups and donations</p>
          </div>

          <div className="history-stats">
            <div className="stat-card"><div className="stat-icon" style={{ background: '#e8f5e9' }}><i className="fas fa-check-circle" style={{ color: '#2ecc71' }}></i></div><div className="stat-details"><h3>{totalPickups}</h3><p>Completed Pickups</p></div></div>
            <div className="stat-card"><div className="stat-icon" style={{ background: '#e8eaf6' }}><i className="fas fa-weight" style={{ color: '#3498db' }}></i></div><div className="stat-details"><h3>{totalQuantity} kg</h3><p>Total Quantity</p></div></div>
            <div className="stat-card"><div className="stat-icon" style={{ background: '#fff3e0' }}><i className="fas fa-store" style={{ color: '#f39c12' }}></i></div><div className="stat-details"><h3>{totalDonors}</h3><p>Donors</p></div></div>
            <div className="stat-card"><div className="stat-icon" style={{ background: '#fef5f5' }}><i className="fas fa-star" style={{ color: '#e74c3c' }}></i></div><div className="stat-details"><h3>{averageRating}</h3><p>Avg Rating</p></div></div>
          </div>

          <div className="history-filters">
            <div className="search-box"><i className="fas fa-search"></i><input type="text" placeholder="Search by title or donor..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
            <div className="filter-controls">
              <select className="filter-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">All Time</option><option value="month">This Month</option><option value="year">This Year</option>
              </select>
              {filter === 'month' && <input type="month" className="month-picker" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} />}
              <select className="filter-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                {categories.map(cat => <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>)}
              </select>
            </div>
          </div>

          <div className="history-timeline">
            {filteredHistory.length > 0 ? filteredHistory.map((item, index) => (
              <div key={item.id} className="timeline-item">
                <div className="timeline-marker">
                  <div className={`timeline-dot ${item.status}`}><i className={`fas ${getStatusIcon(item.status)}`}></i></div>
                  {index < filteredHistory.length - 1 && <div className="timeline-line"></div>}
                </div>
                <div className="timeline-content">
                  <div className="timeline-header">
                    <div className="timeline-date"><i className="fas fa-calendar-alt"></i>{formatDate(item.pickupDate)}</div>
                    <span className={`status-badge ${getStatusBadge(item.status)}`}>{item.status === 'completed' ? 'Completed' : 'Cancelled'}</span>
                  </div>
                  <div className="donation-details"><h3>{item.title}</h3><span className="category-tag">{item.category}</span></div>
                  <div className="beneficiary-info">
                    <div className="info-row"><i className="fas fa-store"></i><span>{item.donor}</span></div>
                    <div className="info-row"><i className="fas fa-weight"></i><span>Quantity: {item.quantity}</span></div>
                  </div>
                  {item.rating > 0 && <div className="rating-section"><div className="stars">{renderStars(item.rating)}</div></div>}
                </div>
              </div>
            )) : (
              <div className="empty-history">
                <i className="fas fa-history"></i><h3>No History Found</h3><p>Your completed pickups will appear here</p>
                <button className="btn-primary" onClick={() => window.location.href = '/beneficiary/surplus'}>Browse Available Surplus</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenHistory;