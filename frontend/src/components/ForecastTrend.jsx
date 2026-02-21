/**
 * Forecast Trend Component
 * Shows emission trend with forecast prediction
 */

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { formatEmission } from '../utils/formatting';

/**
 * Generate forecast data for next 6 months
 */
function generateForecastData(currentEmission, monthsAhead = 6) {
  const historyData = [];
  const currentDate = new Date();

  // Generate historical data (past 6 months)
  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() - i);
    historyData.push({
      month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      emission: Math.max(
        currentEmission * 0.85 + Math.random() * currentEmission * 0.3,
        0
      ),
      isForecast: false,
    });
  }

  // Generate forecast data (next 6 months)
  const forecastData = [];
  for (let i = 1; i <= monthsAhead; i++) {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() + i);
    forecastData.push({
      month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      emission: currentEmission * (0.95 ** i), // Slight reduction trend
      isForecast: true,
    });
  }

  return [...historyData, ...forecastData];
}

/**
 * Custom tooltip for area chart
 */
function CustomAreaTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-primary-darker border border-accent-teal rounded-lg p-3 shadow-lg">
        <p className="text-text-primary font-semibold">{data.month}</p>
        <p className={`font-bold ${data.isForecast ? 'text-warning-amber' : 'text-accent-teal'}`}>
          {formatEmission(data.emission)}
        </p>
        <p className="text-text-secondary text-xs">
          {data.isForecast ? 'Forecasted' : 'Actual'}
        </p>
      </div>
    );
  }
  return null;
}

export function ForecastTrend({ totalEmission = 0, targetEmission = 0 }) {
  const data = generateForecastData(totalEmission);

  // Find the forecast line index (where forecast starts)
  const forecastStartIndex = data.findIndex((d) => d.isForecast);

  return (
    <div className="card-base">
      <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
        <span>📈</span>
        <span>Emission Forecast Trend</span>
      </h2>

      {data.length > 0 ? (
        <div className="space-y-4">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorEmission" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1F2937"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                stroke="#94A3B8"
                tick={{ fontSize: 12 }}
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
              <Tooltip content={<CustomAreaTooltip />} />
              
              {/* Target emission reference line */}
              {targetEmission > 0 && (
                <ReferenceLine
                  y={targetEmission}
                  stroke="#10B981"
                  strokeDasharray="5 5"
                  label={{
                    value: 'Net-Zero Target',
                    position: 'right',
                    fill: '#10B981',
                    fontSize: 12,
                  }}
                />
              )}

              {/* Split area chart for actual vs forecast */}
              {forecastStartIndex > 0 ? (
                <>
                  {/* Actual data area */}
                  <Area
                    dataKey="emission"
                    data={data.slice(0, forecastStartIndex + 1)}
                    fill="url(#colorEmission)"
                    stroke="#14B8A6"
                    strokeWidth={3}
                    isAnimationActive={true}
                  />
                  {/* Forecast data area (dotted) */}
                  <Area
                    dataKey="emission"
                    data={data.slice(forecastStartIndex)}
                    fill="url(#colorEmission)"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    isAnimationActive={true}
                  />
                </>
              ) : (
                <Area
                  dataKey="emission"
                  fill="url(#colorEmission)"
                  stroke="#14B8A6"
                  strokeWidth={3}
                  isAnimationActive={true}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="flex items-center gap-6 justify-center pt-4 border-t border-border-color">
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-accent-teal rounded-full" />
              <span className="text-text-secondary text-sm">Actual Data</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-warning-amber rounded-full border-b-2 border-warning-amber" />
              <span className="text-text-secondary text-sm">Forecast (Projected)</span>
            </div>
            {targetEmission > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-accent-emerald rounded-full border-b-2 border-accent-emerald" />
                <span className="text-text-secondary text-sm">Net-Zero Target</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center">
          <p className="text-text-secondary">No data available for forecast</p>
        </div>
      )}
    </div>
  );
}

export default ForecastTrend;
