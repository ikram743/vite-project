import React from 'react';
import { Link } from 'react-router-dom';
import './DonorHeader.css';

const DonorHeader: React.FC = () => {
  return (
    <header className="donor-header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="logo">
            <i className="fas fa-leaf"></i>
            <span>FoodShare</span>
          </Link>
          <span className="badge">Donor Dashboard</span>
        </div>

        <div className="header-right">
          <div className="notifications">
            <i className="fas fa-bell"></i>
            <span className="badge">3</span>
          </div>
          <div className="user-menu">
            <img src="https://via.placeholder.com/40" alt="User" className="avatar" />
            <span className="user-name">Ahmed Benali</span>
            <i className="fas fa-chevron-down"></i>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DonorHeader;