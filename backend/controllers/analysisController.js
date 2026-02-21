const { EmissionResult } = require('../models/schemas');
const { calculateEmissions, getLatestEmissionResult } = require('../services/analysisService');

/**
 * Run analysis for a product
 * POST /api/analysis/:productId
 */
const runAnalysis = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    // Call analysis service
    const analysisResult = await calculateEmissions(productId);

    res.status(201).json({
      success: true,
      message: 'Analysis completed successfully',
      data: analysisResult.emissionResult,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Analysis failed',
      error: error.message,
    });
  }
};

/**
 * Get latest analysis result for a product
 * GET /api/analysis/:productId
 */
const getAnalysis = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    const result = await getLatestEmissionResult(productId);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'No analysis found for this product',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Analysis retrieved successfully',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve analysis',
      error: error.message,
    });
  }
};

/**
 * Get all analysis results for a product
 * GET /api/analysis/history/:productId
 */
const getAnalysisHistory = async (req, res) => {
  try {
    const { productId } = req.params;

    const results = await EmissionResult.find({ productId })
      .populate('productId')
      .sort({ analysisDate: -1 });

    res.status(200).json({
      success: true,
      message: 'Analysis history retrieved successfully',
      data: results,
      count: results.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve analysis history',
      error: error.message,
    });
  }
};

module.exports = {
  runAnalysis,
  getAnalysis,
  getAnalysisHistory,
};
