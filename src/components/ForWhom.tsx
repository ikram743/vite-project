import React from 'react';
import './ForWhom.css';

const ForWhom: React.FC = () => {
  return (
    <section className="for-whom" id="whom">
      <div className="container">
        <h2 className="section-title">For whom?</h2>
        <p className="section-subtitle">
          Our platform connects generous businesses with committed associations
        </p>

        <div className="cards-grid">
          <div className="card businesses">
            <div className="card-icon">
              <i className="fas fa-store"></i>
            </div>
            <h3>For businesses</h3>
            <p className="card-subtitle">Bakeries, restaurants, supermarkets</p>
            <ul className="card-features">
              <li><i className="fas fa-check-circle"></i> Reduce your food waste</li>
              <li><i className="fas fa-check-circle"></i> Tax deduction for donations</li>
              <li><i className="fas fa-check-circle"></i> Positive social impact</li>
              <li><i className="fas fa-check-circle"></i> Tracking dashboard</li>
              <li><i className="fas fa-check-circle"></i> Automatic notifications</li>
            </ul>
            <button className="btn-outline">I am a business</button>
          </div>

          <div className="card associations">
            <div className="card-icon">
              <i className="fas fa-heart"></i>
            </div>
            <h3>For associations</h3>
            <p className="card-subtitle">Food banks, aid centers</p>
            <ul className="card-features">
              <li><i className="fas fa-check-circle"></i> Free access to food surplus</li>
              <li><i className="fas fa-check-circle"></i> Geolocation of businesses</li>
              <li><i className="fas fa-check-circle"></i> Real-time booking</li>
              <li><i className="fas fa-check-circle"></i> Collection planning</li>
              <li><i className="fas fa-check-circle"></i> Impact statistics</li>
            </ul>
            <button className="btn-primary">I am an association</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForWhom;