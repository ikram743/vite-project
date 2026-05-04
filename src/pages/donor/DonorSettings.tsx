import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DonorSidebar from '../../components/donor/DonorSidebar';
import { FaSave, FaBell, FaShieldAlt, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface SettingsType {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  reservationAlerts: boolean;
  expiryAlerts: boolean;
  twoFactorAuth: boolean;
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
    twoFactorAuth: false
  });

  // Load saved preferences from localStorage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        
        // Load notification preferences
        const notifPrefs = localStorage.getItem('donor_notifications');
        if (notifPrefs) {
          try {
            const parsed = JSON.parse(notifPrefs);
            setSettings(prev => ({ ...prev, ...parsed }));
          } catch(e) {}
        }
        
        // Load two-factor auth setting (just a UI preference, not functional)
        const twoFactor = localStorage.getItem('donor_two_factor');
        if (twoFactor === 'true') {
          setSettings(prev => ({ ...prev, twoFactorAuth: true }));
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSettings({ ...settings, [name]: checked });
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Save notification preferences
      const notifPrefs = {
        emailNotifications: settings.emailNotifications,
        pushNotifications: settings.pushNotifications,
        smsNotifications: settings.smsNotifications,
        reservationAlerts: settings.reservationAlerts,
        expiryAlerts: settings.expiryAlerts
      };
      localStorage.setItem('donor_notifications', JSON.stringify(notifPrefs));
      
      // Save two-factor auth preference (UI only)
      localStorage.setItem('donor_two_factor', settings.twoFactorAuth ? 'true' : 'false');
      
      setSuccess('Settings saved successfully!');
      toast.success('Settings saved successfully! ✅');
      setTimeout(() => setSuccess(null), 3000);
      
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
      <div className="flex min-h-screen bg-gray-50">
        <DonorSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <FaSpinner className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
              <p className="mt-4 text-gray-500">Loading settings...</p>
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
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-500 mb-6">Manage your account preferences</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">
              {success}
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 border-b border-gray-200 mb-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'notifications'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FaBell /> Notifications
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'security'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FaShieldAlt /> Security
            </button>
          </div>

          {/* Settings Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {activeTab === 'notifications' && (
              <div className="space-y-4">
                {[
                  { id: 'emailNotifications', label: 'Email Notifications', description: 'Receive updates via email' },
                  { id: 'pushNotifications', label: 'Push Notifications', description: 'Get real-time alerts in your browser' },
                  { id: 'smsNotifications', label: 'SMS Notifications', description: 'Receive text messages for urgent updates' },
                  { id: 'reservationAlerts', label: 'Reservation Alerts', description: 'Notify when someone reserves your donation' },
                  { id: 'expiryAlerts', label: 'Expiry Alerts', description: 'Remind before your donations expire' }
                ].map(notif => (
                  <label key={notif.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                    <div>
                      <span className="text-gray-700 font-medium">{notif.label}</span>
                      <p className="text-xs text-gray-500 mt-0.5">{notif.description}</p>
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
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <div>
                    <span className="text-gray-700 font-medium">Two-Factor Authentication</span>
                    <p className="text-xs text-gray-500 mt-0.5">Add an extra layer of security to your account</p>
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

            <div className="mt-6 pt-4 border-t border-gray-100 flex gap-3">
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