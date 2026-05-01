import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DonorSidebar from '../../components/donor/DonorSidebar';
import { FaEdit, FaSave, FaTimes, FaBox, FaUsers, FaStar, FaCalendar, FaSpinner } from 'react-icons/fa';
import { getProfile, updateProfile, getMyDonations, getReceivedRequests } from '../../lib/API';
import toast from 'react-hot-toast';

interface ProfileData {
  businessName: string;
  businessType: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  registrationNumber: string;
  taxNumber: string;
  joinedDate: string;
  totalDonations: number;
  totalBeneficiaries: number;
  rating: number;
}

const DonorProfile = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [profileData, setProfileData] = useState<ProfileData>({
    businessName: '',
    businessType: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    registrationNumber: '',
    taxNumber: '',
    joinedDate: '',
    totalDonations: 0,
    totalBeneficiaries: 0,
    rating: 0
  });

  // Fetch profile data from API
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        // Get user profile
        const profileResponse = await getProfile();
        console.log('Profile response:', profileResponse);
        
        let userData = profileResponse?.data?.user || profileResponse?.user || profileResponse;
        
        // Calculate stats from donations
        let donationsResponse = null;
        let requestsResponse = null;
        let donations = [];
        let requests = [];
        
        try {
          donationsResponse = await getMyDonations();
          if (donationsResponse?.data?.donations) {
            donations = donationsResponse.data.donations;
          } else if (donationsResponse?.donations) {
            donations = donationsResponse.donations;
          } else if (Array.isArray(donationsResponse)) {
            donations = donationsResponse;
          }
        } catch (err) {
          console.error('Error fetching donations:', err);
        }
        
        try {
          requestsResponse = await getReceivedRequests();
          if (requestsResponse?.data?.requests) {
            requests = requestsResponse.data.requests;
          } else if (requestsResponse?.requests) {
            requests = requestsResponse.requests;
          } else if (Array.isArray(requestsResponse)) {
            requests = requestsResponse;
          }
        } catch (err) {
          console.error('Error fetching requests:', err);
        }
        
        // Calculate total completed donations
        const completedDonations = donations.filter((d: any) => 
          d.status === 'COMPLETED' || d.status === 'COLLECTED' || d.status === 'FINISHED'
        ).length;
        
        // Calculate unique beneficiaries
        const uniqueBeneficiaries = new Set(requests.map((r: any) => r.beneficiaryId || r.beneficiary?.id)).size;
        
        // Calculate average rating from requests with ratings
        const ratedRequests = requests.filter((r: any) => r.rating && r.rating > 0);
        const avgRating = ratedRequests.length > 0 
          ? ratedRequests.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / ratedRequests.length
          : 0;
        
        // Format joined date
        const joinedDate = userData?.createdAt 
          ? new Date(userData.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
          : 'January 2025';
        
        setProfileData({
          businessName: userData?.businessName || userData?.name || 'My Business',
          businessType: userData?.businessType || userData?.category || 'Restaurant',
          contactName: userData?.contactName || userData?.name || 'Donor',
          email: userData?.email || '',
          phone: userData?.phone || userData?.mobile || '',
          address: userData?.address || userData?.location || '',
          registrationNumber: userData?.registrationNumber || 'Not specified',
          taxNumber: userData?.taxNumber || 'Not specified',
          joinedDate: joinedDate,
          totalDonations: completedDonations,
          totalBeneficiaries: uniqueBeneficiaries,
          rating: parseFloat(avgRating.toFixed(1))
        });
        
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        setError(err.message || 'Failed to load profile');
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    try {
      const updateData = {
        name: profileData.contactName,
        businessName: profileData.businessName,
        businessType: profileData.businessType,
        phone: profileData.phone,
        address: profileData.address,
      };
      
      const response = await updateProfile(updateData);
      console.log('Update response:', response);
      
      if (response?.success || response?.data) {
        toast.success('Profile updated successfully! ✅');
        setIsEditing(false);
        // Refresh profile data
        window.location.reload();
      } else {
        const errorMsg = response?.message || 'Failed to update profile';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err: any) {
      console.error('Error updating profile:', err);
      const errorMsg = err.message || 'An error occurred while updating';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSaving(false);
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
              <p className="mt-4 text-gray-500">Loading profile...</p>
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Business Profile</h1>
            <button 
              onClick={() => {
                if (isEditing) {
                  setIsEditing(false);
                  window.location.reload();
                } else {
                  setIsEditing(true);
                }
              }} 
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <FaEdit size={14} /> 
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <FaBox className="text-emerald-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{profileData.totalDonations}</div>
                <div className="text-sm text-gray-500">Total Donations</div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaUsers className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{profileData.totalBeneficiaries}</div>
                <div className="text-sm text-gray-500">Beneficiaries Helped</div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <FaStar className="text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{profileData.rating}</div>
                <div className="text-sm text-gray-500">Rating</div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                <FaCalendar className="text-rose-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{profileData.joinedDate}</div>
                <div className="text-sm text-gray-500">Joined</div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {!isEditing ? (
              <>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Business Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500">Business Name</label>
                      <p className="font-medium text-gray-900">{profileData.businessName}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Business Type</label>
                      <p className="font-medium text-gray-900">{profileData.businessType}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Registration Number</label>
                      <p className="font-medium text-gray-900">{profileData.registrationNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Tax Number</label>
                      <p className="font-medium text-gray-900">{profileData.taxNumber}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500">Contact Name</label>
                      <p className="font-medium text-gray-900">{profileData.contactName}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Email</label>
                      <p className="font-medium text-gray-900">{profileData.email}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Phone</label>
                      <p className="font-medium text-gray-900">{profileData.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Address</label>
                      <p className="font-medium text-gray-900">{profileData.address}</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                    <input type="text" name="businessName" value={profileData.businessName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                    <select name="businessType" value={profileData.businessType} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                      <option>Restaurant</option>
                      <option>Bakery</option>
                      <option>Supermarket</option>
                      <option>Hotel</option>
                      <option>Catering</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                    <input type="text" name="contactName" value={profileData.contactName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" name="email" value={profileData.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" disabled />
                    <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input type="tel" name="phone" value={profileData.phone} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input type="text" name="address" value={profileData.address} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
                  </div>
                </div>
                <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                  <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    <FaTimes className="inline mr-1" /> Cancel
                  </button>
                  <button type="submit" disabled={saving} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {saving ? <FaSpinner className="inline animate-spin mr-1" /> : <FaSave className="inline mr-1" />}
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DonorProfile;