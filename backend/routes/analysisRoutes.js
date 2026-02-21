const express = require('express');
const router = express.Router();
const {
  runAnalysis,
  getAnalysis,
  getAnalysisHistory,
} = require('../controllers/analysisController');

// POST - Run analysis for a product
router.post('/:productId', runAnalysis);

// GET - Get latest analysis result for a product
router.get('/:productId', getAnalysis);

// GET - Get analysis history for a product
router.get('/history/:productId', getAnalysisHistory);

module.exports = router;
