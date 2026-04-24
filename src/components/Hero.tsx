import React from "react";
import { Link } from "react-router-dom";

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden min-h-[500px] flex items-center py-10 md:py-0">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-bg.jpg"
          alt="Food sharing background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4 drop-shadow-lg">
              Technological solution <br />with social impact
            </h1>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-secondary-100 mb-4 drop-shadow-md">
              Together against food waste
            </h2>
            <p className="text-sm md:text-base text-white/90 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
              Redistribute your food surplus in real-time and connect businesses
              with associations to give food a second life
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/register"
                className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-full transition-all hover:-translate-y-0.5 shadow-lg text-center"
              >
                Join FoodShare
              </Link>
              <Link
                to="/food-waste-impact"
                className="border-2 border-white text-white font-semibold py-3 px-8 rounded-full hover:bg-white hover:text-primary-600 transition-all hover:-translate-y-0.5 text-center"
              >
                Discover the platform
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-full">
            <div className="relative w-full h-64 md:h-80 lg:h-[350px] rounded-3xl overflow-hidden shadow-2xl animate-float">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Food sharing"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary-600/70 to-primary-800/70 flex flex-col items-center justify-center gap-5 hover:backdrop-blur-sm transition-all">
                <i className="fas fa-hand-holding-heart text-5xl md:text-6xl lg:text-7xl text-white animate-pulse"></i>
                <Link
                  to="/register"
                  className="border-2 border-white text-white font-semibold py-2 px-6 rounded-full hover:bg-white hover:text-primary-600 transition-all hover:scale-105"
                >
                  S'inscrire
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom keyframes for animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;