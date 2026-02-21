/**
 * Gemini AI-Powered Optimization Panel
 * Displays AI-generated recommendations with regional context (Maharashtra)
 */

import { useState, useEffect } from 'react';
import { formatEmission, formatCurrency } from '../utils/formatting';
import { getOptimisationInsights } from '../services/api';

function GeminiRecommendationCard({ recommendation, index }) {
  const getImplementationColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'low':
        return 'border-success-green bg-success-green bg-opacity-10';
      case 'medium':
        return 'border-warning-amber bg-warning-amber bg-opacity-10';
      case 'high':
        return 'border-error-red bg-error-red bg-opacity-10';
      default:
        return 'border-border-color';
    }
  };

  const getDifficultyBadgeColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'low':
        return '#22C55E';
      case 'medium':
        return '#F59E0B';
      case 'high':
        return '#EF4444';
      default:
        return '#94A3B8';
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      transport: '🚚',
      energy: '⚡',
      network: '🌐',
      packaging: '📦',
      other: '💡',
    };
    return icons[type?.toLowerCase()] || '🔧';
  };

  // Map API response fields to card display fields
  const displayRiskLevel = (recommendation.riskLevel || recommendation.implementationDifficulty || 'medium').toLowerCase();
  const carbonSaved = recommendation.carbonSaved || 0;
  const costSaved = recommendation.costSaved || 0;
  const timeImpactDays = recommendation.timeImpactDays || 0;

  return (
    <div className={`p-5 bg-primary-darker rounded-lg border ${getImplementationColor(displayRiskLevel)} hover:shadow-lg transition-all`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-2xl">🚀</span>
          <div>
            <h4 className="text-text-primary font-bold text-lg">
              {index + 1}. {recommendation.stageName}
            </h4>
            <p className="text-text-secondary text-sm">
              {recommendation.currentTransport || recommendation.currentState} → {recommendation.suggestedTransport || recommendation.suggestedImprovement}
            </p>
          </div>
        </div>
        <span
          className="px-3 py-1 rounded-full text-sm font-semibold text-white"
          style={{ backgroundColor: getDifficultyBadgeColor(displayRiskLevel) }}
        >
          {displayRiskLevel} effort
        </span>
      </div>

      {/* Current State → Suggested Improvement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 p-3 bg-card-bg rounded border border-border-color">
        <div>
          <span className="text-text-secondary text-xs uppercase tracking-wide">Current Transport</span>
          <p className="text-text-primary font-semibold mt-1">{recommendation.currentTransport || 'Current Method'}</p>
        </div>
        <div>
          <span className="text-text-secondary text-xs uppercase tracking-wide">Suggested Transport</span>
          <p className="text-accent-emerald font-semibold mt-1">{recommendation.suggestedTransport || 'Recommended Method'}</p>
        </div>
      </div>

      {/* Impact Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        {/* Carbon Saved */}
        <div className="text-center p-3 bg-success-green bg-opacity-10 rounded border border-success-green">
          <div className="text-success-green font-bold text-xl">
            -{carbonSaved.toLocaleString()}
          </div>
          <div className="text-text-secondary text-xs uppercase tracking-wide mt-1">
            tCO2e Saved
          </div>
        </div>

        {/* Cost Saved */}
        <div className={`text-center p-3 rounded border ${costSaved > 0 ? 'bg-success-green bg-opacity-10 border-success-green' : 'bg-warning-amber bg-opacity-10 border-warning-amber'}`}>
          <div className={`font-bold text-xl ${costSaved > 0 ? 'text-success-green' : 'text-warning-amber'}`}>
            {costSaved > 0 ? '-' : '+'}{formatCurrency(Math.abs(costSaved), 'USD')}
          </div>
          <div className="text-text-secondary text-xs uppercase tracking-wide mt-1">
            Cost {costSaved > 0 ? 'Saved' : 'Impact'}
          </div>
        </div>

        {/* Time Impact */}
        <div className={`text-center p-3 rounded border ${timeImpactDays <= 0 ? 'bg-success-green bg-opacity-10 border-success-green' : 'bg-warning-amber bg-opacity-10 border-warning-amber'}`}>
          <div className={`font-bold text-xl ${timeImpactDays <= 0 ? 'text-success-green' : 'text-warning-amber'}`}>
            {timeImpactDays === 0 ? 'No change' : (timeImpactDays > 0 ? '+' : '') + timeImpactDays + 'd'}
          </div>
          <div className="text-text-secondary text-xs uppercase tracking-wide mt-1">
            Time Impact
          </div>
        </div>
      </div>

      {/* Recommendation Text */}
      <div className="mb-3 p-3 bg-card-bg rounded">
        <span className="text-text-secondary text-xs uppercase tracking-wide block mb-1">Recommendation</span>
        <p className="text-text-primary text-sm">{recommendation.recommendationText || 'Strategic optimization for supply chain efficiency'}</p>
      </div>

      {/* Risk Level Info */}
      <div className="p-3 bg-accent-teal bg-opacity-10 rounded border border-accent-teal">
        <span className="text-accent-teal text-xs uppercase tracking-wide block mb-1">⚠️ Risk Level</span>
        <p className="text-text-primary text-sm capitalize">This optimization has {displayRiskLevel} implementation risk</p>
      </div>
    </div>
  );
}

