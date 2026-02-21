# 🔧 CarbonChain Pro - Complete Troubleshooting Guide

## Root Cause: Services Not Running

**All 0.00 values on dashboard = Python Engine or Backend not running**

### The Issue Explained

When you click "Run Analysis", this happens:
```
Frontend (React) 
  ↓ sends request
Node.js Backend (port 5000)
  ↓ fetches nodes from MongoDB
  ↓ sends to Python engine  
Python Engine (port 8000)
  ↓ calculates emissions ✗ FAILS if not running
Backend gets error
  ↓
Dashboard shows 0.00 for everything
```

---

## ✅ IMMEDIATE ACTION REQUIRED

### Step 1: Start Python Engine (CRITICAL)
```powershell
cd backend\emission_engine
python main.py
```

**Should see:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

**If you see errors:**
- `ModuleNotFoundError: No module named 'fastapi'` → Run: `pip install -r requirements.txt`
- `Port 8000 already in use` → Run: `netstat -ano | findstr :8000` then `taskkill /PID [PID] /F`

### Step 2: Start Node.js Backend (CRITICAL)
```powershell
cd backend
npm start
```

**Should see:**
```
🚀 Server running on http://localhost:5000
📊 Database: MongoDB
🌱 CarbonChain Pro - AI-Powered Supply Chain Carbon & Net-Zero Tracker
```

**If you see errors:**
- `Port 5000 already in use` → Run: `netstat -ano | findstr :5000` then `taskkill /PID [PID] /F`
- `ERR_MODULE_NOT_FOUND` → Run: `npm install` in backend folder

### Step 3: Start Frontend (Optional)
```powershell
cd frontend
npm run dev
```

**Go to:** http://localhost:5173

---

## 🧪 Verification Checklist

- [ ] **Python Engine running?** Visit http://localhost:8000/docs
- [ ] **Backend running?** Visit http://localhost:5000/api/health
- [ ] **Frontend running?** Visit http://localhost:5173
- [ ] **Added nodes to product?** Check "Add Node" in app
- [ ] **Clicked Run Analysis?** Check browser console for errors (F12)

---

## 📊 What Should Happen After Fix

### Before (Broken)
```
Total Emission: 0.00 tCO2e
Highest Stage: N/A
Carbon Efficiency: 0.00
Pie Chart: Empty
Forecast: Empty
```

### After (Fixed)
```
Total Emission: 4.5+ tCO2e
Highest Stage: Logistics / Raw Materials
Carbon Efficiency: 85+ /100
Pie Chart: Shows breakdown by stage
Forecast: Shows trend line with data points
```

---

## 🚀 Using START_ALL.bat

Instead of manual steps, use the batch file:

1. **Open folder:** `c:\games\CodeliteHackthon\Supply_chain_carbon_footprint_tracker\`
2. **Double-click:** `START_ALL.bat`
3. **Wait 5 seconds** for all terminals to open

This automatically:
- Starts Python Engine
- Starts Node.js Backend  
- Starts React Frontend
- Opens 3 new terminal windows

---

## 🔍 Debug Mode: View Actual Errors

When Analysis fails:

1. **Open Browser DevTools:** Press `F12`
2. **Go to Network tab**
3. **Click Run Analysis**
4. **Look for POST request** to `/api/analysis/[productId]`
5. **Check Response** tab - should show:
   - If error: `"hint": "Make sure Python engine is running..."`
   - If success: Full emission data with breakdown

---

## 📋 Complete Data Flow (For Reference)

```json
{
  "frontend_action": "Click Run Analysis",
  "request": {
    "method": "POST",
    "url": "http://localhost:5000/api/analysis/[productId]",
    "headers": { "Content-Type": "application/json" }
  },
  "backend_steps": [
    "1. Receive product ID",
    "2. Fetch SupplyChainNodes from MongoDB",
    "3. Map to Python format (camelCase → snake_case)",
    "4. POST to Python: http://localhost:8000/api/emissions/calculate-total",
    "5. Receive calculation results",
    "6. Save to EmissionResult in MongoDB",
    "7. Return to Frontend"
  ],
  "python_steps": [
    "1. Receive supply_chain_nodes array",
    "2. Load emission_factors.json",
    "3. For each node:",
    "   - Get transport_factor from emission_factors",
    "   - emission = distance_km × transport_factor + energy_factor",
    "4. Sum all emissions",
    "5. Find highest_emission_stage",
    "6. Return breakdown and totals"
  ],
  "frontend_display": {
    "total_emission": "from returned data",
    "highest_emission_stage": "from returned data",
    "nodes_breakdown": "used for pie chart",
    "efficiency_scores": "calculated by backend"
  }
}
```

---

## 🎯 Expected Results After Fix

Click Run Analysis, then check Dashboard shows:

| Metric | Expected Value | Location |
|--------|---|---|
| Total Emissions | 4.5+ tCO2e | Top left card |
| Highest Stage | "Logistics" or stage name | Top center card |
| Carbon Efficiency | 85+ /100 | Top right card |
| Pie Chart | Multi-colored breakdown | Bottom left  |
| Forecast Trend | Curve from Sep to Aug | Bottom center |
| Stage Ranking | "1. Logistics X.XX tCO2e" | Left sidebar |

---

## 🆘 Still Not Working?

### Check Server Logs
1. Look at **Python terminal** → Any errors?
2. Look at **Backend terminal** → Shows `[Analysis]` logs?
3. Look at **Browser console** (F12) → Any errors?

### Common Issues

**"Python Engine unavailable"** in browser error
- Python main.py not running
- Solution: Start Python engine in terminal 1

**"No supply chain nodes found"** in browser error
- No nodes added to product yet
- Solution: Click "Add Node" in app first

**"Connection refused"** errors
- Backend or Python not running
- Solution: Check both are in Running state

---

## ✅ Once Everything Works

Your dashboard will show:
1. Real-time emission calculations
2. Pie charts with stage breakdown
3. Forecast trends  
4. Optimization recommendations
5. Net-zero alignment status
6. Carbon reduction opportunities

---

**Last Updated:** February 21, 2026  
**CarbonChain Pro v1.0.0**
