import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DonorSidebar from '../../components/donor/DonorSidebar';
import { FaBox, FaSearch, FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const DonorSurplus = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const surplusItems = [
    { id: 1, name: 'Fresh Bread', category: 'Bakery', quantity: '100 pieces', expiry: '2026-03-15', status: 'available', requests: 2 },
    { id: 2, name: 'Mixed Vegetables', category: 'Vegetables', quantity: '30 kg', expiry: '2026-03-12', status: 'reserved', requests: 1 },
    { id: 3, name: 'Prepared Meals', category: 'Prepared Food', quantity: '50 meals', expiry: '2026-03-10', status: 'completed', requests: 0 },
    { id: 4, name: 'Fresh Fruits', category: 'Fruits', quantity: '25 kg', expiry: '2026-03-14', status: 'available', requests: 3 },
  ];

  const filteredItems = surplusItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'available': return 'bg-emerald-100 text-emerald-700';
      case 'reserved': return 'bg-amber-100 text-amber-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DonorSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">My Surplus</h1>
              <p className="text-gray-500 mt-1">Manage all your food surplus listings</p>
            </div>
            <button onClick={() => navigate('/donor/add-surplus')} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              <FaPlus size={14} /> Add New Surplus
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input type="text" placeholder="Search by name or category..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500" />
            </div>
            <div className="flex gap-2">
              {['all', 'available', 'reserved', 'completed'].map(status => (
                <button key={status} onClick={() => setFilterStatus(status)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === status ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
                  {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Name</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Category</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Quantity</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Expiry</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Status</th>
                    <th className="text-center py-3 px-4 text-gray-600 font-semibold text-sm">Requests</th>
                    <th className="text-center py-3 px-4 text-gray-600 font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map(item => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 font-medium text-gray-900">{item.name}</td>
                      <td className="py-3 px-4 text-gray-600">{item.category}</td>
                      <td className="py-3 px-4 text-gray-600">{item.quantity}</td>
                      <td className="py-3 px-4 text-gray-600">{item.expiry}</td>
                      <td className="py-3 px-4"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusClass(item.status)}`}>{item.status}</span></td>
                      <td className="py-3 px-4 text-center">{item.requests > 0 ? <span className="inline-flex items-center justify-center w-6 h-6 bg-primary-500 text-white rounded-full text-xs font-bold">{item.requests}</span> : '-'}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all"><FaEdit size={14} /></button>
                          <button className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"><FaTrash size={14} /></button>
                          <button className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white transition-all"><FaEye size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="bg-white rounded-xl p-4 text-center"><span className="block text-2xl font-bold text-primary-600">{surplusItems.length}</span><span className="text-sm text-gray-500">Total Items</span></div>
            <div className="bg-white rounded-xl p-4 text-center"><span className="block text-2xl font-bold text-emerald-600">{surplusItems.filter(s => s.status === 'available').length}</span><span className="text-sm text-gray-500">Available</span></div>
            <div className="bg-white rounded-xl p-4 text-center"><span className="block text-2xl font-bold text-amber-600">{surplusItems.filter(s => s.status === 'reserved').length}</span><span className="text-sm text-gray-500">Reserved</span></div>
            <div className="bg-white rounded-xl p-4 text-center"><span className="block text-2xl font-bold text-blue-600">{surplusItems.filter(s => s.status === 'completed').length}</span><span className="text-sm text-gray-500">Completed</span></div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DonorSurplus;