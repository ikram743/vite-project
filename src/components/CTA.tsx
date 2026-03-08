import React from 'react';
import './CTA.css';

const CTA: React.FC = () => {
  return (
    <section className="cta">
      <div className="container">
        <h2>Ready to make a difference?</h2>
        <p>Join our community and participate in the fight against food waste today</p>
        <div className="cta-buttons">
          <button className="btn-outline">Create a business account</button>
          <button className="btn-primary">Create an association account</button>
        </div>
      </div>
    </section>
  );
};

export default CTA;