export function GeminiOptimizationPanel({ optimizations = [], isLoading = false, onRegenerate = null, productId = null }) {
  const [regenerating, setRegenerating] = useState(false);
  const [localOptimizations, setLocalOptimizations] = useState(optimizations);
  const [loading, setLoading] = useState(false);

  // Load optimization insights on component mount
  useEffect(() => {
    const loadOptimizations = async () => {
      setLoading(true);
      try {
        const response = await getOptimisationInsights();
        if (response?.success && response?.data) {
          // Handle both array and single object responses
          const data = Array.isArray(response.data) ? response.data : [response.data];
          setLocalOptimizations(data);
        }
      } catch (error) {
        console.error('Error loading optimizations:', error);
      } finally {
        setLoading(false);
      }
    };

    // Only load if no optimizations passed as prop
    if (!optimizations || optimizations.length === 0) {
      loadOptimizations();
    } else {
      setLocalOptimizations(optimizations);
    }
  }, [optimizations]);

  // Calculate aggregated metrics from local optimizations
  const displayOptimizations = localOptimizations.length > 0 ? localOptimizations : optimizations;
  
  const totalCarbonReduction = displayOptimizations.reduce((sum, opt) => sum + (opt.carbonSaved || opt.carbonReductionPercent || 0), 0);
  const totalCostSavings = displayOptimizations.reduce((sum, opt) => sum + (opt.costSaved || opt.costImpactINR || 0), 0);
  const avgImplementationDifficulty = displayOptimizations.length > 0
    ? Math.round(
        (displayOptimizations.filter(o => (o.riskLevel || o.implementationDifficulty || '').toLowerCase() === 'low').length * 33 +
          displayOptimizations.filter(o => (o.riskLevel || o.implementationDifficulty || '').toLowerCase() === 'medium').length * 66 +
          displayOptimizations.filter(o => (o.riskLevel || o.implementationDifficulty || '').toLowerCase() === 'high').length * 100) / displayOptimizations.length
      )
    : 0;

  const handleRegenerate = async () => {
    if (onRegenerate && !regenerating) {
      setRegenerating(true);
      try {
        await onRegenerate();
      } finally {
        setRegenerating(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Regenerate Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <span>🤖</span>
          <span>AI-Powered Optimization Strategies</span>
        </h2>
        {onRegenerate && displayOptimizations.length > 0 && (
          <button
            onClick={handleRegenerate}
            disabled={regenerating || isLoading}
            className="px-4 py-2 bg-accent-teal text-white rounded-lg font-semibold disabled:opacity-50 transition-all hover:bg-accent-teal-dark"
          >
            {regenerating ? 'Regenerating...' : 'Regenerate'}
          </button>
        )}
      </div>

      {/* Insights Summary */}
      {displayOptimizations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-base border-success-green">
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-text-secondary text-sm uppercase tracking-wide">
                Total Carbon Reduction
              </h4>
              <span className="text-2xl">🌱</span>
            </div>
            <p className="text-3xl font-bold text-success-green">
              -{totalCarbonReduction}%
            </p>
            <p className="text-text-secondary text-xs mt-2">
              tCO2e reduction potential
            </p>
          </div>

          <div className="card-base border-accent-teal">
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-text-secondary text-sm uppercase tracking-wide">
                Annual Cost Impact
              </h4>
              <span className="text-2xl">💰</span>
            </div>
            <p className={`text-3xl font-bold ${totalCostSavings < 0 ? 'text-success-green' : 'text-warning-amber'}`}>
              {totalCostSavings < 0 ? '-' : '+'}{formatCurrency(Math.abs(totalCostSavings), 'INR')}
            </p>
            <p className="text-text-secondary text-xs mt-2">
              {totalCostSavings < 0 ? 'Potential savings' : 'Investment required'}
            </p>
          </div>

          <div className="card-base border-warning-amber">
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-text-secondary text-sm uppercase tracking-wide">
                Implementation Complexity
              </h4>
              <span className="text-2xl">⚙️</span>
            </div>
            <div className="mt-3">
              <div className="w-full bg-primary-darker rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-warning-amber transition-all"
                  style={{ width: `${avgImplementationDifficulty}%` }}
                />
              </div>
              <p className="text-text-secondary text-xs mt-2">
                {avgImplementationDifficulty < 40 ? 'Low' : avgImplementationDifficulty < 70 ? 'Medium' : 'High'} complexity
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations List */}
      <div className="card-base">
        {loading || isLoading ? (
          <div className="py-12 text-center">
            <p className="text-text-secondary text-lg mb-2">🤔 Loading optimization insights...</p>
            <p className="text-text-secondary text-sm">Fetching recommendations from the optimization engine</p>
          </div>
        ) : displayOptimizations.length > 0 ? (
          <div className="space-y-4">
            {displayOptimizations.map((recommendation, index) => (
              <GeminiRecommendationCard
                key={recommendation._id || index}
                recommendation={recommendation}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-text-secondary text-lg mb-2">✨ No optimizations generated yet</p>
            <p className="text-text-secondary text-sm mb-4">
              Run an analysis to generate optimization recommendations for your supply chain
            </p>
          </div>
        )}
      </div>

      {/* Implementation Notes */}
      {displayOptimizations.length > 0 && (
        <div className="card-base border-accent-teal bg-opacity-5">
          <h3 className="text-lg font-bold text-accent-teal mb-3 flex items-center gap-2">
            <span>💡</span>
            <span>Implementation Notes</span>
          </h3>
          <ul className="space-y-2 text-text-primary text-sm">
            <li className="flex gap-2">
              <span className="text-accent-emerald">✓</span>
              <span>These recommendations are generated by the backend optimization engine</span>
            </li>
            <li className="flex gap-2">
              <span className="text-accent-emerald">✓</span>
              <span>Each recommendation shows potential carbon emissions reduction and cost savings</span>
            </li>
            <li className="flex gap-2">
              <span className="text-accent-emerald">✓</span>
              <span>Risk levels indicate implementation complexity (low, medium, high)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-accent-emerald">✓</span>
              <span>Implement high-impact, low-risk recommendations first for maximum ROI</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default GeminiOptimizationPanel;
