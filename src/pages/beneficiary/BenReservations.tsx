import React, { useState } from 'react';
import BenHeader from '../../components/beneficiary/BenHeader';
import BenSidebar from '../../components/beneficiary/BenSidebar';
import BenReservationCard from '../../components/beneficiary/BenReservationCard';
import './BenReservations.css';

type ReservationStatus = 'pending' | 'confirmed' | 'ready' | 'completed' | 'cancelled';

interface Reservation {
  id: number;
  surplusTitle: string;
  donorName: string;
  donorPhone: string;
  quantity: string;
  reservationDate: string;
  pickupDate: string;
  status: ReservationStatus;
  notes?: string;
  rating?: number;
}

const BenReservations: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [reservations] = useState<Reservation[]>([
    { id: 1, surplusTitle: 'Fresh Bread', donorName: 'Artisan Bakery', donorPhone: '0555 12 34 56', quantity: '5 kg', reservationDate: '2026-03-10', pickupDate: '2026-03-11', status: 'pending' },
    { id: 2, surplusTitle: 'Mixed Vegetables', donorName: 'Green Market', donorPhone: '0555 78 90 12', quantity: '3 kg', reservationDate: '2026-03-09', pickupDate: '2026-03-10', status: 'confirmed' },
    { id: 3, surplusTitle: 'Prepared Meals', donorName: 'Restaurant El Djazair', donorPhone: '0555 34 56 78', quantity: '5 portions', reservationDate: '2026-03-08', pickupDate: '2026-03-09', status: 'ready' },
    { id: 4, surplusTitle: 'Fresh Fruits', donorName: 'Fresh Mart', donorPhone: '0555 56 78 90', quantity: '4 kg', reservationDate: '2026-03-07', pickupDate: '2026-03-08', status: 'completed', rating: 5 },
    { id: 5, surplusTitle: 'Dairy Products', donorName: 'Daily Dairy', donorPhone: '0555 90 12 34', quantity: '3 L', reservationDate: '2026-03-06', pickupDate: '2026-03-07', status: 'cancelled' }
  ]);

  const stats = {
    total: reservations.length,
    pending: reservations.filter(r => r.status === 'pending').length,
    confirmed: reservations.filter(r => r.status === 'confirmed').length,
    ready: reservations.filter(r => r.status === 'ready').length,
    completed: reservations.filter(r => r.status === 'completed').length
  };

  const filteredReservations = reservations.filter(item => {
    const matchesFilter = filter === 'all' || item.status === filter;
    const matchesSearch = item.surplusTitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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

          <div className="page-header">
            <h1>My Reservations</h1>
            <p>Manage your food surplus reservations</p>
          </div>

          <div className="reservation-stats">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#fff3e0' }}>
                <i className="fas fa-clock" style={{ color: '#f39c12' }}></i>
              </div>
              <div className="stat-details">
                <h3>{stats.pending}</h3>
                <p>Pending</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#e8f5e9' }}>
                <i className="fas fa-check-circle" style={{ color: '#2ecc71' }}></i>
              </div>
              <div className="stat-details">
                <h3>{stats.confirmed}</h3>
                <p>Confirmed</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#e8eaf6' }}>
                <i className="fas fa-box-open" style={{ color: '#3498db' }}></i>
              </div>
              <div className="stat-details">
                <h3>{stats.ready}</h3>
                <p>Ready</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#e8f5e9' }}>
                <i className="fas fa-check-double" style={{ color: '#27ae60' }}></i>
              </div>
              <div className="stat-details">
                <h3>{stats.completed}</h3>
                <p>Completed</p>
              </div>
            </div>
          </div>

          <div className="filter-tabs">
            <button className={`filter-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All ({stats.total})</button>
            <button className={`filter-tab ${filter === 'pending' ? 'active' : ''}`} onClick={() => setFilter('pending')}>Pending ({stats.pending})</button>
            <button className={`filter-tab ${filter === 'confirmed' ? 'active' : ''}`} onClick={() => setFilter('confirmed')}>Confirmed ({stats.confirmed})</button>
            <button className={`filter-tab ${filter === 'ready' ? 'active' : ''}`} onClick={() => setFilter('ready')}>Ready ({stats.ready})</button>
            <button className={`filter-tab ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>Completed ({stats.completed})</button>
          </div>

          <div className="reservations-list">
            {filteredReservations.map(reservation => (
              <BenReservationCard key={reservation.id} reservation={reservation} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenReservations;