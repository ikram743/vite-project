// src/components/beneficiary/BenLoadingSkeleton.tsx
import React from 'react';

interface BenLoadingSkeletonProps {
  type?: 'card' | 'stats' | 'list';
  count?: number;
}

const BenLoadingSkeleton: React.FC<BenLoadingSkeletonProps> = ({ type = 'card', count = 3 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
            <div className="h-28 bg-gray-200"></div>
            <div className="p-5 space-y-3">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="flex gap-2">
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        );
      
      case 'stats':
        return (
          <div className="bg-white rounded-2xl p-6 text-center animate-pulse">
            <div className="w-16 h-16 bg-gray-200 rounded-2xl mx-auto mb-3"></div>
            <div className="h-8 bg-gray-200 rounded w-20 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
          </div>
        );
      
      case 'list':
        return (
          <div className="bg-white rounded-2xl p-4 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="w-16 h-8 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(count).fill(0).map((_, i) => (
        <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};

export default BenLoadingSkeleton;