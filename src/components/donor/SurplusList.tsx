import React from 'react';
import './SurplusList.css';

interface Surplus {
  id: number;
  title: string;
  quantity: string;
  expiry: string;
  status: 'available' | 'reserved' | 'completed';
  requests: number;
}

interface SurplusListProps {
  surpluses: Surplus[];
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const SurplusList: React.FC<SurplusListProps> = ({ surpluses, onEdit, onDelete }) => {
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
    <div className="surplus-list">
      <div className="list-header">
        <div className="header-cell">Title</div>
        <div className="header-cell">Quantity</div>
        <div className="header-cell">Expiry Date</div>
        <div className="header-cell">Status</div>
        <div className="header-cell">Requests</div>
        <div className="header-cell">Actions</div>
      </div>

      {surpluses.map(surplus => (
        <div key={surplus.id} className="list-row">
          <div className="row-cell">{surplus.title}</div>
          <div className="row-cell">{surplus.quantity}</div>
          <div className="row-cell">{surplus.expiry}</div>
          <div className="row-cell">
            <span className={`status-badge ${getStatusClass(surplus.status)}`}>
              {getStatusText(surplus.status)}
            </span>
          </div>
          <div className="row-cell">
            {surplus.requests > 0 ? (
              <span className="requests-badge">{surplus.requests}</span>
            ) : '-'}
          </div>
          <div className="row-cell actions">
            <button className="action-btn edit" onClick={() => onEdit?.(surplus.id)}>
              <i className="fas fa-edit"></i>
            </button>
            <button className="action-btn delete" onClick={() => onDelete?.(surplus.id)}>
              <i className="fas fa-trash"></i>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SurplusList;