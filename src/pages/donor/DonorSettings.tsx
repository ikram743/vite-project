import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DonorSidebar from '../../components/donor/DonorSidebar';
import { FaSave, FaBell, FaShieldAlt, FaGlobe, FaPalette, FaSpinner } from 'react-icons/fa';
import { getProfile, updateProfile } from '../../lib/API';
import toast from 'react-hot-toast';

interface SettingsType {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  reservationAlerts: boolean;
  expiryAlerts: boolean;
  twoFactorAuth: boolean;
  language: string;
  theme: string;
}

const DonorSettings = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('notifications');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [settings, setSettings] = useState<SettingsType>({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    reservationAlerts: true,
    expiryAlerts: true,
    twoFactorAuth: false,
    language: 'en',
    theme: 'light'
  });

  // Load user preferences from API
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const response = await getProfile();
        console.log('Profile response:', response);
        
        const userData = response?.data?.user || response?.user || response;
        
        // Load preferences from user data if available
        if (userData?.preferences) {
          setSettings(prev => ({
            ...prev,
            ...userData.preferences
          }));
        }
        
        // Load language from user data
        if (userData?.language) {
          setSettings(prev => ({ ...prev, language: userData.language }));
        }
        
        // Load theme from localStorage or user data
        const savedTheme = localStorage.getItem('donor_theme');
        if (savedTheme) {
          setSettings(prev => ({ ...prev, theme: savedTheme as 'light' | 'dark' }));
        }
        
      } catch (err: any) {
        console.error('Error loading settings:', err);
        setError(err.message || 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, []);

  // Apply theme when changed
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('donor_theme', settings.theme);
  }, [settings.theme]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, type } = e.target;
    const value = type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setSettings({ ...settings, [name]: value });
    // Clear messages when user changes settings
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Prepare preferences data
      const preferencesData = {
        preferences: {
          emailNotifications: settings.emailNotifications,
          pushNotifications: settings.pushNotifications,
          smsNotifications: settings.smsNotifications,
          reservationAlerts: settings.reservationAlerts,
          expiryAlerts: settings.expiryAlerts,
          twoFactorAuth: settings.twoFactorAuth,
          language: settings.language,
          theme: settings.theme
        },
        language: settings.language
      };
      
      const response = await updateProfile(preferencesData);
      console.log('Update response:', response);
      
      if (response?.success || response?.data) {
        setSuccess('Settings saved successfully!');
        toast.success('Settings saved successfully! ✅');
        // Apply language change
        if (settings.language) {
          localStorage.setItem('donor_language', settings.language);
        }
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } else {
        const errorMsg = response?.message || 'Failed to save settings';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err: any) {
      console.error('Error saving settings:', err);
      const errorMsg = err.message || 'An error occurred while saving';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <DonorSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <FaSpinner className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
              <p className="mt-4 text-gray-500 dark:text-gray-400">Loading settings...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <DonorSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="p-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Manage your account preferences</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-600 dark:text-green-400 text-sm">
              {success}
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
            {[
              { id: 'notifications', label: 'Notifications', icon: <FaBell /> },
              { id: 'security', label: 'Security', icon: <FaShieldAlt /> },
              { id: 'preferences', label: 'Preferences', icon: <FaGlobe /> },
              { id: 'appearance', label: 'Appearance', icon: <FaPalette /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Settings Content */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            {activeTab === 'notifications' && (
              <div className="space-y-4">
                {[
                  { id: 'emailNotifications', label: 'Email Notifications', description: 'Receive updates via email' },
                  { id: 'pushNotifications', label: 'Push Notifications', description: 'Get real-time alerts in your browser' },
                  { id: 'smsNotifications', label: 'SMS Notifications', description: 'Receive text messages for urgent updates' },
                  { id: 'reservationAlerts', label: 'Reservation Alerts', description: 'Notify when someone reserves your donation' },
                  { id: 'expiryAlerts', label: 'Expiry Alerts', description: 'Remind before your donations expire' }
                ].map(notif => (
                  <label key={notif.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{notif.label}</span>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{notif.description}</p>
                    </div>
                    <input
                      type="checkbox"
                      name={notif.id}
                      checked={settings[notif.id as keyof SettingsType] as boolean}
                      onChange={handleChange}
                      className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                    />
                  </label>
                ))}
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-4">
                <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Two-Factor Authentication</span>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Add an extra layer of security to your account</p>
                  </div>
                  <input
                    type="checkbox"
                    name="twoFactorAuth"
                    checked={settings.twoFactorAuth}
                    onChange={handleChange}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                  />
                </label>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Language</label>
                <select
                  name="language"
                  value={settings.language}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                >
                  <option value="en">🇬🇧 English</option>
                  <option value="fr">🇫🇷 Français</option>
                  <option value="ar">🇩🇿 العربية</option>
                </select>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Choose your preferred language for the interface</p>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Theme</label>
                <select
                  name="theme"
                  value={settings.theme}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                >
                  <option value="light">☀️ Light</option>
                  <option value="dark">🌙 Dark</option>
                </select>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Switch between light and dark mode</p>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DonorSettings;