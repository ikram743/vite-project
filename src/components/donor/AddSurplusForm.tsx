import React, { useState } from "react";
import { FaSave, FaTimes } from "react-icons/fa";

interface AddSurplusFormProps {
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

const AddSurplusForm: React.FC<AddSurplusFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "", category: "", quantity: "", unit: "kg", expiryDate: "", pickupTime: "", location: "", description: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Food Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required>
              <option value="">Select category</option>
              <option value="Bakery">Bakery</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Fruits">Fruits</option>
              <option value="Prepared Food">Prepared Food</option>
              <option value="Dairy">Dairy</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
            <input type="text" name="quantity" placeholder="e.g., 10, 5.5" value={formData.quantity} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
            <select name="unit" value={formData.unit} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="kg">kg</option>
              <option value="g">g</option>
              <option value="L">L</option>
              <option value="piece">piece</option>
              <option value="portion">portion</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date *</label>
            <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Time</label>
            <input type="time" name="pickupTime" value={formData.pickupTime} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
            <input type="text" name="location" placeholder="e.g., Algiers, 123 Street" value={formData.location} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" rows={3} value={formData.description} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Additional details about the food..."></textarea>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
            <FaTimes /> Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2">
            <FaSave /> Add Surplus
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSurplusForm;