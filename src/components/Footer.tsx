import React from "react";
import { Link, useLocation } from "react-router-dom";

const Footer: React.FC = () => {
  const location = useLocation();

  const scrollToSection = (sectionId: string) => {
    if (location.pathname === "/") {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.location.href = `/#${sectionId}`;
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-400 py-12 md:py-16 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* About Section */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-2xl font-bold text-secondary-500 mb-4">
              <i className="fas fa-leaf"></i>
              <span>FoodShare</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto md:mx-0">
              Together against food waste. A platform to redistribute surplus
              and create positive social impact.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h4 className="text-white font-semibold text-base mb-5 relative inline-block md:inline-block after:absolute after:left-0 after:bottom-[-8px] after:w-8 after:h-0.5 after:bg-secondary-500 after:rounded-full md:after:left-0 after:left-1/2 after:-translate-x-1/2 md:after:translate-x-0">
              Quick links
            </h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => scrollToSection("how")}
                  className="text-gray-400 text-sm hover:text-secondary-500 transition-all hover:translate-x-1 md:hover:translate-x-1"
                >
                  How it works
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("whom")}
                  className="text-gray-400 text-sm hover:text-secondary-500 transition-all hover:translate-x-1 md:hover:translate-x-1"
                >
                  For whom
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("impact")}
                  className="text-gray-400 text-sm hover:text-secondary-500 transition-all hover:translate-x-1 md:hover:translate-x-1"
                >
                  Impact
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center md:text-left">
            <h4 className="text-white font-semibold text-base mb-5 relative inline-block md:inline-block after:absolute after:left-0 after:bottom-[-8px] after:w-8 after:h-0.5 after:bg-secondary-500 after:rounded-full md:after:left-0 after:left-1/2 after:-translate-x-1/2 md:after:translate-x-0">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center justify-center md:justify-start gap-2 text-gray-400 text-sm">
                <i className="fas fa-envelope text-secondary-500 w-5"></i>
                <a
                  href="mailto:contact@foodshare.dz"
                  className="hover:text-secondary-500 transition-colors"
                >
                  contact@foodshare.dz
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2 text-gray-400 text-sm">
                <i className="fas fa-phone text-secondary-500 w-5"></i>
                <a
                  href="tel:+213123456789"
                  className="hover:text-secondary-500 transition-colors"
                >
                  +213 12 34 56 789
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2 text-gray-400 text-sm">
                <i className="fas fa-map-marker-alt text-secondary-500 w-5"></i>
                <span>Algérie</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="text-center pt-6 border-t border-gray-800 text-gray-500 text-xs">
          <p>© 2026 FoodShare. All rights reserved. Developed by us</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;