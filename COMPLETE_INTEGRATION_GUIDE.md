# CarbonChain Pro - Complete Integration & Setup Guide

## Full Stack Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend                        │
│              (Vite + Tailwind + Recharts)               │
│         Runs on: http://localhost:5173                  │
└──────────────────────┬──────────────────────────────────┘
                       │ (HTTP/Axios)
                       ↓
┌─────────────────────────────────────────────────────────┐
│               Node.js Backend (Express)                  │
│        Database: MongoDB (Local or Atlas)                │
│         Runs on: http://localhost:5000                  │
└──────────────────────┬──────────────────────────────────┘
                       │ (Internal API Calls)
                       ↓
┌─────────────────────────────────────────────────────────┐
│        Python Computation Engine (FastAPI)              │
│         Emission Calculations & Analytics               │
│         Runs on: http://localhost:8000                  │
└─────────────────────────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────┐
│       MongoDB Database (Stores All Data)                 │
│    Connection: mongodb://localhost:27017 (local)       │
└─────────────────────────────────────────────────────────┘
```

## Prerequisites

### System Requirements

- **Operating System:** Windows, macOS, Linux
- **RAM:** Minimum 4GB (8GB recommended)
- **Disk Space:** 5GB free space

### Required Software

1. **Node.js & NPM**
   - Download: https://nodejs.org/ (LTS version)
   - Verify: `node --version && npm --version`

2. **Python 3.x**
   - Download: https://www.python.org/
   - Verify: `python --version`

3. **MongoDB**
   - Option A: Local MongoDB
     - Download: https://www.mongodb.com/try/download/community
   - Option B: MongoDB Atlas (Cloud - Recommended)
     - Create free account: https://www.mongodb.com/cloud/atlas

4. **Git** (for cloning the repository)
   - Download: https://git-scm.com/

## Step-by-Step Setup

### Part 1: MongoDB Setup

#### Option A: MongoDB Atlas (Cloud - Recommended)

1. Create an account at https://www.mongodb.com/cloud/atlas
2. Create a free tier cluster
3. Add database user:
   - Username: `carbonchain`
   - Password: (generate secure password)
4. Get connection string:
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/carbonchain`
5. Whitelist your IP address

#### Option B: Local MongoDB

1. Download and install MongoDB Community Server
2. Start MongoDB:
   - **Windows:** MongoDB starts as service
   - **macOS/Linux:** `mongod` command
3. Default connection: `mongodb://localhost:27017`

### Part 2: Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/carbonchain
   # OR for Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/carbonchain
   NODE_ENV=development
   ```

4. **Start backend server:**
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

   **Expected Output:**
   ```
   ✓ CarbonChain Pro Server is Running
   ✓ Connected to MongoDB
   Server running on port 5000
   ```

5. **Test backend health:**
   - Open browser: http://localhost:5000/api/health
   - Should see: `"success": true`

### Part 3: Python Computation Engine Setup

1. **Navigate to emission_engine directory:**
   ```bash
   cd backend/emission_engine
   ```

2. **Create Python virtual environment:**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

   **Required packages** (from requirements.txt):
   - FastAPI
   - Uvicorn
   - Pandas
   - NumPy
   - Pydantic

4. **Start Python computation engine:**
   ```bash
   python main.py
   # or
   uvicorn main:app --reload --port 8000
   ```

   **Expected Output:**
   ```
   INFO:     Uvicorn running on http://127.0.0.1:8000
   INFO:     Application startup complete
   ```

5. **Test Python API:**
   - Open browser: http://localhost:8000/docs
   - Should see: Swagger API documentation

### Part 4: Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Verify backend URLs in `src/services/api.js`:**
   ```javascript
   const API_BASE_URL = 'http://localhost:5000/api';
   ```

4. **Start frontend development server:**
   ```bash
   npm run dev
   ```

   **Expected Output:**
   ```
   VITE v6.x.x  ready in xxx ms

   ➜  Local:   http://localhost:5173/
   ```

5. **Open browser:**
   - Navigate to: http://localhost:5173

## Complete Setup Checklist

```
Backend Services:
☐ MongoDB running (local or Atlas)
☐ Node.js backend running on port 5000
☐ Python computation engine running on port 8000
☐ Backend health check passing
☐ Python API docs visible at http://localhost:8000/docs

