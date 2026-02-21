# CarbonChain Pro - System Startup Guide

## 📋 Prerequisites
- Node.js v18+ installed
- MongoDB connection configured in `.env`
- Python 3.8+ for emission engine (optional for demo mode)

---

## 🚀 Quick Start (All Services)

### Terminal 1: Start Backend Server
```bash
cd backend
node server.js
```
Expected output:
```
✅ MongoDB Connected Successfully
Server is running on http://localhost:5000
```

### Terminal 2: Start Python Emission Engine
**IMPORTANT: Start this BEFORE running analysis in the frontend!**
```bash
cd backend/emission_engine
pip install -r requirements.txt
python main.py
```
Expected output:
```
Uvicorn running on http://127.0.0.1:8000
Application startup complete
```

### Terminal 3: Start Frontend Development Server
```bash
cd frontend
npm run dev
```
Expected output:
```
  VITE v6.0.0  ready in 123 ms
  ➜  Local:   http://localhost:5173/
```

---

## 🔌 Verify All Services Running

### Check Backend Health
```bash
curl http://localhost:5000/api/health
```
Response (if working):
```json
{
  "success": true,
  "message": "CarbonChain Pro Server is Running",
  "timestamp": "2026-02-21T..."
}
```

### Check Frontend
Navigate to: `http://localhost:5173`
You should see the login page

---

## 📡 API Endpoint Mapping

### Architecture: How Analysis Works
```
Frontend (React)
    ↓
POST /api/analysis/{productId}
    ↓
Backend (Node.js) - analysisService.js
    ↓
Fetches supply chain nodes from MongoDB
    ↓
POST /api/emissions/calculate-total (calls Python)
    ↓
Python Engine (FastAPI) - Calculates emissions
    ↓
Returns: total_emission, highest_emission_stage, nodes_breakdown
    ↓
Backend saves result to EmissionResult collection
    ↓
Frontend displays analysis dashboard
```

**Critical**: Python engine MUST be running for analysis to work!

### Company Endpoints
| Method | Frontend Call | Backend Route |
|--------|--------------|--------------|
| POST | `/api/companies` | `/companies` - Create company |
| GET | `/api/companies` | `/companies` - Get all companies |
| GET | `/api/companies/{id}` | `/companies/{id}` - Get company by ID |

### Product Endpoints
| Method | Frontend Call | Backend Route |
|--------|--------------|--------------|
| POST | `/api/products` | `/products` - Create product |
| GET | `/api/products/company/{companyId}` | `/products/company/{companyId}` - Get products by company |
| GET | `/api/products/{id}` | `/products/{id}` - Get product by ID |

### Supply Chain Endpoints ✅ FIXED
| Method | Frontend Call | Backend Route |
|--------|--------------|--------------|
| POST | `/api/supply-chain` | `/supply-chain` - Create node |
| GET | `/api/supply-chain/product/{productId}` | `/supply-chain/product/{productId}` - Get nodes |
| GET | `/api/supply-chain/{id}` | `/supply-chain/{id}` - Get node by ID |
| PUT | `/api/supply-chain/{id}` | `/supply-chain/{id}` - Update node |

### Supply Chain Endpoints ✅ FIXED
| Method | Frontend Call | Backend Route |
|--------|--------------|--------------|
| POST | `/api/supply-chain` | `/supply-chain` - Create node |
| GET | `/api/supply-chain/product/{productId}` | `/supply-chain/product/{productId}` - Get nodes |
| GET | `/api/supply-chain/{id}` | `/supply-chain/{id}` - Get node by ID |
| PUT | `/api/supply-chain/{id}` | `/supply-chain/{id}` - Update node |

### Analysis Endpoints
| Method | Frontend Call | Backend Route | Python Engine Call |
|--------|--------------|--------------|-------------------|
| POST | `/api/analysis/{productId}` | `/analysis/{productId}` - Run analysis | `POST /api/emissions/calculate-total` (Python) |
| GET | `/api/analysis/{productId}` | `/analysis/{productId}` - Get analysis result | N/A - Retrieves from DB |

---

## 🧪 Test Workflow

1. **Ensure All Services Running**:
   - Terminal 1: Backend `node server.js`
   - Terminal 2: Python engine `python main.py` 
   - Terminal 3: Frontend `npm run dev`

2. **Open Frontend**: `http://localhost:5173`

3. **Create Company**: 
   - Click "Register" tab
   - Fill in company details
   - Click "Create Company"

4. **Create Product**:
   - Click "New Product"
   - Fill in product name & net-zero target
   - Click "Create Product"

5. **Add Supply Chain Node**:
   - Click "Add Node"
   - Select stage, supplier, transport mode, distance
   - Click "Add Node"

6. **Run Analysis**:
   - Select your product from dropdown
   - Click "Run Analysis" button
   - ⚠️ **IMPORTANT**: Python engine must be running or this will fail with 500 error
   - View emissions dashboard

7. **Verify Success**:
   - Dashboard shows: total emissions, breakdown chart, optimization suggestions
   - No errors in browser console
   - Python terminal shows successful calculation logs

---

## ⚠️ Common Issues

### Backend Won't Start
**Error**: `Cannot find module 'express'`
**Solution**: 
```bash
cd backend
npm install
```

### Backend Connection Refused
**Error**: `net::ERR_CONNECTION_REFUSED` on port 5000
**Solution**: Make sure backend is running with `node server.js`

