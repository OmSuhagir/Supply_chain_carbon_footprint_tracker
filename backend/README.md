# CarbonChain Pro - Backend API Documentation

## 📋 Overview

**CarbonChain Pro** – AI-Powered Supply Chain Carbon & Net-Zero Tracker

A RESTful Node.js + Express backend for managing company supply chains, calculating carbon emissions, and tracking net-zero progress. The backend integrates with a Python service for emission calculations.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- npm
- MongoDB (local or cloud)
- Postman (for testing)

### Installation

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/carbonchain-pro
NODE_ENV=development
```

4. Start the server:
```bash
npm start          # Production
npm run dev        # Development with auto-reload
```

Server will run on: `http://localhost:5000`

---

## 📊 API Response Format

All endpoints return a standardized response:

```json
{
  "success": true,
  "message": "Description of what happened",
  "data": {}
}
```

---

## 🔌 API Endpoints

### 1️⃣ COMPANY ENDPOINTS

#### POST /api/companies
**Create a new company**

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Tesla Inc",
  "industry": "Automotive",
  "sustainabilityGoal": "Net Zero by 2030",
  "headquartersLocation": "Palo Alto, California"
}
```

**Sample Response (201):**
```json
{
  "success": true,
  "message": "Company created successfully",
  "data": {
    "_id": "65a7b2c1d8f5e9b3c2a1f0e2",
    "name": "Tesla Inc",
    "industry": "Automotive",
    "sustainabilityGoal": "Net Zero by 2030",
    "headquartersLocation": "Palo Alto, California",
    "createdAt": "2026-02-21T10:30:00.000Z",
    "updatedAt": "2026-02-21T10:30:00.000Z"
  }
}
```

---

#### GET /api/companies
**Get all companies**

**Sample Response (200):**
```json
{
  "success": true,
  "message": "Companies retrieved successfully",
  "count": 2,
  "data": [
    {
      "_id": "65a7b2c1d8f5e9b3c2a1f0e2",
      "name": "Tesla Inc",
      "industry": "Automotive",
      "sustainabilityGoal": "Net Zero by 2030",
      "headquartersLocation": "Palo Alto, California",
      "createdAt": "2026-02-21T10:30:00.000Z",
      "updatedAt": "2026-02-21T10:30:00.000Z"
    }
  ]
}
```

---

#### GET /api/companies/:id
**Get company by ID**

**Example URL:**
```
http://localhost:5000/api/companies/65a7b2c1d8f5e9b3c2a1f0e2
```

**Sample Response (200):**
```json
{
  "success": true,
  "message": "Company retrieved successfully",
  "data": {
    "_id": "65a7b2c1d8f5e9b3c2a1f0e2",
    "name": "Tesla Inc",
    "industry": "Automotive",
    "sustainabilityGoal": "Net Zero by 2030",
    "headquartersLocation": "Palo Alto, California",
    "createdAt": "2026-02-21T10:30:00.000Z",
    "updatedAt": "2026-02-21T10:30:00.000Z"
  }
}
```

---

#### PUT /api/companies/:id
**Update company**

**Request Body:**
```json
{
  "name": "Tesla Inc",
  "industry": "Electric Vehicles",
  "sustainabilityGoal": "Net Zero by 2025",
  "headquartersLocation": "Austin, Texas"
}
```

**Sample Response (200):**
```json
{
  "success": true,
  "message": "Company updated successfully",
  "data": {
    "_id": "65a7b2c1d8f5e9b3c2a1f0e2",
    "name": "Tesla Inc",
    "industry": "Electric Vehicles",
    "sustainabilityGoal": "Net Zero by 2025",
    "headquartersLocation": "Austin, Texas",
    "createdAt": "2026-02-21T10:30:00.000Z",
    "updatedAt": "2026-02-21T10:35:00.000Z"
  }
}
```

---

#### DELETE /api/companies/:id
**Delete company**

**Sample Response (200):**
```json
{
  "success": true,
  "message": "Company deleted successfully",
  "data": {
    "_id": "65a7b2c1d8f5e9b3c2a1f0e2",
    "name": "Tesla Inc",
    "industry": "Automotive",
    "sustainabilityGoal": "Net Zero by 2030",
    "headquartersLocation": "Palo Alto, California"
  }
}
```

---

### 2️⃣ PRODUCT ENDPOINTS

#### POST /api/products
**Create a new product**

**Request Body:**
```json
{
  "companyId": "65a7b2c1d8f5e9b3c2a1f0e2",
  "name": "Tesla Model 3",
  "description": "Electric sedan for personal use",
  "yearlyNetZeroTarget": 50000
}
```

**Sample Response (201):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "65a7b2c1d8f5e9b3c2a1f0e3",
    "companyId": {
      "_id": "65a7b2c1d8f5e9b3c2a1f0e2",
      "name": "Tesla Inc"
    },
    "name": "Tesla Model 3",
    "description": "Electric sedan for personal use",
    "yearlyNetZeroTarget": 50000,
    "currentYearEmission": 0,
    "carbonEfficiencyScore": null,
    "createdAt": "2026-02-21T10:40:00.000Z",
    "updatedAt": "2026-02-21T10:40:00.000Z"
  }
}
```

