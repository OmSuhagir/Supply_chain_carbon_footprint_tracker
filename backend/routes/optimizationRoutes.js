const express = require('express');
const router = express.Router();
const {
  createOptimization,
  generateRecommendations,
  getOptimizationByProduct,
  getOptimizationById,
  updateOptimization,
  deleteOptimization,
} = require('../controllers/optimizationController');

// POST - Create optimization insight
router.post('/', createOptimization);

// POST - Generate optimization recommendations for a product
router.post('/:productId/generate', generateRecommendations);

// GET - Get all optimization insights for a product
router.get('/:productId', getOptimizationByProduct);

// PUT - Update optimization insight
router.put('/:id', updateOptimization);

// DELETE - Delete optimization insight
router.delete('/:id', deleteOptimization);

module.exports = router;
