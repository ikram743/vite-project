import React from 'react';
import { Link } from 'react-router-dom';  // أضف هذا
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-about">
            <Link to="/" className="footer-logo">  {/* غير <div> إلى <Link> */}
              <i className="fas fa-leaf"></i>
              <span>FoodShare</span>
            </Link>
            <p>Together against food waste. A platform to redistribute surplus and create positive social impact.</p>
          </div>

          <div className="footer-links">
            <h4>Quick links</h4>
            <ul>
              <li><Link to="/#how">How it works</Link></li>
              <li><Link to="/#whom">For whom</Link></li>
              <li><Link to="/#impact">Impact</Link></li>
              <li><Link to="/#about">About</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Legal</h4>
            <ul>
              <li><Link to="/terms">Terms of use</Link></li>
              <li><Link to="/privacy">Privacy policy</Link></li>
              <li><Link to="/legal">Legal notice</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>Contact</h4>
            <ul>
              <li><i className="fas fa-envelope"></i> contact@foodshare.dz</li>
              <li><i className="fas fa-phone"></i> +213 12 34 56 789</li>
              <li><i className="fas fa-map-marker-alt"></i> Algérie</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 FoodShare. All rights reserved. Developed by Boudaoud Sid Ahmed</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;