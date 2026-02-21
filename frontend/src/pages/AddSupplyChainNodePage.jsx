/**
 * Add Supply Chain Node Page
 * Form to add supply chain stages/nodes to a product
 * Now includes route tracking with Maharashtra city locations
 */

import { useState, useEffect } from 'react';
import { addSupplyChainNode, analyzeRouteIntelligence } from '../services/api';

const STAGES = ['Raw Materials', 'Manufacturing', 'Logistics', 'Packaging', 'Distribution', 'End-of-Life'];
const TRANSPORT_MODES = ['truck', 'rail', 'ship', 'air'];
const ENERGY_SOURCES = ['coal', 'solar', 'wind', 'gas', 'diesel', 'petrol'];

// Maharashtra cities with logistics infrastructure
const MAHARASHTRA_CITIES = [
  'Aurangabad',
  'Chhatrapati Sambhajinagar',
  'Nashik',
  'Pune',
  'Mumbai',
  'Thane',
  'Kolhapur',
  'Solapur',
  'Buldhana',
  'Parbhani',
  'Sangli',
  'Satara',
  'Sindhdurg',
  'Raigad',
  'Jalgaon',
  'Nagpur',
  'Akola',
  'Amravati',
];

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
    fromLocation: 'Pune',
    toLocation: 'Mumbai',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [routeAnalysis, setRouteAnalysis] = useState(null);
  const [analyzingRoute, setAnalyzingRoute] = useState(false);

  // Auto-analyze route when locations change
  useEffect(() => {
    if (formData.fromLocation && formData.toLocation && formData.fromLocation !== formData.toLocation) {
      analyzeRoute();
    }
  }, [formData.fromLocation, formData.toLocation]);

  const analyzeRoute = async () => {
    try {
      setAnalyzingRoute(true);
      const analysis = await analyzeRouteIntelligence({
        productId,
        fromLocation: formData.fromLocation,
        toLocation: formData.toLocation,
      });
      setRouteAnalysis(analysis.data);
    } catch (err) {
      console.error('Route analysis error:', err);
      setRouteAnalysis(null);
    } finally {
      setAnalyzingRoute(false);
    }
  };

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
            fromLocation: 'Pune',
            toLocation: 'Mumbai',
          });
          setSuccess(false);
          setRouteAnalysis(null);
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

        {/* Route Information - From Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-text-primary text-sm font-semibold mb-2">
              From Location (Maharashtra) *
            </label>
            <select
              name="fromLocation"
              value={formData.fromLocation}
              onChange={handleChange}
              className="w-full bg-primary-darker border border-border-color rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-emerald focus:ring-1 focus:ring-accent-emerald"
            >
              {MAHARASHTRA_CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Route Information - To Location */}
          <div>
            <label className="block text-text-primary text-sm font-semibold mb-2">
              To Location (Maharashtra) *
            </label>
            <select
              name="toLocation"
              value={formData.toLocation}
              onChange={handleChange}
              className="w-full bg-primary-darker border border-border-color rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-emerald focus:ring-1 focus:ring-accent-emerald"
            >
              {MAHARASHTRA_CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Route Analysis Display */}
        {analyzingRoute && (
          <div className="p-4 bg-accent-emerald bg-opacity-10 border border-accent-emerald rounded-lg">
            <p className="text-text-secondary text-sm">
              🔍 Analyzing route intelligence...
            </p>
          </div>
        )}

        {routeAnalysis && (
          <div className="p-4 bg-accent-teal bg-opacity-10 border border-accent-teal rounded-lg">
            <div className="mb-3">
              <h4 className="text-text-primary font-semibold mb-2">📍 Route Intelligence</h4>
              <p className="text-text-secondary text-sm mb-3">{routeAnalysis.routeDetails}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              {routeAnalysis.fromHasSeaway && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-accent-emerald">✓</span>
                  <span className="text-text-secondary">Seaway access from origin</span>
                </div>
              )}
              {routeAnalysis.fromHasAirport && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-accent-emerald">✓</span>
                  <span className="text-text-secondary">Airport near origin</span>
                </div>
              )}
              {routeAnalysis.toHasSeaway && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-accent-emerald">✓</span>
                  <span className="text-text-secondary">Seaway access at destination</span>
                </div>
              )}
              {routeAnalysis.toHasAirport && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-accent-emerald">✓</span>
                  <span className="text-text-secondary">Airport near destination</span>
                </div>
              )}
            </div>

            {routeAnalysis.greenOpportunities && routeAnalysis.greenOpportunities.length > 0 && (
              <div>
                <p className="text-text-secondary text-xs font-semibold mb-2">🌱 Green Transport Options:</p>
                <ul className="text-text-secondary text-xs space-y-1">
                  {routeAnalysis.greenOpportunities.slice(0, 3).map((opp, idx) => (
                    <li key={idx}>• {opp}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

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
          <div className="p-4 bg-error-red bg-opacity-10 border border-error-red rounded-lg">
            <p className="text-error-red text-sm">{error}</p>
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
