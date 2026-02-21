const { OptimizationInsight } = require('../models/schemas');

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
 * Get all optimization insights for a product
 * GET /api/optimization/product/:productId
 */
const getOptimizationByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const insights = await OptimizationInsight.find({ productId })
      .populate('productId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Optimization insights retrieved successfully',
      data: insights,
      count: insights.length,
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

module.exports = {
  createOptimization,
  getOptimizationByProduct,
  getOptimizationById,
  updateOptimization,
  deleteOptimization,
};