---

#### GET /api/products/company/:companyId
**Get all products for a company**

**Example URL:**
```
http://localhost:5000/api/products/company/65a7b2c1d8f5e9b3c2a1f0e2
```

**Sample Response (200):**
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "count": 1,
  "data": [
    {
      "_id": "65a7b2c1d8f5e9b3c2a1f0e3",
      "companyId": {
        "_id": "65a7b2c1d8f5e9b3c2a1f0e2",
        "name": "Tesla Inc"
      },
      "name": "Tesla Model 3",
      "description": "Electric sedan for personal use",
      "yearlyNetZeroTarget": 50000,
      "currentYearEmission": 0,
      "carbonEfficiencyScore": null,
      "createdAt": "2026-02-21T10:40:00.000Z",
      "updatedAt": "2026-02-21T10:40:00.000Z"
    }
  ]
}
```

---

#### GET /api/products/:id
**Get product by ID**

**Example URL:**
```
http://localhost:5000/api/products/65a7b2c1d8f5e9b3c2a1f0e3
```

---

#### PUT /api/products/:id
**Update product**

**Request Body:**
```json
{
  "name": "Tesla Model 3",
  "description": "Electric sedan with autopilot",
  "yearlyNetZeroTarget": 45000,
  "carbonEfficiencyScore": 85
}
```

---

#### DELETE /api/products/:id
**Delete product**

---

### 3️⃣ SUPPLY CHAIN ENDPOINTS

#### POST /api/supply-chain
**Create a supply chain node**

**Request Body:**
```json
{
  "productId": "65a7b2c1d8f5e9b3c2a1f0e3",
  "stageName": "Manufacturing",
  "supplierName": "Tesla Factory",
  "transportMode": "truck",
  "distanceKm": 500,
  "energySource": "solar",
  "transportCost": 5000,
  "transportTimeDays": 15
}
```

**Sample Response (201):**
```json
{
  "success": true,
  "message": "Supply chain node created successfully",
  "data": {
    "_id": "65a7b2c1d8f5e9b3c2a1f0e4",
    "productId": {
      "_id": "65a7b2c1d8f5e9b3c2a1f0e3",
      "name": "Tesla Model 3"
    },
    "stageName": "Manufacturing",
    "supplierName": "Tesla Factory",
    "transportMode": "truck",
    "distanceKm": 500,
    "energySource": "solar",
    "transportCost": 5000,
    "transportTimeDays": 15,
    "emission": null,
    "createdAt": "2026-02-21T10:50:00.000Z",
    "updatedAt": "2026-02-21T10:50:00.000Z"
  }
}
```

---

#### GET /api/supply-chain/product/:productId
**Get all supply chain nodes for a product**

**Example URL:**
```
http://localhost:5000/api/supply-chain/product/65a7b2c1d8f5e9b3c2a1f0e3
```

---

#### GET /api/supply-chain/:id
**Get supply chain node by ID**

---

#### PUT /api/supply-chain/:id
**Update supply chain node**

**Request Body:**
```json
{
  "stageName": "Manufacturing",
  "supplierName": "Tesla Gigafactory",
  "transportMode": "rail",
  "distanceKm": 600,
  "energySource": "wind",
  "transportCost": 4500,
  "transportTimeDays": 12,
  "emission": 120.5
}
```

---

#### DELETE /api/supply-chain/:id
**Delete supply chain node**

---

### 4️⃣ ANALYSIS ENDPOINTS ⭐

#### POST /api/analysis/:productId
**Run emission analysis (calls Python API)**

**Example URL:**
```
http://localhost:5000/api/analysis/65a7b2c1d8f5e9b3c2a1f0e3
```

**How it works:**
1. Fetches all supply chain nodes for the product
2. Sends data to Python service at `http://localhost:8000/calculate`
3. Receives emission calculations
4. Saves EmissionResult to database
5. Updates product's currentYearEmission

