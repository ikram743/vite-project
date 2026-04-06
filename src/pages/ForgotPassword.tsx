import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    console.log('Reset password for:', email);
    setSubmitted(true);
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="forgot-password-header">
          <Link to="/" className="logo">
            <i className="fas fa-leaf"></i>
            <span>FoodShare</span>
          </Link>
          <h1>Forgot password?</h1>
          <p className="subtitle">Enter your email address and we'll send you a link to reset your password.</p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="forgot-password-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary btn-block">
              Send reset link
            </button>

            <p className="back-to-login">
              <Link to="/login">← Back to sign in</Link>
            </p>
          </form>
        ) : (
          <div className="success-message">
            <i className="fas fa-check-circle"></i>
            <h2>Check your email</h2>
            <p>We've sent a password reset link to <strong>{email}</strong></p>
            <Link to="/login" className="btn-primary btn-block">Back to sign in</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;