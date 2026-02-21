/**
 * Dashboard Component
 * Main dashboard displaying all CarbonChain Pro metrics and analytics
 */
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { useState, useEffect } from 'react';
import Header from './Header';
import SummaryCard from './SummaryCard';
import EmissionsBarChart from './EmissionsBarChart';
import EmissionPieChart from './EmissionPieChart';
import ForecastTrend from './ForecastTrend';
import GeminiOptimizationPanel from './GeminiOptimizationPanel';
import { formatEmission, getAlignmentColor } from '../utils/formatting';
import OptimizationPanel from './OptimizationPanel';

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
    nodesBreakdown: [],
  });

   const forecastData = [
  { month: 'Jan', actual: 5200, forecast: 5200 },
  { month: 'Feb', actual: 4980, forecast: 4980 },
  { month: 'Mar', actual: 5100, forecast: 5100 },
  { month: 'Apr', actual: null, forecast: 4950 },
  { month: 'May', actual: null, forecast: 4720 },
  { month: 'Jun', actual: null, forecast: 4480 },
];

  useEffect(() => {
    if (analysisResult?.data) {
      // Ensure proper defaults for all fields
      const data = analysisResult.data;
      setDashboardData({
        totalEmission: data.totalEmission || 0,
        highestEmissionStage: data.highestEmissionStage || 'N/A',
        carbonEfficiencyScore: parseFloat(data.carbonEfficiencyScore) || 0,
        costEfficiencyScore: parseFloat(data.costEfficiencyScore) || 0,
        timeEfficiencyScore: parseFloat(data.timeEfficiencyScore) || 0,
        netZeroAlignmentPercentage: parseFloat(data.netZeroAlignmentPercentage) || 0,
        nodesBreakdown: data.nodesBreakdown || [],
      });
      console.log('✓ Dashboard data updated:', data);
    } else if (analysisResult?.success && !analysisResult?.data) {
      // No analysis yet - show defaults
      console.log('ℹ No analysis data yet, showing defaults');
      setDashboardData({
        totalEmission: 0,
        highestEmissionStage: 'N/A',
        carbonEfficiencyScore: 0,
        costEfficiencyScore: 0,
        timeEfficiencyScore: 0,
        netZeroAlignmentPercentage: 0,
      });
    }
  }, [analysisResult]);

  const getAlignmentBadge = (alignment) => {
    const value = parseFloat(alignment) || 0;
    if (value >= 80)
      return { text: 'ON TRACK', color: 'badge-success', bgColor: 'bg-success-green' };
    if (value >= 50)
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

        {!loading && product && (
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
                value={dashboardData.totalEmission || 0}
                unit="tCO2e"
                icon="🌍"
              />

              <SummaryCard
                title="Highest Emission Stage"
                value={dashboardData.highestEmissionStage || 'N/A'}
                icon="⚠"
                isHighestEmission={true}
              />

              <SummaryCard
                title="Carbon Efficiency"
                value={dashboardData.carbonEfficiencyScore || "72"}
                unit="/100"
                icon="🌱"
              />

              <SummaryCard
                title="Cost Efficiency"
                value={dashboardData.costEfficiencyScore || 85}
                unit="/100"
                icon="💰"
              />

              <SummaryCard
                title="Net-Zero Alignment"
                value={dashboardData.netZeroAlignmentPercentage || 0}
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
                  <EmissionsBarChart nodes={dashboardData.nodesBreakdown || analysisResult?.data?.nodesBreakdown || nodes} />
                </div>

                {/* Emission Breakdown Pie */}
                <div>
                  <EmissionPieChart nodes={dashboardData.nodesBreakdown || analysisResult?.data?.nodesBreakdown || nodes} />
                </div>
              </div>

              {/* Forecast Trend */}
              {/* <ForecastTrend
                totalEmission={dashboardData.totalEmission || 0}
                targetEmission={product.yearlyNetZeroTarget}
              /> */}

              <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={forecastData} margin={{ top: 12, right: 12, left: 0, bottom: 8 }}>
              <defs>
                <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0d9488" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#0d9488" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#64748b" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#64748b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} unit=" tCO₂e" />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                formatter={(value) => (value != null ? [`${value} tCO₂e`, ''] : null)}
              />
              <Area type="monotone" dataKey="actual" stroke="#0d9488" fill="url(#actualGrad)" strokeWidth={2} name="Actual" />
              <Line type="monotone" dataKey="forecast" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} name="Forecast" dot={{ r: 3 }} connectNulls />
            </AreaChart>
          </ResponsiveContainer>

              {/* AI-Powered Optimization Recommendations */}
              {/* <GeminiOptimizationPanel
                isLoading={loading}
              /> */}
              <OptimizationPanel
              optimizations={optimizations}
              hasOptimizations={true}/>
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
                  <p className="text-text-primary font-semibold">{nodes?.length || 0} nodes</p>
                </div>
                <div className="text-center">
                  <p className="text-text-secondary text-sm mb-2">AI Recommendations</p>
                  <p className="text-text-primary font-semibold">{optimizations?.length || 0} available</p>
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
