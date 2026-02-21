# Authentication Setup Guide - Email & Password Login

## 🔍 Understanding the 404 Error

**Error:** `POST /api/companies/register` returns 404 (Not Found)

**Root Cause:** The backend server must be restarted after adding new routes.

**Solution:** Restart all services in correct order.

---

## ✅ Changes Made

### 1. **Backend Database Schema** - Added Email & Password
**File:** `backend/models/schemas.js`
```javascript
// Added to companySchema:
email: {
  type: String,
  required: true,
  unique: true,
  index: true,
},
password: {
  type: String,
  required: true,
}
```

### 2. **Backend Routes** - Added Authentication Endpoints
**File:** `backend/routes/companyRoutes.js`
```javascript
// NEW ROUTES:
router.post('/register', registerCompany);  // Register with email/password
router.post('/login', loginCompany);        // Login with email/password
```

### 3. **Backend Controller** - Added Auth Functions
**File:** `backend/controllers/companyController.js`
```javascript
// NEW FUNCTIONS:
registerCompany(email, password, name, ...)  // Register company
loginCompany(email, password)                // Authenticate company
// Uses bcrypt for password hashing
```

### 4. **Frontend API Service** - Added Auth Methods
**File:** `frontend/src/services/api.js`
```javascript
registerCompany(companyData)         // Call POST /companies/register
loginCompany(email, password)        // Call POST /companies/login
```

### 5. **Frontend LoginPage** - Converted to Email/Password
**File:** `frontend/src/pages/LoginPage.jsx`
- Removed: Company dropdown selector
- Added: Email input field
- Added: Password input field
- Added: Confirm password (on register)
- Both login and registration now use email + password

### 6. **Python Backend** - MongoDB Integration
**File:** `backend/emission_engine/main.py` & `database.py`
```python
# NEW:
MongoDBManager.get_nodes_by_product_id(product_id)
# Fetches supply chain nodes from MongoDB
# Sends results to Node.js server
```

---

## 🚀 How to Start Everything

### Step 1: Stop All Running Services
```bash
# Close all terminal windows or press Ctrl+C on each
```

### Step 2: Install Dependencies
```bash
# Backend Node.js dependencies
cd backend
npm install

# Python dependencies  
cd emission_engine
pip install -r requirements.txt
# Installs: pymongo, requests, fastapi, uvicorn, etc.
```

### Step 3: Start Services in Order

**Terminal 1 - Python Engine (Port 8000)**
```bash
cd Supply_chain_carbon_footprint_tracker/backend/emission_engine
python main.py
# Should show: INFO: Uvicorn running on http://0.0.0.0:8000
```

**Terminal 2 - Node.js Backend (Port 5000)**
```bash
cd Supply_chain_carbon_footprint_tracker/backend
npm start
# Should show: 🚀 Server running on http://localhost:5000
```

**Terminal 3 - React Frontend (Port 5173)**
```bash
cd Supply_chain_carbon_footprint_tracker/frontend
npm run dev
# Should show: Local: http://localhost:5173
```

---

## 🔐 How Authentication Now Works

### Registration Flow
```
Frontend (Email/Password)
         ↓
POST /api/companies/register
         ↓
Backend validates input
         ↓
Backend hashes password with bcrypt
         ↓
Saves to MongoDB with email + hashed_password
         ↓
Returns company ID + data to frontend
         ↓
Frontend automatically logs in
```

### Login Flow
```
Frontend (Email/Password)
         ↓
POST /api/companies/login
         ↓
Backend finds company by email
         ↓
Backend verifies password with bcrypt
         ↓
Returns company ID + data
         ↓
Frontend proceeds to dashboard
```

---

## 📋 Complete Workflow Test

### 1. Register New Company
```
Go to http://localhost:5173
Click "Register" tab
Fill in:
  - Company Name: "Test Company"
  - Email: "test@company.com"
  - Password: "Test123"
  - Confirm Password: "Test123"
  - Industry: "Manufacturing"
  - Sustainability Goal: "Net Zero 2030"
Click "Register Company"

Expected: Registration successful → Auto-login → Dashboard appears
```

### 2. Create Product
```
On Dashboard, click "Add Product"
Fill in product details
Click "Add Product"

Expected: Product appears on dashboard
```

### 3. Add Supply Chain Node
```
Click "Add Node" on Supply Chain card
Fill in:
  - Stage: "Manufacturing"
  - Location: "China"
  - Transport: "Ship"
  - Distance: 10000 km
  - Emissions: 500 kg CO2
Click "Add Node"

Expected: Node appears in table
```

### 4. Run Analysis
```
Click "Get Analysis" or "Run Analysis"

Expected:
- Python engine fetches nodes from MongoDB
- Calculates emissions
- Sends results to Node.js server
- Dashboard updates with data
```

---

## 🆘 Troubleshooting

### Problem: Still Getting 404 on Register
**Solution:** 
1. Ensure backend server IS RUNNING (Terminal 2)
2. Hard refresh browser: Ctrl+Shift+R
3. Check backend console for errors
4. Verify route: POST http://localhost:5000/api/companies/register

### Problem: "Email already registered"
**Solution:**
- Register with a different email
- Or check MongoDB to delete old test records

### Problem: Python Engine Error "No module 'bson'"
**Solution:**
```bash
pip install pymongo
```

### Problem: Backend Won't Start
**Solution:**
1. Check if port 5000 is in use: `netstat -ano | findstr :5000`
2. Check MongoDB connection: `mongosh`
3. Check for missing dependencies: `npm install`

### Problem: Frontend Port Already in Use
**Solution:**
```bash
# Kill process on port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

---

## ✨ Key Points

1. **Email is now required** for registration (must be unique)
2. **Password is now required** (minimum 6 characters)
3. **Company login** uses email + password (no more dropdown)
4. **Python backend** now connects to MongoDB  
5. **All three services** must be running (Python, Node.js, React)

---

## 📝 API Endpoints Summary

| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| `/api/companies/register` | POST | Register company | None |
| `/api/companies/login` | POST | Login company | None |
| `/api/companies` | GET | List all companies | None |
| `/api/products` | POST | Create product | Company ID |
| `/api/supply-chain` | POST | Add supply chain node | Company ID |
| `/api/analysis/{productId}` | GET | Get analysis | Company ID |
| `/api/analysis/{productId}` | POST | Run analysis | Company ID |

---

**Status:** All authentication changes implemented ✅
**Next Step:** Restart all services and test registration flow
