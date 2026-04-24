import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-gray-50">
      {/* ========== NAVBAR ========== */}
      <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 py-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center gap-5 flex-wrap">
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent"
          >
            <i className="fas fa-leaf text-emerald-600"></i>
            <span>FoodShare</span>
          </Link>

          <div className="flex gap-6 items-center flex-wrap">
            {["how", "whom", "impact"].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className="relative text-gray-600 font-medium text-sm hover:text-emerald-600 transition-colors after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-emerald-500 after:transition-all hover:after:w-full"
              >
                {section === "how"
                  ? "How it works"
                  : section === "whom"
                    ? "For whom"
                    : "Impact"}
              </button>
            ))}
            <Link
              to="/food-waste-impact"
              className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-5 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              Food Waste Impact
            </Link>
          </div>

          <div className="flex gap-3 items-center">
            <Link
              to="/login"
              className="px-5 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="px-6 py-2 text-sm font-medium bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-full shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              Sign up
            </Link>
          </div>
        </div>
      </nav>

      {/* ========== HERO SECTION ========== */}
      <section
        className="relative min-h-[90vh] flex items-center bg-cover bg-center"
        style={{ backgroundImage: "url(/hero-bg.jpg)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Technological solution <br />
              with social impact
            </h1>
            <div className="inline-block bg-white/10 backdrop-blur-md px-8 py-3 rounded-full mb-6 border border-white/20">
              <h2 className="text-2xl md:text-3xl font-bold text-emerald-300">
                Together against food waste
              </h2>
            </div>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Redistribute your food surplus in real-time and connect businesses
              with associations to give food a second life
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => navigate("/register")}
                className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 flex items-center gap-2"
              >
                <i className="fas fa-leaf"></i> Join FoodShare
              </button>
              <Link
                to="/discover"
                className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-emerald-600 transition-all flex items-center gap-2"
              >
                <i className="fas fa-chart-line"></i> Discover the platform
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS SECTION ========== */}
      <section id="how" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-4">
            How does it work?
          </h2>
          <p className="text-center text-gray-500 max-w-2xl mx-auto mb-12">
            A simple and effective 4-step process to fight food waste
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                num: 1,
                title: "Declare your surplus",
                desc: "Businesses declare their food surplus in just a few clicks via our platform.",
              },
              {
                num: 2,
                title: "Automatic geolocation",
                desc: "The system automatically locates the surplus and finds nearby associations.",
              },
              {
                num: 3,
                title: "Real-time notification",
                desc: "Associations receive instant notifications with all the details.",
              },
              {
                num: 4,
                title: "Collection and tracking",
                desc: "The redistribution is organized and tracked until its completion.",
              },
            ].map((step) => (
              <div
                key={step.num}
                className="group bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100"
              >
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 text-2xl font-bold rounded-full flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  {step.num}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FOR WHOM SECTION ========== */}
      <section
        id="whom"
        className="py-20 bg-gradient-to-br from-gray-50 to-gray-100"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              For whom?
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Our platform connects generous businesses with committed
              associations
            </p>
            <div className="w-24 h-1 bg-emerald-500 mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Business Card */}
            <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors">
                <i className="fas fa-store text-3xl text-emerald-600 group-hover:text-white transition-colors"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                For businesses
              </h3>
              <p className="text-gray-500 mb-6">
                Bakeries, restaurants, supermarkets
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Reduce your waste",
                  "Tax deduction for donations",
                  "Positive social impact",
                  "Tracking dashboard",
                  "Automatic notifications",
                ].map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-gray-600"
                  >
                    <i className="fas fa-check-circle text-emerald-500 text-sm"></i>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              {/* ✅ I am a business */}
              <Link
                to="/auth?mode=signup&type=donor"
                className="w-full py-3 border-2 border-emerald-600 text-emerald-600 font-semibold rounded-full hover:bg-emerald-600 hover:text-white transition-all text-center block"
              >
                I am a business
              </Link>
            </div>

            {/* Association Card */}
            <div className="group bg-gradient-to-br from-emerald-600 to-green-700 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 text-white">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                <i className="fas fa-heart text-3xl text-white"></i>
              </div>
              <h3 className="text-2xl font-bold mb-2">For associations</h3>
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
                    <i className="fas fa-check-circle text-emerald-300 text-sm"></i>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              {/* ✅ I am an association */}
              <Link
                to="/auth?mode=signup&type=beneficiary"
                className="w-full py-3 bg-white text-emerald-600 font-semibold rounded-full hover:bg-transparent hover:text-white hover:border-2 hover:border-white transition-all text-center block"
              >
                I am an association
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========== IMPACT SECTION ========== */}
      <section id="impact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-4">
            Food waste in Algeria
          </h2>
          <p className="text-center text-gray-500 max-w-2xl mx-auto mb-12">
            A silent crisis that requires immediate action
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              {
                value: "900M",
                label: "Bread wasted/year",
                desc: "In Algeria every year",
              },
              { value: "5M", label: "Bread/day", desc: "Wasted daily" },
              {
                value: "10-15%",
                label: "Of production",
                desc: "Ends up in the trash",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-gray-50 p-8 rounded-2xl text-center hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="text-6xl md:text-7xl font-bold text-emerald-600 mb-3">
                  {stat.value}
                </div>
                <div className="text-xl font-semibold text-gray-800 mb-2">
                  {stat.label}
                </div>
                <div className="text-gray-500">{stat.desc}</div>
              </div>
            ))}
          </div>
          <div className="relative max-w-3xl mx-auto bg-emerald-50 rounded-3xl p-8 text-center">
            <i className="fas fa-quote-left absolute top-6 left-8 text-5xl text-emerald-200"></i>
            <p className="text-2xl md:text-3xl font-bold text-gray-800 italic">
              Every saved Food can feed a family in need
            </p>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 text-2xl font-bold text-emerald-500 mb-4">
                <i className="fas fa-leaf"></i>
                <span>FoodShare</span>
              </div>
              <p className="text-sm leading-relaxed">
                Together against food waste. A platform to redistribute surplus
                and create positive social impact.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick links</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => scrollToSection("how")}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    How it works
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("whom")}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    For whom
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("impact")}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Impact
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <i className="fas fa-envelope w-5"></i> contact@foodshare.dz
                </li>
                <li className="flex items-center gap-2">
                  <i className="fas fa-phone w-5"></i> +213 12 34 56 789
                </li>
                <li className="flex items-center gap-2">
                  <i className="fas fa-map-marker-alt w-5"></i> Algérie
                </li>
              </ul>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-gray-800 text-sm">
            <p>© 2026 FoodShare. All rights reserved. Developed by us</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
