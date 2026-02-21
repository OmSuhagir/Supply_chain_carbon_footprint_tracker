const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/connectdb');
const {
  Company,
  Product,
  SupplyChainNode,
  EmissionResult,
  OptimizationInsight,
  NetZeroProgress,
} = require('./models/schemas');

// ============================================================
// INITIALIZATION
// ============================================================
const app = express();
const PORT = process.env.PORT || 5000;

// ============================================================
// MIDDLEWARE
// ============================================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================================
// CONNECT TO DATABASE
// ============================================================
connectDB();

// ============================================================
// ROUTES
// ============================================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    message: 'CarbonChain Pro Server is Running',
    timestamp: new Date().toISOString(),
  });
});

// ============================================================
// START SERVER
// ============================================================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Database: MongoDB`);
  console.log(`🌱 CarbonChain Pro - AI-Powered Supply Chain Carbon & Net-Zero Tracker`);
});

module.exports = app;
