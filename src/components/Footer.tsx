import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Footer.css';

const Footer: React.FC = () => {
  const location = useLocation();

  // دالة للتمرير إلى القسم المطلوب
  const scrollToSection = (sectionId: string) => {
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = `/#${sectionId}`;
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* القسم الأول: معلومات المنصة (تبقى كما هي) */}
          <div className="footer-about">
            <div className="footer-logo">
              <i className="fas fa-leaf"></i>
              <span>FoodShare</span>
            </div>
            <p className="project-description">
              Together against food waste. A platform to redistribute surplus and create positive social impact.
            </p>
          </div>

          {/* القسم الثاني: Quick links */}
          <div className="footer-links">
            <h4>Quick links</h4>
            <ul>
              <li>
                <button 
                  onClick={() => scrollToSection('how')}
                  className="footer-link-btn"
                >
                  How it works
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('whom')}
                  className="footer-link-btn"
                >
                  For whom
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('impact')}
                  className="footer-link-btn"
                >
                  Impact
                </button>
              </li>
            </ul>
          </div>

          {/* القسم الثالث: Contact */}
          <div className="footer-contact">
            <h4>Contact</h4>
            <ul>
              <li>
                <i className="fas fa-envelope"></i>
                <a href="mailto:contact@foodshare.dz">contact@foodshare.dz</a>
              </li>
              <li>
                <i className="fas fa-phone"></i>
                <a href="tel:+213123456789">+213 12 34 56 789</a>
              </li>
              <li>
                <i className="fas fa-map-marker-alt"></i>
                Algérie
              </li>
            </ul>
          </div>
        </div>

        {/* السطر الأخير */}
        <div className="footer-bottom">
          <p>© 2026 FoodShare. All rights reserved. Developed by us</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;