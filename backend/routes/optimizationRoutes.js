const express = require('express');
const router = express.Router();
const {
  createOptimization,
  generateRecommendations,
  getOptimizationByProduct,
  getOptimizationById,
  updateOptimization,
  deleteOptimization,
  getGeminiOptimizationsByProduct,
  regenerateGeminiOptimizations,
} = require('../controllers/optimizationController');

// GET - Get all optimization insights (for dashboard)
router.get('/', async (req, res) => {
  try {
    const OptimizationInsight = require('../models/schemas').OptimizationInsight;
    const optimizations = await OptimizationInsight.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('productId');
    
    res.status(200).json({
      success: true,
      message: 'Optimizations retrieved successfully',
      data: optimizations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching optimizations',
      error: error.message,
    });
  }
});

// POST - Create optimization insight
router.post('/', createOptimization);

// POST - Generate optimization recommendations for a product
router.post('/:productId/generate', generateRecommendations);

// GET - Get all optimization insights for a product
router.get('/:productId', getOptimizationByProduct);

// GET - Get Gemini AI-generated optimizations for a product
router.get('/:productId/gemini', getGeminiOptimizationsByProduct);

// POST - Regenerate Gemini AI recommendations
router.post('/:productId/gemini/regenerate', regenerateGeminiOptimizations);

// PUT - Update optimization insight
router.put('/:id', updateOptimization);

// DELETE - Delete optimization insight
router.delete('/:id', deleteOptimization);

module.exports = router;
