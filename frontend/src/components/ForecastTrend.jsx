/**
 * Forecast Trend Component
 * Shows emission trend with forecast prediction
 */

import { useState } from 'react';
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
 * Generate hourly forecast data (past 12 hours, next 12 hours)
 */
function generateHourlyForecastData(currentEmission) {
  const historyData = [];
  const forecastData = [];
  const currentDate = new Date();
  // Use a reasonable baseline for demo if no emission data exists
  const baseEmission = Math.max(currentEmission || 50, 50);

  // Past 12 hours
  for (let i = 11; i >= 0; i--) {
    const date = new Date(currentDate);
    date.setHours(date.getHours() - i);
    const trend = 1 + (i * 0.02);
    historyData.push({
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      emission: Math.max(baseEmission / 30 * trend, 0),
      isForecast: false,
    });
  }

  // Next 12 hours
  for (let i = 1; i <= 12; i++) {
    const date = new Date(currentDate);
    date.setHours(date.getHours() + i);
    const reductionFactor = Math.pow(0.98, i);
    forecastData.push({
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      emission: Math.max(baseEmission / 30 * reductionFactor, 0),
      isForecast: true,
    });
  }

  return [...historyData, ...forecastData];
}

/**
 * Generate daily forecast data (past 30 days, next 30 days)
 */
function generateDailyForecastData(currentEmission) {
  const historyData = [];
  const forecastData = [];
  const currentDate = new Date();
  // Use a reasonable baseline for demo if no emission data exists
  const baseEmission = Math.max(currentEmission || 50, 50);

  // Past 30 days
  for (let i = 29; i >= 0; i--) {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - i);
    const trend = 1 + (i * 0.01);
    historyData.push({
      day: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      emission: Math.max(baseEmission / 2 * trend, 0),
      isForecast: false,
    });
  }

  // Next 30 days
  for (let i = 1; i <= 30; i++) {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + i);
    const reductionFactor = Math.pow(0.97, i / 10);
    forecastData.push({
      day: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      emission: Math.max(baseEmission / 2 * reductionFactor, 0),
      isForecast: true,
    });
  }

  return [...historyData, ...forecastData];
}

/**
 * Generate monthly forecast data (past 12 months, next 6 months)
 */
function generateMonthlyForecastData(currentEmission) {
  const historyData = [];
  const forecastData = [];
  const currentDate = new Date();
  // Use a reasonable baseline for demo if no emission data exists
  const baseEmission = Math.max(currentEmission || 50, 50);

  // Past 12 months
  for (let i = 11; i >= 0; i--) {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() - i);
    const trend = 1 + (i * 0.05);
    historyData.push({
      month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      emission: Math.max(baseEmission * trend, 0),
      isForecast: false,
    });
  }

  // Next 6 months
  for (let i = 1; i <= 6; i++) {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() + i);
    const reductionFactor = Math.pow(0.97, i);
    forecastData.push({
      month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      emission: Math.max(baseEmission * reductionFactor, 0),
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
  const [timePeriod, setTimePeriod] = useState('monthly'); // hourly, daily, monthly

  // Generate data based on selected time period
  let data;
  let dataKeyName;
  
  switch (timePeriod) {
    case 'hourly':
      data = generateHourlyForecastData(totalEmission);
      dataKeyName = 'time';
      break;
    case 'daily':
      data = generateDailyForecastData(totalEmission);
      dataKeyName = 'day';
      break;
    case 'monthly':
    default:
      data = generateMonthlyForecastData(totalEmission);
      dataKeyName = 'month';
      break;
  }

  // Find the forecast line index (where forecast starts)
  const forecastStartIndex = data.findIndex((d) => d.isForecast);

  const periodLabels = {
    hourly: { label: 'Hourly', key: 'time', period: '12 hours history | 12 hours forecast' },
    daily: { label: 'Daily', key: 'day', period: '30 days history | 30 days forecast' },
    monthly: { label: 'Monthly', key: 'month', period: '12 months history | 6 months forecast' },
  };

  return (
    <div className="card-base">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <span>📈</span>
          <span>Emission Forecast Trend</span>
        </h2>
      </div>

      {/* Time Period Toggle Buttons */}
      <div className="flex gap-3 mb-6">
        {['hourly', 'daily', 'monthly'].map((period) => (
          <button
            key={period}
            onClick={() => setTimePeriod(period)}
            className={`px-5 py-2 rounded-lg font-semibold transition-all ${
              timePeriod === period
                ? 'bg-accent-emerald text-white shadow-lg'
                : 'bg-primary-darker text-text-primary border border-border-color hover:border-accent-emerald'
            }`}
          >
            {periodLabels[period].label}
          </button>
        ))}
      </div>

      {/* Period Info */}
      <div className="text-xs text-text-secondary mb-4 px-3 py-2 bg-primary-darker rounded-lg">
        {periodLabels[timePeriod].period}
      </div>

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
                dataKey={dataKeyName}
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
