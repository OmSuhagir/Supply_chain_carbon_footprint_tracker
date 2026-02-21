# 🚀 Complete System Testing Guide - Verify All Fixes

## Summary of Fixes Applied ✅

**Today's Fixes:**
1. ✅ **Optimization Route**: Changed from `GET /api/optimization/product/:productId` → `GET /api/optimization/:productId`
2. ✅ **Analysis Route Ordering**: Moved `/history/:productId` before `/:productId` to fix route matching
3. ✅ **Analysis 404 Handling**: Backend returns `200 { data: null }` instead of 404 for new products

**Previous Fixes:**
4. ✅ Supply chain endpoint corrections
5. ✅ Backend-Python emission engine integration
6. ✅ Company authentication & multi-tenant support

---

## Step 1: Prepare Your Environment

### Kill All Running Services
```bash
# If services are running, stop them:
# Terminal 1 (Frontend): Press Ctrl+C
# Terminal 2 (Backend): Press Ctrl+C
# Terminal 3 (Python): Press Ctrl+C

# Wait 5 seconds for all ports to free up
```

### Clear Browser Cache
```
Option A: Hard Refresh
- Windows/Linux: Press Ctrl+Shift+R
- Mac: Press Cmd+Shift+R

Option B: DevTools Cache Clearing
- Open DevTools (F12)
- Settings (⚙️) → Network → Check "Disable cache"
- Check "Bypass for network" (optional)
```

---

## Step 2: Start All Services in Order

### Terminal 1: Start Python Engine (Port 8000)
```bash
cd Supply_chain_carbon_footprint_tracker/backend/emission_engine

# Windows
python main.py

# Mac/Linux
python3 main.py
```

**Expected Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

### Terminal 2: Start Backend (Port 5000)
```bash
cd Supply_chain_carbon_footprint_tracker/backend

npm start
```

**Expected Output:**
```
Connection to MongoDB successful!
Server running on port 5000
Routes registered:
- /api/companies
- /api/products
- /api/supply-chain
- /api/analysis
- /api/optimization
- /api/net-zero-progress
```

### Terminal 3: Start Frontend (Port 5173)
```bash
cd Supply_chain_carbon_footprint_tracker/frontend

npm run dev
```

**Expected Output:**
```
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

**Browser:** Open http://localhost:5173

---

## Step 3: Open DevTools & Network Tab

```
1. Page open at http://localhost:5173
2. Press F12 to open DevTools
3. Click "Network" tab
4. Check "Preserve logs" ✓
5. Start with "XHR" filter selected
```

---

## Step 4: Test Complete Workflow

### Test A: Company Registration
```
ACTION: Click "Register Company" button

FILL IN:
- Company Name: "Test Company"
- Email: "test@company.com"
- Password: "Test123!"

NETWORK CHECKS:
✅ POST /api/companies should show 201
✅ Response should include company ID

SCREEN SHOWS:
✅ "Welcome Dashboard" with company name
✅ "Add Product" button visible
```

### Test B: Product Creation
```
ACTION: Click "Add Product"

FILL IN:
- Product Name: "Carbon Tracker Pro"
- Category: "Software"
- Quantity: 50
- Unit: "units"

NETWORK CHECKS:
✅ POST /api/products should show 201
✅ Response ID matches displayed product

SCREEN SHOWS:
✅ Product appears in dashboard
✅ "Supply Chain" card visible
```

### Test C: Add Supply Chain Node
```
ACTION: Click "Add Node" on Supply Chain card

FILL IN:
- Stage Name: "Manufacturing"
- Location: "China"
- Transport Method: "Ship"
- Distance (km): 12000
- Emissions (kg CO2): 500

NETWORK CHECKS:
❌ DO NOT IGNORE: If you see 404, it means route wasn't fixed properly
✅ POST /api/supply-chain should show 201

SCREEN SHOWS:
✅ Node appears in table
✅ Total distance shows 12000 km
```

### Test D: Get Analysis (Fix Test)
```
ACTION: On Dashboard, look for Analysis section
       Or click "Get Analysis" button if present

NETWORK CHECKS - THIS IS THE BIG TEST:
Before Fix: GET /api/analysis/{productId} → 404 ❌
After Fix:  GET /api/analysis/{productId} → 200 Data: null ✅

✅ Should NOT show 404 error (RED)
✅ Should show 200 (GREEN)
✅ Response should be: { success: true, data: null }

SCREEN SHOWS:
✅ No error message
✅ Analysis section displays or says "No analysis yet"
```

### Test E: Run Analysis (Python Integration)
```
ACTION: Click "Run Analysis" button (if present)
        Or manually trigger analysis calculation

NETWORK CHECKS:
✅ POST /api/analysis/{productId} should show 201
   (Backend calculates and returns result)

Python Engine Checks:
✅ Terminal 1 should show request log like:
   "POST /api/emissions/calculate-total"

SCREEN SHOWS:
✅ Dashboard updates with emissions data
✅ Charts show carbon footprint
❌ If 500 error: Python engine not running
```

### Test F: Optimization Data (Route Fix Test)
```
ACTION: Look for "Optimization" section on dashboard

