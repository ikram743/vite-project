import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './DonorLogin.css';

const DonorLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login:', { email, password });
  };

  return (
    <div className="donor-login">
      <div className="login-box">
        <Link to="/" className="logo">
          <i className="fas fa-leaf"></i>
          <span>FoodShare</span>
        </Link>
        <h1>Donor Login</h1>
        <p>Access your dashboard to manage donations</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="donor@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary btn-block">
            Sign In
          </button>
        </form>

        <p className="register-link">
          Don't have an account? <Link to="/register">Register as Donor</Link>
        </p>
      </div>
    </div>
  );
};

export default DonorLogin;