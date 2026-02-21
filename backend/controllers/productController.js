const { Product } = require('../models/schemas');

/**
 * Create a new product
 * POST /api/products
 */
const createProduct = async (req, res) => {
  try {
    const { companyId, name, description, yearlyNetZeroTarget } = req.body;

    // Validate required fields
    if (!companyId || !name || yearlyNetZeroTarget === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Company ID, product name, and yearly net-zero target are required',
      });
    }

    // Create new product
    const product = new Product({
      companyId,
      name,
      description,
      yearlyNetZeroTarget,
      currentYearEmission: 0,
    });

    await product.save();
    await product.populate('companyId');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
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
 * Get all products for a company
 * GET /api/products/company/:companyId
 */
const getProductsByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;

    const products = await Product.find({ companyId }).populate('companyId').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      data: products,
      count: products.length,
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
 * Get product by ID
 * GET /api/products/:id
 */
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate('companyId');
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product retrieved successfully',
      data: product,
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
 * Update product
 * PUT /api/products/:id
 */
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, yearlyNetZeroTarget, carbonEfficiencyScore } = req.body;

    const product = await Product.findByIdAndUpdate(
      id,
      { name, description, yearlyNetZeroTarget, carbonEfficiencyScore },
      { new: true, runValidators: true }
    ).populate('companyId');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
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
 * Delete product
 * DELETE /api/products/:id
 */
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: product,
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
  createProduct,
  getProductsByCompany,
  getProductById,
  updateProduct,
  deleteProduct,
};
