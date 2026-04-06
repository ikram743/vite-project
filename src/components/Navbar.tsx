import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const scrollToSection = (sectionId: string) => {
    setIsMenuOpen(false);

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
    <nav className="navbar">
      <div className="container">
        <div className="nav-wrapper">
          {/* اللوجو في اليسار */}
          <Link to="/" className="nav-logo">
            <i className="fas fa-leaf"></i>
            <span>FoodShare</span>
          </Link>

          {/* الروابط في الوسط */}
          <div className={`nav-links ${isMenuOpen ? "active" : ""}`}>
            <button
              onClick={() => scrollToSection("how")}
              className="nav-link-btn"
            >
              How it works
            </button>
            <button
              onClick={() => scrollToSection("whom")}
              className="nav-link-btn"
            >
              For whom
            </button>
            <button
              onClick={() => scrollToSection("impact")}
              className="nav-link-btn"
            >
              Impact
            </button>
            {/* الرابط الجديد لصفحة Food Waste Impact */}
            <Link to="/food-waste-impact" className="nav-link-btn impact-link">
              Food Waste Impact
            </Link>
          </div>

          {/* أزرار Sign in / Sign up في اليمين */}
          <div className={`nav-buttons ${isMenuOpen ? "active" : ""}`}>
            <Link to="/auth?mode=signin" className="nav-link">
              Sign in
            </Link>
            <Link to="/auth?mode=signup" className="nav-link btn-signup">
              Sign up
            </Link>
          </div>

          {/* زر القائمة للجوال */}
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i className={`fas fa-${isMenuOpen ? "times" : "bars"}`}></i>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
