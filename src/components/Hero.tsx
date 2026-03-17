import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="hero-background">
        <img src="/images/hero-bg.jpg" alt="Food sharing background" />
        <div className="hero-overlay"></div>
      </div>
      <div className="container">
        <div className="hero-wrapper">
          <div className="hero-content">
            <h1>Technological solution <br />with social impact</h1>
            <h2>Together against food waste</h2>
            <p>Redistribute your food surplus in real-time and connect businesses with associations to give food a second life</p>
            <div className="hero-buttons">
              <Link to="/register" className="btn-primary">Join FoodShare</Link>
              <Link to="/food-waste-impact" className="btn-outline">Discover the platform</Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="image-placeholder">
              <img 
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Food sharing" 
                className="placeholder-image"
              />
              <div className="image-overlay-content">
                <i className="fas fa-hand-holding-heart"></i>
                <Link to="/register" className="image-link">
                  <p>S'inscrire</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;