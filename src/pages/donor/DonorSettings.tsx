import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DonorHeader from '../../components/donor/DonorHeader';
import DonorSidebar from '../../components/donor/DonorSidebar';
import './DonorSettings.css';

const DonorSettings: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  const [settings, setSettings] = useState({
    // Profile Settings
    businessName: 'Artisan Bakery',
    email: 'contact@artisanbakery.dz',
    phone: '+213 555 123 456',
    address: '123 Rue Didouche, Algiers',
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    reservationAlerts: true,
    expiryAlerts: true,
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 30,
    
    // App Settings
    language: 'en',
    theme: 'light'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSave = () => {
    console.log('Saving settings:', settings);
    alert('Settings saved successfully!');
  };

  return (
    <div className="donor-dashboard">
      <DonorHeader />
      <div className="dashboard-main container">
        <DonorSidebar />
        
        <div className="dashboard-content">
          {/* أزرار التنقل */}
          <div className="navigation-buttons">
            <button className="nav-btn back-btn" onClick={() => navigate(-1)}>
              <i className="fas fa-arrow-left"></i> Back
            </button>
            <button className="nav-btn home-btn" onClick={() => navigate('/')}>
              <i className="fas fa-home"></i> Home
            </button>
          </div>

          <div className="settings-header">
            <h1>Settings</h1>
          </div>

          {/* Tabs */}
          <div className="settings-tabs">
            <button 
              className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <i className="fas fa-user"></i> Profile
            </button>
            <button 
              className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              <i className="fas fa-bell"></i> Notifications
            </button>
            <button 
              className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <i className="fas fa-shield-alt"></i> Security
            </button>
            <button 
              className={`tab-btn ${activeTab === 'app' ? 'active' : ''}`}
              onClick={() => setActiveTab('app')}
            >
              <i className="fas fa-cog"></i> Application
            </button>
          </div>

          {/* Tab Content */}
          <div className="settings-content">
            {activeTab === 'profile' && (
              <div className="settings-section">
                <h3>Profile Settings</h3>
                <div className="settings-grid">
                  <div className="form-group">
                    <label>Business Name</label>
                    <input
                      type="text"
                      name="businessName"
                      value={settings.businessName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={settings.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={settings.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Address</label>
                    <input
                      type="text"
                      name="address"
                      value={settings.address}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="settings-section">
                <h3>Notification Preferences</h3>
                <div className="checkbox-grid">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="emailNotifications"
                      checked={settings.emailNotifications}
                      onChange={handleChange}
                    />
                    <span>Email Notifications</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="pushNotifications"
                      checked={settings.pushNotifications}
                      onChange={handleChange}
                    />
                    <span>Push Notifications</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="smsNotifications"
                      checked={settings.smsNotifications}
                      onChange={handleChange}
                    />
                    <span>SMS Notifications</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="reservationAlerts"
                      checked={settings.reservationAlerts}
                      onChange={handleChange}
                    />
                    <span>Reservation Alerts</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="expiryAlerts"
                      checked={settings.expiryAlerts}
                      onChange={handleChange}
                    />
                    <span>Expiry Alerts</span>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="settings-section">
                <h3>Security Settings</h3>
                <div className="settings-grid">
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="twoFactorAuth"
                        checked={settings.twoFactorAuth}
                        onChange={handleChange}
                      />
                      <span>Two-Factor Authentication</span>
                    </label>
                  </div>
                  <div className="form-group">
                    <label>Session Timeout (minutes)</label>
                    <select 
                      name="sessionTimeout" 
                      value={settings.sessionTimeout}
                      onChange={handleChange}
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <button className="btn-secondary">
                      <i className="fas fa-key"></i> Change Password
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'app' && (
              <div className="settings-section">
                <h3>Application Settings</h3>
                <div className="settings-grid">
                  <div className="form-group">
                    <label>Language</label>
                    <select 
                      name="language" 
                      value={settings.language}
                      onChange={handleChange}
                    >
                      <option value="en">English</option>
                      <option value="fr">Français</option>
                      <option value="ar">العربية</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Theme</label>
                    <select 
                      name="theme" 
                      value={settings.theme}
                      onChange={handleChange}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="form-actions">
            <button className="btn-primary" onClick={handleSave}>
              <i className="fas fa-save"></i> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorSettings;