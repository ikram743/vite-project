import React, { useState } from 'react';
import BenHeader from '../../components/beneficiary/BenHeader';
import BenSidebar from '../../components/beneficiary/BenSidebar';
import './BenProfile.css';

const BenProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'documents' | 'stats' | 'preferences'>('profile');
  const [isEditing, setIsEditing] = useState(false);

  // بيانات الملف الشخصي
  const [profileData, setProfileData] = useState({
    organizationName: 'Association Nour',
    organizationType: 'association',
    registrationNumber: 'ASSOC-2024-001',
    licenseNumber: 'LIC-12345-ALG',
    establishedYear: '2015',
    contactName: 'Fatima Zahra',
    position: 'Director',
    email: 'contact@associationnour.dz',
    phone: '+213 555 123 456',
    alternativePhone: '+213 555 789 012',
    address: '45 Rue Didouche Mourad',
    city: 'Algiers',
    postalCode: '16000',
    wilaya: 'Algiers',
    website: 'www.associationnour.dz',
    facebook: 'associationnour',
    description: 'Association dedicated to helping families in need by providing food and essential supplies.',
    members: 25,
    volunteers: 45,
    beneficiaries: 350,
    totalPickups: 127,
    mealsProvided: 12500
  });

  const [documents, setDocuments] = useState([
    { id: 1, name: 'Registration Certificate', file: 'reg_cert.pdf', date: '2024-01-15', status: 'verified' },
    { id: 2, name: 'Tax Exemption Letter', file: 'tax_exempt.pdf', date: '2024-02-20', status: 'verified' },
    { id: 3, name: 'Bank Statement', file: 'bank_stmt.pdf', date: '2024-03-01', status: 'pending' },
    { id: 4, name: 'Annual Report 2025', file: 'annual_report.pdf', date: '2025-12-31', status: 'draft' },
  ]);

  const [preferences, setPreferences] = useState({
    language: 'en',
    notifications: {
      email: true,
      push: true,
      sms: false,
      reservationAlerts: true,
      expiryAlerts: true,
      newsletter: false
    },
    radius: 10,
    preferredCategories: ['bakery', 'vegetables', 'fruits'],
    pickupTime: '09:00-17:00'
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handlePreferenceChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      
      if (name.startsWith('notifications.')) {
        const notifName = name.split('.')[1];
        setPreferences({
          ...preferences,
          notifications: {
            ...preferences.notifications,
            [notifName]: checked
          }
        });
      } else {
        setPreferences({
          ...preferences,
          [name]: checked
        });
      }
    } else {
      if (name.startsWith('notifications.')) {
        const notifName = name.split('.')[1];
        setPreferences({
          ...preferences,
          notifications: {
            ...preferences.notifications,
            [notifName]: value
          }
        });
      } else {
        setPreferences({
          ...preferences,
          [name]: value
        });
      }
    }
  };

  const handleSave = () => {
    console.log('Saving profile...', { profileData, documents, preferences });
    setIsEditing(false);
  };

  const handleFileUpload = () => {
    console.log('Upload document');
  };

  const handleDeleteDocument = (id: number) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'verified': return 'badge-success';
      case 'pending': return 'badge-warning';
      case 'draft': return 'badge-info';
      default: return '';
    }
  };

  const setLanguage = (lang: string) => {
    setPreferences({
      ...preferences,
      language: lang
    });
  };

  return (
    <div className="ben-dashboard">
      <BenHeader />
      
      <div className="dashboard-main container">
        <BenSidebar />
        
        <div className="dashboard-content profile-page">
          {/* Cover Image */}
          <div className="profile-cover">
            <div className="cover-image"></div>
            <div className="profile-avatar">
              <img src="https://via.placeholder.com/120" alt="Organization" />
              <button className="change-photo">
                <i className="fas fa-camera"></i>
              </button>
            </div>
          </div>

          {/* Profile Header */}
          <div className="profile-header">
            <div className="profile-title">
              <h1>{profileData.organizationName}</h1>
              <div className="profile-badges">
                <span className="org-badge">
                  <i className="fas fa-check-circle"></i>
                  Verified Association
                </span>
                <span className="org-badge">
                  <i className="fas fa-calendar"></i>
                  Since {profileData.establishedYear}
                </span>
              </div>
            </div>
            <button className="btn-edit" onClick={() => setIsEditing(!isEditing)}>
              <i className={`fas fa-${isEditing ? 'times' : 'edit'}`}></i>
              {isEditing ? ' Cancel' : ' Edit Profile'}
            </button>
          </div>

          {/* Stats Cards */}
          <div className="profile-stats">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#e8f5e9' }}>
                <i className="fas fa-hand-holding-heart" style={{ color: '#2ecc71' }}></i>
              </div>
              <div className="stat-info">
                <h3>{profileData.totalPickups}</h3>
                <p>Total Pickups</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#fff3e0' }}>
                <i className="fas fa-utensils" style={{ color: '#f39c12' }}></i>
              </div>
              <div className="stat-info">
                <h3>{profileData.mealsProvided}</h3>
                <p>Meals Provided</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#e8eaf6' }}>
                <i className="fas fa-users" style={{ color: '#3498db' }}></i>
              </div>
              <div className="stat-info">
                <h3>{profileData.beneficiaries}</h3>
                <p>Beneficiaries</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#fef5f5' }}>
                <i className="fas fa-star" style={{ color: '#e74c3c' }}></i>
              </div>
              <div className="stat-info">
                <h3>4.8</h3>
                <p>Rating</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="profile-tabs">
            <button 
              className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <i className="fas fa-building"></i>
              Organization
            </button>
            <button 
              className={`tab-btn ${activeTab === 'documents' ? 'active' : ''}`}
              onClick={() => setActiveTab('documents')}
            >
              <i className="fas fa-file-alt"></i>
              Documents
            </button>
            <button 
              className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
              onClick={() => setActiveTab('stats')}
            >
              <i className="fas fa-chart-bar"></i>
              Impact Stats
            </button>
            <button 
              className={`tab-btn ${activeTab === 'preferences' ? 'active' : ''}`}
              onClick={() => setActiveTab('preferences')}
            >
              <i className="fas fa-cog"></i>
              Preferences
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="profile-tab">
                {!isEditing ? (
                  // View Mode
                  <div className="profile-view">
                    <div className="info-section">
                      <h3>Organization Information</h3>
                      <div className="info-grid">
                        <div className="info-item">
                          <label>Organization Name</label>
                          <p>{profileData.organizationName}</p>
                        </div>
                        <div className="info-item">
                          <label>Registration Number</label>
                          <p>{profileData.registrationNumber}</p>
                        </div>
                        <div className="info-item">
                          <label>License Number</label>
                          <p>{profileData.licenseNumber}</p>
                        </div>
                        <div className="info-item">
                          <label>Established</label>
                          <p>{profileData.establishedYear}</p>
                        </div>
                      </div>
                    </div>

                    <div className="info-section">
                      <h3>Contact Information</h3>
                      <div className="info-grid">
                        <div className="info-item">
                          <label>Contact Person</label>
                          <p>{profileData.contactName}</p>
                        </div>
                        <div className="info-item">
                          <label>Position</label>
                          <p>{profileData.position}</p>
                        </div>
                        <div className="info-item">
                          <label>Email</label>
                          <p>{profileData.email}</p>
                        </div>
                        <div className="info-item">
                          <label>Phone</label>
                          <p>{profileData.phone}</p>
                        </div>
                        <div className="info-item">
                          <label>Alternative Phone</label>
                          <p>{profileData.alternativePhone}</p>
                        </div>
                      </div>
                    </div>

                    <div className="info-section">
                      <h3>Address</h3>
                      <div className="info-grid">
                        <div className="info-item">
                          <label>Address</label>
                          <p>{profileData.address}</p>
                        </div>
                        <div className="info-item">
                          <label>City</label>
                          <p>{profileData.city}</p>
                        </div>
                        <div className="info-item">
                          <label>Postal Code</label>
                          <p>{profileData.postalCode}</p>
                        </div>
                        <div className="info-item">
                          <label>Wilaya</label>
                          <p>{profileData.wilaya}</p>
                        </div>
                      </div>
                    </div>

                    <div className="info-section">
                      <h3>Online Presence</h3>
                      <div className="info-grid">
                        <div className="info-item">
                          <label>Website</label>
                          <p>
                            <a href={`https://${profileData.website}`} target="_blank" rel="noopener noreferrer">
                              {profileData.website}
                            </a>
                          </p>
                        </div>
                        <div className="info-item">
                          <label>Facebook</label>
                          <p>
                            <a href={`https://facebook.com/${profileData.facebook}`} target="_blank" rel="noopener noreferrer">
                              @{profileData.facebook}
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="info-section">
                      <h3>About</h3>
                      <p className="about-text">{profileData.description}</p>
                    </div>
                  </div>
                ) : (
                  // Edit Mode
                  <form className="profile-edit">
                    <div className="form-section">
                      <h3>Organization Information</h3>
                      <div className="form-grid">
                        <div className="form-group">
                          <label>Organization Name</label>
                          <input
                            type="text"
                            name="organizationName"
                            value={profileData.organizationName}
                            onChange={handleProfileChange}
                          />
                        </div>
                        <div className="form-group">
                          <label>Registration Number</label>
                          <input
                            type="text"
                            name="registrationNumber"
                            value={profileData.registrationNumber}
                            onChange={handleProfileChange}
                          />
                        </div>
                        <div className="form-group">
                          <label>License Number</label>
                          <input
                            type="text"
                            name="licenseNumber"
                            value={profileData.licenseNumber}
                            onChange={handleProfileChange}
                          />
                        </div>
                        <div className="form-group">
                          <label>Established Year</label>
                          <input
                            type="text"
                            name="establishedYear"
                            value={profileData.establishedYear}
                            onChange={handleProfileChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-section">
                      <h3>Contact Information</h3>
                      <div className="form-grid">
                        <div className="form-group">
                          <label>Contact Person</label>
                          <input
                            type="text"
                            name="contactName"
                            value={profileData.contactName}
                            onChange={handleProfileChange}
                          />
                        </div>
                        <div className="form-group">
                          <label>Position</label>
                          <input
                            type="text"
                            name="position"
                            value={profileData.position}
                            onChange={handleProfileChange}
                          />
                        </div>
                        <div className="form-group">
                          <label>Email</label>
                          <input
                            type="email"
                            name="email"
                            value={profileData.email}
                            onChange={handleProfileChange}
                          />
                        </div>
                        <div className="form-group">
                          <label>Phone</label>
                          <input
                            type="tel"
                            name="phone"
                            value={profileData.phone}
                            onChange={handleProfileChange}
                          />
                        </div>
                        <div className="form-group">
                          <label>Alternative Phone</label>
                          <input
                            type="tel"
                            name="alternativePhone"
                            value={profileData.alternativePhone}
                            onChange={handleProfileChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-section">
                      <h3>Address</h3>
                      <div className="form-grid">
                        <div className="form-group full-width">
                          <label>Address</label>
                          <input
                            type="text"
                            name="address"
                            value={profileData.address}
                            onChange={handleProfileChange}
                          />
                        </div>
                        <div className="form-group">
                          <label>City</label>
                          <input
                            type="text"
                            name="city"
                            value={profileData.city}
                            onChange={handleProfileChange}
                          />
                        </div>
                        <div className="form-group">
                          <label>Postal Code</label>
                          <input
                            type="text"
                            name="postalCode"
                            value={profileData.postalCode}
                            onChange={handleProfileChange}
                          />
                        </div>
                        <div className="form-group">
                          <label>Wilaya</label>
                          <select name="wilaya" value={profileData.wilaya} onChange={handleProfileChange}>
                            <option value="Algiers">Algiers</option>
                            <option value="Oran">Oran</option>
                            <option value="Constantine">Constantine</option>
                            <option value="Annaba">Annaba</option>
                            <option value="Blida">Blida</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="form-section">
                      <h3>Online Presence</h3>
                      <div className="form-grid">
                        <div className="form-group">
                          <label>Website</label>
                          <input
                            type="text"
                            name="website"
                            value={profileData.website}
                            onChange={handleProfileChange}
                            placeholder="www.example.com"
                          />
                        </div>
                        <div className="form-group">
                          <label>Facebook</label>
                          <input
                            type="text"
                            name="facebook"
                            value={profileData.facebook}
                            onChange={handleProfileChange}
                            placeholder="username"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-section">
                      <h3>About</h3>
                      <textarea
                        name="description"
                        rows={4}
                        value={profileData.description}
                        onChange={handleProfileChange}
                      />
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="documents-tab">
                <div className="documents-header">
                  <h3>Organization Documents</h3>
                  <button className="btn-primary" onClick={handleFileUpload}>
                    <i className="fas fa-upload"></i>
                    Upload Document
                  </button>
                </div>

                <div className="documents-list">
                  {documents.map(doc => (
                    <div key={doc.id} className="document-item">
                      <div className="document-icon">
                        <i className="fas fa-file-pdf"></i>
                      </div>
                      <div className="document-info">
                        <h4>{doc.name}</h4>
                        <p>{doc.file} • Uploaded {doc.date}</p>
                      </div>
                      <div className="document-status">
                        <span className={`status-badge ${getStatusBadge(doc.status)}`}>
                          {doc.status}
                        </span>
                      </div>
                      <div className="document-actions">
                        <button className="action-btn" title="Download">
                          <i className="fas fa-download"></i>
                        </button>
                        <button 
                          className="action-btn delete" 
                          title="Delete"
                          onClick={() => handleDeleteDocument(doc.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stats Tab */}
            {activeTab === 'stats' && (
              <div className="stats-tab">
                <h3>Impact Statistics</h3>
                
                <div className="impact-charts">
                  <div className="chart-card">
                    <h4>Monthly Pickups</h4>
                    <div className="bar-chart">
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => (
                        <div key={month} className="chart-column">
                          <div 
                            className="bar" 
                            style={{ height: `${20 + i * 15}px` }}
                          ></div>
                          <span>{month}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-value">{profileData.totalPickups}</div>
                      <div className="stat-label">Total Pickups</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-value">{profileData.mealsProvided}</div>
                      <div className="stat-label">Meals Provided</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-value">{profileData.beneficiaries}</div>
                      <div className="stat-label">Beneficiaries</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-value">{profileData.members}</div>
                      <div className="stat-label">Team Members</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="preferences-tab">
                <h3>Notification Preferences</h3>
                
                <div className="preferences-grid">
                  <div className="preference-group">
                    <h4>Notification Channels</h4>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="notifications.email"
                        checked={preferences.notifications.email}
                        onChange={handlePreferenceChange}
                      />
                      <span>Email Notifications</span>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="notifications.push"
                        checked={preferences.notifications.push}
                        onChange={handlePreferenceChange}
                      />
                      <span>Push Notifications</span>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="notifications.sms"
                        checked={preferences.notifications.sms}
                        onChange={handlePreferenceChange}
                      />
                      <span>SMS Notifications</span>
                    </label>
                  </div>

                  <div className="preference-group">
                    <h4>Alert Types</h4>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="notifications.reservationAlerts"
                        checked={preferences.notifications.reservationAlerts}
                        onChange={handlePreferenceChange}
                      />
                      <span>Reservation Alerts</span>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="notifications.expiryAlerts"
                        checked={preferences.notifications.expiryAlerts}
                        onChange={handlePreferenceChange}
                      />
                      <span>Expiry Alerts</span>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="notifications.newsletter"
                        checked={preferences.notifications.newsletter}
                        onChange={handlePreferenceChange}
                      />
                      <span>Newsletter</span>
                    </label>
                  </div>

                  <div className="preference-group">
                    <h4>Search Preferences</h4>
                    <div className="form-group">
                      <label>Search Radius (km)</label>
                      <input
                        type="range"
                        name="radius"
                        min="1"
                        max="50"
                        value={preferences.radius}
                        onChange={handlePreferenceChange}
                      />
                      <span className="range-value">{preferences.radius} km</span>
                    </div>

                    <div className="form-group">
                      <label>Preferred Pickup Time</label>
                      <select name="pickupTime" value={preferences.pickupTime} onChange={handlePreferenceChange}>
                        <option value="09:00-17:00">09:00 - 17:00</option>
                        <option value="08:00-20:00">08:00 - 20:00</option>
                        <option value="Any">Anytime</option>
                      </select>
                    </div>
                  </div>

                  <div className="preference-group">
                    <h4>Language</h4>
                    <div className="language-options">
                      <button 
                        className={`lang-btn ${preferences.language === 'en' ? 'active' : ''}`}
                        onClick={() => setLanguage('en')}
                      >
                        English
                      </button>
                      <button 
                        className={`lang-btn ${preferences.language === 'fr' ? 'active' : ''}`}
                        onClick={() => setLanguage('fr')}
                      >
                        Français
                      </button>
                      <button 
                        className={`lang-btn ${preferences.language === 'ar' ? 'active' : ''}`}
                        onClick={() => setLanguage('ar')}
                      >
                        العربية
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Save/Cancel buttons for edit mode */}
          {isEditing && (
            <div className="form-actions">
              <button className="btn-secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSave}>
                <i className="fas fa-save"></i>
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BenProfile;