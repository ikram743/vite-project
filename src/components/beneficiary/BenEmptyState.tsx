// src/components/beneficiary/BenEmptyState.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface BenEmptyStateProps {
  title: string;
  message: string;
  icon?: string;
  actionText?: string;
  actionLink?: string;
}

const BenEmptyState: React.FC<BenEmptyStateProps> = ({ 
  title, 
  message, 
  icon = '🍽️',
  actionText,
  actionLink = '/beneficiary/surplus'
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
      <div className="text-7xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">{message}</p>
      {actionText && (
        <button
          onClick={() => navigate(actionLink)}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-secondary-500 text-white rounded-xl hover:bg-secondary-600 transition-all duration-200"
        >
          <span>{actionText}</span>
          <span>→</span>
        </button>
      )}
    </div>
  );
};

export default BenEmptyState;