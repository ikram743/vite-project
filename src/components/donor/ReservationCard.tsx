import React from 'react';
import './ReservationCard.css';

interface Reservation {
  id: number;
  surplusTitle: string;
  beneficiaryName: string;
  beneficiaryPhone: string;
  quantity: string;
  pickupDate: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

interface ReservationCardProps {
  reservation: Reservation;
  onConfirm?: (id: number) => void;
  onComplete?: (id: number) => void;
}

const ReservationCard: React.FC<ReservationCardProps> = ({ reservation, onConfirm, onComplete }) => {
  const getStatusClass = (status: string) => {
    switch(status) {
      case 'pending': return 'status-pending';
      case 'confirmed': return 'status-confirmed';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  return (
    <div className="reservation-card">
      <div className="card-header">
        <h3>{reservation.surplusTitle}</h3>
        <span className={`status-badge ${getStatusClass(reservation.status)}`}>
          {getStatusText(reservation.status)}
        </span>
      </div>

      <div className="card-body">
        <div className="info-row">
          <i className="fas fa-user"></i>
          <span>{reservation.beneficiaryName}</span>
        </div>
        <div className="info-row">
          <i className="fas fa-phone"></i>
          <span>{reservation.beneficiaryPhone}</span>
        </div>
        <div className="info-row">
          <i className="fas fa-weight"></i>
          <span>Quantity: {reservation.quantity}</span>
        </div>
        <div className="info-row">
          <i className="fas fa-calendar"></i>
          <span>Pickup: {reservation.pickupDate}</span>
        </div>
      </div>

      <div className="card-actions">
        {reservation.status === 'pending' && (
          <button className="btn-confirm" onClick={() => onConfirm?.(reservation.id)}>
            <i className="fas fa-check"></i> Confirm
          </button>
        )}
        {reservation.status === 'confirmed' && (
          <button className="btn-complete" onClick={() => onComplete?.(reservation.id)}>
            <i className="fas fa-check-double"></i> Mark Completed
          </button>
        )}
        <button className="btn-contact">
          <i className="fas fa-comment"></i> Contact
        </button>
      </div>
    </div>
  );
};

export default ReservationCard;