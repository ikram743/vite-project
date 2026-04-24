import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DonorSidebar from '../../components/donor/DonorSidebar';
import { FaBox, FaWeight, FaUsers, FaStar, FaChartLine } from 'react-icons/fa';

const DonorStatistics = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [period, setPeriod] = useState('month');

  const monthlyData = [
    { month: 'Jan', donations: 12, quantity: 65 }, { month: 'Feb', donations: 18, quantity: 92 },
    { month: 'Mar', donations: 24, quantity: 128 }, { month: 'Apr', donations: 22, quantity: 115 },
    { month: 'May', donations: 28, quantity: 145 }, { month: 'Jun', donations: 32, quantity: 168 },
  ];
  const maxDonations = Math.max(...monthlyData.map(d => d.donations));

  const categories = [{ name: 'Bakery', percent: 29, count: 45 }, { name: 'Vegetables', percent: 24, count: 38 }, { name: 'Fruits', percent: 21, count: 32 }, { name: 'Prepared Food', percent: 18, count: 28 }, { name: 'Dairy', percent: 8, count: 13 }];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DonorSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="p-8">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <div><h1 className="text-2xl font-semibold text-gray-900">Statistics & Analytics</h1><p className="text-gray-500">Track your impact and donation patterns</p></div>
            <div className="flex gap-2 bg-gray-100 p-1 rounded-full"><button onClick={() => setPeriod('week')} className={`px-4 py-1.5 rounded-full text-sm ${period === 'week' ? 'bg-primary-600 text-white' : 'text-gray-600'}`}>Week</button><button onClick={() => setPeriod('month')} className={`px-4 py-1.5 rounded-full text-sm ${period === 'month' ? 'bg-primary-600 text-white' : 'text-gray-600'}`}>Month</button><button onClick={() => setPeriod('year')} className={`px-4 py-1.5 rounded-full text-sm ${period === 'year' ? 'bg-primary-600 text-white' : 'text-gray-600'}`}>Year</button></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <div className="bg-white rounded-xl p-4 flex items-center gap-3"><div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center"><FaBox className="text-emerald-600" /></div><div><div className="text-2xl font-bold">156</div><div className="text-sm text-gray-500">Total Donations</div></div></div>
            <div className="bg-white rounded-xl p-4 flex items-center gap-3"><div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><FaWeight className="text-blue-600" /></div><div><div className="text-2xl font-bold">845</div><div className="text-sm text-gray-500">Total Quantity (kg)</div></div></div>
            <div className="bg-white rounded-xl p-4 flex items-center gap-3"><div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center"><FaUsers className="text-amber-600" /></div><div><div className="text-2xl font-bold">47</div><div className="text-sm text-gray-500">Beneficiaries</div></div></div>
            <div className="bg-white rounded-xl p-4 flex items-center gap-3"><div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center"><FaStar className="text-rose-600" /></div><div><div className="text-2xl font-bold">4.8</div><div className="text-sm text-gray-500">Average Rating</div></div></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm"><h3 className="text-lg font-semibold mb-4">Monthly Donations</h3><div className="flex justify-between items-end h-48 gap-2">{monthlyData.map((item, i) => (<div key={i} className="flex-1 flex flex-col items-center gap-2"><div className="w-full bg-primary-500 rounded-t-lg transition-all" style={{ height: `${(item.donations / maxDonations) * 140}px` }}><div className="text-center text-white text-xs font-bold mt-1">{item.donations}</div></div><span className="text-xs text-gray-500">{item.month}</span></div>))}</div></div>
            <div className="bg-white rounded-xl p-6 shadow-sm"><h3 className="text-lg font-semibold mb-4">Categories Distribution</h3>{categories.map((cat, i) => (<div key={i} className="mb-4"><div className="flex justify-between text-sm mb-1"><span>{cat.name}</span><span>{cat.count} items ({cat.percent}%)</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-primary-500 rounded-full h-2" style={{ width: `${cat.percent}%` }}></div></div></div>))}</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DonorStatistics;