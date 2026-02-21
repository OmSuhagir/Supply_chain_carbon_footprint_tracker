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

    // Prepare data for Python API
    const supplyChainData = nodes.map((node) => ({
      stageName: node.stageName,
      transportMode: node.transportMode,
      distanceKm: node.distanceKm,
      energySource: node.energySource,
      transportCost: node.transportCost,
    }));

    // Call Python API for emission calculation
    const pythonResponse = await axios.post('http://localhost:8000/calculate', {
      supplyChain: supplyChainData,
    });

    const {
      totalEmission,
      highestEmissionStage,
      carbonEfficiencyScore,
      costEfficiencyScore,
      timeEfficiencyScore,
      netZeroAlignmentPercentage,
    } = pythonResponse.data;

    // Save analysis result to database
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    const emissionResult = new EmissionResult({
      productId,
      totalEmission,
      highestEmissionStage,
      carbonEfficiencyScore,
      costEfficiencyScore,
      timeEfficiencyScore,
      netZeroAlignmentPercentage,
    });

    await emissionResult.save();

    // Update product currentYearEmission
    product.currentYearEmission = totalEmission;
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