**Sample Response (201):**
```json
{
  "success": true,
  "message": "Analysis completed successfully",
  "data": {
    "_id": "65a7b2c1d8f5e9b3c2a1f0e5",
    "productId": "65a7b2c1d8f5e9b3c2a1f0e3",
    "totalEmission": 1250.75,
    "highestEmissionStage": "Manufacturing",
    "carbonEfficiencyScore": 78,
    "costEfficiencyScore": 85,
    "timeEfficiencyScore": 88,
    "netZeroAlignmentPercentage": 97.5,
    "analysisDate": "2026-02-21T11:00:00.000Z"
  }
}
```

---

#### GET /api/analysis/:productId
**Get latest analysis result for a product**

**Example URL:**
```
http://localhost:5000/api/analysis/65a7b2c1d8f5e9b3c2a1f0e3
```

**Sample Response (200):**
```json
{
  "success": true,
  "message": "Analysis retrieved successfully",
  "data": {
    "_id": "65a7b2c1d8f5e9b3c2a1f0e5",
    "productId": {
      "_id": "65a7b2c1d8f5e9b3c2a1f0e3",
      "name": "Tesla Model 3"
    },
    "totalEmission": 1250.75,
    "highestEmissionStage": "Manufacturing",
    "carbonEfficiencyScore": 78,
    "costEfficiencyScore": 85,
    "timeEfficiencyScore": 88,
    "netZeroAlignmentPercentage": 97.5,
    "analysisDate": "2026-02-21T11:00:00.000Z"
  }
}
```

---

#### GET /api/analysis/history/:productId
**Get analysis history for a product**

**Example URL:**
```
http://localhost:5000/api/analysis/history/65a7b2c1d8f5e9b3c2a1f0e3
```

---

### 5️⃣ OPTIMIZATION ENDPOINTS

#### POST /api/optimization
**Create optimization insight**

**Request Body:**
```json
{
  "productId": "65a7b2c1d8f5e9b3c2a1f0e3",
  "stageName": "Manufacturing",
  "currentTransport": "truck",
  "suggestedTransport": "rail",
  "carbonSaved": 250.5,
  "costSaved": 1500,
  "timeImpactDays": 3,
  "riskLevel": "low",
  "recommendationText": "Switch from truck to rail transport to reduce emissions by 20%"
}
```

**Sample Response (201):**
```json
{
  "success": true,
  "message": "Optimization insight created successfully",
  "data": {
    "_id": "65a7b2c1d8f5e9b3c2a1f0e6",
    "productId": "65a7b2c1d8f5e9b3c2a1f0e3",
    "stageName": "Manufacturing",
    "currentTransport": "truck",
    "suggestedTransport": "rail",
    "carbonSaved": 250.5,
    "costSaved": 1500,
    "timeImpactDays": 3,
    "riskLevel": "low",
    "recommendationText": "Switch from truck to rail transport to reduce emissions by 20%",
    "createdAt": "2026-02-21T11:10:00.000Z",
    "updatedAt": "2026-02-21T11:10:00.000Z"
  }
}
```

---

#### GET /api/optimization/product/:productId
**Get optimization insights for a product**

**Example URL:**
```
http://localhost:5000/api/optimization/product/65a7b2c1d8f5e9b3c2a1f0e3
```

---

#### GET /api/optimization/:id
**Get optimization insight by ID**

---

#### PUT /api/optimization/:id
**Update optimization insight**

**Request Body:**
```json
{
  "stageName": "Manufacturing",
  "currentTransport": "truck",
  "suggestedTransport": "ship",
  "carbonSaved": 350.5,
  "costSaved": 2000,
  "timeImpactDays": 5,
  "riskLevel": "medium",
  "recommendationText": "Switch to maritime shipping for bulk shipments"
}
```

---

#### DELETE /api/optimization/:id
**Delete optimization insight**

---

### 6️⃣ NET-ZERO PROGRESS ENDPOINTS

#### POST /api/netzero-progress
**Create net-zero progress entry**

**Request Body:**
```json
{
  "productId": "65a7b2c1d8f5e9b3c2a1f0e3",
  "year": 2026,
  "targetEmission": 50000,
  "actualEmission": 48750,
  "alignmentPercentage": 97.5
}
```

**Sample Response (201):**
```json
{
  "success": true,
  "message": "Net-zero progress recorded successfully",
  "data": {
    "_id": "65a7b2c1d8f5e9b3c2a1f0e7",
    "productId": "65a7b2c1d8f5e9b3c2a1f0e3",
    "year": 2026,
    "targetEmission": 50000,
    "actualEmission": 48750,
    "alignmentPercentage": 97.5,
    "recordedAt": "2026-02-21T11:20:00.000Z"
  }
}
```

