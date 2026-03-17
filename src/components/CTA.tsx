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
          {/* حولنا الزر لرابط مع كلاس btn-outline */}
          <Link to="/auth?mode=signin&type=business" className="btn-outline">
            Create a business account
          </Link>

          {/* حولنا الزر لرابط مع كلاس btn-primary */}
          <Link to="/auth?mode=signin&type=association" className="btn-primary">
            Create an association account
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTA;
