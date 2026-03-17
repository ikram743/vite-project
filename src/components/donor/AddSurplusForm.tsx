import React, { useState } from 'react';
import './AddSurplusForm.css';

const AddSurplusForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    quantity: '',
    unit: 'kg',
    expiryDate: '',
    description: '',
    pickupAddress: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New surplus:', formData);
  };

  return (
    <div className="add-surplus-form">
      <h2>Add New Food Surplus</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              placeholder="e.g., Fresh Bread"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select name="category" value={formData.category} onChange={handleChange} required>
              <option value="">Select category</option>
              <option value="bakery">Bakery</option>
              <option value="vegetables">Vegetables</option>
              <option value="fruits">Fruits</option>
              <option value="prepared">Prepared Meals</option>
              <option value="dairy">Dairy</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Quantity *</label>
            <input
              type="number"
              name="quantity"
              placeholder="10"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Unit</label>
            <select name="unit" value={formData.unit} onChange={handleChange}>
              <option value="kg">kg</option>
              <option value="g">g</option>
              <option value="pieces">pieces</option>
              <option value="portions">portions</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Expiry Date *</label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            rows={3}
            placeholder="Describe your food surplus..."
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Pickup Address *</label>
          <input
            type="text"
            name="pickupAddress"
            placeholder="123 Main Street, Algiers"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn-outline">Cancel</button>
          <button type="submit" className="btn-primary">Add Surplus</button>
        </div>
      </form>
    </div>
  );
};

export default AddSurplusForm;