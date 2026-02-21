const { OptimizationInsight } = require('../models/schemas');
const { generateOptimizations, getOptimizations } = require('../services/optimizationService');

/**
 * Create an optimization insight
 * POST /api/optimization
 */
const createOptimization = async (req, res) => {
  try {
    const {
      productId,
      stageName,
      currentTransport,
      suggestedTransport,
      carbonSaved,
      costSaved,
      timeImpactDays,
      riskLevel,
      recommendationText,
    } = req.body;

    // Validate required fields
    if (!productId || !stageName) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and stage name are required',
      });
    }

    // Create optimization insight
    const insight = new OptimizationInsight({
      productId,
      stageName,
      currentTransport,
      suggestedTransport,
      carbonSaved,
      costSaved,
      timeImpactDays,
      riskLevel,
      recommendationText,
    });

    await insight.save();
    await insight.populate('productId');

    res.status(201).json({
      success: true,
      message: 'Optimization insight created successfully',
      data: insight,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * Generate optimization recommendations for a product
 * POST /api/optimizations/:productId/generate
 */
const generateRecommendations = async (req, res) => {
  try {
    const { productId } = req.params;

    console.log(`[Optimization] Generating recommendations for product: ${productId}`);

    const result = await generateOptimizations(productId);

    console.log(`[Optimization] Generated ${result.count} recommendations`);

    res.status(201).json({
      success: true,
      message: `Generated ${result.count} optimization recommendations`,
      data: result.data,
      count: result.count,
    });
  } catch (error) {
    console.error(`[Optimization] Error generating recommendations:`, error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to generate recommendations',
      error: error.message,
    });
  }
};

/**
 * Get all optimization insights for a product
 * GET /api/optimizations/:productId
 */
const getOptimizationByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    console.log(`[Optimization] Fetching optimizations for product: ${productId}`);

    const result = await getOptimizations(productId);

    res.status(200).json({
      success: true,
      message: 'Optimizations retrieved successfully',
      data: result.data,
      count: result.count,
    });
  } catch (error) {
    console.error(`[Optimization] Error fetching optimizations:`, error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve optimizations',
      error: error.message,
    });
  }
};

/**
 * Get optimization insight by ID
 * GET /api/optimization/:id
 */
const getOptimizationById = async (req, res) => {
  try {
    const { id } = req.params;

    const insight = await OptimizationInsight.findById(id).populate('productId');

    if (!insight) {
      return res.status(404).json({
        success: false,
        message: 'Optimization insight not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Optimization insight retrieved successfully',
      data: insight,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * Update optimization insight
 * PUT /api/optimization/:id
 */
const updateOptimization = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      stageName,
      currentTransport,
      suggestedTransport,
      carbonSaved,
      costSaved,
      timeImpactDays,
      riskLevel,
      recommendationText,
    } = req.body;

    const insight = await OptimizationInsight.findByIdAndUpdate(
      id,
      {
        stageName,
        currentTransport,
        suggestedTransport,
        carbonSaved,
        costSaved,
        timeImpactDays,
        riskLevel,
        recommendationText,
      },
      { new: true, runValidators: true }
    ).populate('productId');

    if (!insight) {
      return res.status(404).json({
        success: false,
        message: 'Optimization insight not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Optimization insight updated successfully',
      data: insight,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * Delete optimization insight
 * DELETE /api/optimization/:id
 */
const deleteOptimization = async (req, res) => {
  try {
    const { id } = req.params;

    const insight = await OptimizationInsight.findByIdAndDelete(id);

    if (!insight) {
      return res.status(404).json({
        success: false,
        message: 'Optimization insight not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Optimization insight deleted successfully',
      data: insight,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * Get Gemini AI-generated optimizations for a product
 * GET /api/optimizations/:productId/gemini
 */
const getGeminiOptimizationsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    console.log(`[Gemini Optimization] Fetching Gemini optimizations for product: ${productId}`);

    const { getGeminiOptimizations } = require('../services/geminiOptimizationService');
    const result = await getGeminiOptimizations(productId);

    res.status(200).json({
      success: true,
      message: 'Gemini optimizations retrieved successfully',
      data: result.data,
      count: result.count,
      source: 'gemini-ai',
    });
  } catch (error) {
    console.error(`[Gemini Optimization] Error fetching optimizations:`, error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve Gemini optimizations',
      error: error.message,
    });
  }
};

/**
 * Regenerate Gemini AI recommendations (clear old and generate fresh)
 * POST /api/optimizations/:productId/gemini/regenerate
 */
const regenerateGeminiOptimizations = async (req, res) => {
  try {
    const { productId } = req.params;

    console.log(`[Gemini Optimization] Regenerating recommendations for product: ${productId}`);

    const { regenerateGeminiOptimizations } = require('../services/geminiOptimizationService');
    const result = await regenerateGeminiOptimizations(productId);

    console.log(`[Gemini Optimization] Regenerated ${result.count} recommendations`);

    res.status(201).json({
      success: true,
      message: `Regenerated ${result.count} AI-powered optimization recommendations`,
      data: result.data,
      count: result.count,
      source: 'gemini-ai',
    });
  } catch (error) {
    console.error(`[Gemini Optimization] Error regenerating recommendations:`, error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to regenerate recommendations',
      error: error.message,
    });
  }
};

module.exports = {
  createOptimization,
  generateRecommendations,
  getOptimizationByProduct,
  getOptimizationById,
  updateOptimization,
  deleteOptimization,
  getGeminiOptimizationsByProduct,
  regenerateGeminiOptimizations,
};
