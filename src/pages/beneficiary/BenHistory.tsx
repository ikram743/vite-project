import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BenSidebar from '../../components/beneficiary/BenSidebar';
import { FaStore, FaCalendar, FaBox, FaStar, FaRegStar } from 'react-icons/fa';

interface HistoryItem {
  id: number;
  food: string;
  donor: string;
  quantity: string;
  date: string;
  status: 'delivered' | 'cancelled';
  rating: number;
  feedback?: string;
}

const BenHistory = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedYear, setSelectedYear] = useState('2024');
  const [showFeedback, setShowFeedback] = useState<number | null>(null);

  const historyItems: HistoryItem[] = [
    { id: 1, food: 'Ready Meals', donor: 'Al Salam Restaurant', quantity: '10 meals', date: '2024-12-15', status: 'delivered', rating: 5, feedback: 'Great quality food, very fresh!' },
    { id: 2, food: 'Fresh Bread', donor: 'Al Noor Bakery', quantity: '20 pieces', date: '2024-12-14', status: 'delivered', rating: 4, feedback: 'Fresh bread, thank you' },
    { id: 3, food: 'Vegetables', donor: 'Al Fallah Market', quantity: '5 kg', date: '2024-12-13', status: 'delivered', rating: 5, feedback: 'Very fresh vegetables' },
    { id: 4, food: 'Fruits', donor: 'Fresh Market', quantity: '3 kg', date: '2024-12-10', status: 'delivered', rating: 4, feedback: 'Good variety' },
    { id: 5, food: 'Milk', donor: 'Dairy Farm', quantity: '5 liters', date: '2024-12-08', status: 'delivered', rating: 5, feedback: 'Fresh milk' },
  ];

  const years = ['2024', '2023'];
  const filteredHistory = historyItems.filter(item => item.date.includes(selectedYear));
  
  const totalMeals = filteredHistory.reduce((sum, item) => {
    const qty = parseInt(item.quantity) || 0;
    return sum + qty;
  }, 0);
  
  const averageRating = (filteredHistory.reduce((sum, item) => sum + item.rating, 0) / filteredHistory.length).toFixed(1);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          star <= rating ? (
            <FaStar key={star} className="text-yellow-500 text-sm" />
          ) : (
            <FaRegStar key={star} className="text-gray-300 text-sm" />
          )
        ))}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <BenSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Order History</h1>
            <p className="text-gray-500 mt-1">View your past orders and deliveries</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-primary-600">{filteredHistory.length}</div>
              <div className="text-sm text-gray-500">Total Orders</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-secondary-500">{totalMeals}</div>
              <div className="text-sm text-gray-500">Meals Received</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-yellow-500">{averageRating}</div>
              <div className="text-sm text-gray-500">Average Rating</div>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <span className="text-sm text-gray-500">Filter by year:</span>
            {years.map(year => (
              <button key={year} onClick={() => setSelectedYear(year)} className={`px-4 py-2 rounded-lg transition-all text-sm ${selectedYear === year ? 'bg-primary-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>{year}</button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredHistory.map((item) => (
              <div key={item.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <h3 className="font-semibold text-gray-800 text-lg">{item.food}</h3>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Delivered</span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1 flex items-center gap-1"><FaStore className="text-xs" /> {item.donor}</p>
                    <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-400">
                      <span className="flex items-center gap-1"><FaBox className="text-xs" /> {item.quantity}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><FaCalendar className="text-xs" /> {item.date}</span>
                    </div>
                    <div className="mt-2">{renderStars(item.rating)}</div>
                    {showFeedback === item.id && item.feedback && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-600 italic border-l-3 border-primary-500">"{item.feedback}"</div>
                    )}
                  </div>
                </div>
                <div className="flex gap-3 mt-4 pt-3 border-t border-gray-100">
                  <button onClick={() => setShowFeedback(showFeedback === item.id ? null : item.id)} className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                    {showFeedback === item.id ? 'Hide Feedback' : 'View Feedback'}
                  </button>
                  <button onClick={() => navigate('/beneficiary/surplus')} className="flex-1 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 transition-colors">Order Again</button>
                </div>
              </div>
            ))}
          </div>

          {filteredHistory.length === 0 && (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
              <FaCalendar className="text-6xl text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-800">No order history found</h3>
              <p className="text-gray-400 text-sm mt-1 mb-4">You haven't placed any orders yet</p>
              <button onClick={() => navigate('/beneficiary/surplus')} className="px-6 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 transition-colors">Browse Food Surplus</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BenHistory;