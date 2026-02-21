const { EmissionResult } = require('../models/schemas');
const { calculateEmissions, getLatestEmissionResult } = require('../services/analysisService');
const { generateGeminiOptimizations } = require('../services/geminiOptimizationService');

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

    console.log(`[Analysis] Starting analysis for product: ${productId}`);

    // Call analysis service
    const analysisResult = await calculateEmissions(productId);

    console.log(`[Analysis] Completed successfully for product: ${productId}`);
    console.log(`[Analysis] Result:`, JSON.stringify(analysisResult.emissionResult, null, 2));

    // Generate optimization recommendations using Gemini AI
    try {
      console.log(`[Analysis] Generating AI-powered optimization recommendations using Gemini...`);
      await generateGeminiOptimizations(productId, analysisResult.emissionResult);
      console.log(`[Analysis] Gemini optimizations generated successfully`);
    } catch (optErr) {
      console.error(`[Analysis] Error generating Gemini optimizations (non-blocking):`, optErr.message);
      // Non-blocking: optimization errors don't fail the analysis
    }

    res.status(201).json({
      success: true,
      message: 'Analysis completed successfully',
      data: analysisResult.emissionResult,
    });
  } catch (error) {
    console.error(`[Analysis] ERROR for product ${req.params.productId}:`, error.message);
    console.error(`[Analysis] Full error:`, error);
    
    res.status(500).json({
      success: false,
      message: 'Analysis failed',
      error: error.message,
      hint: error.message.includes('Python') ? 'Make sure Python engine is running (python main.py in backend/emission_engine)' : 'Check backend logs for details',
    });
  }
};

/**
 * Get latest analysis result for a product
 * GET /api/analysis/:productId
 * Returns 200 with data: null if no analysis exists (expected for new products)
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

    // Return 200 with null data if no analysis exists (expected for new products)
    if (!result) {
      return res.status(200).json({
        success: true,
        message: 'No analysis found for this product (expected for new products)',
        data: null,
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
