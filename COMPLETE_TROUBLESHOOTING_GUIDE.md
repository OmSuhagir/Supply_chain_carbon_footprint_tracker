# Complete Troubleshooting & Debug Guide

## 📋 Quick Reference

| Error | Cause | Fix |
|-------|-------|-----|
| `GET /api/analysis... 404` | No analysis run yet (NORMAL) | ✅ Now returns 200 with null |
| `POST /api/analysis... 500` | Python engine not running | Start Python engine |
| `Cannot find module 'express'` | Missing dependencies | `npm install` in backend |
| `Connection refused :5000` | Backend not running | `node server.js` |
| `Connection refused :8000` | Python not running | `python main.py` |

---

## 🏃 Fastest Way to Get Running

### Step 1: Open 3 Terminal Windows

**Terminal 1 - Backend**
```bash
cd backend
node server.js
```
✓ Wait for: `MongoDB Connected Successfully`

**Terminal 2 - Python Engine** (IMPORTANT FOR ANALYSIS!)
```bash
cd backend/emission_engine
python main.py
```
✓ Wait for: `Application startup complete`

**Terminal 3 - Frontend**
```bash
cd frontend
npm run dev
```
✓ Wait for: `VITE v6.0.0 ready`

### Step 2: Test in Browser
1. Open `http://localhost:5173`
2. Register company
3. Create product + add node
4. Click "Run Analysis"
5. ✅ Should see dashboard (not error)

---

## 🐛 Common Issues & Fixes

### Issue: "Analysis failed - 500 Internal Server Error"

**Check 1**: Is Python engine running?
```bash
# In new terminal, try:
curl http://localhost:8000/api/health

# If you see error, Python isn't running
# Solution: Start it in Terminal 2
```

**Check 2**: Check Python terminal for errors
```
Look at Terminal 2 for traceback or error messages
Common issues:
- "Connection refused" on MongoDB
- "Module not found" for dependencies
- Syntax error in Python code
```

**Check 3**: Verify supply chain nodes exist
```
Before running analysis, you MUST have at least 1 node
Error message should be: "No supply chain nodes found for this product"
```

**Check 4**: Check backend logs
```bash
Terminal 1 (backend) should show:
> POST /api/analysis/69999e90154d93d8bc9bf405
> calling Python at http://localhost:8000/api/emissions/calculate-total

If not, analysis request never reached Python
```

---

### Issue: "GET /api/analysis... 404 Not Found"

**Status**: ✅ FIXED!

**What it means**:
- Product hasn't had analysis run yet (NORMAL for new products)
- Frontend NOW handles this gracefully

**No action needed** - the dashboard will show "Run Analysis" button

**If still seeing error**:
- Clear browser cache: `Ctrl+Shift+Delete`
- Refresh page: `Ctrl+R`
- Check DevTools console for any errors

---

### Issue: "Cannot Load Analysis Result"

**Before Fix**: ❌ Showed error message
**After Fix**: ✅ Dashboard appears with empty state

**If still seeing error**:
1. Frontend might be using cached version
2. Stop `npm run dev` and restart it
3. Hard refresh browser: `Ctrl+Shift+R`

---

## 🔍 Debug Checklist

Use this when something isn't working:

```
☐ Backend running?
  → Terminal 1: `node server.js`
  → Look for: "MongoDB Connected Successfully"

☐ Python engine running?
  → Terminal 2: `python main.py`
  → Look for: "Application startup complete"
  
☐ Frontend running?
  → Terminal 3: `npm run dev`
  → Look for: "VITE v6.0.0 ready in"

☐ Can reach backend?
  → Browser: curl http://localhost:5000/api/health
  → Should see: {"success": true, "message": "..."}

☐ Can reach Python?
  → Browser: curl http://localhost:8000/api/health
  → Should see: {"status": "healthy"}

☐ MongoDB connected?
  → Backend terminal:
  → Should see: "✅ MongoDB Connected Successfully"

☐ Can create company?
  → Try registering on frontend
  → Check MongoDB for "companies" collection

☐ Can create product?
  → Try creating product in frontend
  → Check MongoDB for "products" collection

☐ Can add supply chain node?
  → Try adding node in frontend
  → Check MongoDB for "supplychainodes" collection

☐ Can run analysis?
  → Try clicking "Run Analysis"
  → Check Python terminal for calculation output
  → Check MongoDB for "emissionresults" collection
```

---

## 🧪 Manual Test Workflow

### Test 1: Company Creation
```
Frontend → Register → Fill form → Submit
Expected: Success message, redirected to dashboard

If fails:
- Check backend logs for POST /api/companies error
- Verify MongoDB connection
- Check form validation (all fields required)
```