Frontend:
☐ Frontend dev server running on port 5173
☐ No console errors in browser
☐ Backend status shows "Connected"

Database:
☐ MongoDB accessible
☐ Collections created after first run
☐ Sample company and product created
```

## Running for First Time

### Terminal Setup (Windows PowerShell / macOS/Linux Terminal)

**Option 1: Separate Terminals (Recommended)**

**Terminal 1 - MongoDB (if using local):**
```bash
mongod
```

**Terminal 2 - Python Backend:**
```bash
cd backend/emission_engine
python -m venv venv
# On Windows: venv\Scripts\activate
# On macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
python main.py
```

**Terminal 3 - Node.js Backend:**
```bash
cd backend
npm start
```

**Terminal 4 - Frontend:**
```bash
cd frontend
npm run dev
```

**Option 2: Using npm-run-all (Run Multiple Scripts)**

In `package.json` root:
```json
{
  "scripts": {
    "dev": "npm-run-all --parallel dev:frontend dev:backend",
    "dev:frontend": "cd frontend && npm run dev",
    "dev:backend": "cd backend && npm run dev"
  }
}
```

Then run: `npm run dev`

## Demo Workflow

### Test the Complete Application

1. **Open Frontend:**
   - Navigate to http://localhost:5173

2. **Create Company:**
   - System automatically creates "Demo Sustainable Corp"

3. **Create Product:**
   - Click "New Product"
   - Name: "Eco-Friendly Smartphone"
   - Net-Zero Target: 50000 tCO2e
   - Click "Create Product"

4. **Add Supply Chain Nodes:**
   - Select created product
   - Click "Add Node"
   - Add 3-4 nodes with different stages:

     **Node 1 - Raw Materials:**
     - Stage: "Raw Materials"
     - Supplier: "Eco Materials Ltd"
     - Transport: Ship
     - Distance: 2000 km
     - Energy: Solar
     - Cost: $1500
     - Time: 14 days

     **Node 2 - Manufacturing:**
     - Stage: "Manufacturing"
     - Supplier: "Green Factory"
     - Transport: Truck
     - Distance: 500 km
     - Energy: Wind
     - Cost: $2000
     - Time: 3 days

     **Node 3 - Distribution:**
     - Stage: "Distribution"
     - Supplier: "Logistics Hub"
     - Transport: Rail
     - Distance: 1000 km
     - Energy: Gas
     - Cost: $800
     - Time: 2 days

5. **Run Analysis:**
   - Click "Run Analysis" button
   - Wait for calculation (5-10 seconds)

6. **View Dashboard:**
   - See total emissions
   - View emissions by stage (bar chart)
   - Check net-zero alignment
   - Review optimization recommendations

7. **Analyze Results:**
   - Bar chart shows each stage's emissions
   - Pie chart shows breakdown percentage
   - Forecast trend shows projected emissions
   - Recommendations suggest transport mode changes
   - See cost vs. time tradeoffs

## Troubleshooting

### Issue: "Cannot connect to backend"

**Solution:**
1. Ensure Node.js backend is running on port 5000
2. Check `src/services/api.js` has correct API_BASE_URL
3. Check browser console for CORS errors
4. Restart backend: `npm start`

### Issue: "MongoDB connection failed"

**Solution:**
1. Verify MongoDB is running
2. Check connection string in `.env`:
   ```
   # Local:
   MONGODB_URI=mongodb://localhost:27017/carbonchain
   
   # Atlas:
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/carbonchain
   ```
3. Test connection: 
   ```bash
   mongo "mongodb://localhost:27017"
   ```

### Issue: "Python module 'pandas' not found"

**Solution:**
```bash
cd backend/emission_engine
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install pandas numpy fastapi uvicorn
```

### Issue: "Port 5000 already in use"

**Solution:**
```bash
# Kill process on port 5000
# Windows:
lsof -i :5000
kill -9 <PID>

# macOS/Linux:
lsof -i :5000
kill -9 <PID>

# Or change port in backend .env:
PORT=5001
```

### Issue: "Charts not loading"

**Solution:**
1. Check browser console for errors
2. Ensure supply chain nodes have emission values
3. Restart frontend: Stop `npm run dev` and restart
4. Clear browser cache: Ctrl+Shift+Del

### Issue: "Demo Mode" instead of "Connected"

**Solution:**
1. Frontend cannot reach backend
2. Ensure backend is running
3. Check API_BASE_URL in `src/services/api.js`
4. Check for CORS errors in browser DevTools

## API Endpoints Reference

### Health & Status
```
GET /api/health
```

### Companies
```
POST   /api/companies              # Create company
GET    /api/companies              # List companies
GET    /api/companies/:id          # Get company
PUT    /api/companies/:id          # Update company
DELETE /api/companies/:id          # Delete company
```

### Products
```
POST   /api/products               # Create product
GET    /api/products/company/:id   # Get products by company
GET    /api/products/:id           # Get product
PUT    /api/products/:id           # Update product
DELETE /api/products/:id           # Delete product
```

### Supply Chain Nodes
```
POST   /api/supply-chain/nodes                # Add node
GET    /api/supply-chain/product/:id         # Get product nodes
GET    /api/supply-chain/nodes/:id           # Get specific node
PUT    /api/supply-chain/nodes/:id           # Update node
DELETE /api/supply-chain/nodes/:id           # Delete node
```

### Analysis
```
POST   /api/analysis/:productId              # Run analysis
GET    /api/analysis/:productId              # Get latest result
GET    /api/analysis/history/:productId      # Get history
```

### Optimization
```
POST   /api/optimization                     # Create optimization
GET    /api/optimization/product/:id         # Get optimizations
```

### Net-Zero Progress
```
POST   /api/netzero-progress                 # Record progress
GET    /api/netzero-progress/product/:id    # Get progress history
```

## Environment Variables

### Backend `.env`

```
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/carbonchain
# OR
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/carbonchain

# Python Engine
PYTHON_ENGINE_URL=http://localhost:8000
```

### Frontend `.env.local`

```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=CarbonChain Pro
```

## Production Deployment

### Frontend Build

```bash
cd frontend
npm run build
```

Outputs to `dist/` directory. Deploy to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

### Backend Deployment

Use:
- Heroku
- AWS EC2
- Google Cloud Run
- DigitalOcean
- Railway.app

### Python Deployment

Use:
- AWS Lambda + API Gateway
- Google Cloud Functions
- Heroku
- Railway.app
- Render

### Database Deployment

MongoDB Atlas is recommended for production (fully managed service).

## Performance Optimization

### Frontend
```bash
# Build optimization
npm run build

# Check bundle size
npm install -g vite-bundle-visualizer
npx vite build --analyze
```

### Backend
```bash
# Use production mode
NODE_ENV=production npm start

# Monitor performance
npm install pm2 -g
pm2 start server.js -i max
```

### Database
- Enable indexing on frequently queried fields
- Use connection pooling
- Monitor query performance

## Monitoring & Logging

### Check All Services Status

```bash
# Terminal 1: Check MongoDB
mongo
> db.stats()

# Terminal 2: Check Node.js backend
curl http://localhost:5000/api/health

# Terminal 3: Check Python engine
curl http://localhost:8000/docs

# Terminal 4: Check Frontend
curl http://localhost:5173
```

## Next Steps

After successful setup:

1. **Explore Dashboard:** Interact with all features
2. **Run Sample Analysis:** Test with different transport modes
3. **Review Code:** Understand the architecture
4. **Customize:** Modify for your organization
5. **Deploy:** Follow production deployment guide

## Support & Resources

- **Backend Issues:** Check `backend/README.md`
- **Python Issues:** Check `backend/emission_engine/README.md`
- **Frontend Issues:** Check `frontend/FRONTEND_SETUP_GUIDE.md`
- **General Issues:** Check main `README.md`

---

## Quick Start Summary

```bash
# 1. Terminal 1 - Python
cd backend/emission_engine
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate
pip install -r requirements.txt
python main.py

# 2. Terminal 2 - Node.js
cd backend
npm install
npm start

# 3. Terminal 3 - Frontend
cd frontend
npm install
npm run dev

# 4. Open browser to http://localhost:5173
```

**Time to first load:** ~2-3 minutes with all three services running

---

**CarbonChain Pro** - AI-Powered Supply Chain Carbon & Net-Zero Tracker

*Helping companies balance sustainability, cost efficiency, and business continuity while achieving net-zero commitments.*
