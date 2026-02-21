const express = require('express');
const router = express.Router();
const {
  runAnalysis,
  getAnalysis,
  getAnalysisHistory,
} = require('../controllers/analysisController');

// GET - Get analysis history for a product (MUST come before /:productId)
router.get('/history/:productId', getAnalysisHistory);

// POST - Run analysis for a product
router.post('/:productId', runAnalysis);

// GET - Get latest analysis result for a product
router.get('/:productId', getAnalysis);

module.exports = router;
