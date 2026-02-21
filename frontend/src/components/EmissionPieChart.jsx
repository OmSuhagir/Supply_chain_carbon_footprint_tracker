/**
 * Emission Pie Chart Component
 * Shows emission breakdown by stage as pie chart
 */

import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatEmission, getStageColor, getEmissionPercentage } from '../utils/formatting';

/**
 * Custom tooltip for pie chart
 */
function CustomPieTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0];
    const percent = data.percent ? (data.percent * 100).toFixed(1) : '0';
    return (
      <div className="bg-primary-darker border border-accent-emerald rounded-lg p-3 shadow-lg">
        <p className="text-text-primary font-semibold">{data.payload?.stage || 'Unknown'}</p>
        <p className="text-accent-emerald">
          {formatEmission(data.value || 0)}
        </p>
        <p className="text-accent-teal">
          {percent}% of total
        </p>
      </div>
    );
  }
  return null;
}

/**
 * Custom label renderer for pie chart
 */
function renderCustomLabel(entry) {
  return `${(entry.percent * 100).toFixed(0)}%`;
}

export function EmissionPieChart({ nodes = [] }) {
  // Prepare data - group by stage, handle both stageName/emission and stage_name/total_emission
  const stageMap = {};
  let totalEmission = 0;

  nodes.forEach((node) => {
    // Support both camelCase (from DB nodes) and snake_case (from Python breakdown)
    const stage = node.stageName || node.stage_name || node.stage || 'Unknown';
    const emission = node.emission || node.total_emission || 0;
    
    if (!stageMap[stage]) {
      stageMap[stage] = { stage, value: 0 };
    }
    stageMap[stage].value += emission;
    totalEmission += emission;
  });

  const chartData = Object.values(stageMap).map((item) => ({
    ...item,
    fill: getStageColor(item.stage),
  }));

  return (
    <div className="card-base">
      <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
        <span>🥧</span>
        <span>Emission Breakdown</span>
      </h2>

      <div className="space-y-8">
        {chartData.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Pie Chart */}
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={100}
                  fill="#10B981"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Legend with values */}
            <div className="space-y-3">
              {chartData.map((item, index) => {
                const percentage = getEmissionPercentage(item.value, totalEmission);
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-primary-darker rounded-lg">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.fill }}
                      />
                      <p className="text-text-primary font-medium">{item.stage}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-text-primary font-semibold text-sm">
                        {formatEmission(item.value)}
                      </p>
                      <p className="text-text-secondary text-xs">
                        {percentage}%
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center">
            <p className="text-text-secondary">No emission data available</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmissionPieChart;
