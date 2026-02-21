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

// GET - Get all optimization insights for a product (matches frontend call: /api/optimization/:productId)
router.get('/:productId', getOptimizationByProduct);

// PUT - Update optimization insight
router.put('/:id', updateOptimization);

// DELETE - Delete optimization insight
router.delete('/:id', deleteOptimization);

module.exports = router;
