import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Register.css';

const Register: React.FC = () => {
  const [accountType, setAccountType] = useState<'business' | 'association'>('business');
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    organizationName: '',
    registrationNumber: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Register:', { accountType, ...formData });
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <div className="logo">
            <i className="fas fa-leaf"></i>
            <span>FoodShare</span>
          </div>
          <h1>Create an account</h1>
          <p className="subtitle">Choose your account type to get started</p>
        </div>

        <div className="account-type-toggle">
          <button
            className={`type-btn ${accountType === 'business' ? 'active' : ''}`}
            onClick={() => setAccountType('business')}
          >
            <i className="fas fa-store"></i>
            Business
          </button>
          <button
            className={`type-btn ${accountType === 'association' ? 'active' : ''}`}
            onClick={() => setAccountType('association')}
          >
            <i className="fas fa-heart"></i>
            Association
          </button>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {accountType === 'business' ? (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>Business name *</label>
                  <input
                    type="text"
                    name="businessName"
                    placeholder="Artisan Bakery"
                    value={formData.businessName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Business type *</label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Bakery, Restaurant, Supermarket...</option>
                    <option value="bakery">Bakery</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="supermarket">Supermarket</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Contact name *</label>
                  <input
                    type="text"
                    name="contactName"
                    placeholder="Ahmed Benali"
                    value={formData.contactName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone number</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+213 555 123 456"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>Organization name *</label>
                  <input
                    type="text"
                    name="organizationName"
                    placeholder="Association Nour"
                    value={formData.organizationName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Registration number</label>
                  <input
                    type="text"
                    name="registrationNumber"
                    placeholder="ASSOC001"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Contact name *</label>
                <input
                  type="text"
                  name="contactName"
                  placeholder="Fatima Zahra"
                  value={formData.contactName}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              placeholder="contact@bakery.dz"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Address *</label>
            <input
              type="text"
              name="address"
              placeholder="123 Republic Street, Algiers"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                name="password"
                placeholder="********"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm password *</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="********"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary btn-block">
            Create my {accountType === 'business' ? 'business' : 'association'} account
          </button>

          <p className="login-link">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>

        <div className="register-stats">
          <p className="stats-text">
            Join over <strong>700 businesses and associations</strong> using FoodShare to redistribute food surplus.
          </p>
          
          <div className="stats-grid">
            <div className="stat-item">
              <h4>For businesses</h4>
              <ul>
                <li><i className="fas fa-check"></i> Reduce your waste</li>
                <li><i className="fas fa-check"></i> Tax deduction</li>
                <li><i className="fas fa-check"></i> Positive social impact</li>
              </ul>
            </div>
            <div className="stat-item">
              <h4>For associations</h4>
              <ul>
                <li><i className="fas fa-check"></i> Free access to surplus</li>
                <li><i className="fas fa-check"></i> Geolocation</li>
                <li><i className="fas fa-check"></i> Real-time notifications</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;