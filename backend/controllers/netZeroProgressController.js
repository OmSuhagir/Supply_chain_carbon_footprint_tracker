const { NetZeroProgress } = require('../models/schemas');

/**
 * Create a net-zero progress entry
 * POST /api/netzero-progress
 */
const createNetZeroProgress = async (req, res) => {
  try {
    const { productId, year, targetEmission, actualEmission, alignmentPercentage } = req.body;

    // Validate required fields
    if (!productId || !year) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and year are required',
      });
    }

    // Create net-zero progress entry
    const progress = new NetZeroProgress({
      productId,
      year,
      targetEmission,
      actualEmission,
      alignmentPercentage,
    });

    await progress.save();
    await progress.populate('productId');

    res.status(201).json({
      success: true,
      message: 'Net-zero progress recorded successfully',
      data: progress,
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
 * Get net-zero progress history for a product
 * GET /api/netzero-progress/product/:productId
 */
const getNetZeroProgressByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const progress = await NetZeroProgress.find({ productId })
      .populate('productId')
      .sort({ year: -1 });

    res.status(200).json({
      success: true,
      message: 'Net-zero progress retrieved successfully',
      data: progress,
      count: progress.length,
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
 * Get net-zero progress by ID
 * GET /api/netzero-progress/:id
 */
const getNetZeroProgressById = async (req, res) => {
  try {
    const { id } = req.params;

    const progress = await NetZeroProgress.findById(id).populate('productId');

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Net-zero progress record not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Net-zero progress retrieved successfully',
      data: progress,
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
 * Update net-zero progress
 * PUT /api/netzero-progress/:id
 */
const updateNetZeroProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { targetEmission, actualEmission, alignmentPercentage } = req.body;

    const progress = await NetZeroProgress.findByIdAndUpdate(
      id,
      { targetEmission, actualEmission, alignmentPercentage },
      { new: true, runValidators: true }
    ).populate('productId');

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Net-zero progress record not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Net-zero progress updated successfully',
      data: progress,
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
 * Delete net-zero progress
 * DELETE /api/netzero-progress/:id
 */
const deleteNetZeroProgress = async (req, res) => {
  try {
    const { id } = req.params;

    const progress = await NetZeroProgress.findByIdAndDelete(id);

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Net-zero progress record not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Net-zero progress deleted successfully',
      data: progress,
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
  createNetZeroProgress,
  getNetZeroProgressByProduct,
  getNetZeroProgressById,
  updateNetZeroProgress,
  deleteNetZeroProgress,
};
