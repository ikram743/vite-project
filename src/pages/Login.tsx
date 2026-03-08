import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login:', { email, password, rememberMe });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="login-header">
            <div className="logo">
              <i className="fas fa-leaf"></i>
              <span>FoodShare</span>
            </div>
            <h1>Sign in</h1>
            <p className="subtitle">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
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

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="password-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="forgot-link">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button type="submit" className="btn-primary btn-block">
              Sign in
            </button>
          </form>

          <div className="login-footer">
            <p className="or-divider">Or</p>
            <p className="signup-link">
              Don't have an account? <Link to="/register">Create an account</Link>
            </p>
          </div>
        </div>

        <div className="login-right">
          <h2>Join the fight against food waste</h2>
          <p>Sign in to access your dashboard and manage your redistributions in real-time.</p>
          
          <ul className="feature-list">
            <li>
              <i className="fas fa-check-circle"></i>
              <span>Quick surplus declaration</span>
            </li>
            <li>
              <i className="fas fa-check-circle"></i>
              <span>Real-time notifications</span>
            </li>
            <li>
              <i className="fas fa-check-circle"></i>
              <span>Detailed impact tracking</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;