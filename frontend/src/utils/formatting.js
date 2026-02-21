/**
 * Utility functions for CarbonChain Pro
 */

/**
 * Format number with comma separators
 * @param {Number} num - Number to format
 * @param {Number} decimals - Number of decimal places
 */
export const formatNumber = (num, decimals = 2) => {
  if (!num) return '0.00';
  return Number(num).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * Format emission value with unit
 * @param {Number} emission - Emission value in kg
 * @returns {String} Formatted emission with unit
 */
export const formatEmission = (emission) => {
  if (!emission) return '0.00 tCO2e';
  const tCO2e = emission / 1000; // Convert kg to tCO2e
  return `${formatNumber(tCO2e, 2)} tCO2e`;
};

/**
 * Get color based on net-zero alignment
 * @param {Number} alignment - Alignment percentage
 * @returns {String} Color class
 */
export const getAlignmentColor = (alignment) => {
  if (alignment >= 80) return 'text-success-green';
  if (alignment >= 50) return 'text-warning-amber';
  return 'text-danger-red';
};

export const getAlignmentBgColor = (alignment) => {
  if (alignment >= 80) return 'bg-success-green';
  if (alignment >= 50) return 'bg-warning-amber';
  return 'bg-danger-red';
};

/**
 * Get badge style based on value
 * @param {Number} value - Value to evaluate
 * @param {Number} threshold - Threshold value
 */
export const getBadgeStyle = (value, threshold = 50) => {
  if (value >= threshold) return 'badge-success';
  if (value >= threshold * 0.7) return 'badge-warning';
  return 'badge-danger';
};

/**
 * Calculate efficiency score category
 * @param {Number} score - Score 0-100
 */
export const getEfficiencyCategory = (score) => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Needs Improvement';
};

/**
 * Calculate time impact label
 * @param {Number} days - Number of days
 */
export const getTimeImpactLabel = (days) => {
  if (days === 0) return 'No time change';
  if (days > 0) return `+${days} days delay`;
  return `${days} days faster`;
};

/**
 * Format currency
 * @param {Number} amount - Money amount
 * @param {String} currency - Currency code (default: USD)
 */
export const formatCurrency = (amount, currency = 'USD') => {
  if (!amount) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Calculate percentage change
 * @param {Number} current - Current value
 * @param {Number} target - Target value
 */
export const calculatePercentageChange = (current, target) => {
  if (target === 0) return 0;
  return ((target - current) / Math.abs(target)) * 100;
};

/**
 * Get stage color for charts
 * @param {String} stage - Stage name
 */
export const getStageColor = (stage) => {
  const colors = {
    'Raw Materials': '#10B981',
    'Manufacturing': '#14B8A6',
    'Logistics': '#06B6D4',
    'Packaging': '#8B5CF6',
    'Distribution': '#EC4899',
    'End-of-Life': '#F59E0B',
  };
  return colors[stage] || '#10B981';
};

/**
 * Format date
 * @param {Date} date - Date to format
 */
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format datetime
 * @param {Date} date - Date to format
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Get emission stage breakdown
 * @param {Array} nodes - Supply chain nodes
 */
export const getEmissionBreakdown = (nodes) => {
  const breakdown = {};
  
  nodes.forEach((node) => {
    if (!breakdown[node.stageName]) {
      breakdown[node.stageName] = {
        stage: node.stageName,
        emissions: 0,
        count: 0,
      };
    }
    breakdown[node.stageName].emissions += node.emission || 0;
    breakdown[node.stageName].count += 1;
  });

  return Object.values(breakdown).sort((a, b) => b.emissions - a.emissions);
};

/**
 * Calculate total emissions
 * @param {Array} nodes - Supply chain nodes
 */
export const calculateTotalEmissions = (nodes) => {
  return nodes.reduce((sum, node) => sum + (node.emission || 0), 0);
};

/**
 * Get emission percentage
 * @param {Number} emission - Emission value
 * @param {Number} total - Total emission
 */
export const getEmissionPercentage = (emission, total) => {
  if (total === 0) return 0;
  return ((emission / total) * 100).toFixed(1);
};

/**
 * Get recommendation risk color
 * @param {String} riskLevel - Risk level (low, medium, high)
 */
export const getRiskColor = (riskLevel) => {
  switch (riskLevel) {
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

/**
 * Validate MongoDB ObjectId
 * @param {String} id - ID to validate
 */
export const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

export default {
  formatNumber,
  formatEmission,
  getAlignmentColor,
  getAlignmentBgColor,
  getBadgeStyle,
  getEfficiencyCategory,
  getTimeImpactLabel,
  formatCurrency,
  calculatePercentageChange,
  getStageColor,
  formatDate,
  formatDateTime,
  getEmissionBreakdown,
  calculateTotalEmissions,
  getEmissionPercentage,
  getRiskColor,
  isValidObjectId,
};
