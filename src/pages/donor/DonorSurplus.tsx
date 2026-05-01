import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DonorSidebar from '../../components/donor/DonorSidebar';
import { FaBox, FaSearch, FaPlus, FaEdit, FaTrash, FaEye, FaSpinner } from 'react-icons/fa';
import { getMyDonations, deleteDonation, updateDonationStatus } from '../../lib/API';
import toast from 'react-hot-toast';

interface SurplusItem {
  id: string;
  name: string;
  category: string;
  quantity: string;
  quantityValue: number;
  unit: string;
  expiry: string;
  status: 'available' | 'reserved' | 'completed';
  requests: number;
  description?: string;
  pickupAddress?: string;
}

const DonorSurplus = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [surplusItems, setSurplusItems] = useState<SurplusItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadSurplus = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMyDonations();
      console.log('My donations response:', response);
      
      let donations = [];
      if (response?.data?.donations) {
        donations = response.data.donations;
      } else if (response?.donations) {
        donations = response.donations;
      } else if (Array.isArray(response)) {
        donations = response;
      }
      
      const formattedItems: SurplusItem[] = donations.map((donation: any) => ({
        id: donation.id,
        name: donation.foodType || donation.name || 'Food Item',
        category: donation.category || getCategoryFromFoodType(donation.foodType),
        quantity: `${donation.totalQuantity || donation.quantity || 0} ${donation.unit || 'kg'}`,
        quantityValue: donation.totalQuantity || donation.quantity || 0,
        unit: donation.unit || 'kg',
        expiry: donation.expirationDate || donation.expiryDate 
          ? new Date(donation.expirationDate || donation.expiryDate).toISOString().split('T')[0]
          : 'N/A',
        status: mapStatus(donation.status),
        requests: donation._count?.requests || donation.requestsCount || 0,
        description: donation.description,
        pickupAddress: donation.pickupAddress
      }));
      
      setSurplusItems(formattedItems);
    } catch (err: any) {
      console.error('Error loading surplus:', err);
      setError(err.message || 'Failed to load surplus');
      toast.error('Failed to load surplus');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryFromFoodType = (foodType: string): string => {
    const type = foodType?.toLowerCase() || '';
    if (type.includes('bread') || type.includes('bakery')) return 'Bakery';
    if (type.includes('vegetable')) return 'Vegetables';
    if (type.includes('fruit')) return 'Fruits';
    if (type.includes('meal')) return 'Prepared Food';
    return 'Other';
  };

  const mapStatus = (status: string): 'available' | 'reserved' | 'completed' => {
    const upperStatus = status?.toUpperCase() || '';
    switch(upperStatus) {
      case 'AVAILABLE':
      case 'ACTIVE':
      case 'OPEN':
        return 'available';
      case 'RESERVED':
      case 'PENDING':
        return 'reserved';
      case 'COMPLETED':
      case 'COLLECTED':
      case 'FINISHED':
        return 'completed';
      default:
        return 'available';
    }
  };

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'available': return 'bg-emerald-100 text-emerald-700';
      case 'reserved': return 'bg-amber-100 text-amber-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    
    setDeletingId(id);
    try {
      await deleteDonation(id);
      toast.success('Donation deleted successfully');
      loadSurplus(); // Refresh list
    } catch (err: any) {
      console.error('Error deleting donation:', err);
      toast.error(err.message || 'Failed to delete donation');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/donor/edit-surplus/${id}`);
  };

  const handleView = (id: string) => {
    navigate(`/donor/surplus/${id}`);
  };

  useEffect(() => {
    loadSurplus();
  }, []);

  const filteredItems = surplusItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const counts = {
    total: surplusItems.length,
    available: surplusItems.filter(s => s.status === 'available').length,
    reserved: surplusItems.filter(s => s.status === 'reserved').length,
    completed: surplusItems.filter(s => s.status === 'completed').length,
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <DonorSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <FaSpinner className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
              <p className="mt-4 text-gray-500">Loading your surplus...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
            <button 
              onClick={() => navigate('/donor/add-surplus')} 
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <FaPlus size={14} /> Add New Surplus
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
              <button onClick={loadSurplus} className="ml-3 underline">Try again</button>
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input 
                type="text" 
                placeholder="Search by name or category..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" 
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['all', 'available', 'reserved', 'completed'].map(status => (
                <button 
                  key={status} 
                  onClick={() => setFilterStatus(status)} 
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus === status 
                      ? 'bg-primary-600 text-white shadow-sm' 
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {status === 'all' ? `All (${counts.total})` : `${status.charAt(0).toUpperCase() + status.slice(1)} (${counts[status as keyof typeof counts]})`}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBox className="text-3xl text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">No surplus items found</p>
              <p className="text-gray-400 text-sm mt-1 mb-5">
                {searchTerm || filterStatus !== 'all' 
                  ? "Try adjusting your search or filters" 
                  : "You haven't added any surplus yet"}
              </p>
              <button 
                onClick={() => navigate('/donor/add-surplus')} 
                className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Add Your First Surplus
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusClass(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {item.requests > 0 ? (
                            <span className="inline-flex items-center justify-center min-w-[24px] h-6 bg-primary-500 text-white rounded-full text-xs font-bold px-2">
                              {item.requests}
                            </span>
                          ) : '-'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => handleEdit(item.id)}
                              className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center"
                              disabled={deletingId === item.id}
                            >
                              <FaEdit size={14} />
                            </button>
                            <button 
                              onClick={() => handleDelete(item.id, item.name)}
                              disabled={deletingId === item.id}
                              className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {deletingId === item.id ? <FaSpinner className="animate-spin" size={14} /> : <FaTrash size={14} />}
                            </button>
                            <button 
                              onClick={() => handleView(item.id)}
                              className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center"
                            >
                              <FaEye size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <span className="block text-2xl font-bold text-primary-600">{counts.total}</span>
              <span className="text-sm text-gray-500">Total Items</span>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <span className="block text-2xl font-bold text-emerald-600">{counts.available}</span>
              <span className="text-sm text-gray-500">Available</span>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <span className="block text-2xl font-bold text-amber-600">{counts.reserved}</span>
              <span className="text-sm text-gray-500">Reserved</span>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <span className="block text-2xl font-bold text-blue-600">{counts.completed}</span>
              <span className="text-sm text-gray-500">Completed</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DonorSurplus;