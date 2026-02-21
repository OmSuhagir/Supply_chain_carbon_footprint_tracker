# 🚀 Complete Setup - Step by Step

## The Error & The Fix

**404 Error** = Backend server not restarted

**Fix** = Restart backend with: `npm start`

---

## ⏸️ Stop Everything First

Close all running services (or press Ctrl+C in all terminals):

```
X Close backend terminal
X Close frontend terminal  
X Close Python terminal
```

Wait 5 seconds for ports to free up.

---

## 🔧 Install Missing Dependency

Open **ONE** terminal and run:

```bash
cd C:\games\CodeliteHackthon\Supply_chain_carbon_footprint_tracker\backend
npm install bcrypt
```

Output should show:
```
added 3 packages
```

Close this terminal.

---

## 🏃 Start Services in Order

Open **3 separate terminals** and start in this order:

### Terminal 1: Python Engine
```bash
cd C:\games\CodeliteHackthon\Supply_chain_carbon_footprint_tracker\backend\emission_engine
python main.py
```

**Wait for:**
```
INFO: Uvicorn running on http://0.0.0.0:8000
```

✅ Leave running

---

### Terminal 2: Node.js Backend
```bash
cd C:\games\CodeliteHackthon\Supply_chain_carbon_footprint_tracker\backend
npm start
```

**Wait for:**
```
🚀 Server running on http://localhost:5000
```

✅ Leave running

---

### Terminal 3: React Frontend
```bash
cd C:\games\CodeliteHackthon\Supply_chain_carbon_footprint_tracker\frontend
npm run dev
```

**Wait for:**
```
Local: http://localhost:5173
```

✅ Leave running

---

## 🧪 Test Registration

**Step 1:** Open browser to http://localhost:5173

**Step 2:** Click "Register" tab

**Step 3:** Fill in the form:
```
Company Name: Test Company
Email: test@company.com
Password: Test123!
Confirm Password: Test123!
Industry: Manufacturing
Sustainability Goal: Net Zero by 2030
Headquarters Location: San Francisco, CA
```

**Step 4:** Click "Register Company"

**Expected Result:**
- ✅ Success message appears
- ✅ Auto-login to dashboard
- ✅ See welcome message with company name

---

## ✨ If Registration Works

Congratulations! 🎉

Now try:

1. **Create Product**
   - Click "Add Product" button
   - Fill in product details
   - Click "Add Product"

2. **Add Supply Chain Node**
   - Click "Add Node"
   - Fill in stage, location, transport method, distance
   - Click "Add Node"

3. **Run Analysis**
   - Python fetches data from MongoDB
   - Calculates emissions
   - Results display on dashboard

---

## 🆘 Troubleshooting

### Still Getting 404?

**Check 1:** Is Terminal 2 (backend) showing "Server running..."?
- If NO: Backend server not started
- If YES: Hard refresh browser (Ctrl+Shift+R)

**Check 2:** Open DevTools (F12) → Network tab
- Register company
- Look for request to: `POST .../api/companies/register`
- Should be **GREEN** (200 OK), not **RED** (404)

**Check 3:** Check backend console for errors
- Should NOT show any red errors
- Should show incoming request logs

---

### Backend Won't Start ("npm start" fails)?

**Solution:**
```bash
cd backend
npm install
npm start
```

If still fails:
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# If something is using it, kill it or use different port
# Edit .env and change PORT=5000 to PORT=5001
```

---

### Still Getting Different Error?

**Email Already Exists:**
- Register with different email
- Or check MongoDB and delete test records

**Password Too Short:**
- Use at least 6 characters
- Example: `Test123` ✅
- Example: `123` ❌

**Network Error (Can't reach backend):**
- Make sure backend terminal shows "Server running on port 5000"
- Make sure frontend shows "Local: http://localhost:5173"

---

## 📊 What Changed

| Layer | Before | After |
|-------|--------|-------|
| **Registration** | No email/password | Email + Password required |
| **Schema** | Name only | Email + hashed password |
| **Login** | Select company dropdown | Email + password form |
| **Authentication** | None | bcrypt password hashing |
| **Routes** | POST /companies | POST /register, POST /login |
| **Python** | Manual node input | Fetch from MongoDB |

---

## ✅ Final Checklist

Before testing:
- [ ] All 3 terminals have services running
- [ ] Backend shows "Server running on port 5000"
- [ ] Python shows "Uvicorn running on 0.0.0.0:8000"
- [ ] Frontend shows "Local: http://localhost:5173"
- [ ] Browser refreshed (Ctrl+Shift+R)
- [ ] No errors in dev console

After testing:
- [ ] Can register with email/password
- [ ] Can login with email/password
- [ ] Can create products
- [ ] Can add supply chain nodes
- [ ] Can run analysis

---

## 🎯 Summary

**Problem:** 404 error on `/api/companies/register`  
**Cause:** Backend server wasn't running with new code  
**Solution:** Run `npm start` in backend folder  
**Time to Fix:** 2 minutes  
**Result:** Full email/password authentication working ✅

All code is already written and in place! Just restart the backend server.
