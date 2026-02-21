const express = require('express');
const router = express.Router();
const {
  createSupplyChainNode,
  getSupplyChainByProduct,
  getSupplyChainNodeById,
  updateSupplyChainNode,
  deleteSupplyChainNode,
  analyzeRoute,
} = require('../controllers/supplyChainController');

// POST - Create a supply chain node
router.post('/', createSupplyChainNode);

// POST - Analyze route intelligence
router.post('/route/analyze', analyzeRoute);

// GET - Get all supply chain nodes for a product
router.get('/product/:productId', getSupplyChainByProduct);

// GET - Get supply chain node by ID
router.get('/:id', getSupplyChainNodeById);

// PUT - Update supply chain node
router.put('/:id', updateSupplyChainNode);

// DELETE - Delete supply chain node
router.delete('/:id', deleteSupplyChainNode);

module.exports = router;
