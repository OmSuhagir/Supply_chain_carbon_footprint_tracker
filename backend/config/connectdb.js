const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * Uses MONGODB_URI from environment variables or falls back to local MongoDB
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/carbonchain_pro';

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 second timeout
    });

    console.log('✅ MongoDB Connected Successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.warn('⚠️  Running without MongoDB. Some features may be limited.');
    // Don't crash the server - continue without DB
    return null;
  }
};

module.exports = connectDB;
