/**
 * Optimization Panel Component
 * Displays optimization recommendations with carbon/cost/time tradeoffs
 */

import { formatEmission, formatCurrency, getTimeImpactLabel, getRiskColor } from '../utils/formatting';

function RecommendationRow({ recommendation, index }) {
  return (
    <div className="p-4 bg-primary-darker rounded-lg border border-border-color hover:border-accent-teal transition-all cursor-pointer group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="text-text-primary font-semibold text-lg mb-1">
            {index + 1}. {recommendation.suggestedTransport || 'Optimization Strategy'}
          </h4>
          <p className="text-text-secondary text-sm">
            {recommendation.recommendationText || 'Switch mode of transport for efficiency'}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium text-white`}
          style={{ backgroundColor: getRiskColor(recommendation.riskLevel || 'medium') }}
        >
          {recommendation.riskLevel || 'medium'} risk
        </span>
      </div>

      {/* Tradeoff metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-border-color">
        {/* Carbon savings */}
        <div className="text-center">
          <div className="text-success-green font-bold text-lg">
            {recommendation.carbonSaved ? '-' : '~'}{Math.abs(recommendation.carbonSaved || 0) / 1000 > 0.01 ? `${(Math.abs(recommendation.carbonSaved || 0) / 1000).toFixed(1)} tCO2e` : 'Minimal'}
          </div>
          <div className="text-text-secondary text-xs uppercase tracking-wide">
            Carbon Saved
          </div>
        </div>

        {/* Cost impact */}
        <div className="text-center">
          <div className={`font-bold text-lg ${recommendation.costSaved > 0 ? 'text-success-green' : 'text-warning-amber'}`}>
            {recommendation.costSaved > 0 ? '-' : '+'}{formatCurrency(Math.abs(recommendation.costSaved || 0))}
          </div>
          <div className="text-text-secondary text-xs uppercase tracking-wide">
            Cost {recommendation.costSaved > 0 ? 'Saved' : 'Impact'}
          </div>
        </div>

        {/* Time impact */}
        <div className="text-center">
          <div className={`font-bold text-lg ${recommendation.timeImpactDays < 0 ? 'text-success-green' : 'text-warning-amber'}`}>
            {recommendation.timeImpactDays > 0 ? '+' : ''}{recommendation.timeImpactDays || 0}d
          </div>
          <div className="text-text-secondary text-xs uppercase tracking-wide">
            Time Impact
          </div>
        </div>

        {/* Business risk */}
        <div className="text-center">
          <div className="text-warning-amber font-bold text-sm">
            {recommendation.riskLevel === 'high' ? '⚠' : recommendation.riskLevel === 'medium' ? '⚡' : '✓'}
          </div>
          <div className="text-text-secondary text-xs uppercase tracking-wide">
            Risk Level
          </div>
        </div>
      </div>

      {/* Current vs suggested */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 pt-4 border-t border-border-color">
        <div className="bg-card-bg rounded p-2">
          <span className="text-text-secondary text-xs">Current</span>
          <p className="text-text-primary font-semibold">{recommendation.currentTransport || 'N/A'}</p>
        </div>
        <div className="bg-card-bg rounded p-2">
          <span className="text-text-secondary text-xs">Suggested</span>
          <p className="text-accent-emerald font-semibold">{recommendation.suggestedTransport || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
}

export function OptimizationPanel({ optimizations = [], hasOptimizations = false }) {
  // Sort by carbon savings descending
  const sortedOptimizations = [...optimizations].sort(
    (a, b) => (b.carbonSaved || 0) - (a.carbonSaved || 0)
  );

  // Calculate total potential savings
  const totalCarbonSavings = sortedOptimizations.reduce((sum, opt) => sum + (opt.carbonSaved || 0), 0);
  const totalCostSavings = sortedOptimizations.reduce((sum, opt) => sum + (opt.costSaved || 0), 0);

  return (
    <div className="space-y-6">
      {/* Savings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-base border-accent-emerald">
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-text-secondary text-sm uppercase tracking-wide">
              Carbon Reduction Potential
            </h4>
            <span className="text-2xl">🌱</span>
          </div>
          <p className="text-3xl font-bold text-success-green">
            {(totalCarbonSavings / 1000).toFixed(2)} tCO2e
          </p>
          <p className="text-text-secondary text-xs mt-2">
            {sortedOptimizations.length} optimization{sortedOptimizations.length !== 1 ? 's' : ''} available
          </p>
        </div>

        <div className="card-base border-accent-teal">
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-text-secondary text-sm uppercase tracking-wide">
              Financial Savings
            </h4>
            <span className="text-2xl">💰</span>
          </div>
          <p className="text-3xl font-bold text-accent-teal">
            {formatCurrency(totalCostSavings)}
          </p>
          <p className="text-text-secondary text-xs mt-2">
            Cumulative cost impact
          </p>
        </div>

        <div className="card-base border-warning-amber">
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-text-secondary text-sm uppercase tracking-wide">
              Implementation Status
            </h4>
            <span className="text-2xl">📋</span>
          </div>
          <p className="text-3xl font-bold text-warning-amber">
            {sortedOptimizations.length}
          </p>
          <p className="text-text-secondary text-xs mt-2">
            Ready to evaluate
          </p>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="card-base">
        <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
          <span>💡</span>
          <span>Optimization Strategies</span>
        </h2>

        {sortedOptimizations.length > 0 ? (
          <div className="space-y-4">
            {sortedOptimizations.map((recommendation, index) => (
              <RecommendationRow
                key={index}
                recommendation={recommendation}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            {hasOptimizations ? (
              <>
                <p className="text-text-secondary text-lg mb-2">Loading optimization recommendations...</p>
                <p className="text-text-secondary text-sm">This may take a moment as we analyze your supply chain</p>
              </>
            ) : (
              <>
                <p className="text-text-secondary text-lg mb-2">No optimizations available yet</p>
                <p className="text-text-secondary text-sm">Add supply chain nodes and run analysis to generate recommendations</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Implementation Guide */}
      {sortedOptimizations.length > 0 && (
        <div className="card-base border-accent-teal bg-opacity-5">
          <h3 className="text-lg font-bold text-accent-teal mb-4 flex items-center gap-2">
            <span>🎯</span>
            <span>Implementation Guide</span>
          </h3>
          <ul className="space-y-3">
            <li className="flex gap-3 text-text-primary">
              <span className="text-accent-emerald font-bold">1.</span>
              <span>Review each recommendation and its tradeoffs (carbon vs cost vs time)</span>
            </li>
            <li className="flex gap-3 text-text-primary">
              <span className="text-accent-emerald font-bold">2.</span>
              <span>Assess business impact - prioritize based on your net-zero roadmap</span>
            </li>
            <li className="flex gap-3 text-text-primary">
              <span className="text-accent-emerald font-bold">3.</span>
              <span>For high-risk items, consider hybrid strategies (partial mode change)</span>
            </li>
            <li className="flex gap-3 text-text-primary">
              <span className="text-accent-emerald font-bold">4.</span>
              <span>Track implementation progress and monitor emission reductions</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default OptimizationPanel;
