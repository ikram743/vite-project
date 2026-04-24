import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DonorSidebar from '../../components/donor/DonorSidebar';
import { FaSave, FaBell, FaShieldAlt, FaGlobe, FaPalette } from 'react-icons/fa';

const DonorSettings = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('notifications');

  const [settings, setSettings] = useState({
    emailNotifications: true, pushNotifications: true, smsNotifications: false,
    reservationAlerts: true, expiryAlerts: true, twoFactorAuth: false,
    language: 'en', theme: 'light'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, type } = e.target;
    const value = type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setSettings({ ...settings, [name]: value });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DonorSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="p-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-500 mb-6">Manage your account preferences</p>

          <div className="flex gap-2 border-b border-gray-200 mb-6">
            {[{ id: 'notifications', label: 'Notifications', icon: <FaBell /> }, { id: 'security', label: 'Security', icon: <FaShieldAlt /> }, { id: 'preferences', label: 'Preferences', icon: <FaGlobe /> }, { id: 'appearance', label: 'Appearance', icon: <FaPalette /> }].map(tab => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${activeTab === tab.id ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}>{tab.icon}{tab.label}</button>))}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            {activeTab === 'notifications' && (<div className="space-y-4">{['emailNotifications', 'pushNotifications', 'smsNotifications', 'reservationAlerts', 'expiryAlerts'].map(notif => (<label key={notif} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer"><span className="text-gray-700">{notif.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span><input type="checkbox" name={notif} checked={settings[notif as keyof typeof settings] as boolean} onChange={handleChange} className="w-5 h-5 accent-primary-600" /></label>))}</div>)}
            {activeTab === 'security' && (<div><label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer"><span className="text-gray-700">Two-Factor Authentication</span><input type="checkbox" name="twoFactorAuth" checked={settings.twoFactorAuth} onChange={handleChange} className="w-5 h-5 accent-primary-600" /></label><div className="mt-4"><label className="block text-sm font-medium mb-1">Session Timeout</label><select name="sessionTimeout" value={settings.sessionTimeout} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg"><option value="15">15 minutes</option><option value="30">30 minutes</option><option value="60">1 hour</option></select></div></div>)}
            {activeTab === 'preferences' && (<div><label className="block text-sm font-medium mb-1">Language</label><select name="language" value={settings.language} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg mb-4"><option value="en">English</option><option value="fr">Français</option><option value="ar">العربية</option></select></div>)}
            {activeTab === 'appearance' && (<div><label className="block text-sm font-medium mb-1">Theme</label><select name="theme" value={settings.theme} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg"><option value="light">Light</option><option value="dark">Dark</option></select></div>)}
            <div className="mt-6"><button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"><FaSave /> Save Changes</button></div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DonorSettings;