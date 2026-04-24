import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DonorSidebar from '../../components/donor/DonorSidebar';
import { FaBox, FaCheckCircle, FaUsers, FaCalendar, FaEye, FaComment } from 'react-icons/fa';

const DonorHistory = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const historyData = [
    { id: 1, date: '2026-03-10', item: 'Fresh Bread', beneficiary: 'Association Nour', quantity: '10 kg', status: 'completed' },
    { id: 2, date: '2026-03-09', item: 'Mixed Vegetables', beneficiary: 'Food Bank', quantity: '5 kg', status: 'completed' },
    { id: 3, date: '2026-03-08', item: 'Prepared Meals', beneficiary: 'Charity Center', quantity: '15 portions', status: 'completed' },
    { id: 4, date: '2026-03-07', item: 'Fresh Fruits', beneficiary: 'Association Nour', quantity: '8 kg', status: 'completed' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DonorSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="p-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Donation History</h1>
          <p className="text-gray-500 mb-6">Track all your past donations</p>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 flex items-center gap-3"><div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center"><FaBox className="text-emerald-600" /></div><div><div className="text-2xl font-bold">{historyData.length}</div><div className="text-sm text-gray-500">Total Donations</div></div></div>
            <div className="bg-white rounded-xl p-4 flex items-center gap-3"><div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><FaCheckCircle className="text-blue-600" /></div><div><div className="text-2xl font-bold">{historyData.filter(d => d.status === 'completed').length}</div><div className="text-sm text-gray-500">Completed</div></div></div>
            <div className="bg-white rounded-xl p-4 flex items-center gap-3"><div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center"><FaUsers className="text-amber-600" /></div><div><div className="text-2xl font-bold">4</div><div className="text-sm text-gray-500">Beneficiaries</div></div></div>
            <div className="bg-white rounded-xl p-4 flex items-center gap-3"><div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center"><FaCalendar className="text-rose-600" /></div><div><div className="text-2xl font-bold">Mar 2026</div><div className="text-sm text-gray-500">Last Month</div></div></div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200"><tr><th className="text-left py-3 px-4">Date</th><th className="text-left py-3 px-4">Item</th><th className="text-left py-3 px-4">Beneficiary</th><th className="text-left py-3 px-4">Quantity</th><th className="text-left py-3 px-4">Status</th><th className="text-center py-3 px-4">Actions</th></tr></thead>
                <tbody>{historyData.map(item => (<tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50"><td className="py-3 px-4">{item.date}</td><td className="py-3 px-4 font-medium">{item.item}</td><td className="py-3 px-4">{item.beneficiary}</td><td className="py-3 px-4">{item.quantity}</td><td className="py-3 px-4"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">Completed</span></td><td className="py-3 px-4 text-center"><div className="flex items-center justify-center gap-2"><button className="p-2 bg-gray-100 rounded-lg hover:bg-primary-100"><FaEye className="text-gray-600" /></button><button className="p-2 bg-gray-100 rounded-lg hover:bg-primary-100"><FaComment className="text-gray-600" /></button></div></td></tr>))}</tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DonorHistory;