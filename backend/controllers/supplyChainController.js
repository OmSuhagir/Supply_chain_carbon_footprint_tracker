const { SupplyChainNode } = require('../models/schemas');

/**
 * Create a supply chain node
 * POST /api/supply-chain
 */
const createSupplyChainNode = async (req, res) => {
  try {
    const {
      productId,
      stageName,
      supplierName,
      transportMode,
      distanceKm,
      energySource,
      transportCost,
      transportTimeDays,
    } = req.body;

    // Validate required fields
    if (!productId || !stageName || distanceKm === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Product ID, stage name, and distance are required',
      });
    }

    // Create supply chain node
    const node = new SupplyChainNode({
      productId,
      stageName,
      supplierName,
      transportMode,
      distanceKm,
      energySource,
      transportCost,
      transportTimeDays,
    });

    await node.save();
    await node.populate('productId');

    res.status(201).json({
      success: true,
      message: 'Supply chain node created successfully',
      data: node,
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
 * Get all supply chain nodes for a product
 * GET /api/supply-chain/product/:productId
 */
const getSupplyChainByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const nodes = await SupplyChainNode.find({ productId })
      .populate('productId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Supply chain nodes retrieved successfully',
      data: nodes,
      count: nodes.length,
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
 * Get supply chain node by ID
 * GET /api/supply-chain/:id
 */
const getSupplyChainNodeById = async (req, res) => {
  try {
    const { id } = req.params;

    const node = await SupplyChainNode.findById(id).populate('productId');

    if (!node) {
      return res.status(404).json({
        success: false,
        message: 'Supply chain node not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Supply chain node retrieved successfully',
      data: node,
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
 * Update supply chain node
 * PUT /api/supply-chain/:id
 */
const updateSupplyChainNode = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      stageName,
      supplierName,
      transportMode,
      distanceKm,
      energySource,
      transportCost,
      transportTimeDays,
      emission,
    } = req.body;

    const node = await SupplyChainNode.findByIdAndUpdate(
      id,
      {
        stageName,
        supplierName,
        transportMode,
        distanceKm,
        energySource,
        transportCost,
        transportTimeDays,
        emission,
      },
      { new: true, runValidators: true }
    ).populate('productId');

    if (!node) {
      return res.status(404).json({
        success: false,
        message: 'Supply chain node not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Supply chain node updated successfully',
      data: node,
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
 * Delete supply chain node
 * DELETE /api/supply-chain/:id
 */
const deleteSupplyChainNode = async (req, res) => {
  try {
    const { id } = req.params;

    const node = await SupplyChainNode.findByIdAndDelete(id);

    if (!node) {
      return res.status(404).json({
        success: false,
        message: 'Supply chain node not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Supply chain node deleted successfully',
      data: node,
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
  createSupplyChainNode,
  getSupplyChainByProduct,
  getSupplyChainNodeById,
  updateSupplyChainNode,
  deleteSupplyChainNode,
};
