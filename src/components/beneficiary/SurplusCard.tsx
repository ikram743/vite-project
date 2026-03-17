import React from 'react';
import { Link } from 'react-router-dom';
import './SurplusCard.css';

interface SurplusCardProps {
  surplus: {
    id: number;
    title: string;
    donor: string;
    distance: number;  // غيري من string إلى number
    quantity: string;
    expiry: string;
    category: string;
    description?: string;
    image?: string;
  };
  viewMode?: 'grid' | 'list';
}

const SurplusCard: React.FC<SurplusCardProps> = ({ surplus, viewMode = 'grid' }) => {
  return (
    <div className={`surplus-card ${viewMode}`}>
      <div className="card-header">
        <span className="category-tag">{surplus.category}</span>
        <span className="distance">
          <i className="fas fa-map-marker-alt"></i> {surplus.distance} km
        </span>
      </div>
      
      <h3>{surplus.title}</h3>
      
      <div className="donor-info">
        <i className="fas fa-store"></i>
        <span>{surplus.donor}</span>
      </div>
      
      <div className="card-details">
        <div className="detail">
          <i className="fas fa-weight"></i>
          <span>{surplus.quantity}</span>
        </div>
        <div className="detail">
          <i className="fas fa-calendar"></i>
          <span>Exp: {surplus.expiry}</span>
        </div>
      </div>
      
      <Link to={`/beneficiary/reserve/${surplus.id}`} className="btn-reserve">
        Reserve Now
      </Link>
    </div>
  );
};

export default SurplusCard;