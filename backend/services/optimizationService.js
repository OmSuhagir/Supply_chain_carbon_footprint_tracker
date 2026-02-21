const axios = require('axios');
const { SupplyChainNode, OptimizationInsight } = require('../models/schemas');

/**
 * Service to generate optimization recommendations
 */
const generateOptimizations = async (productId) => {
  try {
    // Fetch all supply chain nodes
    const nodes = await SupplyChainNode.find({ productId });

    if (nodes.length === 0) {
      return { success: true, data: [] };
    }

    const optimizations = [];

    // Generate optimization recommendations for each high-emission node
    for (const node of nodes) {
      // Skip if this is already an efficient mode
      if (node.transportMode === 'ship' || node.transportMode === 'rail') {
        continue;
      }

      // Suggest more efficient transport modes
      const suggestions = getTransportModesuggestions(node);
      
      for (const suggestion of suggestions) {
        const insight = new OptimizationInsight({
          productId,
          stageName: node.stageName,
          currentTransport: node.transportMode,
          suggestedTransport: suggestion.mode,
          carbonSaved: suggestion.carbonSaved,
          costSaved: suggestion.costSaved,
          timeImpactDays: suggestion.timeImpact,
          riskLevel: suggestion.riskLevel,
          recommendationText: suggestion.text,
        });

        await insight.save();
        optimizations.push({
          stageName: node.stageName,
          currentTransport: node.transportMode,
          suggestedTransport: suggestion.mode,
          carbonSaved: suggestion.carbonSaved,
          costSaved: suggestion.costSaved,
          timeImpactDays: suggestion.timeImpact,
          riskLevel: suggestion.riskLevel,
          recommendationText: suggestion.text,
        });
      }
    }

    return {
      success: true,
      data: optimizations,
      count: optimizations.length,
    };
  } catch (error) {
    console.error('Optimization generation error:', error);
    throw new Error(`Optimization generation failed: ${error.message}`);
  }
};

/**
 * Suggest better transport modes with estimated savings
 */
function getTransportModesuggestions(node) {
  const currentMode = node.transportMode.toLowerCase();
  const distance = node.distanceKm || 0;
  const currentCost = node.transportCost || 0;
  const currentTime = node.transportTimeDays || 0;

  // Emission factors per km (kg CO2e/km)
  const factors = {
    truck: 0.12,
    rail: 0.04,
    ship: 0.02,
    air: 0.5,
  };

  // Cost factors ($)
  const costFactors = {
    truck: 1.5, // $1.5/km
    rail: 1.1,  // $1.1/km
    ship: 0.8,  // $0.8/km
    air: 3.0,   // $3/km
  };

  // Time factors (days)
  const timeFactors = {
    truck: distance / 80,      // ~80 km/day
    rail: distance / 100,      // ~100 km/day
    ship: 7 + distance / 500,  // 7 days + travel
    air: 1,                    // ~1 day
  };

  const suggestions = [];

  for (const [mode, factor] of Object.entries(factors)) {
    if (mode === currentMode) continue;

    // Only suggest feasible alternatives
    if (mode === 'air' && distance > 10000) continue; // Air not feasible for very long distances
    if (mode === 'ship' && distance < 100) continue; // Ship not feasible for short distances

    const currentEmission = distance * factors[currentMode];
    const newEmission = distance * factor;
    const carbonSaved = currentEmission - newEmission;

    const newCost = distance * costFactors[mode];
    const costSaved = currentCost - newCost;

    const newTime = timeFactors[mode];
    const timeImpact = newTime - currentTime;

    // Determine risk level based on time impact
    let riskLevel = 'low';
    if (timeImpact > 5) riskLevel = 'medium';
    if (timeImpact > 10) riskLevel = 'high';

    suggestions.push({
      mode: mode.charAt(0).toUpperCase() + mode.slice(1),
      carbonSaved: parseFloat((carbonSaved * distance).toFixed(2)),
      costSaved: parseFloat((costSaved * distance).toFixed(2)),
      timeImpact: parseFloat(timeImpact.toFixed(1)),
      riskLevel,
      text: generateRecommendationText(node.stageName, currentMode, mode, carbonSaved, costSaved, timeImpact),
    });
  }

  // Sort by carbon saved (descending)
  return suggestions.sort((a, b) => b.carbonSaved - a.carbonSaved);
}

/**
 * Generate human-readable recommendation text
 */
function generateRecommendationText(stage, currentMode, suggestedMode, carbonSaved, costSaved, timeImpact) {
  const carbonPercent = Math.round(carbonSaved * 100);
  
  if (timeImpact > 0) {
    return `Switch ${stage} from ${currentMode} to ${suggestedMode}: save ${carbonPercent}% carbon and $${Math.abs(costSaved).toFixed(2)}, but adds ${timeImpact.toFixed(1)} days delivery.`;
  } else {
    return `Switch ${stage} from ${currentMode} to ${suggestedMode}: save ${carbonPercent}% carbon, save $${costSaved.toFixed(2)}, and reduce time by ${Math.abs(timeImpact).toFixed(1)} days.`;
  }
}

/**
 * Get optimizations for a product
 */
const getOptimizations = async (productId) => {
  try {
    const optimizations = await OptimizationInsight.find({ productId });
    
    return {
      success: true,
      data: optimizations,
      count: optimizations.length,
    };
  } catch (error) {
    throw new Error(`Failed to fetch optimizations: ${error.message}`);
  }
};

module.exports = {
  generateOptimizations,
  getOptimizations,
};
