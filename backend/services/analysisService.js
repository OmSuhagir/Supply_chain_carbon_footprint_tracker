const axios = require('axios');
const { SupplyChainNode, Product, EmissionResult } = require('../models/schemas');

/**
 * Service to calculate emissions via Python API
 * Fetches supply chain nodes and calls Python backend
 */
const calculateEmissions = async (productId) => {
  try {
    // Fetch all supply chain nodes for the product
    const nodes = await SupplyChainNode.find({ productId });

    if (nodes.length === 0) {
      throw new Error('No supply chain nodes found for this product');
    }

    // Prepare data for Python API: Map camelCase to snake_case
    const supplyChainData = nodes.map((node) => ({
      stage_name: node.stageName,
      supplier_name: node.supplierName || '',
      transport_mode: node.transportMode,
      distance_km: node.distanceKm,
      energy_source: node.energySource,
      transport_cost: node.transportCost || 0,
      transport_time_days: node.transportTimeDays || 0,
    }));

    // Call Python API for emission calculation
    // Using correct endpoint: /api/emissions/calculate-total
    let pythonResponse;
    try {
      pythonResponse = await axios.post('http://localhost:8000/api/emissions/calculate-total', {
        supply_chain_nodes: supplyChainData,
      });
    } catch (pythonError) {
      console.error('Python Engine Error:', {
        message: pythonError.message,
        code: pythonError.code,
        url: 'http://localhost:8000/api/emissions/calculate-total',
      });
      throw new Error(`Python Engine unavailable: ${pythonError.message}. Make sure to run "python main.py" in the backend/emission_engine folder`);
    }

    const emissionData = pythonResponse.data.data || pythonResponse.data;
    const {
      total_emission,
      highest_emission_stage,
      nodes_breakdown,
    } = emissionData;

    // Calculate efficiency scores (can be done here or by Python)
    const carbonEfficiencyScore = Math.max(0, 100 - (total_emission / 50000) * 100);
    const costEfficiencyScore = 85; // Placeholder
    const timeEfficiencyScore = 90; // Placeholder
    
    // Calculate net-zero alignment percentage
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }
    
    const netZeroAlignmentPercentage = product.yearlyNetZeroTarget 
      ? Math.max(0, 100 - (total_emission / product.yearlyNetZeroTarget) * 100)
      : 0;

    // Save analysis result to database
    const emissionResult = new EmissionResult({
      productId,
      totalEmission: total_emission,
      highestEmissionStage: highest_emission_stage,
      carbonEfficiencyScore,
      costEfficiencyScore,
      timeEfficiencyScore,
      netZeroAlignmentPercentage,
      nodesBreakdown: nodes_breakdown,
    });

    await emissionResult.save();

    // Update product currentYearEmission
    product.currentYearEmission = total_emission;
    product.carbonEfficiencyScore = carbonEfficiencyScore;
    await product.save();

    return {
      success: true,
      emissionResult,
      productUpdated: product,
    };
  } catch (error) {
    throw new Error(`Emission calculation failed: ${error.message}`);
  }
};

/**
 * Get latest emission result for a product
 */
const getLatestEmissionResult = async (productId) => {
  try {
    const result = await EmissionResult.findOne({ productId })
      .populate('productId')
      .sort({ analysisDate: -1 });

    return result;
  } catch (error) {
    throw new Error(`Failed to fetch emission result: ${error.message}`);
  }
};

module.exports = {
  calculateEmissions,
  getLatestEmissionResult,
};
