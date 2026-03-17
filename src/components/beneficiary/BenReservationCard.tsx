import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './BenReservationCard.css';

interface Reservation {
  id: number;
  surplusTitle: string;
  donorName: string;
  donorPhone: string;
  quantity: string;
  reservationDate: string;
  pickupDate: string;
  status: 'pending' | 'confirmed' | 'ready' | 'completed' | 'cancelled';
  notes?: string;
  rating?: number;
}

interface BenReservationCardProps {
  reservation: Reservation;
  onCancel?: (id: number) => void;
  onConfirmPickup?: (id: number) => void;
  onRate?: (id: number, rating: number) => void;
  onContact?: (id: number) => void;
}

const BenReservationCard: React.FC<BenReservationCardProps> = ({
  reservation,
  onCancel,
  onConfirmPickup,
  onRate,
  onContact
}) => {
  const [showRating, setShowRating] = useState(false);
  const [selectedRating, setSelectedRating] = useState(reservation.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'pending': return 'status-pending';
      case 'confirmed': return 'status-confirmed';
      case 'ready': return 'status-ready';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'pending': return '⏳ Pending';
      case 'confirmed': return '✅ Confirmed';
      case 'ready': return '📦 Ready for Pickup';
      case 'completed': return '🎉 Completed';
      case 'cancelled': return '❌ Cancelled';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending': return 'fa-clock';
      case 'confirmed': return 'fa-check-circle';
      case 'ready': return 'fa-box-open';
      case 'completed': return 'fa-check-double';
      case 'cancelled': return 'fa-times-circle';
      default: return 'fa-info-circle';
    }
  };

  const handleRating = (rating: number) => {
    setSelectedRating(rating);
    if (onRate) {
      onRate(reservation.id, rating);
    }
    setShowRating(false);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const isPending = reservation.status === 'pending';
  const isConfirmed = reservation.status === 'confirmed';
  const isReady = reservation.status === 'ready';
  const isCompleted = reservation.status === 'completed';
  const isCancelled = reservation.status === 'cancelled';
  const canCancel = isPending || isConfirmed;
  const canConfirmPickup = isReady;

  return (
    <div className={`reservation-card ${getStatusClass(reservation.status)}`}>
      {/* Header with status */}
      <div className="card-header">
        <div className="status-wrapper">
          <div className={`status-indicator ${getStatusClass(reservation.status)}`}>
            <i className={`fas ${getStatusIcon(reservation.status)}`}></i>
            <span className="status-text">{getStatusText(reservation.status)}</span>
          </div>
          <span className="reservation-id">#{reservation.id.toString().padStart(4, '0')}</span>
        </div>
        <button 
          className="expand-btn"
          onClick={() => setShowDetails(!showDetails)}
        >
          <i className={`fas fa-chevron-${showDetails ? 'up' : 'down'}`}></i>
        </button>
      </div>

      {/* Main content */}
      <div className="card-body">
        <div className="surplus-info">
          <h3>{reservation.surplusTitle}</h3>
          <div className="donor-badge">
            <i className="fas fa-store"></i>
            <span>{reservation.donorName}</span>
          </div>
        </div>

        <div className="quick-info">
          <div className="info-chip">
            <i className="fas fa-weight"></i>
            <span>{reservation.quantity}</span>
          </div>
          <div className="info-chip">
            <i className="fas fa-calendar-check"></i>
            <span>{formatDate(reservation.pickupDate)}</span>
          </div>
        </div>

        {/* Expanded details */}
        {showDetails && (
          <div className="expanded-details">
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Reservation Date</span>
                <span className="detail-value">{formatDate(reservation.reservationDate)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Pickup Date</span>
                <span className="detail-value">{formatDate(reservation.pickupDate)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Donor Phone</span>
                <span className="detail-value">
                  <a href={`tel:${reservation.donorPhone}`}>{reservation.donorPhone}</a>
                </span>
              </div>
              {reservation.notes && (
                <div className="detail-item full-width">
                  <span className="detail-label">Notes</span>
                  <span className="detail-value">{reservation.notes}</span>
                </div>
              )}
            </div>

            {/* Donor info card */}
            <div className="donor-contact-card">
              <h4>Donor Information</h4>
              <div className="donor-contact-info">
                <div className="contact-row">
                  <i className="fas fa-store"></i>
                  <span>{reservation.donorName}</span>
                </div>
                <div className="contact-row">
                  <i className="fas fa-phone"></i>
                  <a href={`tel:${reservation.donorPhone}`}>{reservation.donorPhone}</a>
                </div>
                <button 
                  className="btn-contact-small"
                  onClick={() => onContact?.(reservation.id)}
                >
                  <i className="fas fa-comment"></i> Send Message
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rating section (for completed reservations) */}
        {isCompleted && (
          <div className="rating-section">
            {!showRating && selectedRating === 0 && (
              <button 
                className="btn-rate"
                onClick={() => setShowRating(true)}
              >
                <i className="fas fa-star"></i> Rate this donation
              </button>
            )}
            
            {showRating && (
              <div className="rating-input">
                <p>How was your experience?</p>
                <div className="stars-container">
                  {[1, 2, 3, 4, 5].map(star => (
                    <i
                      key={star}
                      className={`fas fa-star ${star <= (hoverRating || selectedRating) ? 'star-active' : ''}`}
                      onClick={() => handleRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    ></i>
                  ))}
                </div>
              </div>
            )}

            {selectedRating > 0 && (
              <div className="rating-display">
                <div className="stars-display">
                  {[1, 2, 3, 4, 5].map(star => (
                    <i
                      key={star}
                      className={`fas fa-star ${star <= selectedRating ? 'star-filled' : ''}`}
                    ></i>
                  ))}
                </div>
                <span className="rating-thanks">Thank you for your feedback!</span>
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="card-actions">
          {canCancel && (
            <button 
              className="btn-cancel"
              onClick={() => onCancel?.(reservation.id)}
            >
              <i className="fas fa-times"></i> Cancel Reservation
            </button>
          )}
          
          {canConfirmPickup && (
            <button 
              className="btn-confirm-pickup"
              onClick={() => onConfirmPickup?.(reservation.id)}
            >
              <i className="fas fa-check-circle"></i> Confirm Pickup
            </button>
          )}
          
          <button 
            className="btn-contact"
            onClick={() => onContact?.(reservation.id)}
          >
            <i className="fas fa-comment"></i> Contact Donor
          </button>

          <Link 
            to={`/beneficiary/reservation/${reservation.id}`}
            className="btn-details"
          >
            <i className="fas fa-external-link-alt"></i> Full Details
          </Link>
        </div>

        {/* Progress bar for active reservations */}
        {!isCompleted && !isCancelled && (
          <div className="progress-tracker">
            <div className="progress-steps">
              <div className={`step ${isConfirmed || isReady || isCompleted ? 'completed' : ''}`}>
                <div className="step-icon">
                  <i className="fas fa-check"></i>
                </div>
                <span>Pending</span>
              </div>
              <div className={`step ${isReady || isCompleted ? 'completed' : ''}`}>
                <div className="step-icon">
                  <i className="fas fa-check"></i>
                </div>
                <span>Confirmed</span>
              </div>
              <div className={`step ${isCompleted ? 'completed' : ''}`}>
                <div className="step-icon">
                  <i className="fas fa-check"></i>
                </div>
                <span>Completed</span>
              </div>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ 
                  width: isPending ? '33%' : 
                         isConfirmed ? '66%' : 
                         isReady ? '66%' : 
                         isCompleted ? '100%' : '0%' 
                }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Footer with quick actions */}
      <div className="card-footer">
        <div className="footer-actions">
          <button 
            className="footer-action"
            onClick={() => window.open(`https://maps.google.com/?q=${reservation.donorName}`, '_blank')}
          >
            <i className="fas fa-map-marker-alt"></i>
            <span>Directions</span>
          </button>
          <button 
            className="footer-action"
            onClick={() => navigator.clipboard.writeText(`Reservation #${reservation.id}`)}
          >
            <i className="fas fa-copy"></i>
            <span>Copy ID</span>
          </button>
          <button 
            className="footer-action"
            onClick={() => window.print()}
          >
            <i className="fas fa-print"></i>
            <span>Print</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BenReservationCard;