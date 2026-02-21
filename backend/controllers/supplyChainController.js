const { SupplyChainNode } = require('../models/schemas');
const { analyzeRouteIntelligence } = require('../services/geminiOptimizationService');

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
      fromLocation,
      toLocation,
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
      fromLocation: fromLocation || '',
      toLocation: toLocation || '',
    });

    await node.save();
    await node.populate('productId');

    // If route locations are provided, analyze the route
    if (fromLocation && toLocation) {
      try {
        const routeAnalysis = await analyzeRouteIntelligence(fromLocation, toLocation);
        
        // Update node with route analysis
        node.hasSeaway = routeAnalysis.fromHasSeaway || routeAnalysis.toHasSeaway;
        node.hasAirport = routeAnalysis.fromHasAirport || routeAnalysis.toHasAirport;
        node.routeDetails = routeAnalysis.routeDetails;
        
        await node.save();
      } catch (routeErr) {
        console.error('Route analysis error (non-blocking):', routeErr.message);
        // Non-blocking: route analysis errors don't fail node creation
      }
    }

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

/**
 * Analyze route intelligence for Maharashtra cities
 * POST /api/supply-chain/route/analyze
 */
const analyzeRoute = async (req, res) => {
  try {
    const { productId, fromLocation, toLocation } = req.body;

    if (!productId || !fromLocation || !toLocation) {
      return res.status(400).json({
        success: false,
        message: 'Product ID, fromLocation, and toLocation are required',
      });
    }

    // Call Gemini service to analyze route
    const routeAnalysis = await analyzeRouteIntelligence(fromLocation, toLocation);

    // Update the supply chain node with route information if node ID is provided
    if (req.body.nodeId) {
      const node = await SupplyChainNode.findByIdAndUpdate(
        req.body.nodeId,
        {
          fromLocation,
          toLocation,
          hasSeaway: routeAnalysis.fromHasSeaway || routeAnalysis.toHasSeaway,
          hasAirport: routeAnalysis.fromHasAirport || routeAnalysis.toHasAirport,
          routeDetails: routeAnalysis.routeDetails,
        },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Route analysis completed successfully',
      data: routeAnalysis,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Route analysis failed',
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
  analyzeRoute,
};
