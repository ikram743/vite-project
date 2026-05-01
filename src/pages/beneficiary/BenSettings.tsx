// src/pages/beneficiary/BenSettings.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BenSidebar from '../../components/beneficiary/BenSidebar';
import { FaSpinner, FaSave, FaBell, FaPalette, FaLock } from 'react-icons/fa';
import { getProfile, updateProfile } from '../../lib/API';
import toast from 'react-hot-toast';

const BenSettings = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'notifications' | 'preferences' | 'privacy'>('notifications');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    loadSettings();
  }, []);

  // Apply theme when changed
  useEffect(() => {
    if (preferences.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', preferences.theme);
  }, [preferences.theme]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getProfile();
      console.log('Profile response for settings:', response);
      
      const userData = response?.user || response?.data?.user || response;
      
      // Load saved preferences from user data if available
      if (userData?.preferences) {
        setNotifications(prev => ({
          ...prev,
          ...userData.preferences.notifications
        }));
        setPreferences(prev => ({
          ...prev,
          ...userData.preferences
        }));
        setPrivacy(prev => ({
          ...prev,
          ...userData.preferences.privacy
        }));
      }
      
      // Load theme from localStorage
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        setPreferences(prev => ({ ...prev, theme: savedTheme as 'light' | 'dark' }));
      }
      
      // Load language from localStorage
      const savedLanguage = localStorage.getItem('language');
      if (savedLanguage) {
        setPreferences(prev => ({ ...prev, language: savedLanguage }));
      }
      
    } catch (err: any) {
      console.error('Error loading settings:', err);
      setError(err.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    
    try {
      const updateData = {
        preferences: {
          notifications,
          preferences: {
            language: preferences.language,
            radius: preferences.radius,
            theme: preferences.theme,
            dateFormat: preferences.dateFormat
          },
          privacy
        },
        language: preferences.language
      };
      
      const response = await updateProfile(updateData);
      console.log('Update response:', response);
      
      if (response?.success || response?.user || response?.data) {
        localStorage.setItem('language', preferences.language);
        localStorage.setItem('theme', preferences.theme);
        toast.success('Settings saved successfully! ✅');
      } else {
        setError(response?.message || 'Failed to save settings');
        toast.error(response?.message || 'Failed to save settings');
      }
    } catch (err: any) {
      console.error('Error saving settings:', err);
      setError(err.message || 'An error occurred');
      toast.error(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleLanguageChange = (lang: string) => {
    setPreferences({ ...preferences, language: lang });
    localStorage.setItem('language', lang);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <BenSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <FaSpinner className="animate-spin text-4xl text-primary-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Loading settings...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <BenSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="p-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-secondary-500 rounded-2xl p-6 mb-6 text-white">
            <h1 className="text-2xl font-bold">⚙️ Settings</h1>
            <p className="opacity-90">Manage your account preferences and notifications</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 pb-2 flex-wrap">
            <button 
              onClick={() => setActiveTab('notifications')} 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === 'notifications' 
                  ? 'bg-primary-600 text-white' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <FaBell /> Notifications
            </button>
            <button 
              onClick={() => setActiveTab('preferences')} 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === 'preferences' 
                  ? 'bg-primary-600 text-white' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <FaPalette /> Preferences
            </button>
            <button 
              onClick={() => setActiveTab('privacy')} 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === 'privacy' 
                  ? 'bg-primary-600 text-white' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <FaLock /> Privacy
            </button>
          </div>

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <span className="font-medium dark:text-white">📧 Email Notifications</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Receive updates via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={notifications.email} onChange={() => setNotifications({...notifications, email: !notifications.email})} className="sr-only peer"/>
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <span className="font-medium dark:text-white">📱 Push Notifications</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Get instant alerts on your device</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={notifications.push} onChange={() => setNotifications({...notifications, push: !notifications.push})} className="sr-only peer"/>
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <span className="font-medium dark:text-white">💬 SMS Notifications</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Receive text message alerts</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={notifications.sms} onChange={() => setNotifications({...notifications, sms: !notifications.sms})} className="sr-only peer"/>
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">🌐 Language</label>
                <select 
                  value={preferences.language} 
                  onChange={(e) => handleLanguageChange(e.target.value)} 
                  className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                  <option value="ar">العربية</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">📍 Search Radius (km)</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="range" 
                    min="1" 
                    max="50" 
                    value={preferences.radius} 
                    onChange={(e) => setPreferences({...preferences, radius: parseInt(e.target.value)})} 
                    className="flex-1"
                  />
                  <span className="text-secondary-500 font-semibold">{preferences.radius} km</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">🎨 Theme</label>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setPreferences({...preferences, theme: 'light'})} 
                    className={`flex-1 py-2 rounded-lg transition-all ${
                      preferences.theme === 'light' 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    ☀️ Light
                  </button>
                  <button 
                    onClick={() => setPreferences({...preferences, theme: 'dark'})} 
                    className={`flex-1 py-2 rounded-lg transition-all ${
                      preferences.theme === 'dark' 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    🌙 Dark
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <span className="font-medium dark:text-white">📧 Show Email</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Display your email to donors</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={privacy.showEmail} onChange={() => setPrivacy({...privacy, showEmail: !privacy.showEmail})} className="sr-only peer"/>
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <span className="font-medium dark:text-white">📞 Show Phone</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Display your phone number to donors</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={privacy.showPhone} onChange={() => setPrivacy({...privacy, showPhone: !privacy.showPhone})} className="sr-only peer"/>
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <span className="font-medium dark:text-white">📍 Show Location</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Display your location for food pickup</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={privacy.showLocation} onChange={() => setPrivacy({...privacy, showLocation: !privacy.showLocation})} className="sr-only peer"/>
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          )}

          {/* Save Button */}
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="w-full mt-6 bg-secondary-500 text-white py-3 rounded-xl font-semibold hover:bg-secondary-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
            {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default BenSettings;