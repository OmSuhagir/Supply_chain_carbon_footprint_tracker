const express = require('express');
const companyRoutes = require('./companyRoutes');
const productRoutes = require('./productRoutes');
const supplyChainRoutes = require('./supplyChainRoutes');
const analysisRoutes = require('./analysisRoutes');
const optimizationRoutes = require('./optimizationRoutes');
const netZeroProgressRoutes = require('./netZeroProgressRoutes');

const router = express.Router();

// ============================================================
// API ROUTE REGISTRATION
// ============================================================

// Company routes
router.use('/companies', companyRoutes);

// Product routes
router.use('/products', productRoutes);

// Supply chain routes
router.use('/supply-chain', supplyChainRoutes);

// Analysis routes
router.use('/analysis', analysisRoutes);

// Optimization routes
router.use('/optimizations', optimizationRoutes);
router.use('/optimization', optimizationRoutes); // Alias for singular endpoint

// Net-zero progress routes
router.use('/netzero-progress', netZeroProgressRoutes);

module.exports = router;
