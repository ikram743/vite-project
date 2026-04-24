import React from "react";
import { Link } from "react-router-dom";

const ForWhom: React.FC = () => {
  return (
    <section id="whom" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* عنوان القسم */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-slate-800 mb-4">
          For whom?
        </h2>
        <p className="text-center text-slate-500 max-w-2xl mx-auto mb-12 text-lg">
          Our platform connects generous businesses with committed associations
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Business Card */}
          <div className="group bg-white rounded-3xl p-8 md:p-10 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2">
            <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-600 transition-colors">
              <i className="fas fa-store text-3xl text-primary-600 group-hover:text-white transition-colors"></i>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
              For businesses
            </h3>
            <p className="text-slate-500 mb-6">Bakeries, restaurants, supermarkets</p>
            <ul className="space-y-3 mb-8">
              {[
                "Reduce your food waste",
                "Tax deduction for donations",
                "Positive social impact",
                "Tracking dashboard",
                "Automatic notifications",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-slate-600">
                  <i className="fas fa-check-circle text-secondary-500 text-sm"></i>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/register?type=business"
              className="block w-full py-3 border-2 border-secondary-500 text-secondary-500 font-semibold rounded-full text-center hover:bg-secondary-500 hover:text-white transition-all hover:-translate-y-0.5"
            >
              I am a business
            </Link>
          </div>

          {/* Association Card */}
          <div className="group bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-8 md:p-10 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 text-white">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-6">
              <i className="fas fa-heart text-3xl text-white"></i>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-2">
              For associations
            </h3>
            <p className="text-white/80 mb-6">Food banks, aid centers</p>
            <ul className="space-y-3 mb-8">
              {[
                "Free access to food surplus",
                "Geolocation of businesses",
                "Real-time booking",
                "Collection planning",
                "Impact statistics",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <i className="fas fa-check-circle text-secondary-200 text-sm"></i>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/register?type=association"
              className="block w-full py-3 bg-white text-primary-600 font-semibold rounded-full text-center hover:bg-transparent hover:text-white hover:border-2 hover:border-white transition-all hover:-translate-y-0.5"
            >
              I am an association
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForWhom;