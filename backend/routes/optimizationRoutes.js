const express = require('express');
const router = express.Router();
const {
  createOptimization,
  getOptimizationByProduct,
  getOptimizationById,
  updateOptimization,
  deleteOptimization,
} = require('../controllers/optimizationController');

// POST - Create optimization insight
router.post('/', createOptimization);

// GET - Get all optimization insights for a product
router.get('/product/:productId', getOptimizationByProduct);

// GET - Get optimization insight by ID
router.get('/:id', getOptimizationById);

// PUT - Update optimization insight
router.put('/:id', updateOptimization);

// DELETE - Delete optimization insight
router.delete('/:id', deleteOptimization);

module.exports = router;
