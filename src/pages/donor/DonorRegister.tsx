import React, { useState } from "react";
import { Link } from "react-router-dom";

const DonorRegister: React.FC = () => {
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    contactName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Register:", formData);
    alert("Registration submitted! (Demo)");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4">
      <div className="max-w-lg w-full bg-white rounded-3xl p-8 md:p-10 shadow-xl">
        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold text-primary-600 mb-6">
          <i className="fas fa-leaf"></i>
          <span>FoodShare</span>
        </Link>

        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-2">Become a Donor</h1>
        <p className="text-slate-500 mb-6">Register your business and start donating</p>

        <form onSubmit={handleSubmit}>
          {/* Row 1: Business Name + Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Business Name *</label>
              <input
                type="text"
                name="businessName"
                placeholder="Artisan Bakery"
                value={formData.businessName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Business Type *</label>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 bg-white"
                required
              >
                <option value="">Select type</option>
                <option value="bakery">Bakery</option>
                <option value="restaurant">Restaurant</option>
                <option value="supermarket">Supermarket</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Row 2: Contact Name + Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Contact Name *</label>
              <input
                type="text"
                name="contactName"
                placeholder="Ahmed Benali"
                value={formData.contactName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="+213 555 123 456"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email *</label>
            <input
              type="email"
              name="email"
              placeholder="contact@bakery.dz"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              required
            />
          </div>

          {/* Address */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Address *</label>
            <input
              type="text"
              name="address"
              placeholder="123 Business Street, Algiers"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              required
            />
          </div>

          {/* Row 3: Password + Confirm */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Password *</label>
              <input
                type="password"
                name="password"
                placeholder="********"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="********"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-all hover:-translate-y-0.5 shadow-md"
          >
            Create Donor Account
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-secondary-500 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default DonorRegister;