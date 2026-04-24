import React from "react";
import { Link } from "react-router-dom";
import { FaBell, FaUserCircle, FaChevronDown, FaLeaf } from "react-icons/fa";

const DonorHeader: React.FC = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 py-3 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary-600">
          <FaLeaf className="text-secondary-500" />
          <span>FoodShare</span>
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-6">
          {/* Notifications */}
          <div className="relative cursor-pointer">
            <FaBell className="text-gray-500 text-lg hover:text-primary-500 transition-colors" />
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
              3
            </span>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-2 cursor-pointer py-1 px-3 rounded-lg hover:bg-gray-50 transition-all">
            <FaUserCircle className="text-2xl text-gray-400" />
            <span className="hidden md:inline text-sm font-medium text-gray-700">Ahmed Benali</span>
            <FaChevronDown className="text-gray-400 text-xs" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default DonorHeader;