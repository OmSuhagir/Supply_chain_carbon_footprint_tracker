// Re-export Express app as a serverless handler function
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('../backend/config/connectdb');
const apiRoutes = require('../backend/routes');

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CONNECT TO DATABASE
connectDB();

// ROUTES
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CarbonChain Pro API is Running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/', apiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? undefined : err.message,
  });
});

export default app;
