// src/pages/beneficiary/BenSettings.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BenSidebar from '../../components/beneficiary/BenSidebar';

const BenSettings = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'notifications' | 'preferences' | 'privacy'>('notifications');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    reservationAlerts: true,
    expiryAlerts: true,
    newsletter: false
  });

  const [preferences, setPreferences] = useState({
    language: 'en',
    radius: 10,
    theme: 'light',
    dateFormat: 'DD/MM/YYYY'
  });

  const [privacy, setPrivacy] = useState({
    showEmail: true,
    showPhone: false,
    showLocation: true
  });

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <BenSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="p-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-secondary-500 rounded-2xl p-6 mb-6 text-white">
            <h1 className="text-2xl font-bold">⚙️ Settings</h1>
            <p className="opacity-90">Manage your account preferences and notifications</p>
          </div>

          {/* Save Success Toast */}
          {saveSuccess && (
            <div className="fixed top-20 right-6 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fadeInUp">
              ✅ Settings saved successfully!
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200 pb-2">
            <button onClick={() => setActiveTab('notifications')} className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'notifications' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>🔔 Notifications</button>
            <button onClick={() => setActiveTab('preferences')} className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'preferences' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>🎨 Preferences</button>
            <button onClick={() => setActiveTab('privacy')} className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'privacy' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>🔒 Privacy</button>
          </div>

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-2xl p-6 shadow-md space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"><div><span className="font-medium">📧 Email Notifications</span><p className="text-xs text-gray-500">Receive updates via email</p></div><label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" checked={notifications.email} onChange={() => setNotifications({...notifications, email: !notifications.email})} className="sr-only peer"/><div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div></label></div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"><div><span className="font-medium">📱 Push Notifications</span><p className="text-xs text-gray-500">Get instant alerts on your device</p></div><label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" checked={notifications.push} onChange={() => setNotifications({...notifications, push: !notifications.push})} className="sr-only peer"/><div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div></label></div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"><div><span className="font-medium">💬 SMS Notifications</span><p className="text-xs text-gray-500">Receive text message alerts</p></div><label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" checked={notifications.sms} onChange={() => setNotifications({...notifications, sms: !notifications.sms})} className="sr-only peer"/><div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div></label></div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="bg-white rounded-2xl p-6 shadow-md space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-2">🌐 Language</label><select value={preferences.language} onChange={(e) => setPreferences({...preferences, language: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg"><option value="en">English</option><option value="fr">Français</option><option value="ar">العربية</option></select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">📍 Search Radius (km)</label><div className="flex items-center gap-3"><input type="range" min="1" max="50" value={preferences.radius} onChange={(e) => setPreferences({...preferences, radius: parseInt(e.target.value)})} className="flex-1"/><span className="text-secondary-500 font-semibold">{preferences.radius} km</span></div></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">🎨 Theme</label><div className="flex gap-3"><button onClick={() => setPreferences({...preferences, theme: 'light'})} className={`flex-1 py-2 rounded-lg ${preferences.theme === 'light' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'}`}>☀️ Light</button><button onClick={() => setPreferences({...preferences, theme: 'dark'})} className={`flex-1 py-2 rounded-lg ${preferences.theme === 'dark' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'}`}>🌙 Dark</button></div></div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="bg-white rounded-2xl p-6 shadow-md space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"><div><span className="font-medium">📧 Show Email</span><p className="text-xs text-gray-500">Display your email to donors</p></div><label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" checked={privacy.showEmail} onChange={() => setPrivacy({...privacy, showEmail: !privacy.showEmail})} className="sr-only peer"/><div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div></label></div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"><div><span className="font-medium">📞 Show Phone</span><p className="text-xs text-gray-500">Display your phone number to donors</p></div><label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" checked={privacy.showPhone} onChange={() => setPrivacy({...privacy, showPhone: !privacy.showPhone})} className="sr-only peer"/><div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div></label></div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"><div><span className="font-medium">📍 Show Location</span><p className="text-xs text-gray-500">Display your location for food pickup</p></div><label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" checked={privacy.showLocation} onChange={() => setPrivacy({...privacy, showLocation: !privacy.showLocation})} className="sr-only peer"/><div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div></label></div>
            </div>
          )}

          {/* Save Button */}
          <button onClick={handleSave} className="w-full mt-6 bg-secondary-500 text-white py-3 rounded-xl font-semibold hover:bg-secondary-600 transition-all">💾 Save All Settings</button>
        </div>
      </main>
    </div>
  );
};

export default BenSettings;