import React from "react";
import { FaUser, FaPhone, FaWeight, FaCalendar, FaCheck, FaTimes, FaComment, FaEye } from "react-icons/fa";

interface Reservation {
  id: number;
  surplusTitle: string;
  beneficiaryName: string;
  beneficiaryPhone: string;
  quantity: string;
  pickupDate: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

interface ReservationCardProps {
  reservation: Reservation;
  onConfirm?: (id: number) => void;
  onComplete?: (id: number) => void;
  onCancel?: (id: number) => void;
}

const ReservationCard: React.FC<ReservationCardProps> = ({ reservation, onConfirm, onComplete, onCancel }) => {
  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending": return "bg-amber-100 text-amber-700";
      case "confirmed": return "bg-emerald-100 text-emerald-700";
      case "completed": return "bg-blue-100 text-blue-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "Pending";
      case "confirmed": return "Confirmed";
      case "completed": return "Completed";
      case "cancelled": return "Cancelled";
      default: return status;
    }
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1">
      {/* Header */}
      <div className="flex justify-between items-center pb-3 mb-3 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-900">{reservation.surplusTitle}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(reservation.status)}`}>
          {getStatusText(reservation.status)}
        </span>
      </div>

      {/* Body */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <FaUser className="w-4 text-primary-500" />
          <span>{reservation.beneficiaryName}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <FaPhone className="w-4 text-primary-500" />
          <span>{reservation.beneficiaryPhone}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <FaWeight className="w-4 text-primary-500" />
          <span>Quantity: {reservation.quantity}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <FaCalendar className="w-4 text-primary-500" />
          <span>Pickup: {reservation.pickupDate}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {reservation.status === "pending" && (
          <>
            <button onClick={() => onConfirm?.(reservation.id)} className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-1">
              <FaCheck size={12} /> Confirm
            </button>
            <button onClick={() => onCancel?.(reservation.id)} className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-all flex items-center justify-center gap-1">
              <FaTimes size={12} /> Cancel
            </button>
          </>
        )}
        {reservation.status === "confirmed" && (
          <button onClick={() => onComplete?.(reservation.id)} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-1">
            <FaCheck size={12} /> Mark Completed
          </button>
        )}
        <button className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-all flex items-center justify-center gap-1">
          <FaComment size={12} /> Contact
        </button>
        <button className="flex-1 py-2 bg-primary-50 text-primary-600 rounded-lg text-sm font-semibold hover:bg-primary-100 transition-all flex items-center justify-center gap-1">
          <FaEye size={12} /> Details
        </button>
      </div>
    </div>
  );
};

export default ReservationCard;