import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-wrapper">
          <div className="hero-content">
            <h1>Technological solution <br />with social impact</h1>
            <h2>Together against food waste</h2>
            <p>Redistribute your food surplus in real-time and connect businesses with associations to give food a second life</p>
            <div className="hero-buttons">
              <Link to="/register">
                <button className="btn-primary">Join FoodShare</button>
              </Link>
              <Link to="/#how">
                <button className="btn-outline">Discover the platform</button>
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="image-placeholder">
              <i className="fas fa-hand-holding-heart"></i>
              <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>
                <p>S'inscrire</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;