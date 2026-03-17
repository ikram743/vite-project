import React, { useState } from 'react';
import BenHeader from '../../components/beneficiary/BenHeader';
import BenSidebar from '../../components/beneficiary/BenSidebar';
import './BenSettings.css';

const BenSettings: React.FC = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false
  });

  return (
    <div className="ben-dashboard">
      <BenHeader />
      <div className="dashboard-main container">
        <BenSidebar />
        
        <div className="dashboard-content">
          {/* أزرار التنقل - فوق كل المحتوى */}
          <div className="navigation-buttons">
            <button className="nav-btn back-btn" onClick={() => window.history.back()}>
              <i className="fas fa-arrow-left"></i> Back
            </button>
            <button className="nav-btn home-btn" onClick={() => window.location.href = '/'}>
              <i className="fas fa-home"></i> Home
            </button>
          </div>

          <div className="page-header">
            <h1>Settings</h1>
            <p>Manage your preferences</p>
          </div>

          <div className="settings-section">
            <h2>Notifications</h2>
            <div className="checkbox-group">
              <label>
                <input type="checkbox" checked={notifications.email} onChange={() => setNotifications({...notifications, email: !notifications.email})} />
                Email Notifications
              </label>
              <label>
                <input type="checkbox" checked={notifications.push} onChange={() => setNotifications({...notifications, push: !notifications.push})} />
                Push Notifications
              </label>
              <label>
                <input type="checkbox" checked={notifications.sms} onChange={() => setNotifications({...notifications, sms: !notifications.sms})} />
                SMS Notifications
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenSettings;