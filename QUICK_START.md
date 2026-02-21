# CarbonChain Pro - Quick Start Checklist

## Pre-Flight Check ✈️

Before you begin, make sure you have:

```
☐ Node.js 16+ installed (check: node --version)
☐ Python 3.8+ installed (check: python --version)
☐ MongoDB running (local or Atlas account ready)
☐ Git installed (for cloning if needed)
☐ Terminal/Command Prompt open
☐ Code editor (VS Code recommended)
```

## 5-Minute Setup

### Step 1: Start MongoDB ⚙️ (1 minute)

**Option A - Local MongoDB:**
```bash
# Windows: MongoDB starts as service automatically
# macOS/Linux:
mongod
# Should show: Waiting for connections on port 27017
```

**Option B - MongoDB Atlas (Recommended):**
- Create account: https://www.mongodb.com/cloud/atlas
- Create cluster
- Get connection string
- Note: `mongodb+srv://username:password@cluster.mongodb.net/carbonchain`

### Step 2: Start Python Engine (1 minute)

```bash
# Open new terminal window

# Navigate to Python directory
cd backend/emission_engine

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate
# OR activate (macOS/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start Python server
python main.py

# Expected: ✓ INFO: Uvicorn running on http://127.0.0.1:8000
```

✅ **Python ready when:** You see "Uvicorn running" message

### Step 3: Start Backend (1 minute)

```bash
# Open new terminal window

# Navigate to backend
cd backend

# Install dependencies (first time only)
npm install

# Create .env file with:
echo PORT=5000 > .env
echo MONGODB_URI=mongodb://localhost:27017/carbonchain >> .env
# OR (for Atlas): echo MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/carbonchain >> .env

# Start backend
npm start
# OR with auto-reload:
npm run dev

# Expected: ✓ Server running on port 5000
```

✅ **Backend ready when:** You see "Server running on port 5000"

### Step 4: Start Frontend (1 minute)

```bash
# Open new terminal window

# Navigate to frontend
cd frontend

# Install dependencies (first time only)
npm install

# Start dev server
npm run dev

# Expected: ✓ Local: http://localhost:5173/
```

✅ **Frontend ready when:** You see development server message

### Step 5: Open Browser (1 minute)

```
Open: http://localhost:5173
```

✅ Check top-right corner shows: **"Connected"** (not "Demo Mode")

---

## Create Your First Analysis 📊

### Quick Demo (2-3 minutes)

1. **Create Product**
   - Click "New Product"
   - Name: "Test Product"
   - Net-Zero Target: **50000** (tCO2e)
   - Click "Create Product"

2. **Add Supply Chain Nodes** (Click "Add Node" 3 times)

   **Node 1:**
   - Stage: `Raw Materials`
   - Supplier: `Supplier A`
   - Transport: `ship`
   - Distance: `2000`
   - Energy: `wind`
   - Cost: `1000`
   - Time: `14` days
   - Click "Add Supply Chain Node"

   **Node 2:**
   - Stage: `Manufacturing`
   - Supplier: `Factory B`
   - Transport: `truck`
   - Distance: `500`
   - Energy: `solar`
   - Cost: `2000`
   - Time: `3` days
   - Click "Add Supply Chain Node"

   **Node 3:**
   - Stage: `Distribution`
   - Supplier: `Logistics C`
   - Transport: `rail`
   - Distance: `1000`
   - Energy: `gas`
   - Cost: `800`
   - Time: `2` days
   - Click "Add Supply Chain Node"

3. **Run Analysis**
   - Select your product from dropdown
   - Click blue "Run Analysis" button
   - Wait 5-10 seconds for calculation

4. **View Dashboard**
   - ✅ See total emissions
   - ✅ View emissions by stage (bar chart)
   - ✅ Check net-zero alignment %
   - ✅ Review optimization recommendations
   - ✅ Analyze cost vs. carbon tradeoffs

---

## Verification Checklist ✓

After 5-minute setup, verify everything:

### Backend Services Running

```bash
# Test 1: MongoDB
mongo
> use carbonchain
> db.products.count()
# Should show: 0 (or more if you created products)

# Test 2: Python Engine
curl http://localhost:8000/docs
# Should open Swagger UI in browser

# Test 3: Node.js Backend
curl http://localhost:5000/api/health
# Should show: {"success": true, "message": "..."}

# Test 4: Frontend
Open http://localhost:5173
# Should load dashboard
```

### Frontend Status

```
Top-right corner:
☐ Shows small green dot + "Connected"
☐ NOT showing "Demo Mode"
☐ No red error messages
☐ Can click buttons without errors
```

### Database Connection

```bash
# MongoDB Atlas test (if using cloud):
mongo "mongodb+srv://username:password@cluster.mongodb.net/carbonchain"
> show databases
# Should list carbonchain database
```

---

## Troubleshooting 🔧

### "Cannot connect to backend" in frontend

**Check:**
1. Backend terminal shows "Server running on port 5000"
2. `http://localhost:5000/api/health` returns JSON
3. Check `frontend/src/services/api.js` line 8:
   ```javascript
   const API_BASE_URL = 'http://localhost:5000/api';
   ```

**Fix:**
```bash
# Backend terminal
npm start
# Should see: "Server running on port 5000"
```

### "Cannot connect to MongoDB"

**Check:**
1. MongoDB is running
2. Connection string is correct in `.env`

**Fix:**
```bash
# For local:
echo MONGODB_URI=mongodb://localhost:27017/carbonchain > backend/.env

# For Atlas:
echo MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/carbonchain > backend/.env

# Restart backend:
npm start
```

### "ModuleNotFoundError: No module named 'fastapi'"

**Fix:**
```bash
cd backend/emission_engine
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python main.py
```

### "Port 5000 already in use"

**Fix:**
```bash
# macOS/Linux:
lsof -i :5000
kill -9 <PID>

# Windows PowerShell:
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process

# Or change port in backend/.env:
echo PORT=5001 >> .env
```

### Charts not showing in dashboard

**Check:**
1. You added 3+ supply chain nodes
2. You clicked "Run Analysis" button
3. Frontend shows no errors in console (F12)

**Fix:**
```bash
# Backend terminal - check logs for errors
# Frontend terminal - clear and restart:
npm run dev
```

---

## Terminal Summary 📋

You should have **4 terminal windows** open:

```
Terminal 1 - MongoDB
└─ mongod
   Status: ✓ Waiting for connections on port 27017

Terminal 2 - Python
└─ backend/emission_engine/ > python main.py
   Status: ✓ INFO: Uvicorn running on http://127.0.0.1:8000

Terminal 3 - Backend
└─ backend/ > npm start
   Status: ✓ Server running on port 5000

Terminal 4 - Frontend
└─ frontend/ > npm run dev
   Status: ✓ Local: http://localhost:5173
   Browser: ✓ Shows connected status
```

---

## Demo Flow for Judges 🏆

**Time: 3 minutes**

1. **Show Product** (15 sec)
   - "We created a product with a yearly carbon target"
   - Point to net-zero target value

2. **Show Supply Chain** (30 sec)
   - "3 supply chain stages with different transport modes"
   - Point to nodes in form

3. **Run Analysis** (10 sec)
   - Click "Run Analysis"
   - Point to loading message

4. **Show Dashboard** (60 sec)
   - Total emissions: "120 tCO2e total footprint"
   - Bar chart: "Manufacturing is the biggest emitter at 60 tCO2e"
   - Net-zero: "We're 80% on track to our target"
   - Pie chart: "Distribution breakdown by stage"
   - Forecast: "Trending down with our optimizations"
   - Recommendations: "Switch to rail saves carbon but adds 2 days - business tradeoff"

5. **Key Message** (45 sec)
   - "CarbonChain Pro isn't just about carbon"
   - "It balances three things: Sustainability, Cost, Time"
   - "That's what makes us different from other calculators"
   - "Companies can now make informed decisions"

---

## Files Modified/Created 📁

