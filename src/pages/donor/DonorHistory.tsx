import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DonorSidebar from '../../components/donor/DonorSidebar';
import { FaBox, FaCheckCircle, FaUsers, FaCalendar, FaEye, FaComment, FaSpinner } from 'react-icons/fa';
import { getMyDonations, getReceivedRequests } from '../../lib/API';
import toast from 'react-hot-toast';

interface DonationHistory {
  id: string;
  date: string;
  item: string;
  beneficiary: string;
  quantity: string;
  quantityValue: number;
  unit: string;
  status: string;
  beneficiaryName?: string;
  beneficiaryPhone?: string;
  requestId?: string;
}

// Helper to safely extract an array from API responses
const normalizeArray = (response: any, key?: string): any[] => {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (key && response[key] && Array.isArray(response[key])) return response[key];
  if (response.data && Array.isArray(response.data)) return response.data;
  if (response.donations && Array.isArray(response.donations)) return response.donations;
  if (response.requests && Array.isArray(response.requests)) return response.requests;
  return [];
};

const DonorHistory = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [historyData, setHistoryData] = useState<DonationHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get donor's donations
      const donationsResponse = await getMyDonations();
      console.log('Donations response:', donationsResponse);
      const donations = normalizeArray(donationsResponse, 'donations');
      
      // Get received requests to find beneficiaries (for completed/collected donations)
      const requestsResponse = await getReceivedRequests();
      console.log('Requests response:', requestsResponse);
      const requests = normalizeArray(requestsResponse, 'requests');
      
      // Create a map of donationId to beneficiary info for completed requests
      const donationBeneficiaryMap = new Map();
      requests.forEach((req: any) => {
        const donationId = req.donation?.id || req.donationId;
        const status = req.status?.toLowerCase();
        if (donationId && (status === 'collected' || status === 'completed')) {
          donationBeneficiaryMap.set(donationId, {
            beneficiaryName: req.beneficiary?.user?.name || req.beneficiaryName || 'Beneficiary',
            beneficiaryPhone: req.beneficiary?.user?.phone || req.phone || '',
            requestId: req.id
          });
        }
      });
      
      // Format ALL donations (without filtering by status)
      const formattedHistory: DonationHistory[] = donations.map((donation: any) => {
        const beneficiaryInfo = donationBeneficiaryMap.get(donation.id);
        const dateStr = donation.createdAt || donation.updatedAt;
        
        // Determine status text based on donation status
        let displayStatus = donation.status?.toLowerCase() || 'available';
        let statusText = displayStatus;
        if (displayStatus === 'available') statusText = 'available';
        else if (displayStatus === 'reserved') statusText = 'reserved';
        else if (displayStatus === 'completed') statusText = 'completed';
        else if (displayStatus === 'collected') statusText = 'completed';
        else if (displayStatus === 'finished') statusText = 'completed';
        else statusText = displayStatus;
        
        return {
          id: donation.id,
          date: dateStr ? new Date(dateStr).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          item: donation.foodType || donation.name || 'Food Item',
          beneficiary: beneficiaryInfo?.beneficiaryName || (statusText === 'completed' ? 'Completed' : 'Not yet assigned'),
          quantity: `${donation.totalQuantity || donation.quantity || 0} ${donation.unit || 'kg'}`,
          quantityValue: donation.totalQuantity || donation.quantity || 0,
          unit: donation.unit || 'kg',
          status: statusText,
          beneficiaryName: beneficiaryInfo?.beneficiaryName,
          beneficiaryPhone: beneficiaryInfo?.beneficiaryPhone,
          requestId: beneficiaryInfo?.requestId
        };
      });
      
      setHistoryData(formattedHistory);
      
    } catch (err: any) {
      console.error('Error loading history:', err);
      setError(err.message || 'Failed to load donation history');
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const getAvailableYears = () => {
    const years = new Set<string>();
    historyData.forEach(item => {
      const year = item.date.split('-')[0];
      if (year) years.add(year);
    });
    return Array.from(years).sort().reverse();
  };

  const filteredHistory = historyData.filter(item => {
    if (selectedYear !== 'all') {
      const year = item.date.split('-')[0];
      if (year !== selectedYear) return false;
    }
    if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;
    return true;
  });

  const stats = {
    total: historyData.length,
    completed: historyData.filter(d => d.status === 'completed').length,
    available: historyData.filter(d => d.status === 'available').length,
    reserved: historyData.filter(d => d.status === 'reserved').length,
    uniqueBeneficiaries: new Set(historyData.filter(d => d.beneficiaryName).map(d => d.beneficiary)).size,
    lastMonth: historyData.length > 0 && historyData[0]?.date 
      ? new Date(historyData[0].date).toLocaleString('default', { month: 'short', year: 'numeric' }) 
      : 'N/A'
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'completed':
        return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">Completed</span>;
      case 'available':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">Available</span>;
      case 'reserved':
        return <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">Reserved</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">{status}</span>;
    }
  };

  const handleViewDetails = (item: DonationHistory) => {
    toast('Donation detail pages are not available yet. Opening the donations page instead.');
    navigate('/donor/surplus');
  };

  const handleContactBeneficiary = (item: DonationHistory) => {
    if (item.beneficiaryPhone) {
      window.location.href = `tel:${item.beneficiaryPhone.replace(/\s/g, '')}`;
    } else {
      toast(`📞 No phone number available for ${item.beneficiary}`, {
        icon: '📞',
        duration: 3000,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <DonorSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <FaSpinner className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
              <p className="mt-4 text-gray-500">Loading donation history...</p>
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
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Donation History</h1>
            <p className="text-gray-500 mt-1">Track all your donations (completed, reserved, and available)</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
              <button onClick={loadHistory} className="ml-3 underline">Try again</button>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <FaBox className="text-emerald-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-500">Total Donations</div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaCheckCircle className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.completed}</div>
                <div className="text-sm text-gray-500">Completed</div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FaBox className="text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.available}</div>
                <div className="text-sm text-gray-500">Available</div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <FaUsers className="text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.reserved}</div>
                <div className="text-sm text-gray-500">Reserved</div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                <FaCalendar className="text-rose-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.uniqueBeneficiaries}</div>
                <div className="text-sm text-gray-500">Beneficiaries</div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Year:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
              >
                <option value="all">All Years</option>
                {getAvailableYears().map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* History Table */}
          {filteredHistory.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBox className="text-3xl text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">No donation history found</p>
              <p className="text-gray-400 text-sm mt-1 mb-5">
                {historyData.length === 0 
                  ? "You haven't made any donations yet" 
                  : "No donations match your filters"}
              </p>
              <button 
                onClick={() => navigate('/donor/surplus/add')} 
                className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Create Your First Donation
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Item</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Beneficiary</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Quantity</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistory.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 text-sm text-gray-600">{item.date}</td>
                        <td className="py-3 px-4 font-medium text-gray-900">{item.item}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{item.beneficiary}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{item.quantity}</td>
                        <td className="py-3 px-4">{getStatusBadge(item.status)}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => handleViewDetails(item)}
                              className="p-2 bg-gray-100 rounded-lg hover:bg-primary-100 transition-colors"
                              title="View details"
                            >
                              <FaEye className="text-gray-600 text-sm" />
                            </button>
                            <button 
                              onClick={() => handleContactBeneficiary(item)}
                              className="p-2 bg-gray-100 rounded-lg hover:bg-primary-100 transition-colors"
                              title="Contact beneficiary"
                            >
                              <FaComment className="text-gray-600 text-sm" />
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
        </div>
      </main>
    </div>
  );
};

export default DonorHistory;