---

#### GET /api/netzero-progress/product/:productId
**Get net-zero progress history for a product**

**Example URL:**
```
http://localhost:5000/api/netzero-progress/product/65a7b2c1d8f5e9b3c2a1f0e3
```

---

#### GET /api/netzero-progress/:id
**Get net-zero progress by ID**

---

#### PUT /api/netzero-progress/:id
**Update net-zero progress**

**Request Body:**
```json
{
  "targetEmission": 45000,
  "actualEmission": 43500,
  "alignmentPercentage": 96.7
}
```

---

#### DELETE /api/netzero-progress/:id
**Delete net-zero progress**

---

## 🧪 Testing in Postman

### Step 1: Import Collection
1. Create a new collection named "CarbonChain Pro"
2. Create folders for each entity: Companies, Products, Supply Chain, Analysis, Optimization, NetZero

### Step 2: Set Base URL
In collection settings, set variable:
```
{{BASE_URL}} = http://localhost:5000
```

Use `{{BASE_URL}}/api/companies` in requests

### Step 3: Example Request Flow

**1. Create Company**
```
POST http://localhost:5000/api/companies
```

**2. Create Product** (use company ID from step 1)
```
POST http://localhost:5000/api/products
```

**3. Add Supply Chain Nodes** (use product ID from step 2 - add multiple)
```
POST http://localhost:5000/api/supply-chain
```

**4. Run Analysis** (analyzes all nodes for the product)
```
POST http://localhost:5000/api/analysis/{productId}
```

**5. Get Analysis Results**
```
GET http://localhost:5000/api/analysis/{productId}
```

**6. Create Optimization Insights** (based on analysis)
```
POST http://localhost:5000/api/optimization
```

**7. Track Progress**
```
POST http://localhost:5000/api/netzero-progress
```

---

## ⚠️ Error Handling

### Common Error Responses

**400 Bad Request** - Missing required fields
```json
{
  "success": false,
  "message": "Company name is required"
}
```

**404 Not Found** - Resource doesn't exist
```json
{
  "success": false,
  "message": "Company not found"
}
```

**500 Server Error** - Database or processing error
```json
{
  "success": false,
  "message": "Server error",
  "error": "connection closed"
}
```

---

## 📝 Notes

- All dates are in ISO 8601 format
- ObjectIds are 24-character hexadecimal strings
- Required fields must not be null or empty
- Transport modes: `truck`, `rail`, `ship`, `air`
- Energy sources: `coal`, `solar`, `wind`, `gas`
- Risk levels: `low`, `medium`, `high`

---

## 🔄 Integration with Python Service

The analysis endpoint (`POST /api/analysis/:productId`) sends data to:

**Python API:** `http://localhost:8000/calculate`

**Expected request format:**
```json
{
  "supplyChain": [
    {
      "stageName": "Manufacturing",
      "transportMode": "truck",
      "distanceKm": 500,
      "energySource": "solar",
      "transportCost": 5000
    }
  ]
}
```

**Expected response format:**
```json
{
  "totalEmission": 1250.75,
  "highestEmissionStage": "Manufacturing",
  "carbonEfficiencyScore": 78,
  "costEfficiencyScore": 85,
  "timeEfficiencyScore": 88,
  "netZeroAlignmentPercentage": 97.5
}
```

---

## 📚 Folder Structure

```
backend/
├── config/
│   └── connectdb.js          # MongoDB connection
├── controllers/
│   ├── companyController.js
│   ├── productController.js
│   ├── supplyChainController.js
│   ├── analysisController.js
│   ├── optimizationController.js
│   └── netZeroProgressController.js
├── models/
│   └── schemas.js            # Mongoose schemas
├── services/
│   └── analysisService.js    # Business logic
├── routes/
│   ├── companyRoutes.js
│   ├── productRoutes.js
│   ├── supplyChainRoutes.js
│   ├── analysisRoutes.js
│   ├── optimizationRoutes.js
│   ├── netZeroProgressRoutes.js
│   └── index.js              # Route registry
├── .env                       # Environment variables
├── .gitignore
├── package.json
└── server.js                 # Entry point
```

---

## 🚀 Deployment

Ensure environment variables are set in production:
- `MONGODB_URI` - Production database URI
- `PORT` - Server port
- `NODE_ENV` - Set to "production"

---

**Happy Testing! 🌱**
