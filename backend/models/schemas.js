const mongoose = require('mongoose');

// ============================================================
// 1. COMPANY SCHEMA
// ============================================================
const companySchema = new mongoose.Schema({
  // Organization name
  name: {
    type: String,
    required: true,
    index: true,
  },
  // Company email (unique for login)
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  // Company password (hashed)
  password: {
    type: String,
    required: true,
  },
  // Industry sector (e.g., "Manufacturing", "Retail", "Technology")
  industry: {
    type: String,
  },
  // Sustainability goal (e.g., "Net Zero by 2030")
  sustainabilityGoal: {
    type: String,
  },
  // Headquarters location
  headquartersLocation: {
    type: String,
  },
}, { timestamps: true });

// ============================================================
// 2. PRODUCT SCHEMA
// ============================================================
const productSchema = new mongoose.Schema({
  // Reference to the company
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  // Product name
  name: {
    type: String,
    required: true,
  },
  // Product description
  description: {
    type: String,
  },
  // Yearly CO2 emission target in kg
  yearlyNetZeroTarget: {
    type: Number,
    required: true,
  },
  // Current year total emission in kg
  currentYearEmission: {
    type: Number,
    default: 0,
  },
  // Carbon efficiency score (0-100)
  carbonEfficiencyScore: {
    type: Number,
  },
}, { timestamps: true });

// ============================================================
// 3. SUPPLY CHAIN NODE SCHEMA
// ============================================================
const supplyChainNodeSchema = new mongoose.Schema({
  // Reference to the product
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  // Supply chain stage name
  stageName: {
    type: String,
    required: true,
  },
  // Name of the supplier
  supplierName: {
    type: String,
  },
  // Mode of transport
  transportMode: {
    type: String,
    enum: ['truck', 'rail', 'ship', 'air'],
  },
  // Distance in kilometers
  distanceKm: {
    type: Number,
    required: true,
  },
  // Energy source for transport
  energySource: {
    type: String,
    enum: ['coal', 'solar', 'wind', 'gas','diesel','petrol'],
  },
  // Transport cost in currency units
  transportCost: {
    type: Number,
  },
  // Transport time in days
  transportTimeDays: {
    type: Number,
  },
  // Calculated CO2 emission for this stage in kg
  emission: {
    type: Number,
  },
  // Route origin - Maharashtra city or location
  fromLocation: {
    type: String,
  },
  // Route destination - Maharashtra city or location
  toLocation: {
    type: String,
  },
  // Whether route has maritime/seaway access
  hasSeaway: {
    type: Boolean,
    default: false,
  },
  // Whether route has airport/airfreight access
  hasAirport: {
    type: Boolean,
    default: false,
  },
  // Route details from Gemini analysis
  routeDetails: {
    type: String,
  },
}, { timestamps: true });

// ============================================================
// 4. EMISSION RESULT SCHEMA
// ============================================================
const emissionResultSchema = new mongoose.Schema({
  // Reference to the product
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  // Total emission across all supply chain stages in kg
  totalEmission: {
    type: Number,
    required: true,
  },
  // Stage with highest emissions
  highestEmissionStage: {
    type: String,
  },
  // Carbon efficiency score (0-100)
  carbonEfficiencyScore: {
    type: Number,
  },
  // Cost efficiency score (0-100)
  costEfficiencyScore: {
    type: Number,
  },
  // Time efficiency score (0-100)
  timeEfficiencyScore: {
    type: Number,
  },
  // Percentage alignment with net-zero target
  netZeroAlignmentPercentage: {
    type: Number,
  },
  // Detailed breakdown of emissions by node/stage
  nodesBreakdown: {
    type: Array,
    default: [],
  },
  // Date of analysis
  analysisDate: {
    type: Date,
    default: Date.now,
  },
});

// ============================================================
// 5. OPTIMIZATION INSIGHT SCHEMA
// ============================================================
const optimizationInsightSchema = new mongoose.Schema({
  // Reference to the product
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  // Supply chain stage name
  stageName: {
    type: String,
  },
  // Type of recommendation generated
  recommendationType: {
    type: String,
    enum: ['transport', 'energy', 'network', 'packaging', 'other'],
    default: 'transport',
  },
  // Current state (for Gemini-generated)
  currentState: {
    type: String,
  },
  // Suggested improvement (for Gemini-generated)
  suggestedImprovement: {
    type: String,
  },
  // Current transport mode (legacy)
  currentTransport: {
    type: String,
  },
  // Suggested transport mode (legacy)
  suggestedTransport: {
    type: String,
  },
  // Carbon reduction percentage (Gemini)
  carbonReductionPercent: {
    type: Number,
  },
  // Estimated CO2 savings in kg (legacy)
  carbonSaved: {
    type: Number,
  },
  // Cost impact in INR (Gemini)
  costImpactINR: {
    type: Number,
  },
  // Estimated cost savings in currency units (legacy)
  costSaved: {
    type: Number,
  },
  // Time impact in days
  timeImpactDays: {
    type: Number,
  },
  // Implementation difficulty
  implementationDifficulty: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  // Risk level of implementing this recommendation (legacy)
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
  },
  // Maharashtra-specific notes (Gemini)
  maharashtraSpecificNotes: {
    type: String,
  },
  // Explanation of why this approach (Gemini)
  whyThisApproach: {
    type: String,
  },
  // Detailed recommendation text
  recommendationText: {
    type: String,
  },
  // Source of recommendation (gemini-ai or manual)
  generatedBy: {
    type: String,
    enum: ['gemini-ai', 'manual'],
    default: 'manual',
  },
}, { timestamps: true });

// ============================================================
// 6. NET ZERO PROGRESS SCHEMA
// ============================================================
const netZeroProgressSchema = new mongoose.Schema({
  // Reference to the product
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  // Year of tracking
  year: {
    type: Number,
    required: true,
  },
  // Target emission for the year in kg
  targetEmission: {
    type: Number,
  },
  // Actual emission for the year in kg
  actualEmission: {
    type: Number,
  },
  // Percentage of alignment to net-zero goal
  alignmentPercentage: {
    type: Number,
  },
  // Date when record was created
  recordedAt: {
    type: Date,
    default: Date.now,
  },
});

// ============================================================
// MODEL CREATION & EXPORT
// ============================================================
const Company = mongoose.model('Company', companySchema);
const Product = mongoose.model('Product', productSchema);
const SupplyChainNode = mongoose.model('SupplyChainNode', supplyChainNodeSchema);
const EmissionResult = mongoose.model('EmissionResult', emissionResultSchema);
const OptimizationInsight = mongoose.model('OptimizationInsight', optimizationInsightSchema);
const NetZeroProgress = mongoose.model('NetZeroProgress', netZeroProgressSchema);

module.exports = {
  Company,
  Product,
  SupplyChainNode,
  EmissionResult,
  OptimizationInsight,
  NetZeroProgress,
};
