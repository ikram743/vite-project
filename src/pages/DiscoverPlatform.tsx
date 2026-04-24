import React from "react";
import { useNavigate } from "react-router-dom";

const DiscoverPlatform: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: "🍽️",
      title: "Easy to Use",
      desc: "Simple interface for donors and beneficiaries",
    },
    {
      icon: "📍",
      title: "Geolocation",
      desc: "Find nearby food surplus automatically",
    },
    {
      icon: "🔔",
      title: "Real-time Alerts",
      desc: "Instant notifications for new donations",
    },
    {
      icon: "📊",
      title: "Impact Tracking",
      desc: "Track your donations and impact",
    },
    {
      icon: "🔄",
      title: "Real-time Updates",
      desc: "Live status of reservations",
    },
    { icon: "📱", title: "Mobile Friendly", desc: "Access from any device" },
  ];

  const steps = [
    {
      number: "01",
      title: "Create Account",
      desc: "Sign up as donor or beneficiary",
    },
    {
      number: "02",
      title: "Add or Search",
      desc: "Donors add surplus, beneficiaries search",
    },
    {
      number: "03",
      title: "Reserve",
      desc: "Beneficiaries reserve available food",
    },
    { number: "04", title: "Pick Up", desc: "Arrange pickup and receive food" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter',sans-serif]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-700 to-teal-800 text-white py-16 md:py-20 text-center">
        <div className="max-w-6xl mx-auto px-5">
          <button
            onClick={() => navigate("/")}
            className="bg-white/20 hover:bg-white/30 transition-all px-5 py-2 rounded-full text-sm mb-6 cursor-pointer"
          >
            ← Back to Home
          </button>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Discover FoodShare Platform
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-base md:text-lg">
            The complete solution to fight food waste and help those in need
          </p>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-3">
            How It Works
          </h2>
          <p className="text-gray-500 text-center max-w-2xl mx-auto mb-10 text-sm md:text-base">
            Simple 4-step process to get started
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="text-center p-6 bg-gray-50 rounded-xl hover:bg-white hover:shadow-md transition-all hover:-translate-y-1"
              >
                <div className="text-4xl font-bold text-emerald-500 mb-3">
                  {step.number}
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-3">
            Platform Features
          </h2>
          <p className="text-gray-500 text-center max-w-2xl mx-auto mb-10 text-sm md:text-base">
            Everything you need to manage food surplus
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl text-center shadow-sm hover:shadow-md transition-all hover:-translate-y-1 border border-gray-100"
              >
                <div className="text-5xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-700 text-center text-white">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Ready to Get Started?
          </h2>
          <p className="text-white/80 mb-6 max-w-md mx-auto">
            Join FoodShare today and make a difference
          </p>
          <button
            onClick={() => navigate("/register")}
            className="bg-white text-emerald-600 px-8 py-3 rounded-full font-semibold hover:bg-transparent hover:text-white hover:border-2 hover:border-white transition-all"
          >
            Sign Up Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default DiscoverPlatform;
