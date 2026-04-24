import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

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
    <nav className="bg-white shadow-sm sticky top-0 z-50 py-4 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center relative">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold text-primary-600"
          >
            <i className="fas fa-leaf text-secondary-500"></i>
            <span>FoodShare</span>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            <button
              onClick={() => scrollToSection("how")}
              className="text-gray-700 font-medium text-sm hover:text-secondary-500 transition-colors whitespace-nowrap"
            >
              How it works
            </button>
            <button
              onClick={() => scrollToSection("whom")}
              className="text-gray-700 font-medium text-sm hover:text-secondary-500 transition-colors whitespace-nowrap"
            >
              For whom
            </button>
            <button
              onClick={() => scrollToSection("impact")}
              className="text-gray-700 font-medium text-sm hover:text-secondary-500 transition-colors whitespace-nowrap"
            >
              Impact
            </button>
            <Link
              to="/food-waste-impact"
              className="border-2 border-primary-600 text-primary-600 px-5 py-2 rounded-full font-semibold text-sm hover:bg-primary-600 hover:text-white transition-all hover:-translate-y-0.5"
            >
              Food Waste Impact
            </Link>
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              to="/auth?mode=signin"
              className="text-gray-700 font-medium text-sm hover:text-secondary-500 transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/auth?mode=signup"
              className="bg-primary-600 text-white px-5 py-2 rounded-full font-semibold text-sm hover:bg-primary-700 transition-all hover:-translate-y-0.5"
            >
              Sign up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-2xl text-gray-700 z-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i className={`fas fa-${isMenuOpen ? "times" : "bars"}`}></i>
          </button>

          {/* Mobile Menu */}
          <div
            className={`${
              isMenuOpen
                ? "fixed inset-0 bg-white z-40 flex flex-col items-center justify-center gap-8"
                : "hidden"
            } lg:hidden`}
          >
            <button
              onClick={() => scrollToSection("how")}
              className="text-gray-700 font-medium text-xl hover:text-secondary-500 transition-colors"
            >
              How it works
            </button>
            <button
              onClick={() => scrollToSection("whom")}
              className="text-gray-700 font-medium text-xl hover:text-secondary-500 transition-colors"
            >
              For whom
            </button>
            <button
              onClick={() => scrollToSection("impact")}
              className="text-gray-700 font-medium text-xl hover:text-secondary-500 transition-colors"
            >
              Impact
            </button>
            <Link
              to="/food-waste-impact"
              className="border-2 border-primary-600 text-primary-600 px-6 py-2 rounded-full font-semibold text-lg hover:bg-primary-600 hover:text-white transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              Food Waste Impact
            </Link>
            <div className="flex flex-col items-center gap-4 mt-4 pt-4 border-t border-gray-200 w-full max-w-xs">
              <Link
                to="/auth?mode=signin"
                className="text-gray-700 font-medium text-lg hover:text-secondary-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign in
              </Link>
              <Link
                to="/auth?mode=signup"
                className="bg-primary-600 text-white px-6 py-2 rounded-full font-semibold text-lg hover:bg-primary-700 transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
