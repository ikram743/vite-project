import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DonorHeader from '../../components/donor/DonorHeader';
import DonorSidebar from '../../components/donor/DonorSidebar';
import './DonorDashboard.css';

const DonorSurplus: React.FC = () => {
  const navigate = useNavigate();
  
  const [surpluses, setSurpluses] = useState([
    { 
      id: 1, 
      title: 'Fresh Bread', 
      category: 'Bakery',
      quantity: '10 kg', 
      expiry: '2026-03-15', 
      status: 'available', 
      requests: 2,
      createdAt: '2026-03-10'
    },
    { 
      id: 2, 
      title: 'Mixed Vegetables', 
      category: 'Vegetables',
      quantity: '5 kg', 
      expiry: '2026-03-12', 
      status: 'reserved', 
      requests: 1,
      createdAt: '2026-03-09'
    },
    { 
      id: 3, 
      title: 'Prepared Meals', 
      category: 'Prepared Food',
      quantity: '15 portions', 
      expiry: '2026-03-10', 
      status: 'completed', 
      requests: 0,
      createdAt: '2026-03-08'
    },
    { 
      id: 4, 
      title: 'Fresh Fruits', 
      category: 'Fruits',
      quantity: '8 kg', 
      expiry: '2026-03-14', 
      status: 'available', 
      requests: 3,
      createdAt: '2026-03-11'
    },
  ]);

  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSurpluses = surpluses.filter(item => {
    const matchesFilter = filter === 'all' || item.status === filter;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this surplus?')) {
      setSurpluses(surpluses.filter(item => item.id !== id));
    }
  };

  const handleEdit = (id: number) => {
    console.log('Edit surplus:', id);
  };

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'available': return 'status-available';
      case 'reserved': return 'status-reserved';
      case 'completed': return 'status-completed';
      default: return '';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'available': return 'Available';
      case 'reserved': return 'Reserved';
      case 'completed': return 'Completed';
      default: return status;
    }
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
              <h1>My Surplus</h1>
              <p>Manage all your food surplus listings</p>
            </div>
            <button className="btn-primary" onClick={() => window.location.href = '/donor/add-surplus'}>
              <i className="fas fa-plus-circle"></i> Add New Surplus
            </button>
          </div>

          <div className="filters-bar">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search by title or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button 
                className={`filter-btn ${filter === 'available' ? 'active' : ''}`}
                onClick={() => setFilter('available')}
              >
                Available
              </button>
              <button 
                className={`filter-btn ${filter === 'reserved' ? 'active' : ''}`}
                onClick={() => setFilter('reserved')}
              >
                Reserved
              </button>
              <button 
                className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
                onClick={() => setFilter('completed')}
              >
                Completed
              </button>
            </div>
          </div>

          <div className="surplus-section">
            <div className="table-responsive">
              <table className="surplus-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Expiry Date</th>
                    <th>Status</th>
                    <th>Requests</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSurpluses.length > 0 ? (
                    filteredSurpluses.map(item => (
                      <tr key={item.id}>
                        <td>
                          <div className="item-title">
                            <strong>{item.title}</strong>
                            <small>Added: {item.createdAt}</small>
                          </div>
                        </td>
                        <td>{item.category}</td>
                        <td>{item.quantity}</td>
                        <td>{item.expiry}</td>
                        <td>
                          <span className={`status-badge ${getStatusClass(item.status)}`}>
                            {getStatusText(item.status)}
                          </span>
                        </td>
                        <td className="text-center">
                          {item.requests > 0 ? (
                            <span className="requests-badge">{item.requests}</span>
                          ) : '-'}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="action-btn edit" 
                              onClick={() => handleEdit(item.id)}
                              title="Edit"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button 
                              className="action-btn delete" 
                              onClick={() => handleDelete(item.id)}
                              title="Delete"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                            {item.requests > 0 && (
                              <button 
                                className="action-btn view" 
                                title="View Requests"
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center empty-state">
                        <i className="fas fa-box-open"></i>
                        <p>No surplus items found</p>
                        <button className="btn-primary" onClick={() => window.location.href = '/donor/add-surplus'}>
                          Add Your First Surplus
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="summary-cards">
            <div className="summary-card">
              <span className="summary-label">Total Items</span>
              <span className="summary-value">{surpluses.length}</span>
            </div>
            <div className="summary-card">
              <span className="summary-label">Available</span>
              <span className="summary-value">{surpluses.filter(s => s.status === 'available').length}</span>
            </div>
            <div className="summary-card">
              <span className="summary-label">Reserved</span>
              <span className="summary-value">{surpluses.filter(s => s.status === 'reserved').length}</span>
            </div>
            <div className="summary-card">
              <span className="summary-label">Completed</span>
              <span className="summary-value">{surpluses.filter(s => s.status === 'completed').length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorSurplus;