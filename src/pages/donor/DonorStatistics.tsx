import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DonorSidebar from '../../components/donor/DonorSidebar';
import { FaBox, FaWeight, FaUsers, FaStar, FaChartLine, FaSpinner } from 'react-icons/fa';
import { getMyDonations, getReceivedRequests, getDashboardStats } from '../../lib/API';
import toast from 'react-hot-toast';

interface MonthlyData {
  month: string;
  donations: number;
  quantity: number;
}

interface CategoryData {
  name: string;
  percent: number;
  count: number;
}

const DonorStatistics = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [period, setPeriod] = useState('month');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState({
    totalDonations: 0,
    totalQuantity: 0,
    totalBeneficiaries: 0,
    averageRating: 0
  });

  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [maxDonations, setMaxDonations] = useState(0);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get donations
      const donationsResponse = await getMyDonations();
      console.log('Donations response:', donationsResponse);
      
      let donations = [];
      if (donationsResponse?.data?.donations) {
        donations = donationsResponse.data.donations;
      } else if (donationsResponse?.donations) {
        donations = donationsResponse.donations;
      } else if (Array.isArray(donationsResponse)) {
        donations = donationsResponse;
      }
      
      // Get requests for beneficiaries and ratings
      const requestsResponse = await getReceivedRequests();
      console.log('Requests response:', requestsResponse);
      
      let requests = [];
      if (requestsResponse?.data?.requests) {
        requests = requestsResponse.data.requests;
      } else if (requestsResponse?.requests) {
        requests = requestsResponse.requests;
      } else if (Array.isArray(requestsResponse)) {
        requests = requestsResponse;
      }
      
      // Calculate total stats
      const completedDonations = donations.filter((d: any) => 
        d.status === 'COMPLETED' || d.status === 'COLLECTED' || d.status === 'FINISHED'
      );
      
      const totalDonations = completedDonations.length;
      const totalQuantity = completedDonations.reduce((sum: number, d: any) => 
        sum + (d.totalQuantity || d.quantity || 0), 0
      );
      
      // Calculate unique beneficiaries
      const uniqueBeneficiaries = new Set(requests.map((r: any) => 
        r.beneficiaryId || r.beneficiary?.id
      )).size;
      
      // Calculate average rating
      const ratedRequests = requests.filter((r: any) => r.rating && r.rating > 0);
      const avgRating = ratedRequests.length > 0 
        ? ratedRequests.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / ratedRequests.length
        : 0;
      
      setStats({
        totalDonations,
        totalQuantity,
        totalBeneficiaries: uniqueBeneficiaries,
        averageRating: parseFloat(avgRating.toFixed(1))
      });
      
      // Process monthly data
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthlyMap = new Map();
      
      completedDonations.forEach((donation: any) => {
        const date = donation.createdAt || donation.completedAt || new Date();
        const month = new Date(date).getMonth();
        const quantity = donation.totalQuantity || donation.quantity || 0;
        
        if (!monthlyMap.has(month)) {
          monthlyMap.set(month, { donations: 0, quantity: 0 });
        }
        const data = monthlyMap.get(month);
        data.donations += 1;
        data.quantity += quantity;
      });
      
      const monthlyArray: MonthlyData[] = [];
      for (let i = 0; i < 6; i++) {
        const monthIndex = (new Date().getMonth() - 5 + i + 12) % 12;
        const data = monthlyMap.get(monthIndex) || { donations: 0, quantity: 0 };
        monthlyArray.push({
          month: monthNames[monthIndex],
          donations: data.donations,
          quantity: data.quantity
        });
      }
      
      setMonthlyData(monthlyArray);
      setMaxDonations(Math.max(...monthlyArray.map(d => d.donations), 1));
      
      // Process category distribution
      const categoryMap = new Map();
      donations.forEach((donation: any) => {
        const category = donation.category || 
                        (donation.foodType?.toLowerCase().includes('bread') ? 'Bakery' :
                         donation.foodType?.toLowerCase().includes('vegetable') ? 'Vegetables' :
                         donation.foodType?.toLowerCase().includes('fruit') ? 'Fruits' :
                         donation.foodType?.toLowerCase().includes('meal') ? 'Prepared Food' : 'Other');
        
        if (!categoryMap.has(category)) {
          categoryMap.set(category, 0);
        }
        categoryMap.set(category, categoryMap.get(category) + 1);
      });
      
      const totalItems = donations.length;
      const categoryArray: CategoryData[] = Array.from(categoryMap.entries())
        .map(([name, count]) => ({
          name,
          count,
          percent: totalItems > 0 ? Math.round((count / totalItems) * 100) : 0
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
      
      setCategories(categoryArray);
      
    } catch (err: any) {
      console.error('Error loading statistics:', err);
      setError(err.message || 'Failed to load statistics');
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
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
              <p className="mt-4 text-gray-500">Loading statistics...</p>
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
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Statistics & Analytics</h1>
              <p className="text-gray-500">Track your impact and donation patterns</p>
            </div>
            <div className="flex gap-2 bg-gray-100 p-1 rounded-full">
              <button 
                onClick={() => setPeriod('week')} 
                className={`px-4 py-1.5 rounded-full text-sm transition-all ${period === 'week' ? 'bg-primary-600 text-white' : 'text-gray-600'}`}
              >
                Week
              </button>
              <button 
                onClick={() => setPeriod('month')} 
                className={`px-4 py-1.5 rounded-full text-sm transition-all ${period === 'month' ? 'bg-primary-600 text-white' : 'text-gray-600'}`}
              >
                Month
              </button>
              <button 
                onClick={() => setPeriod('year')} 
                className={`px-4 py-1.5 rounded-full text-sm transition-all ${period === 'year' ? 'bg-primary-600 text-white' : 'text-gray-600'}`}
              >
                Year
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
              <button onClick={loadStatistics} className="ml-3 underline">Try again</button>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <FaBox className="text-emerald-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalDonations}</div>
                <div className="text-sm text-gray-500">Total Donations</div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaWeight className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalQuantity}</div>
                <div className="text-sm text-gray-500">Total Quantity (kg)</div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <FaUsers className="text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalBeneficiaries}</div>
                <div className="text-sm text-gray-500">Beneficiaries Helped</div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                <FaStar className="text-rose-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.averageRating}</div>
                <div className="text-sm text-gray-500">Average Rating</div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Donations Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Donations</h3>
              <div className="flex justify-between items-end h-48 gap-2">
                {monthlyData.map((item, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-primary-500 rounded-t-lg transition-all hover:bg-primary-600 cursor-pointer relative group"
                      style={{ height: `${(item.donations / maxDonations) * 140}px` }}
                    >
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {item.donations} donations
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories Distribution */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories Distribution</h3>
              {categories.length > 0 ? (
                categories.map((cat, i) => (
                  <div key={i} className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">{cat.name}</span>
                      <span className="text-gray-500">{cat.count} items ({cat.percent}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-500 rounded-full h-2 transition-all"
                        style={{ width: `${cat.percent}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No category data available</p>
              )}
            </div>
          </div>

          {/* Additional Stats */}
          <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-primary-600">
                  {stats.totalDonations > 0 ? Math.round((stats.totalDonations / 200) * 100) : 0}%
                </div>
                <div className="text-sm text-gray-500">of annual goal reached</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {stats.totalBeneficiaries}
                </div>
                <div className="text-sm text-gray-500">lives impacted</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-emerald-600">
                  {Math.round(stats.totalQuantity / 2)}
                </div>
                <div className="text-sm text-gray-500">meals donated</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DonorStatistics;