### Created Files:
```
frontend/
├── tailwind.config.js              ✓ New
├── postcss.config.js               ✓ New
├── FRONTEND_SETUP_GUIDE.md         ✓ New
├── src/
│   ├── components/
│   │   ├── Header.jsx              ✓ New
│   │   ├── Dashboard.jsx           ✓ New
│   │   ├── SummaryCard.jsx         ✓ New
│   │   ├── EmissionsBarChart.jsx   ✓ New
│   │   ├── EmissionPieChart.jsx    ✓ New
│   │   ├── ForecastTrend.jsx       ✓ New
│   │   └── OptimizationPanel.jsx   ✓ New
│   ├── pages/
│   │   ├── AddProductPage.jsx      ✓ New
│   │   └── AddSupplyChainNodePage.jsx ✓ New
│   ├── services/
│   │   └── api.js                  ✓ New
│   ├── utils/
│   │   └── formatting.js           ✓ New
│   └── App.jsx                     ✓ Updated

project_root/
├── README.md                        ✓ Updated
└── COMPLETE_INTEGRATION_GUIDE.md    ✓ New
```

### Modified Files:
```
frontend/package.json               ✓ Updated (added dependencies)
frontend/src/index.css             ✓ Updated (Tailwind + custom styles)
frontend/src/App.css               ✓ Updated
```

---

## Performance Expected 🚀

| Operation | Time |
|-----------|------|
| Frontend Load | 1-2 sec |
| Create Product | <1 sec |
| Add Node | <1 sec |
| Run Analysis | 5-10 sec |
| View Dashboard | <1 sec |
| Load Chart | <500ms |

---

## Success Indicators ✅

Your setup is successful when:

```
✓ Frontend loads at http://localhost:5173
✓ No error messages in UI
✓ Status shows "Connected" (not "Demo Mode")
✓ Can create a product
✓ Can add supply chain nodes
✓ Can run analysis (changes to "Analyzing...")
✓ Dashboard displays all sections
✓ Bar chart shows emissions per stage
✓ Pie chart shows breakdown
✓ Forecast trend line displays
✓ Optimization panel shows recommendations
✓ All numbers display correctly
✓ Charts are responsive (try resizing window)
```

---

## Next Steps After Setup 🎯

1. **Explore Features**
   - Try different transport modes
   - Create multiple products
   - Compare cost vs. carbon

2. **Understand the Data**
   - Review emission calculations
   - Study the optimization recommendations
   - Check net-zero alignment math

3. **Customize**
   - Modify emission factors
   - Add more supply chain stages
   - Adjust colors/branding

4. **Deploy**
   - Build frontend: `npm run build`
   - Deploy to Vercel/Netlify
   - Deploy backend to Heroku/Railway
   - Use MongoDB Atlas for database

---

## Common Commands Quick Reference 📝

```bash
# Start services
npm run dev              # Frontend
npm start               # Backend
python main.py          # Python
mongod                  # MongoDB

# Install dependencies
npm install             # JavaScript
pip install -r requirements.txt  # Python

# Build for production
npm run build           # Frontend

# Check status
curl http://localhost:5000/api/health
curl http://localhost:8000/docs
npm list                # Check npm versions
```

---

## Support Links 🔗

- **Node.js Issues:** https://nodejs.org/
- **Python Issues:** https://www.python.org/
- **MongoDB Issues:** https://www.mongodb.com/docs/
- **React Docs:** https://react.dev
- **Vite Docs:** https://vitejs.dev
- **Tailwind Docs:** https://tailwindcss.com

---

## You're All Set! 🎉

**You now have a production-ready supply chain carbon tracking system.**

Your setup is complete when all 4 services show "ready" status and frontend connects to backend.

**Estimated time to completion: 10-15 minutes**

**Questions?** Check the full guides:
- 📖 [Complete Integration Guide](./COMPLETE_INTEGRATION_GUIDE.md)
- 🎨 [Frontend Setup](./frontend/FRONTEND_SETUP_GUIDE.md)
- 🔧 [Main README](./README.md)

---

**CarbonChain Pro** - Ready to Transform Supply Chain Sustainability 🌍
