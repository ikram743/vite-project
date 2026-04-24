// src/components/beneficiary/BenSearchBar.tsx
import React from 'react';

interface BenSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onFilterChange?: (filter: string) => void;
  filters?: { value: string; label: string }[];
  activeFilter?: string;
}

const BenSearchBar: React.FC<BenSearchBarProps> = ({ 
  value, 
  onChange, 
  placeholder = "Search...",
  onFilterChange,
  filters,
  activeFilter = 'all'
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>

        {/* Filters */}
        {filters && onFilterChange && (
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {filters.map(filter => (
              <button
                key={filter.value}
                onClick={() => onFilterChange(filter.value)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  activeFilter === filter.value
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BenSearchBar;