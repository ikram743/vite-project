// src/components/beneficiary/BenStatCard.tsx
import React from 'react';

interface BenStatCardProps {
  icon: string;
  value: string | number;
  label: string;
  trend?: string;
  color?: 'primary' | 'secondary' | 'accent';
  delay?: number;
}

const colorClasses = {
  primary: 'from-primary-500 to-primary-700',
  secondary: 'from-secondary-500 to-secondary-700',
  accent: 'from-accent-500 to-accent-700',
};

const BenStatCard: React.FC<BenStatCardProps> = ({ 
  icon, 
  value, 
  label, 
  trend, 
  color = 'primary',
  delay = 0 
}) => {
  return (
    <div 
      className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${colorClasses[color]} bg-opacity-10 mb-3 group-hover:scale-110 transition-transform duration-300`}>
        <span className="text-4xl">{icon}</span>
      </div>
      <div className="text-3xl font-bold text-gray-800 mb-1">{value}</div>
      <div className="text-gray-500 text-sm">{label}</div>
      {trend && (
        <div className="text-xs text-green-500 mt-2 flex items-center justify-center gap-1">
          <span>📈</span>
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
};

export default BenStatCard;