# 🔧 FIX: 404 Error on /api/companies/register

## ❌ What's Wrong

**Error:** `POST /api/companies/register` → **404 Not Found**

**Why:** Backend server hasn't been restarted to load the new authentication routes.

---

## ✅ Solution: Restart Backend Server

### Quick Fix (3 Steps)

**Step 1:** Open terminal in backend folder
```bash
cd C:\games\CodeliteHackthon\Supply_chain_carbon_footprint_tracker\backend
```

**Step 2:** Verify dependencies are installed
```bash
npm install bcrypt
```

**Step 3:** Start the backend server
```bash
npm start
```

**Expected Output:**
```
🚀 Server running on http://localhost:5000
📊 Database: MongoDB
🌱 CarbonChain Pro - AI-Powered Supply Chain Carbon & Net-Zero Tracker
📚 API Documentation: http://localhost:5000/api
```

---

## 🔄 Required Running Services

All THREE must be running simultaneously:

1. **Python Engine** (Port 8000)
   ```bash
   cd backend/emission_engine
   python main.py
   ```

2. **Node.js Backend** (Port 5000) ← **This one was missing!**
   ```bash
   cd backend
   npm start
   ```

3. **React Frontend** (Port 5173)
   ```bash
   cd frontend
   npm run dev
   ```

---

## 🧪 Test After Restart

1. **Hard refresh browser:** Ctrl+Shift+R
2. **Go to:** http://localhost:5173
3. **Click:** "Register" tab
4. **Fill in:**
   - Company Name: "Test Corp"
   - Email: "test@test.com"
   - Password: "Test123"
   - Confirm: "Test123"
5. **Click:** "Register Company"

**Expected:** Registration succeeds and auto-logs in to dashboard ✅

---

## 📋 Code Changes Summary

| File | Change | Status |
|------|--------|--------|
| schemas.js | Added email + password to Company | ✅ Done |
| companyController.js | Added registerCompany() + loginCompany() functions | ✅ Done |
| companyRoutes.js | Added POST /register and POST /login routes | ✅ Done |
| api.js (frontend) | Added registerCompany() + loginCompany() functions | ✅ Done |
| LoginPage.jsx | Converted to email/password form | ✅ Done |
| database.py | Added get_nodes_by_product_id() function | ✅ Done |
| main.py | Updated calculate-total endpoint for MongoDB | ✅ Done |
| requirements.txt | Added pymongo dependency | ✅ Done |

---

## 💡 How It Works Now

```
User enters email & password in frontend
                ↓
Frontend calls: POST /api/companies/register
                ↓
Backend validates credentials
                ↓
Backend hashes password with bcrypt
                ↓
Backend saves company to MongoDB with email + hashed_password
                ↓
Backend returns company data
                ↓
Frontend stores company info
                ↓
User sees dashboard ✅
```

---

## ⚡ Next Steps

1. ✅ All code changes are complete
2. ⏳ **Restart backend server** (this fixes the 404)
3. 🧪 Test registration with email + password
4. 📊 Create product and add supply chain nodes
5. 🔍 Run analysis (Python engine will fetch data from MongoDB)

---

**Cause of 404:** Backend server not running or not restarted  
**Time to Fix:** 30 seconds (just restart the server)  
**Status:** All code is ready, just needs server restart!
