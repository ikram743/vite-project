import React from "react";
import { Link } from "react-router-dom"; // استيراد Link
import "./CTA.css";

const CTA: React.FC = () => {
  return (
    <section className="cta">
      <div className="container">
        <h2>Ready to make a difference?</h2>
        <p>
          Join our community and participate in the fight against food waste
          today
        </p>
        <div className="cta-buttons">
          <Link to="/auth?mode=signup&type=donor" className="btn-business-card">
            Create a business account
          </Link>

          <Link
            to="/auth?mode=signup&type=beneficiary"
            className="btn-association-card"
          >
            Create an association account
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTA;