### MongoDB Connection Failed
**Error**: `MongoDB Connection Error`
**Solution**: 
- Check `.env` file has valid `MONGODB_URI`
- Verify MongoDB cluster is accessible
- Check IP whitelist on MongoDB Atlas

### Supply Chain Node 404 Error
**Status**: ✅ FIXED
Summary of fix: Changed API endpoints from `/supply-chain/nodes` to `/supply-chain/`

### Frontend Port Already in Use
**Error**: `Port 5173 already in use`
**Solution**: Kill existing process or use different port: `npm run dev -- --port 5174`

### Analysis Returns 500 Error
**Error**: `POST http://localhost:5000/api/analysis/{productId} 500 (Internal Server Error)`
**Causes & Solutions**:
1. **Python Engine Not Running** (Most Common)
   - The backend tries to call Python at `http://localhost:8000/api/emissions/calculate-total`
   - If Python engine isn't running, you get 500 error
   - Solution: Start Python engine in Terminal 2 (see Quick Start section)

2. **Python Engine Address Wrong**
   - Check that Python started on `http://127.0.0.1:8000`
   - Backend should show no connection error if engine runs

3. **Supply Chain Nodes Missing**
   - Error: `No supply chain nodes found for this product`
   - Solution: Add at least 1 supply chain node before running analysis

4. **MongoDB Issue**
   - Error: Product or collection not found
   - Solution: Verify MongoDB connection and databases exist

**Verify Python Engine is Running**:
```bash
curl http://localhost:8000/api/health
```
Response (if working):
```json
{
  "status": "healthy",
  "timestamp": "2026-02-21T..."
}
```

**Check Python Logs** for detailed error messages

---

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CarbonChain Pro                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Frontend (React + Vite)          Backend (Express)         │
│  ┌──────────────────────┐         ┌─────────────────┐      │
│  │ localhost:5173      │   HTTP   │ localhost:5000  │      │
│  │                     │◄────────►│                 │      │
│  │ • Login Page        │          │ • API Routes    │      │
│  │ • Dashboard         │          │ • Controllers   │      │
│  │ • Product Manager   │          │ • Services      │      │
│  │ • Supply Chain UI   │          │                 │      │
│  └──────────────────────┘         └─────────────────┘      │
│                                           │                 │
│                                           │ MongoDB Driver  │
│                                           ▼                 │
│                                    ┌──────────────┐        │
│                                    │   MongoDB    │        │
│                                    │   Cluster    │        │
│                                    └──────────────┘        │
│                                                              │
│  Python Engine (Optional)                                   │
│  ┌──────────────────────┐                                  │
│  │ localhost:8000      │                                  │
│  │ Emission Calculator  │                                  │
│  │ Net-Zero Tracker     │                                  │
│  └──────────────────────┘                                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## � Python Engine Setup

### Install Python Dependencies (First Time Only)
```bash
cd backend/emission_engine

# On Windows
pip install -r requirements.txt

# On Mac/Linux  
pip3 install -r requirements.txt
```

### Python Dependencies Included
- fastapi==0.109.0 - Web framework for Python API
- uvicorn==0.27.0 - ASGI server
- pydantic==2.5.3 - Data validation
- requests==2.31.0 - HTTP client
- pytest==7.4.3 - Testing framework

### Expected Python Terminal Output
```
INFO:     Started server process [12345]
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
```

### Access Python API Documentation
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
- Health Check: `http://localhost:8000/api/health`

### Backend (.env)
```
MONGODB_URI=mongodb+srv://[user]:[password]@[cluster].mongodb.net/...
PORT=5000
```

### Frontend (.env.local) - Optional
```
VITE_API_URL=http://localhost:5000/api
```

---

## ✅ Fixed Issues

### API Mismatch Resolution ✅
**Problem**: Frontend was calling `/api/supply-chain/nodes` but backend expects `/api/supply-chain/`

**Changes Made**:
- `POST /supply-chain/nodes` → `POST /supply-chain/`
- `GET /supply-chain/nodes/{id}` → `GET /supply-chain/{id}`
- `PUT /supply-chain/nodes/{id}` → `PUT /supply-chain/{id}`

**Files Updated**:
- `frontend/src/services/api.js` - Fixed 3 supply chain endpoint calls

### Python Engine Field Mapping ✅
**Problem**: Backend was sending camelCase fields but Python expected snake_case, and wrong endpoint

**Changes Made**:
- `stageName` → `stage_name`
- `transportMode` → `transport_mode`
- `distanceKm` → `distance_km`
- `energySource` → `energy_source`
- `transportCost` → `transport_cost`
- Endpoint: `/calculate` → `/api/emissions/calculate-total`

**Files Updated**:
- `backend/services/analysisService.js` - Fixed Python engine integration (37 lines updated)

**Result**: Analysis now correctly calls Python calculation engine with proper data format

---

## 🎯 Next Steps

1. ✅ Fix API endpoint mismatches (DONE)
2. ⏳ Start backend server: `cd backend && node server.js`
3. ⏳ Start frontend: `cd frontend && npm run dev`
4. ⏳ Test login workflow
5. ⏳ Verify all API calls succeed
6. ⏳ Test complete product-to-analysis flow

---

**Last Updated**: February 21, 2026
**Status**: Ready for testing
