const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProductsByCompany,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

// POST - Create a new product
router.post('/', createProduct);

// GET - Get all products for a company
router.get('/company/:companyId', getProductsByCompany);

// GET - Get product by ID
router.get('/:id', getProductById);

// PUT - Update product
router.put('/:id', updateProduct);

// DELETE - Delete product
router.delete('/:id', deleteProduct);

module.exports = router;
