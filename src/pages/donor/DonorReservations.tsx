import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DonorSidebar from '../../components/donor/DonorSidebar';
import { FaCheck, FaTimes, FaComment, FaEye } from 'react-icons/fa';

const DonorReservations = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const reservations = [
    { id: 1, title: 'Fresh Bread', beneficiary: 'Association Nour', phone: '+213 55 12 34 56', quantity: '10 kg', date: '2026-03-15', status: 'pending' },
    { id: 2, title: 'Mixed Vegetables', beneficiary: 'Food Bank', phone: '+213 55 23 45 67', quantity: '5 kg', date: '2026-03-14', status: 'confirmed' },
    { id: 3, title: 'Prepared Meals', beneficiary: 'Charity Center', phone: '+213 55 34 56 78', quantity: '15 portions', date: '2026-03-13', status: 'completed' },
  ];

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'confirmed': return 'bg-emerald-100 text-emerald-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DonorSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="p-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Reservations</h1>
          <p className="text-gray-500 mb-6">Manage your food surplus reservations</p>

          <div className="space-y-4">
            {reservations.map(res => (
              <div key={res.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{res.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{res.beneficiary}</p>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                      <span><i className="fas fa-phone mr-1"></i> {res.phone}</span>
                      <span><i className="fas fa-weight mr-1"></i> {res.quantity}</span>
                      <span><i className="fas fa-calendar mr-1"></i> {res.date}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(res.status)}`}>{res.status}</span>
                    <div className="flex gap-2 mt-2">
                      {res.status === 'pending' && <button className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"><FaCheck className="inline mr-1" size={12} /> Confirm</button>}
                      {res.status === 'pending' && <button className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"><FaTimes className="inline mr-1" size={12} /> Cancel</button>}
                      <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200"><FaComment className="inline mr-1" size={12} /> Contact</button>
                      <button className="px-3 py-1.5 bg-primary-50 text-primary-600 text-sm rounded-lg hover:bg-primary-100"><FaEye className="inline mr-1" size={12} /> Details</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DonorReservations;