import React from "react";
import { Link } from "react-router-dom";

const CTA: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-center text-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">
          Ready to make a difference?
        </h2>
        <p className="text-base md:text-lg opacity-90 max-w-xl mx-auto mb-8 leading-relaxed">
          Join our community and participate in the fight against food waste
          today
        </p>
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
          <Link
            to="/auth?mode=signup&type=donor"
            className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-white hover:text-primary-600 transition-all hover:-translate-y-1 hover:shadow-lg w-full sm:w-auto text-center"
          >
            Create a business account
          </Link>
          <Link
            to="/auth?mode=signup&type=beneficiary"
            className="bg-white text-primary-600 px-8 py-3 rounded-full font-semibold text-sm hover:bg-transparent hover:text-white hover:border-2 hover:border-white transition-all hover:-translate-y-1 hover:shadow-lg w-full sm:w-auto text-center"
          >
            Create an association account
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTA;