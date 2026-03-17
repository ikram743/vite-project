import React, { useState } from 'react';
import BenHeader from '../../components/beneficiary/BenHeader';
import BenSidebar from '../../components/beneficiary/BenSidebar';
import SurplusCard from '../../components/beneficiary/SurplusCard';
import './BenSurplus.css';

interface Surplus {
  id: number;
  title: string;
  donor: string;
  donorId: number;
  donorRating: number;
  distance: number;
  quantity: string;
  unit: string;
  items: number;
  expiryDate: string;
  expiry: string;
  category: string;
  description: string;
  pickupAddress: string;
  pickupTime: string;
  images: string[];
  available: boolean;
  reservedCount: number;
}

const BenSurplus: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDistance, setSelectedDistance] = useState('10');
  const [sortBy, setSortBy] = useState('nearest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [surplusData] = useState<Surplus[]>([
    {
      id: 1, title: 'Fresh Bread - Baguettes', donor: 'Artisan Bakery', donorId: 101, donorRating: 4.8,
      distance: 0.5, quantity: '15 kg', unit: 'kg', items: 25, expiryDate: '2026-03-15', expiry: '2026-03-15',
      category: 'Bakery', description: 'Fresh baguettes baked this morning.', available: true, reservedCount: 2,
      pickupAddress: '12 Rue Didouche, Algiers', pickupTime: '09:00 - 18:00', images: []
    },
    {
      id: 2, title: 'Mixed Vegetables Box', donor: 'Green Market', donorId: 102, donorRating: 4.6,
      distance: 1.2, quantity: '8 kg', unit: 'kg', items: 12, expiryDate: '2026-03-14', expiry: '2026-03-14',
      category: 'Vegetables', description: 'Assorted fresh vegetables.', available: true, reservedCount: 1,
      pickupAddress: '45 Rue Larbi Ben Mhidi, Algiers', pickupTime: '10:00 - 19:00', images: []
    },
    {
      id: 3, title: 'Prepared Meals - Couscous', donor: 'Restaurant El Djazair', donorId: 103, donorRating: 4.9,
      distance: 2.1, quantity: '20 portions', unit: 'portions', items: 20, expiryDate: '2026-03-13', expiry: '2026-03-13',
      category: 'Prepared Food', description: 'Traditional Algerian couscous.', available: true, reservedCount: 3,
      pickupAddress: '78 Boulevard Zighoud Youcef, Algiers', pickupTime: '12:00 - 21:00', images: []
    }
  ]);

  const categories = ['all', 'Bakery', 'Vegetables', 'Fruits', 'Prepared Food', 'Dairy', 'Other'];

  const filteredSurplus = surplusData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.donor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesDistance = parseFloat(item.distance.toString()) <= parseFloat(selectedDistance);
    return matchesSearch && matchesCategory && matchesDistance && item.available;
  });

  const sortedSurplus = [...filteredSurplus].sort((a, b) => {
    switch(sortBy) {
      case 'nearest': return a.distance - b.distance;
      case 'soonest': return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
      case 'rating': return b.donorRating - a.donorRating;
      default: return 0;
    }
  });

  return (
    <div className="ben-dashboard">
      <BenHeader />
      <div className="dashboard-main container">
        <BenSidebar />
        
        <div className="dashboard-content surplus-page">
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
            <h1>Available Surplus</h1>
            <p>Find food surplus near you</p>
          </div>

          <div className="surplus-filters">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input type="text" placeholder="Search by title, donor, or description..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="filter-controls">
              <select className="filter-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                {categories.map(cat => <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>)}
              </select>
              <select className="filter-select" value={selectedDistance} onChange={(e) => setSelectedDistance(e.target.value)}>
                <option value="5">Within 5 km</option>
                <option value="10">Within 10 km</option>
                <option value="20">Within 20 km</option>
                <option value="50">Within 50 km</option>
              </select>
              <select className="filter-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="nearest">Nearest first</option>
                <option value="soonest">Expiring soon</option>
                <option value="rating">Highest rated</option>
              </select>
            </div>
          </div>

          <div className="results-count">
            <span>{sortedSurplus.length} items available</span>
            <button className="btn-reset" onClick={() => { setSearchTerm(''); setSelectedCategory('all'); setSelectedDistance('10'); setSortBy('nearest'); }}>
              <i className="fas fa-undo"></i> Reset Filters
            </button>
          </div>

          <div className="view-toggle">
            <button className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>
              <i className="fas fa-th-large"></i>
            </button>
            <button className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
              <i className="fas fa-list"></i>
            </button>
          </div>

          {sortedSurplus.length > 0 ? (
            <div className={`surplus-container ${viewMode}`}>
              {sortedSurplus.map(item => (
                <SurplusCard key={item.id} surplus={item} viewMode={viewMode} />
              ))}
            </div>
          ) : (
            <div className="empty-results">
              <i className="fas fa-box-open"></i>
              <h3>No surplus found</h3>
              <p>Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BenSurplus;