/**
 * Add Supply Chain Node Page
 * Form to add supply chain stages/nodes to a product
 */

import { useState } from 'react';
import { addSupplyChainNode } from '../services/api';

const STAGES = ['Raw Materials', 'Manufacturing', 'Logistics', 'Packaging', 'Distribution', 'End-of-Life'];
const TRANSPORT_MODES = ['truck', 'rail', 'ship', 'air'];
const ENERGY_SOURCES = ['coal', 'solar', 'wind', 'gas', 'diesel', 'petrol'];

const EMISSION_FACTORS = {
  truck: 0.12,
  rail: 0.04,
  ship: 0.02,
  air: 0.6,
};

export function AddSupplyChainNodePage({ productId, onNodeAdded, onCancel }) {
  const [formData, setFormData] = useState({
    stageName: STAGES[0],
    supplierName: '',
    transportMode: TRANSPORT_MODES[0],
    distanceKm: 100,
    energySource: ENERGY_SOURCES[0],
    transportCost: 0,
    transportTimeDays: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        ['distanceKm', 'transportCost', 'transportTimeDays'].includes(name)
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const nodeData = {
        productId,
        ...formData,
      };

      const response = await addSupplyChainNode(nodeData);

      if (response.success) {
        setSuccess(true);
        if (onNodeAdded) {
          onNodeAdded(response.data);
        }
        setTimeout(() => {
          setFormData({
            stageName: STAGES[0],
            supplierName: '',
            transportMode: TRANSPORT_MODES[0],
            distanceKm: 100,
            energySource: ENERGY_SOURCES[0],
            transportCost: 0,
            transportTimeDays: 1,
          });
          setSuccess(false);
        }, 2000);
      }
    } catch (err) {
      setError(err.message || 'Failed to add supply chain node');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-base max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-text-primary mb-6">
        Add Supply Chain Node
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Stage Name */}
        <div>
          <label className="block text-text-primary text-sm font-semibold mb-2">
            Supply Chain Stage *
          </label>
          <select
            name="stageName"
            value={formData.stageName}
            onChange={handleChange}
            className="w-full bg-primary-darker border border-border-color rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-emerald focus:ring-1 focus:ring-accent-emerald"
          >
            {STAGES.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </div>

        {/* Supplier Name */}
        <div>
          <label className="block text-text-primary text-sm font-semibold mb-2">
            Supplier Name
          </label>
          <input
            type="text"
            name="supplierName"
            value={formData.supplierName}
            onChange={handleChange}
            placeholder="e.g., ABC Manufacturing Co."
            className="w-full bg-primary-darker border border-border-color rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent-emerald focus:ring-1 focus:ring-accent-emerald"
          />
        </div>

        {/* Transport Mode */}
        <div>
          <label className="block text-text-primary text-sm font-semibold mb-2">
            Transport Mode *
          </label>
          <select
            name="transportMode"
            value={formData.transportMode}
            onChange={handleChange}
            className="w-full bg-primary-darker border border-border-color rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-emerald focus:ring-1 focus:ring-accent-emerald"
          >
            {TRANSPORT_MODES.map((mode) => (
              <option key={mode} value={mode}>
                {mode.charAt(0).toUpperCase() + mode.slice(1)} (
                {EMISSION_FACTORS[mode]} kg CO2/km)
              </option>
            ))}
          </select>
        </div>

        {/* Distance */}
        <div>
          <label className="block text-text-primary text-sm font-semibold mb-2">
            Distance (km) *
          </label>
          <input
            type="number"
            name="distanceKm"
            value={formData.distanceKm}
            onChange={handleChange}
            required
            min="0"
            step="0.1"
            placeholder="e.g., 500"
            className="w-full bg-primary-darker border border-border-color rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent-emerald focus:ring-1 focus:ring-accent-emerald"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Energy Source */}
          <div>
            <label className="block text-text-primary text-sm font-semibold mb-2">
              Energy Source *
            </label>
            <select
              name="energySource"
              value={formData.energySource}
              onChange={handleChange}
              className="w-full bg-primary-darker border border-border-color rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-emerald focus:ring-1 focus:ring-accent-emerald"
            >
              {ENERGY_SOURCES.map((source) => (
                <option key={source} value={source}>
                  {source.charAt(0).toUpperCase() + source.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Transport Time */}
          <div>
            <label className="block text-text-primary text-sm font-semibold mb-2">
              Transport Time (days) *
            </label>
            <input
              type="number"
              name="transportTimeDays"
              value={formData.transportTimeDays}
              onChange={handleChange}
              required
              min="1"
              step="0.5"
              placeholder="e.g., 3"
              className="w-full bg-primary-darker border border-border-color rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent-emerald focus:ring-1 focus:ring-accent-emerald"
            />
          </div>
        </div>

        {/* Transport Cost */}
        <div>
          <label className="block text-text-primary text-sm font-semibold mb-2">
            Transport Cost ($)
          </label>
          <input
            type="number"
            name="transportCost"
            value={formData.transportCost}
            onChange={handleChange}
            min="0"
            step="0.01"
            placeholder="e.g., 2500"
            className="w-full bg-primary-darker border border-border-color rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent-emerald focus:ring-1 focus:ring-accent-emerald"
          />
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
            <p className="text-success-green text-sm">✓ Supply chain node added successfully!</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-accent-emerald text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Supply Chain Node'}
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

export default AddSupplyChainNodePage;
