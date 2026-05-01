// src/pages/beneficiary/BenProfile.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BenSidebar from '../../components/beneficiary/BenSidebar';
import { FaSpinner, FaEdit, FaSave, FaTimes, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';
import { getProfile, updateProfile, getMyRequests, changePassword } from '../../lib/API';
import toast from 'react-hot-toast';

const BenProfile = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'stats' | 'settings'>('info');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [profile, setProfile] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    joinDate: '',
    bio: '',
    avatar: '👤',
  });

  const [stats, setStats] = useState({
    totalOrders: 0,
    mealsSaved: 0,
    rating: 0,
    treesPlanted: 0,
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get user profile
      const profileResponse = await getProfile();
      console.log('Profile response:', profileResponse);
      
      let userData = profileResponse?.user || profileResponse?.data?.user || profileResponse;
      
      // Get requests for stats
      const requestsResponse = await getMyRequests();
      console.log('Requests response:', requestsResponse);
      
      let requests = [];
      if (requestsResponse?.requests) {
        requests = requestsResponse.requests;
      } else if (Array.isArray(requestsResponse)) {
        requests = requestsResponse;
      }
      
      // Calculate stats
      const completedOrders = requests.filter((r: any) => 
        r.status === 'COMPLETED' || r.status === 'COLLECTED' || r.status === 'DELIVERED'
      ).length;
      
      const totalMeals = requests.reduce((sum: number, r: any) => {
        const quantity = r.requestedQuantity || r.quantity || 0;
        const unit = r.donation?.unit || r.unit || 'kg';
        // Convert kg to meals (1kg = 2 meals)
        if (unit === 'kg') return sum + (quantity * 2);
        if (unit === 'meals') return sum + quantity;
        return sum + quantity;
      }, 0);
      
      const ratedRequests = requests.filter((r: any) => r.rating && r.rating > 0);
      const avgRating = ratedRequests.length > 0 
        ? ratedRequests.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / ratedRequests.length
        : 0;
      
      // Trees planted (rough estimate: 1 tree per 50 meals saved)
      const treesEquivalent = Math.floor(totalMeals / 50);
      
      setProfile({
        id: userData?.id || '',
        name: userData?.name || '',
        email: userData?.email || '',
        phone: userData?.phone || '',
        address: userData?.address || userData?.location || '',
        joinDate: userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'January 2025',
        bio: userData?.bio || 'Passionate about reducing food waste and helping my community. Together we can make a difference! 🌱',
        avatar: '👤',
      });
      
      setStats({
        totalOrders: completedOrders,
        mealsSaved: totalMeals,
        rating: parseFloat(avgRating.toFixed(1)),
        treesPlanted: treesEquivalent,
      });
      
    } catch (err: any) {
      console.error('Error loading profile:', err);
      setError(err.message || 'Failed to load profile');
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    
    try {
      const updateData = {
        name: profile.name,
        phone: profile.phone,
        address: profile.address,
        bio: profile.bio,
      };
      
      const response = await updateProfile(updateData);
      console.log('Update response:', response);
      
      if (response?.success || response?.user || response?.data) {
        toast.success('Profile updated successfully! ✅');
        setIsEditing(false);
        loadProfile(); // Reload fresh data
      } else {
        setError(response?.message || 'Failed to update profile');
        toast.error(response?.message || 'Failed to update profile');
      }
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'An error occurred');
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setPasswordLoading(true);
    try {
      await changePassword(passwordData.oldPassword, passwordData.newPassword);
      toast.success('Password changed successfully!');
      setShowPasswordModal(false);
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      console.error('Error changing password:', err);
      toast.error(err.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <BenSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <FaSpinner className="animate-spin text-4xl text-primary-600 mx-auto mb-4" />
              <p className="text-gray-500">Loading profile...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <BenSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="p-6">
          {/* Header with Cover */}
          <div className="relative mb-8">
            <div className="h-32 bg-gradient-to-r from-primary-600 to-secondary-500 rounded-2xl"></div>
            <div className="absolute -bottom-12 left-6 flex items-end gap-4">
              <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center text-5xl shadow-lg border-4 border-white">
                {profile.avatar}
              </div>
              <div className="mb-2">
                <h1 className="text-2xl font-bold text-gray-800">{profile.name}</h1>
                <p className="text-gray-500">Beneficiary • Member since {profile.joinDate}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-16 mb-6">
            <button 
              onClick={() => setIsEditing(!isEditing)} 
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all"
            >
              {isEditing ? <FaTimes /> : <FaEdit />}
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200 pb-2 flex-wrap">
            <button 
              onClick={() => setActiveTab('info')} 
              className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'info' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              📋 Personal Info
            </button>
            <button 
              onClick={() => setActiveTab('stats')} 
              className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'stats' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              📊 Impact Stats
            </button>
            <button 
              onClick={() => setActiveTab('settings')} 
              className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'settings' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              ⚙️ Account Settings
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'info' && (
            <div className="bg-white rounded-2xl p-6 shadow-md">
              {!isEditing ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap py-3 border-b">
                    <div className="w-32 font-medium text-gray-600 flex items-center gap-2"><FaUser /> Name:</div>
                    <div className="text-gray-800">{profile.name}</div>
                  </div>
                  <div className="flex flex-wrap py-3 border-b">
                    <div className="w-32 font-medium text-gray-600 flex items-center gap-2"><FaEnvelope /> Email:</div>
                    <div className="text-gray-800">{profile.email}</div>
                  </div>
                  <div className="flex flex-wrap py-3 border-b">
                    <div className="w-32 font-medium text-gray-600 flex items-center gap-2"><FaPhone /> Phone:</div>
                    <div className="text-gray-800">{profile.phone || 'Not provided'}</div>
                  </div>
                  <div className="flex flex-wrap py-3 border-b">
                    <div className="w-32 font-medium text-gray-600 flex items-center gap-2"><FaMapMarkerAlt /> Location:</div>
                    <div className="text-gray-800">{profile.address || 'Not provided'}</div>
                  </div>
                  <div className="flex flex-wrap py-3 border-b">
                    <div className="w-32 font-medium text-gray-600 flex items-center gap-2"><FaCalendarAlt /> Joined:</div>
                    <div className="text-gray-800">{profile.joinDate}</div>
                  </div>
                  <div className="flex flex-wrap py-3">
                    <div className="w-32 font-medium text-gray-600 flex items-center gap-2"><FaInfoCircle /> Bio:</div>
                    <div className="flex-1 text-gray-600 italic">"{profile.bio}"</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <input 
                    type="text" 
                    name="name" 
                    placeholder="Full Name" 
                    value={profile.name} 
                    onChange={handleChange} 
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500" 
                  />
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="Email" 
                    value={profile.email} 
                    className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50" 
                    disabled
                  />
                  <p className="text-xs text-gray-400 -mt-2">Email cannot be changed</p>
                  <input 
                    type="tel" 
                    name="phone" 
                    placeholder="Phone" 
                    value={profile.phone} 
                    onChange={handleChange} 
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500" 
                  />
                  <input 
                    type="text" 
                    name="address" 
                    placeholder="Location" 
                    value={profile.address} 
                    onChange={handleChange} 
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500" 
                  />
                  <textarea 
                    name="bio" 
                    placeholder="Bio" 
                    rows={3} 
                    value={profile.bio} 
                    onChange={handleChange} 
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                  ></textarea>
                  <button 
                    onClick={handleSave} 
                    disabled={saving}
                    className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-all disabled:opacity-50"
                  >
                    {saving ? <FaSpinner className="animate-spin inline mr-2" /> : <FaSave className="inline mr-2" />}
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-md text-center">
                <div className="text-4xl mb-2">📦</div>
                <div className="text-3xl font-bold text-primary-600">{stats.totalOrders}</div>
                <div className="text-gray-500 text-sm">Total Orders</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-md text-center">
                <div className="text-4xl mb-2">🍽️</div>
                <div className="text-3xl font-bold text-secondary-500">{stats.mealsSaved}</div>
                <div className="text-gray-500 text-sm">Meals Saved</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-md text-center">
                <div className="text-4xl mb-2">⭐</div>
                <div className="text-3xl font-bold text-yellow-500">{stats.rating}</div>
                <div className="text-gray-500 text-sm">Rating</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-md text-center">
                <div className="text-4xl mb-2">🌳</div>
                <div className="text-3xl font-bold text-green-600">{stats.treesPlanted}</div>
                <div className="text-gray-500 text-sm">Trees Equivalent</div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="font-semibold text-gray-800 mb-4">🔐 Security</h3>
              <button 
                onClick={() => setShowPasswordModal(true)}
                className="w-full mb-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Change Password
              </button>
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="font-semibold text-red-600 mb-2">⚠️ Danger Zone</h3>
                <button 
                  onClick={() => toast.error('Contact support to delete your account')}
                  className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Change Password</h2>
            <div className="space-y-4">
              <input
                type="password"
                placeholder="Current Password"
                value={passwordData.oldPassword}
                onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg"
              />
              <input
                type="password"
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                disabled={passwordLoading}
                className="flex-1 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {passwordLoading ? <FaSpinner className="animate-spin inline" /> : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BenProfile;