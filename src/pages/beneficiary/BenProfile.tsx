// src/pages/beneficiary/BenProfile.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BenSidebar from '../../components/beneficiary/BenSidebar';

const BenProfile = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'stats' | 'settings'>('info');

  const [profile, setProfile] = useState({
    name: 'Ahmed Mansouri',
    email: 'ahmed@foodshare.com',
    phone: '+213 55 12 34 56',
    location: 'Algiers, Algeria',
    joinDate: 'January 2024',
    bio: 'Passionate about reducing food waste and helping my community. Together we can make a difference! 🌱',
    avatar: '👤',
  });

  const stats = {
    totalOrders: 48,
    mealsSaved: 125,
    rating: 4.8,
    treesPlanted: 15,
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsEditing(false);
    alert('Profile updated successfully! ✅');
  };

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
            <button onClick={() => setIsEditing(!isEditing)} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all">
              {isEditing ? '❌ Cancel' : '✏️ Edit Profile'}
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200 pb-2">
            <button onClick={() => setActiveTab('info')} className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'info' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>📋 Personal Info</button>
            <button onClick={() => setActiveTab('stats')} className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'stats' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>📊 Impact Stats</button>
            <button onClick={() => setActiveTab('settings')} className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'settings' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>⚙️ Account Settings</button>
          </div>

          {/* Tab Content */}
          {activeTab === 'info' && (
            <div className="bg-white rounded-2xl p-6 shadow-md">
              {!isEditing ? (
                <div className="space-y-4">
                  <div className="flex py-3 border-b"><div className="w-32 font-medium text-gray-600">Full Name:</div><div className="text-gray-800">{profile.name}</div></div>
                  <div className="flex py-3 border-b"><div className="w-32 font-medium text-gray-600">Email:</div><div className="text-gray-800">{profile.email}</div></div>
                  <div className="flex py-3 border-b"><div className="w-32 font-medium text-gray-600">Phone:</div><div className="text-gray-800">{profile.phone}</div></div>
                  <div className="flex py-3 border-b"><div className="w-32 font-medium text-gray-600">Location:</div><div className="text-gray-800">{profile.location}</div></div>
                  <div className="flex py-3"><div className="w-32 font-medium text-gray-600">Bio:</div><div className="flex-1 text-gray-600 italic">"{profile.bio}"</div></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <input type="text" name="name" placeholder="Full Name" value={profile.name} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500" />
                  <input type="email" name="email" placeholder="Email" value={profile.email} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg" />
                  <input type="tel" name="phone" placeholder="Phone" value={profile.phone} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg" />
                  <input type="text" name="location" placeholder="Location" value={profile.location} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg" />
                  <textarea name="bio" placeholder="Bio" rows={3} value={profile.bio} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg"></textarea>
                  <button onClick={handleSave} className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-all">💾 Save Changes</button>
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
              <button className="w-full mb-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">Change Password</button>
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="font-semibold text-red-600 mb-2">⚠️ Danger Zone</h3>
                <button className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Delete Account</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BenProfile;