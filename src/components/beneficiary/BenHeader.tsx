import React from 'react';
import { Link } from 'react-router-dom';
import './BenHeader.css';

const BenHeader: React.FC = () => {
  return (
    <header className="ben-header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="logo">
            <i className="fas fa-leaf"></i>
            <span>FoodShare</span>
          </Link>
          <span className="badge">Beneficiary Dashboard</span>
        </div>

        <div className="header-right">
          <div className="notifications">
            <i className="fas fa-bell"></i>
            <span className="badge">3</span>
          </div>
          <div className="user-menu">
            <img src="https://via.placeholder.com/40" alt="User" className="avatar" />
            <span className="user-name">Association Nour</span>
            <i className="fas fa-chevron-down"></i>
          </div>
        </div>
      </div>
    </header>
  );
};

export default BenHeader;