# 🐍 CarbonChain Pro - Python Emission Engine

This directory contains the Python FastAPI-based computation engine for CarbonChain Pro. It handles all carbon calculations, net-zero tracking, optimization analysis, and business intelligence scoring.

## 📂 File Structure

```
emission_engine/
├── main.py                        # FastAPI server (entry point)
├── emission_calculator.py         # Core emission calculations
├── net_zero_tracker.py            # Net-zero target tracking
├── optimization_engine.py         # Cost-Carbon-Time tradeoff analysis
├── business_intelligence.py       # Efficiency scoring and recommendations
├── audit_report_generator.py      # Audit report data generation
├── utils.py                       # Helper functions
├── emission_factors.json          # Reference emission data
├── requirements.txt               # Python dependencies
└── README.md                      # This file
```

## 🎯 What Python Handles

The Python engine is responsible for:

### 1. **Emission Calculations** (`emission_calculator.py`)
- Transport emission = distance × transport_factor
- Energy emission = 1 × energy_factor
- Per-node total emission
- Product-level aggregation
- Highest emission stage identification

### 2. **Net-Zero Tracking** (`net_zero_tracker.py`)
- Net-zero alignment % calculation
- Status determination (RED/AMBER/GREEN)
- Year-end emission forecasting
- Progress metrics
- Milestone tracking

### 3. **Optimization Engine** (`optimization_engine.py`)
- Compare current vs alternative scenarios
- Calculate carbon saved/lost
- Calculate cost impact
- Calculate time tradeoff
- Business risk scoring
- Hybrid logistics recommendations

### 4. **Business Intelligence** (`business_intelligence.py`)
- Carbon Efficiency Score (0-100)
- Cost Efficiency Score (0-100)
- Time Efficiency Score (0-100)
- Strategic recommendations
- Benchmark comparisons

### 5. **Audit Report Generation** (`audit_report_generator.py`)
- Comprehensive report data structure
- Methodology documentation
- Risk analysis
- Executive summary
- JSON output for PDF backend

---

## 🚀 Installation & Setup

### Step 1: Navigate to emission_engine directory
```bash
cd emission_engine
```

### Step 2: Create Python Virtual Environment
```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

---

## ⚙️ How to Run

### Start the FastAPI Server
```bash
python main.py
```

The server will start on `http://localhost:8000`

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

### Access API Documentation
- **Swagger UI (Interactive)**: http://localhost:8000/docs
- **ReDoc (Read-only)**: http://localhost:8000/redoc

---

## 📡 API Endpoints

The Python engine exposes these REST endpoints for the Node.js backend to call:

### Health Check
```
GET /health
GET /
```

### Emission Calculations
```
POST /api/emissions/calculate-single-node
POST /api/emissions/calculate-total
POST /api/emissions/transport-comparison
POST /api/emissions/energy-comparison
```

### Net-Zero Tracking
```
POST /api/net-zero/calculate-alignment
POST /api/net-zero/forecast-year-end
POST /api/net-zero/progress-metrics
POST /api/net-zero/milestones
```

### Optimization
```
POST /api/optimization/compare-scenarios
POST /api/optimization/business-risk-score
```

### Business Intelligence
```
POST /api/intelligence/carbon-efficiency
POST /api/intelligence/cost-efficiency
POST /api/intelligence/time-efficiency
POST /api/intelligence/all-efficiency-scores
POST /api/intelligence/strategic-recommendations
```

### Audit Reports
```
POST /api/audit/generate-report
```

---

## 💻 Example API Calls

### Example 1: Calculate Total Emission

#### Request (from Node.js):
```javascript
// From Node.js backend
fetch('http://localhost:8000/api/emissions/calculate-total', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    supply_chain_nodes: [
      {
        stage_name: "Raw Material",
        transport_mode: "truck",
        distance_km: 500,
        energy_source: "coal"
      },
      {
        stage_name: "Supplier",
        transport_mode: "rail",
        distance_km: 1000,
        energy_source: "gas"
      }
    ]
  })
})
```

#### Response (from Python):
```json
{
  "success": true,
  "data": {
    "total_emission": 87.0,
    "node_count": 2,
    "highest_emission_stage": "Raw Material",
    "highest_emission_value": 60.0,
    "average_emission_per_node": 43.5,
    "nodes_breakdown": [
      {
        "stage_name": "Raw Material",
        "transport_emission": 60.0,
        "energy_emission": 0.9,
        "total_emission": 60.9,
        "percentage_of_total": 70.0
      },
      {
        "stage_name": "Supplier",
        "transport_emission": 40.0,
        "energy_emission": 0.5,
        "total_emission": 40.5,
        "percentage_of_total": 46.6
      }
    ]
  },
  "timestamp": "2026-02-21T10:30:00.000Z"
}
```

### Example 2: Calculate Net-Zero Alignment

#### Request:
```javascript
fetch('http://localhost:8000/api/net-zero/calculate-alignment', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    yearly_target: 50000,
    current_emission: 32000
  })
})
```

#### Response:
```json
{
  "success": true,
  "data": {
    "alignment_percentage": 36.0,
    "remaining_emission_budget": 18000,
    "status": "critical",
    "label": "Off Track",
    "is_on_track": false,
    "color": "#EF4444"
  },
  "timestamp": "2026-02-21T10:31:00.000Z"
}
```

---

## 🔄 How Node.js Backend Integrates

### In Node.js/Express:

```javascript
// Example route in Node.js that calls Python engine

router.post('/api/analyze-product', async (req, res) => {
  try {
    const { supplyChainNodes, yearlyTarget, currentEmission } = req.body;
    
    // Call Python engine for emission calculation
    const emissionResponse = await fetch('http://localhost:8000/api/emissions/calculate-total', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ supply_chain_nodes: supplyChainNodes })
    });
    
    const emissionData = await emissionResponse.json();
    
    // Call Python engine for net-zero alignment
    const netZeroResponse = await fetch('http://localhost:8000/api/net-zero/calculate-alignment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        yearly_target: yearlyTarget,
        current_emission: currentEmission
      })
    });
    
    const netZeroData = await netZeroResponse.json();
    
    // Combine results and save to MongoDB
    const analysisResult = {
      emissions: emissionData.data,
      netZero: netZeroData.data,
      analyzedAt: new Date()
    };
    
    // Save to MongoDB
    const savedResult = await EmissionResults.create(analysisResult);
    
    res.json({ success: true, data: savedResult });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

---

## 📊 Data Flows

### Complete Analysis Flow:

```
Frontend (React)
    ↓
Node.js/Express Backend
    ↓
    ├─→ Python Engine (Emission Calculation) → /api/emissions/calculate-total
    ├─→ Python Engine (Net-Zero Tracking) → /api/net-zero/calculate-alignment
    ├─→ Python Engine (Business Intelligence) → /api/intelligence/all-efficiency-scores
    ├─→ Python Engine (Optimization) → /api/optimization/compare-scenarios
    └─→ Python Engine (Audit Report) → /api/audit/generate-report
    ↓
MongoDB (Store Results)
    ↓
Frontend (Display Dashboards & Reports)
```

---

## 🧮 Calculation Formulas

### Emission Calculation
```
Emission per Node = (distance_km × transport_factor) + (1 × energy_factor)

Transport Factors:
- Truck: 0.12 kg CO2/km
- Rail: 0.04 kg CO2/km
- Ship: 0.02 kg CO2/km
- Air: 0.60 kg CO2/km

Energy Factors:
- Coal: 0.9 kg CO2/unit
- Gas: 0.5 kg CO2/unit
- Solar: 0.05 kg CO2/unit
- Wind: 0.02 kg CO2/unit
- Hydro: 0.01 kg CO2/unit
```

### Net-Zero Alignment
```
Alignment % = ((Target - Current Emission) / Target) × 100

Status:
< 50% → RED (Off Track)
50-80% → AMBER (At Risk)
> 80% → GREEN (On Track)
```

### Efficiency Scores
```
Carbon Efficiency = (Benchmark / Actual) × 100
Cost Efficiency = (Benchmark / Actual) × 100
Time Efficiency = (Benchmark / Actual) × 100

All scores: 0-100 (100 = best)
```

---

## 🔌 Module Documentation

### `emission_calculator.py`

**Main Class**: `EmissionCalculator`

Methods:
- `calculate_node_emission(node_data)` - Single node emission
- `calculate_product_total_emission(nodes)` - Total product emission
- `get_transport_mode_comparison(distance_km, current_mode)` - Transport comparison
- `get_energy_source_comparison()` - Energy source comparison

### `net_zero_tracker.py`

**Main Class**: `NetZeroTracker`

Methods:
- `calculate_net_zero_alignment(yearly_target, current_emission)` - Alignment %
- `forecast_year_end_emission(current_emission, days_passed, yearly_target)` - Forecast
- `calculate_progress_metrics(yearly_target, current_emission, days_passed)` - Progress
- `get_milestone_recommendations(yearly_target, current_emission)` - Milestones

### `optimization_engine.py`

**Main Class**: `OptimizationEngine`

Methods:
- `compare_alternatives(current_scenario, alternative_scenario)` - Scenario comparison
- `calculate_business_risk_score(time_increase_days, demand_urgency)` - Risk scoring
- `get_optimization_recommendations(current_scenario, alternatives)` - Recommendations

### `business_intelligence.py`

**Main Class**: `BusinessIntelligence`

Methods:
- `calculate_carbon_efficiency_score(actual_emission, benchmark_emission)` - Carbon score
- `calculate_cost_efficiency_score(actual_cost, benchmark_cost)` - Cost score
- `calculate_time_efficiency_score(actual_time, benchmark_time)` - Time score
- `generate_strategic_recommendations(...)` - Strategic advice

### `audit_report_generator.py`

**Main Class**: `AuditReportGenerator`

Methods:
- `generate_audit_report_data(...)` - Complete audit report

---

## 📝 Usage Example Walkthrough

### Scenario: Analyze a product's supply chain

**Step 1**: Node.js receives request
```javascript
{
  productId: "prod_123",
  supplyChainNodes: [
    { stage_name: "Raw Material", distance_km: 500, transport_mode: "truck", energy_source: "coal" },
    { stage_name: "Processing", distance_km: 200, transport_mode: "rail", energy_source: "gas" },
    { stage_name: "Distribution", distance_km: 1000, transport_mode: "truck", energy_source: "gas" }
  ],
  yearlyTarget: 50000,
  currentEmission: 32000
}
```

**Step 2**: Node.js calls Python engine

```javascript
// Call emission calculation
const emissions = await fetchPython('/api/emissions/calculate-total', supplyChainNodes);
// Result: total_emission: 250.5 kg CO2