### Test 2: Product Creation
```
Frontend → New Product → Fill form → Submit
Expected: Product added, appears in selector dropdown

If fails:
- Same as above but for POST /api/products
- Verify company is selected
- Check yearly target is valid number
```

### Test 3: Supply Chain Node
```
Frontend → Add Node → Fill form → Submit
Expected: Node added, appears in list

If fails:
- POST /api/supply-chain fails
- Check all fields filled
- Verify product is selected
```

### Test 4: Analysis Execution
```
Frontend → Select product → Add node → Run Analysis
Expected: Dashboard with emissions chart

If fails (500 error):
- Python engine not running
- Check Python terminal for errors
- Verify node count > 0
- Check MongoDB has product

If no error but no data:
- Check browser console
- Reload page
- Verify analysis result saved to MongoDB
```

---

## 📡 API Testing with curl

### Test Backend Health
```bash
curl http://localhost:5000/api/health
```
Response:
```json
{
  "success": true,
  "message": "CarbonChain Pro Server is Running",
  "timestamp": "2026-02-21T..."
}
```

### Test Python Health
```bash
curl http://localhost:8000/api/health
```
Response:
```json
{
  "status": "healthy",
  "timestamp": "2026-02-21T..."
}
```

### Test Create Company
```bash
curl -X POST http://localhost:5000/api/companies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Company",
    "industry": "Manufacturing",
    "sustainabilityGoal": "Net Zero 2030",
    "headquartersLocation": "San Francisco"
  }'
```

### Test Get Analysis (Will Be Null for New Product)
```bash
# Replace with actual product ID
curl http://localhost:5000/api/analysis/69999e90154d93d8bc9bf405
```
Response (if no analysis yet):
```json
{
  "success": true,
  "message": "No analysis found for this product (expected for new products)",
  "data": null
}
```

---

## 🔧 Port Conflict Resolution

### Port 5000 Already in Use (Backend)
```bash
# Find process on port 5000
netstat -ano | findstr :5000

# Kill it (Windows)
taskkill /PID <PID> /F

# Or use different port
# Edit backend/.env and change PORT=5001
```

### Port 8000 Already in Use (Python)
```bash
# Find process on port 8000
netstat -ano | findstr :8000

# Kill it (Windows)
taskkill /PID <PID> /F

# Or run Python on different port
cd backend/emission_engine
python main.py --port 8001

# Then update backend analysisService.js to call http://localhost:8001
```

### Port 5173 Already in Use (Frontend)
```bash
# Kill existing process or use different port
npm run dev -- --port 5174
```

---

## 📊 Database Verification

### Check Collections Exist
```bash
# In MongoDB Atlas or mongo shell

# Check companies
db.companies.find().pretty()

# Check products
db.products.find().pretty()

# Check supply chain nodes
db.supplychainodes.find().pretty()

# Check analysis results  
db.emissionresults.find().pretty()

# Check optimizations
db.optimizationinsights.find().pretty()
```

---

## 🚨 Error Message Key

| Message | Meaning | Action |
|---------|---------|--------|
| "No analysis found for this product" | Normal, not an error | None - click "Run Analysis" |
| "Analysis failed" + 500 | Python engine down | Start Python engine |
| "Connection refused" | Service not running | Start backend/Python/frontend |
| "Product not found" | Wrong product ID | Refresh page |
| "Invalid MongoDB URI" | Bad DB connection | Check .env file |
| "No supply chain nodes" | Can't analyze empty product | Add at least 1 node first |

---

## ✅ After Fix Verification

✅ Creating new product shows NO errors  
✅ Selecting product shows "Run Analysis" button  
✅ Dashboard loads without 404 errors  
✅ Adding nodes works as expected  
✅ Running analysis (if Python running) shows dashboard  
✅ Browser console has NO error messages about 404  

---

## 🎯 Summary of Changes

| File | Changes | Impact |
|------|---------|--------|
| `analysisController.js` | Returns 200 instead of 404 | GET works for new products |
| `api.js` getAnalysisResult() | Handles 404 gracefully | No frontend errors |
| `api.js` getOptimizations() | Handles 404 gracefully | No frontend errors |
| `App.jsx` loadProductData() | Nested try/catch blocks | Robust error handling |

---

## 🚀 Success Indicators

When everything works:
- ✅ No red error messages in DevTools console
- ✅ No 404 errors loading products
- ✅ Dashboard appears cleanly after creating product
- ✅ Analysis completes in <5 seconds if Python running
- ✅ Emissions chart displays with real data

---

**Last Updated**: February 21, 2026  
**Version**: 1.0  
**Status**: All major errors fixed and documented
