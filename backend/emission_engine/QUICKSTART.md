# ⚡ Quick Start Guide - Python Engine

Get the Python emission engine running in 5 minutes!

## 🚀 Quick Setup

### 1. Open Terminal/Command Prompt
```bash
cd emission_engine
```

### 2. Create & Activate Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Start Server
```bash
python main.py
```

You should see:
```
============================================================
🚀 CarbonChain Pro - Emission Calculation Engine
============================================================
Starting FastAPI server...
Server will run on: http://localhost:8000
API Documentation: http://localhost:8000/docs
============================================================
```

## ✅ Server is Running!

### Access Documentation:
- **Interactive API Docs**: http://localhost:8000/docs
- **Read-only Docs**: http://localhost:8000/redoc

### Test a Quick Call:
Open http://localhost:8000/docs and click on any endpoint to test it!

## 📝 Example: Calculate Emission

Go to `/api/emissions/calculate-single-node` endpoint and try:

```json
{
  "stage_name": "Raw Material Transport",
  "transport_mode": "truck",
  "distance_km": 500,
  "energy_source": "gas"
}
```

Expected response:
```json
{
  "success": true,
  "data": {
    "stage_name": "Raw Material Transport",
    "transport_mode": "truck",
    "distance_km": 500,
    "transport_emission": 60.0,
    "energy_source": "gas",
    "energy_emission": 0.5,
    "total_emission": 60.5
  },
  "timestamp": "2026-02-21T..."
}
```

## 🔌 Call from Node.js

```javascript
// In your Node.js Express backend
const response = await fetch('http://localhost:8000/api/emissions/calculate-single-node', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    stage_name: 'Raw Material Transport',
    transport_mode: 'truck',
    distance_km: 500,
    energy_source: 'gas'
  })
});

const data = await response.json();
console.log(data); // Print the response
```

## 📊 All Available Endpoints

### Emission Calculations
- `POST /api/emissions/calculate-single-node` - One node emission
- `POST /api/emissions/calculate-total` - All nodes emission
- `POST /api/emissions/transport-comparison` - Compare transport modes
- `POST /api/emissions/energy-comparison` - Compare energy sources

### Net-Zero Tracking
- `POST /api/net-zero/calculate-alignment` - Alignment %
- `POST /api/net-zero/forecast-year-end` - Forecast
- `POST /api/net-zero/progress-metrics` - Progress metrics
- `POST /api/net-zero/milestones` - Milestones

### Optimization
- `POST /api/optimization/compare-scenarios` - Compare scenarios
- `POST /api/optimization/business-risk-score` - Risk score

### Business Intelligence
- `POST /api/intelligence/carbon-efficiency` - Carbon score
- `POST /api/intelligence/cost-efficiency` - Cost score
- `POST /api/intelligence/time-efficiency` - Time score
- `POST /api/intelligence/all-efficiency-scores` - All scores
- `POST /api/intelligence/strategic-recommendations` - Recommendations

### Audit Reports
- `POST /api/audit/generate-report` - Full audit report

## 🧪 Test All Features

Use the Swagger UI at http://localhost:8000/docs to test all endpoints interactively!

## 🛑 Stop Server

Press `Ctrl+C` in the terminal

## ⚡ Pro Tips

1. **Keep terminal open** - Server runs in the terminal, don't close it
2. **Check documentation** - Visit /docs to see all endpoints
3. **Test before using** - Test endpoints in Swagger before calling from Node.js
4. **Check error messages** - Helpful error messages in terminal

## ❓ Issues?

- **Port already in use?** Change port in `main.py` line 300
- **Module not found?** Make sure virtual environment is activated
- **Can't call from Node.js?** Check CORS settings in `main.py`

## 🎯 Next Steps

1. ✅ Start Python engine
2. → Start Node.js backend
3. → Connect Node.js to Python
4. → Save results to MongoDB
5. → Start React frontend
6. → Test full flow

**Ready to move to Node.js backend setup!**
