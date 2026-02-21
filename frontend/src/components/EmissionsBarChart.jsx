/**
 * Emissions Bar Chart Component
 * Displays emissions by supply chain stage
 */

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  Label,
} from 'recharts';
import { formatNumber, formatEmission, getStageColor, getEmissionPercentage } from '../utils/formatting';

/**
 * Custom tooltip for bar chart
 */
function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const percentage = getEmissionPercentage(data.emission, data.totalEmission);
    return (
      <div className="bg-primary-darker border border-accent-emerald rounded-lg p-3 shadow-lg">
        <p className="text-text-primary font-semibold">{data.stage}</p>
        <p className="text-accent-emerald">
          Emission: {formatEmission(data.emission)}
        </p>
        <p className="text-accent-teal">
          Contribution: {percentage}%
        </p>
      </div>
    );
  }
  return null;
}

/**
 * Custom label for showing value on top of bars
 */
function CustomLabel(props) {
  const { x, y, width, value } = props;
  const tCO2e = (value / 1000).toFixed(2);
  
  return (
    <text
      x={x + width / 2}
      y={y - 10}
      fill="#10B981"
      textAnchor="middle"
      fontSize={12}
      fontWeight="bold"
    >
      {tCO2e}
    </text>
  );
}

export function EmissionsBarChart({ nodes = [] }) {
  // Prepare data - group by stage, handle both formats
  const stageMap = {};
  let maxEmission = 0;
  let totalEmission = 0;

  nodes.forEach((node) => {
    // Support both camelCase (from DB) and snake_case (from Python)
    const stage = node.stageName || node.stage_name || node.stage || 'Unknown';
    const emission = node.emission || node.total_emission || 0;
    
    if (!stageMap[stage]) {
      stageMap[stage] = { stage, emission: 0 };
    }
    stageMap[stage].emission += emission;
    totalEmission += emission;
    maxEmission = Math.max(maxEmission, stageMap[stage].emission);
  });

  const chartData = Object.values(stageMap).map((item) => ({
    ...item,
    totalEmission,
  }));

  // Sort by emission descending
  chartData.sort((a, b) => b.emission - a.emission);

  // Highlight highest emission
  const highestStage = chartData.length > 0 ? chartData[0].stage : null;

  return (
    <div className="space-y-6">
      {/* Chart */}
      <div className="card-base">
        <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
          <span>📊</span>
          <span>Emissions by Stage</span>
        </h2>

        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData} margin={{ top: 30, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1F2937"
                vertical={false}
              />
              <XAxis
                dataKey="stage"
                stroke="#94A3B8"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                stroke="#94A3B8"
                tick={{ fontSize: 12 }}
                label={{
                  value: 'tCO2e',
                  angle: -90,
                  position: 'insideLeft',
                  offset: 10,
                  fill: '#94A3B8',
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="emission"
                fill="url(#colorBarGradient)"
                radius={[8, 8, 0, 0]}
                label={<CustomLabel />}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.stage === highestStage ? '#F59E0B' : '#10B981'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center">
            <p className="text-text-secondary">No emission data available</p>
          </div>
        )}
      </div>

      {/* Stage Ranking List */}
      <div className="card-base">
        <h3 className="text-xl font-bold text-text-primary mb-4">Stage Ranking</h3>
        
        <div className="space-y-2">
          {chartData.map((item, index) => {
            const percentage = getEmissionPercentage(item.emission, totalEmission);
            const isHighest = item.stage === highestStage;
            
            return (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                  isHighest
                    ? 'bg-warning-amber bg-opacity-10 border border-warning-amber'
                    : 'bg-primary-darker border border-border-color hover:border-accent-teal'
                }`}
              >
                <div className="flex-1">
                  <p className="text-text-primary font-semibold">{index + 1}. {item.stage}</p>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div>
                    <p className={`font-bold ${isHighest ? 'text-warning-amber' : 'text-accent-emerald'}`}>
                      {formatEmission(item.emission)}
                    </p>
                    <p className="text-text-secondary text-sm">
                      {percentage}% of total
                    </p>
                  </div>
                  {isHighest && (
                    <span className="badge badge-warning">⚠ Highest</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {chartData.length === 0 && (
          <p className="text-text-secondary text-center py-4">
            No supply chain stages added yet
          </p>
        )}
      </div>
    </div>
  );
}

export default EmissionsBarChart;
