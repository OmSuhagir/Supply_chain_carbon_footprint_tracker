const express = require('express');
const router = express.Router();
const {
  createNetZeroProgress,
  getNetZeroProgressByProduct,
  getNetZeroProgressById,
  updateNetZeroProgress,
  deleteNetZeroProgress,
} = require('../controllers/netZeroProgressController');

// POST - Create net-zero progress entry
router.post('/', createNetZeroProgress);

// GET - Get net-zero progress history for a product
router.get('/product/:productId', getNetZeroProgressByProduct);

// GET - Get net-zero progress by ID
router.get('/:id', getNetZeroProgressById);

// PUT - Update net-zero progress
router.put('/:id', updateNetZeroProgress);

// DELETE - Delete net-zero progress
router.delete('/:id', deleteNetZeroProgress);

module.exports = router;
