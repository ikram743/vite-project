import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DonorHeader from '../../components/donor/DonorHeader';
import DonorSidebar from '../../components/donor/DonorSidebar';
import './DonorProfile.css';

const DonorProfile: React.FC = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    businessName: 'Artisan Bakery',
    businessType: 'Bakery',
    contactName: 'Ahmed Benali',
    email: 'ahmed.benali@bakery.dz',
    phone: '+213 555 123 456',
    address: '123 Rue Didouche, Algiers',
    registrationNumber: 'REG123456',
    taxNumber: 'TAX789012',
    joinedDate: 'January 2026',
    totalDonations: 48,
    totalBeneficiaries: 23,
    rating: 4.8
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Profile updated:', profileData);
    setIsEditing(false);
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

          <div className="profile-header">
            <h1>Business Profile</h1>
            <button 
              className="btn-edit"
              onClick={() => setIsEditing(!isEditing)}
            >
              <i className={`fas fa-${isEditing ? 'times' : 'edit'}`}></i>
              {isEditing ? ' Cancel' : ' Edit Profile'}
            </button>
          </div>

          {/* إحصائيات سريعة */}
          <div className="profile-stats">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#e8f5e9' }}>
                <i className="fas fa-box" style={{ color: '#2ecc71' }}></i>
              </div>
              <div className="stat-info">
                <h3>{profileData.totalDonations}</h3>
                <p>Total Donations</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#e8eaf6' }}>
                <i className="fas fa-users" style={{ color: '#3498db' }}></i>
              </div>
              <div className="stat-info">
                <h3>{profileData.totalBeneficiaries}</h3>
                <p>Beneficiaries</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#fff3e0' }}>
                <i className="fas fa-star" style={{ color: '#f39c12' }}></i>
              </div>
              <div className="stat-info">
                <h3>{profileData.rating}</h3>
                <p>Rating</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#fef5f5' }}>
                <i className="fas fa-calendar" style={{ color: '#e74c3c' }}></i>
              </div>
              <div className="stat-info">
                <h3>{profileData.joinedDate}</h3>
                <p>Joined</p>
              </div>
            </div>
          </div>

          {/* معلومات الملف الشخصي */}
          {!isEditing ? (
            <div className="profile-info">
              <div className="info-section">
                <h3>Business Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Business Name</label>
                    <p>{profileData.businessName}</p>
                  </div>
                  <div className="info-item">
                    <label>Business Type</label>
                    <p>{profileData.businessType}</p>
                  </div>
                  <div className="info-item">
                    <label>Registration Number</label>
                    <p>{profileData.registrationNumber}</p>
                  </div>
                  <div className="info-item">
                    <label>Tax Number</label>
                    <p>{profileData.taxNumber}</p>
                  </div>
                </div>
              </div>

              <div className="info-section">
                <h3>Contact Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Contact Name</label>
                    <p>{profileData.contactName}</p>
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
                    <label>Address</label>
                    <p>{profileData.address}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="profile-edit">
              <div className="edit-section">
                <h3>Business Information</h3>
                <div className="edit-grid">
                  <div className="form-group">
                    <label>Business Name</label>
                    <input
                      type="text"
                      name="businessName"
                      value={profileData.businessName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Business Type</label>
                    <select name="businessType" value={profileData.businessType} onChange={handleChange}>
                      <option value="Bakery">Bakery</option>
                      <option value="Restaurant">Restaurant</option>
                      <option value="Supermarket">Supermarket</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Registration Number</label>
                    <input
                      type="text"
                      name="registrationNumber"
                      value={profileData.registrationNumber}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Tax Number</label>
                    <input
                      type="text"
                      name="taxNumber"
                      value={profileData.taxNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="edit-section">
                <h3>Contact Information</h3>
                <div className="edit-grid">
                  <div className="form-group">
                    <label>Contact Name</label>
                    <input
                      type="text"
                      name="contactName"
                      value={profileData.contactName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <input
                      type="text"
                      name="address"
                      value={profileData.address}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonorProfile;