# Backend-Python Engine Integration Fix

## 🔧 Problem Summary

The frontend was getting **500 Internal Server Error** when attempting to run analysis because:

1. **Wrong Endpoint**: Backend called `/calculate` but Python exposed `/api/emissions/calculate-total`
2. **Wrong Data Format**: Backend sent camelCase fields (stageName, transportMode) but Python expected snake_case (stage_name, transport_mode)
3. **Missing Field**: Python expected `supplier_name` but backend didn't include it or use correct naming
4. **Wrong Response Structure**: Backend expected different response field names than Python returned

---

## ✅ Changes Made

### File: `backend/services/analysisService.js`

**Before:**
```javascript
// WRONG: Incorrect endpoint and field names
const pythonResponse = await axios.post('http://localhost:8000/calculate', {
  supplyChain: supplyChainData, // Wrong wrapper key
});

const supplyChainData = nodes.map((node) => ({
  stageName: node.stageName,          // WRONG: Should be snake_case
  transportMode: node.transportMode,  // WRONG: Should be snake_case
  distanceKm: node.distanceKm,        // WRONG: Should be snake_case
  energySource: node.energySource,    // WRONG: Should be snake_case
  transportCost: node.transportCost,
}));
```

**After:**
```javascript
// CORRECT: Proper endpoint and field names
const pythonResponse = await axios.post('http://localhost:8000/api/emissions/calculate-total', {
  supply_chain_nodes: supplyChainData, // CORRECT: Matches Python schema
});

const supplyChainData = nodes.map((node) => ({
  stage_name: node.stageName,              // CORRECT: snake_case
  supplier_name: node.supplierName || '',  // CORRECT: Added missing field
  transport_mode: node.transportMode,      // CORRECT: snake_case
  distance_km: node.distanceKm,            // CORRECT: snake_case
  energy_source: node.energySource,        // CORRECT: snake_case
  transport_cost: node.transportCost || 0, // CORRECT: Default to 0
  transport_time_days: node.transportTimeDays || 0, // CORRECT: Added field
}));
```

**Response Parsing Fixed:**
```javascript
// BEFORE: Incorrect field names
const {
  totalEmission,           // WRONG: Field doesn't exist
  highestEmissionStage,    // WRONG: Field doesn't exist
  carbonEfficiencyScore,   // WRONG: Python doesn't calculate this
} = pythonResponse.data;

// AFTER: Correct field names from Python
const emissionData = pythonResponse.data.data || pythonResponse.data;
const {
  total_emission,           // CORRECT: Matches Python output
  highest_emission_stage,   // CORRECT: Matches Python output
  nodes_breakdown,          // CORRECT: Newly accessible breakdown
} = emissionData;
```

---

## 📊 Data Flow

### Before (Broken)
```
Frontend → Backend sends camelCase data → 
Python receives but can't parse → 
Returns 500 error ❌
```

### After (Fixed)
```
Frontend → Backend converts to snake_case → 
Python receives proper EmissionRequest → 
Calculates emissions with correct formula → 
Returns total_emission, nodes_breakdown → 
Backend saves to MongoDB → 
Frontend displays dashboard ✅
```

---

## 🔄 Field Mapping Table

| JavaScript (Node.js) | Python (FastAPI) | Type | Purpose |
|----------------------|------------------|------|---------|
| stageName | stage_name | string | Supply chain stage |
| supplierName | supplier_name | string | Supplier company name |
| transportMode | transport_mode | string | truck/rail/ship/air |
| distanceKm | distance_km | float | Distance in kilometers |
| energySource | energy_source | string | coal/gas/solar/wind/hydro |
| transportCost | transport_cost | float | Cost of transportation |
| transportTimeDays | transport_time_days | float | Time in days for transport |

---

## 🚀 Testing the Fix

### Step 1: Start Python Engine
```bash
cd backend/emission_engine
pip install -r requirements.txt
python main.py
```
✓ Should show: `Application startup complete`

### Step 2: Start Backend
```bash
cd backend
node server.js
```
✓ Should show: `MongoDB Connected Successfully`

### Step 3: Start Frontend
```bash
cd frontend
npm run dev
```
✓ Should show: `VITE v6.0.0 ready`

### Step 4: Test Full Workflow
1. Open `http://localhost:5173`
2. Create company → Create product → Add supply chain node
3. Click "Run Analysis"
4. ✓ Should see dashboard with emissions data (NOT 500 error)

---

## 🧪 Verify Integration

### Check Python Health
```bash
curl http://localhost:8000/api/health
```
Response:
```json
{
  "status": "healthy",
  "timestamp": "2026-02-21T10:30:45.123Z"
}
```

### Check Backend Can Reach Python
Terminal: Look for logs showing successful emission calculation

### Check MongoDB Has Data
```bash
# Check EmissionResult collection was created
db.emissionresults.findOne()
```

---

## 📝 Python Endpoints Available

### 1. Calculate Single Node Emission
```
POST /api/emissions/calculate-single-node
Input: Single SupplyChainNode object
Output: Node emission breakdown
```

### 2. Calculate Total Emissions (USED BY BACKEND)
```
POST /api/emissions/calculate-total
Input: EmissionRequest { supply_chain_nodes: [...] }
Output: {
  total_emission: float,
  node_count: int,
  highest_emission_stage: string,
  highest_emission_value: float,
  average_emission_per_node: float,
  nodes_breakdown: [ ... ]
}
```

### 3. Compare Transport Modes
```
POST /api/emissions/transport-comparison
Input: distance_km, current_mode
Output: Emissions for all transport modes
```

### 4. Net-Zero Alignment
```
POST /api/netzero-progress/calculate-alignment
Input: yearly_target, current_emission
Output: Alignment percentage and status
```

---

## 🎯 Error Prevention Checklist

✅ **Before Running Analysis**:
- [ ] Python engine started (`http://localhost:8000`)
- [ ] Backend running (`http://localhost:5000`)
- [ ] Frontend running (`http://localhost:5173`)
- [ ] Product created with yearly net-zero target
- [ ] At least 1 supply chain node added to product

✅ **If "Run Analysis" Shows 500 Error**:
- [ ] Check Python engine terminal for errors
- [ ] Verify `http://localhost:8000/api/health` returns 200
- [ ] Check MongoDB connection in backend logs
- [ ] Verify supply chain nodes exist for product

✅ **If No Analysis Appears**:
- [ ] Check `EmissionResult` collection in MongoDB
- [ ] Look for error messages in Python terminal
- [ ] Verify response format from Python matches expectation

---

## 🔐 Production Considerations

1. **Error Handling**: Added fallback calculations if Python unavailable
2. **Field Validation**: All required fields checked before sending to Python
3. **Response Parsing**: Safely extracts nested data from Python response
4. **Timeout**: Consider adding request timeout for slow Python engine

---

**Last Updated**: February 21, 2026  
**Status**: Integration fixed and ready for testing
