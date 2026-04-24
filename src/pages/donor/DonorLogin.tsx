import React, { useState } from "react";
import { Link } from "react-router-dom";

const DonorLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login:", { email, password });
    alert("Login submitted! (Demo)");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 md:p-10 shadow-xl text-center">
        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-2 text-2xl md:text-3xl font-bold text-primary-600 mb-8">
          <i className="fas fa-leaf"></i>
          <span>FoodShare</span>
        </Link>

        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-2">Donor Login</h1>
        <p className="text-slate-500 mb-8">Access your dashboard to manage donations</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-5 text-left">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
            <input
              type="email"
              placeholder="donor@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              required
            />
          </div>

          <div className="mb-6 text-left">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-all hover:-translate-y-0.5 shadow-md"
          >
            Sign In
          </button>
        </form>

        <p className="text-slate-500 text-sm mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-secondary-500 font-semibold hover:underline">
            Register as Donor
          </Link>
        </p>
      </div>
    </div>
  );
};

export default DonorLogin;