/**
 * Dashboard Component
 * Main dashboard displaying all CarbonChain Pro metrics and analytics
 */

import { useState, useEffect } from 'react';
import Header from './Header';
import SummaryCard from './SummaryCard';
import EmissionsBarChart from './EmissionsBarChart';
import EmissionPieChart from './EmissionPieChart';
import ForecastTrend from './ForecastTrend';
import OptimizationPanel from './OptimizationPanel';
import { formatEmission, getAlignmentColor } from '../utils/formatting';

export function Dashboard({ 
  product = null, 
  analysisResult = null, 
  nodes = [],
  optimizations = [],
  loading = false,
}) {
  const [dashboardData, setDashboardData] = useState({
    totalEmission: 0,
    highestEmissionStage: 'N/A',
    carbonEfficiencyScore: 0,
    costEfficiencyScore: 0,
    timeEfficiencyScore: 0,
    netZeroAlignmentPercentage: 0,
  });

  useEffect(() => {
    if (analysisResult?.data) {
      setDashboardData(analysisResult.data);
    }
  }, [analysisResult]);

  const getAlignmentBadge = (alignment) => {
    if (alignment >= 80)
      return { text: 'ON TRACK', color: 'badge-success', bgColor: 'bg-success-green' };
    if (alignment >= 50)
      return { text: 'AT RISK', color: 'badge-warning', bgColor: 'bg-warning-amber' };
    return { text: 'CRITICAL', color: 'badge-danger', bgColor: 'bg-danger-red' };
  };

  const alignmentBadge = getAlignmentBadge(dashboardData.netZeroAlignmentPercentage);

  return (
    <div className="min-h-screen bg-gradient-hero py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Header />

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin">
              <div className="h-12 w-12 border-4 border-accent-emerald border-r-transparent rounded-full" />
            </div>
            <span className="ml-4 text-text-primary">Analyzing your supply chain...</span>
          </div>
        )}

        {!loading && product && analysisResult && (
          <>
            {/* Product Info Banner */}
            <div className="mb-8 card-base border-accent-teal">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-2">{product.name}</h2>
                  <p className="text-text-secondary">
                    Net-Zero Target: {formatEmission(product.yearlyNetZeroTarget)} annually
                  </p>
                </div>
                <div className={`text-right`}>
                  <p className="text-sm text-text-secondary uppercase tracking-wide mb-2">
                    Net-Zero Status
                  </p>
                  <span
                    className={`px-4 py-2 rounded-full font-bold text-white ${alignmentBadge.bgColor}`}
                  >
                    {alignmentBadge.text}
                  </span>
                </div>
              </div>
            </div>

            {/* Summary Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <SummaryCard
                title="Total Emissions"
                value={dashboardData.totalEmission}
                unit="tCO2e"
                icon="🌍"
              />

              <SummaryCard
                title="Highest Emission Stage"
                value={dashboardData.highestEmissionStage}
                icon="⚠"
                isHighestEmission={true}
              />

              <SummaryCard
                title="Carbon Efficiency"
                value={dashboardData.carbonEfficiencyScore}
                unit="/100"
                icon="🌱"
              />

              <SummaryCard
                title="Cost Efficiency"
                value={dashboardData.costEfficiencyScore}
                unit="/100"
                icon="💰"
              />

              <SummaryCard
                title="Net-Zero Alignment"
                value={dashboardData.netZeroAlignmentPercentage}
                unit="%"
                icon="🎯"
                isAlignment={true}
              />
            </div>

            {/* Charts Section */}
            <div className="space-y-8">
              {/* Bar Chart and Pie Chart Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Emissions By Stage */}
                <div>
                  <EmissionsBarChart nodes={nodes} />
                </div>

                {/* Emission Breakdown Pie */}
                <div>
                  <EmissionPieChart nodes={analysisResult?.data?.nodesBreakdown || nodes} />
                </div>
              </div>

              {/* Forecast Trend */}
              <ForecastTrend
                totalEmission={dashboardData.totalEmission}
                targetEmission={product.yearlyNetZeroTarget}
              />

              {/* Optimization Recommendations */}
              <OptimizationPanel
                optimizations={optimizations}
                hasOptimizations={true}
              />
            </div>

            {/* Footer Information */}
            <div className="mt-12 py-8 border-t border-border-color">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-text-secondary text-sm mb-2">Analysis Date</p>
                  <p className="text-text-primary font-semibold">
                    {new Date().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-text-secondary text-sm mb-2">Supply Chain Stages</p>
                  <p className="text-text-primary font-semibold">{nodes.length} nodes</p>
                </div>
                <div className="text-center">
                  <p className="text-text-secondary text-sm mb-2">Optimization Opportunities</p>
                  <p className="text-text-primary font-semibold">{optimizations.length} strategies</p>
                </div>
              </div>
            </div>
          </>
        )}

        {!loading && !product && (
          <div className="py-16 text-center">
            <p className="text-text-secondary text-xl mb-4">
              No product selected for analysis
            </p>
            <p className="text-text-secondary mb-6">
              Create or select a product to get started with emission analysis
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
