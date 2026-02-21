/**
 * Add Product Page
 * Form to create a new product with yearly net-zero target
 */

import { useState } from 'react';
import { createProduct } from '../services/api';

export function AddProductPage({ companyId, onProductCreated, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    yearlyNetZeroTarget: 10000,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'yearlyNetZeroTarget' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const productData = {
        ...formData,
        companyId,
        yearlyNetZeroTarget: formData.yearlyNetZeroTarget * 1000, // Convert to kg
      };

      const response = await createProduct(productData);

      if (response.success) {
        setSuccess(true);
        if (onProductCreated) {
          onProductCreated(response.data);
        }
        setTimeout(() => {
          setFormData({ name: '', description: '', yearlyNetZeroTarget: 10000 });
          setSuccess(false);
        }, 2000);
      }
    } catch (err) {
      setError(err.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-base max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-text-primary mb-6">
        Create New Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label className="block text-text-primary text-sm font-semibold mb-2">
            Product Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g., Sustainable Sneaker Model X"
            className="w-full bg-primary-darker border border-border-color rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent-emerald focus:ring-1 focus:ring-accent-emerald"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-text-primary text-sm font-semibold mb-2">
            Product Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Details about the product..."
            rows={3}
            className="w-full bg-primary-darker border border-border-color rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent-emerald focus:ring-1 focus:ring-accent-emerald resize-none"
          />
        </div>

        {/* Yearly Net-Zero Target */}
        <div>
          <label className="block text-text-primary text-sm font-semibold mb-2">
            Yearly Net-Zero Target (tCO2e) *
          </label>
          <input
            type="number"
            name="yearlyNetZeroTarget"
            value={formData.yearlyNetZeroTarget}
            onChange={handleChange}
            required
            min="0"
            step="0.1"
            placeholder="e.g., 50000"
            className="w-full bg-primary-darker border border-border-color rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent-emerald focus:ring-1 focus:ring-accent-emerald"
          />
          <p className="text-text-secondary text-xs mt-1">
            Target carbon emissions for this product per year
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-danger-red bg-opacity-10 border border-danger-red rounded-lg">
            <p className="text-danger-red text-sm">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="p-4 bg-success-green bg-opacity-10 border border-success-green rounded-lg">
            <p className="text-success-green text-sm">✓ Product created successfully!</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-accent-emerald text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Product'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-primary-darker border border-border-color text-text-primary px-6 py-3 rounded-lg font-semibold hover:border-accent-emerald transition-all"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default AddProductPage;