NETWORK CHECKS - ANOTHER BIG TEST:
Before Fix: GET /api/optimization/product/{productId} → 404 (wrong path) ❌
After Fix:  GET /api/optimization/{productId} → 200 ✅

✅ Should NOT show 404
✅ Should show 200 with optimization data array

SCREEN SHOWS:
✅ Optimization recommendations display (or empty array if none)
✅ No error messages
```

---

## Step 5: Complete Network Tab Checklist

Open DevTools → Network tab and verify these requests:

| Request | Expected | Status |
|---------|----------|--------|
| POST /companies | 201 Created | ✅ |
| POST /products | 201 Created | ✅ |
| POST /supply-chain | 201 Created | ✅ |
| GET /analysis/{id} | 200 OK (data: null OK) | ✅ |
| POST /analysis/{id} | 201 Created | ✅ |
| GET /optimization/{id} | 200 OK | ✅ |

**Final Rule:** 
- ❌ **NO 404 ERRORS** - If seeing any red 404, routing issue not fully fixed
- ❌ **NO 500 ERRORS** - If seeing any 500, Python engine or request format issue
- ✅ **ALL SHOULD BE 2XX** - All successful responses

---

## Troubleshooting: If Tests Still Fail

### Symptom: Still Seeing 404 on Analysis or Optimization

**Check 1: Route Files Actually Changed**
```bash
# In backend folder, verify:
1. optimizationRoutes.js line 11 should be:
   router.get('/:productId', getOptimizationByProduct);
   
2. analysisRoutes.js line 8 should be:
   router.get('/history/:productId', getAnalysisHistory);
   (BEFORE router.get('/:productId', ...)
```

**Check 2: Backend Actually Restarted**
```bash
# Terminal 2: Look for these logs
Connection to MongoDB successful!
Server running on port 5000

# If not there, kill (Ctrl+C) and restart:
npm start
```

**Check 3: Frontend Cache Actually Cleared**
```bash
# In browser DevTools:
1. Press Ctrl+Shift+R (hard refresh)
2. Let page fully reload (wait for "ready")
3. Then refresh again Ctrl+R
4. Try action again
```

**Check 4: Correct Port**
- Frontend: http://localhost:5173 (NOT 5174)
- Backend: http://localhost:5000
- Python: http://localhost:8000

### Symptom: 404 on Analysis but NOT Wrong Route Error

**Check 1: Is Analysis Service Calling Python Correctly?**
```bash
# In backend console, run analysis and look for:
"POST http://localhost:8000/api/emissions/calculate-total"

# If NOT seeing this, Python integration not working
# Check: backend/services/analysisService.js
```

**Check 2: Is Python Engine Started?**
```bash
# Terminal 3 should show:
INFO: Uvicorn running on http://0.0.0.0:8000
INFO: Application startup complete

# If not there, restart Python:
python main.py
```

### Symptom: 500 Error on POST Analysis

**This means:** Python engine called but failed

**Solution:**
1. Check Python terminal for error message
2. Verify request format (snake_case, correct fields)
3. Verify Python dependencies: `pip install -r requirements.txt`
4. Restart Python engine

---

## Nuclear Option: Full Reset

If everything is broken, do this:

```bash
# 1. Kill all processes
# Ctrl+C on all terminals

# 2. Don't restart yet - wait 10 seconds

# 3. Clear Node cache
cd frontend
rm -rf node_modules dist
npm install

cd ../backend
rm -rf node_modules
npm install

# 4. Clear Python cache
cd emission_engine
rm -rf __pycache__

# 5. Restart in order (Python → Backend → Frontend)
python main.py          # Terminal 1
npm start               # Terminal 2
npm run dev             # Terminal 3

# 6. Hard refresh browser: Ctrl+Shift+R
```

---

## Success Criteria

✅ **System is working correctly when:**
1. Create company → 201 created
2. Create product → 201 created  
3. Add supply chain node → 201 created
4. Get analysis → 200 OK (data: null is fine)
5. Optimization endpoint → 200 OK (empty array is fine)
6. **No 404 errors anywhere**
7. Analysis can be run → 201 with calculation results
8. Dashboard shows emissions data

❌ **System has issues if:**
1. See 404 on analysis endpoint
2. See 404 on optimization endpoint
3. See 500 on analysis POST (Python engine issue)
4. Backend console shows connection errors
5. Python console shows errors

---

## Final Verification Commands

### Check Backend Routes Are Registered:
```bash
# Look in Terminal 2 (Backend):
# Should see something like:
Status: All routes registered successfully
Routes:
  POST /api/companies
  GET /api/companies
  POST /api/products
  GET /api/products
  GET /api/supply-chain/product/:productId
  POST /api/supply-chain
  ... etc
```

### Check Python Engine Ready:
```bash
# Terminal 1 should show:
INFO: Uvicorn running on http://0.0.0.0:8000
# Try: curl http://localhost:8000/health (if endpoint exists)
```

### Check Frontend Connected:
```
# Open http://localhost:5173
# Look at browser console
# Should NOT have CORS errors
# Should NOT have "Cannot GET" errors
```

---

**All fixes are now in place! Follow this guide to verify everything works. Report any remaining issues!**
