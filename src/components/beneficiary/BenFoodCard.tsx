// src/components/beneficiary/BenFoodCard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface BenFoodCardProps {
  id: number;
  name: string;
  donor: string;
  quantity: string;
  expiry: string;
  location: string;
  image?: string;
  status?: 'available' | 'reserved' | 'expiring';
}

const BenFoodCard: React.FC<BenFoodCardProps> = ({ 
  id, 
  name, 
  donor, 
  quantity, 
  expiry, 
  location, 
  image = '🍽️',
  status = 'available'
}) => {
  const navigate = useNavigate();

  const getExpiryStatus = () => {
    const today = new Date();
    const expiryDate = new Date(expiry);
    const diffDays = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) return { text: 'Expiring soon!', color: 'bg-red-100 text-red-700', icon: '⚠️' };
    if (diffDays <= 3) return { text: 'Expiring in 3 days', color: 'bg-yellow-100 text-yellow-700', icon: '⏰' };
    return { text: 'Fresh', color: 'bg-green-100 text-green-700', icon: '✨' };
  };

  const expiryStatus = getExpiryStatus();
  const statusColors = {
    available: 'bg-primary-100 text-primary-700',
    reserved: 'bg-secondary-100 text-secondary-700',
    expiring: 'bg-red-100 text-red-700',
  };

  const handleReserve = () => {
    navigate(`/beneficiary/reservations?food=${id}`);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
      {/* Card Header */}
      <div className="relative h-28 bg-gradient-to-r from-primary-100 to-secondary-100 flex items-center justify-center">
        <span className="text-6xl transition-transform group-hover:scale-110 duration-300">{image}</span>
        <span className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
          {status === 'available' ? 'Available' : status === 'reserved' ? 'Reserved' : 'Expiring'}
        </span>
      </div>

      {/* Card Body */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">{name}</h3>
        <p className="text-secondary-500 text-sm mb-3 flex items-center gap-1">
          <span>🏪</span> {donor}
        </p>
        
        <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1">📦 {quantity}</span>
          <span className="flex items-center gap-1">📅 {expiry}</span>
          <span className="flex items-center gap-1">📍 {location}</span>
        </div>

        {/* Expiry Status */}
        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${expiryStatus.color} mb-3`}>
          <span>{expiryStatus.icon}</span>
          <span>{expiryStatus.text}</span>
        </div>

        {/* Reserve Button */}
        <button
          onClick={handleReserve}
          className="w-full bg-secondary-500 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-secondary-600 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          Reserve Now →
        </button>
      </div>
    </div>
  );
};

export default BenFoodCard;