// Call net-zero alignment
const alignment = await fetchPython('/api/net-zero/calculate-alignment', {
  yearly_target: 50000,
  current_emission: 32000
});
// Result: alignment_percentage: 36%, status: "critical"

// Call efficiency scores
const efficiency = await fetchPython('/api/intelligence/all-efficiency-scores', {
  actual_emission: 250.5,
  actual_cost: 5000,
  actual_time: 10
});
// Result: carbon_score: 65, cost_score: 54, time_score: 70
```

**Step 3**: Node.js saves to MongoDB
```javascript
const result = new EmissionResults({
  product_id: 'prod_123',
  total_emission: 250.5,
  highest_emission_stage: 'Distribution',
  carbon_efficiency_score: 65,
  cost_efficiency_score: 54,
  net_zero_alignment_percentage: 36,
  created_at: new Date()
});
await result.save();
```

**Step 4**: Frontend displays results
- Shows 250.5 kg CO2 total emission
- Shows 36% alignment (RED status)
- Shows efficiency gauges
- Shows optimization recommendations

---

## 🧪 Testing the Python Engine

### Manual Testing with cURL:

```bash
# Test emission calculation
curl -X POST "http://localhost:8000/api/emissions/calculate-single-node" \
  -H "Content-Type: application/json" \
  -d '{
    "stage_name": "Transport",
    "transport_mode": "truck",
    "distance_km": 500,
    "energy_source": "gas"
  }'

# Test net-zero alignment
curl -X POST "http://localhost:8000/api/net-zero/calculate-alignment" \
  -H "Content-Type: application/json" \
  -d '{
    "yearly_target": 50000,
    "current_emission": 32000
  }'

# Test efficiency score
curl -X POST "http://localhost:8000/api/intelligence/carbon-efficiency" \
  -X POST http://localhost:8000/api/intelligence/carbon-efficiency?actual_emission=250.5
```

### Testing with Python requests:

```python
import requests

# Test emission
response = requests.post('http://localhost:8000/api/emissions/calculate-single-node', json={
    'stage_name': 'Transport',
    'transport_mode': 'truck',
    'distance_km': 500,
    'energy_source': 'gas'
})
print(response.json())
```

---

## 🔧 Troubleshooting

### Issue: Port 8000 already in use
```bash
# Kill process on port 8000
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :8000
kill -9 <PID>
```

### Issue: ModuleNotFoundError
```bash
# Make sure virtual environment is activated
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

# Then reinstall dependencies
pip install -r requirements.txt
```

### Issue: CORS errors
- The server is pre-configured to accept requests from React (localhost:5173) and Node.js (localhost:3000)
- To add more origins, edit the CORS configuration in `main.py`

---

## 🚀 Performance Tips

1. **Caching**: Python engine calculates quickly, but consider caching frequently-used factors
2. **Batch Processing**: Send multiple nodes together rather than one-by-one
3. **Connection Pooling**: Node.js should maintain persistent connections to Python engine
4. **Load Testing**: Use tools like Apache JMeter to test high loads

---

## 📚 References

- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **GHG Protocol**: https://ghgprotocol.org/
- **Uvicorn**: https://www.uvicorn.org/
- **Pydantic**: https://docs.pydantic.dev/

---

## 🎓 Code Comments

All Python files are heavily commented to explain:
- What each function does
- Accept parameters and return values
- Calculation logic and formulas
- Integration points with Node.js

Start with `main.py` to understand the overall structure!

---

## ✅ Beginner Checklist

- [ ] Created virtual environment
- [ ] Installed dependencies from requirements.txt
- [ ] Started Python server with `python main.py`
- [ ] Confirmed server running on http://localhost:8000
- [ ] Tested API endpoint in Swagger UI (/docs)
- [ ] Can call endpoint from Node.js Express
- [ ] Results are being stored in MongoDB

---

## 🤝 Need Help?

Each Python file has:
- Detailed docstrings for every function
- Parameter descriptions
- Return value documentation
- Example usage comments

Read the code comments - they explain everything!

---

**Created for CarbonChain Pro Hackathon 2026**
