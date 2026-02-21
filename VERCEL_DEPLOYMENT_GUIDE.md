# 🚀 Step-by-Step Vercel Deployment Guide

This is a complete walkthrough to deploy CarbonChain Pro to Vercel. Follow each step carefully.

---

## ✅ Prerequisites

Before starting, ensure you have:

- ✔️ GitHub account (https://github.com)
- ✔️ Vercel account (https://vercel.com - sign up with GitHub)
- ✔️ MongoDB Atlas account (https://www.mongodb.com/cloud/atlas)
- ✔️ Google Gemini API key (https://console.cloud.google.com)
- ✔️ Project pushed to GitHub

---

## 📝 Step 1: Verify Project Structure

Ensure your project has these files (already created):

```
Supply_chain_carbon_footprint_tracker/
├── vercel.json                    ✅ (created)
├── .vercelignore                  ✅ (created)
├── .env.example                   ✅ (created)
├── .env.local                     ✅ (created)
├── ENV_CONFIGURATION.md           ✅ (created)
├── DEPLOYMENT.md                  ✅ (created)
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   └── src/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── config/
│   └── services/
└── api/
    ├── index.js                   ✅ (created)
    ├── health.js                  ✅ (created)
    └── python/
        └── main.py                ✅ (created)
```

**Verify these files exist:**
```bash
cd d:\Hackathon\CodeLite\Project\Latest\Supply_chain_carbon_footprint_tracker

# Check for required files
dir vercel.json
dir .vercelignore
dir api\index.js
dir frontend\package.json
dir backend\package.json
```

---

## 🔐 Step 2: Prepare MongoDB Atlas

### 2.1 Create MongoDB Atlas Database

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign in or create an account
3. Click **Create a Deployment** → **Build a Database**
4. Choose **Free** tier
5. Select cloud provider and region (e.g., `AWS`, `us-east-1`)
6. Click **Create Deployment**

### 2.2 Create Database User

1. Go to **Database Access** (left sidebar)
2. Click **Add New User**
3. Choose **Password** authentication
4. Create username: `carbonchain_admin`
5. Create password: `YourStrongPassword123!` (copy this)
6. **Database User Privileges**: `Read and write to any database`
7. Click **Add User**

### 2.3 Whitelist IP

1. Go to **Network Access** (left sidebar)
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (0.0.0.0/0) - for Vercel
4. Click **Confirm**

### 2.4 Get Connection String

1. Go to **Databases** → your deployment
2. Click **Connect** button
3. Choose **Drivers**
4. Select **Node.js** version 4.1 or later
5. Copy the connection string (looks like):
   ```
   mongodb+srv://carbonchain_admin:PASSWORD@cluster0.xxxxx.mongodb.net/carbonchain?retryWrites=true&w=majority
   ```
6. **Replace `PASSWORD`** with your password from Step 2.2
7. **Replace `carbonchain`** with your database name

**Save this string** - you'll need it in Step 6.

---

## 🔑 Step 3: Get API Keys

### 3.1 Google Gemini API Key

1. Go to https://console.cloud.google.com
2. Create a new project or select existing
3. Enable **Generative Language API**
4. Go to **APIs & Services** → **Credentials**
5. Click **Create Credentials** → **API Key**
6. Copy the API key
7. **Save this key** - you'll need it in Step 6

### 3.2 Generate JWT Secret

Open PowerShell and run:

```powershell
# Generate a random secure string
$secret = [Convert]::ToBase64String((1..32 | ForEach-Object { [byte](Get-Random -Min 0 -Max 256) }))
Write-Output $secret
```

Copy the output - **you'll need it in Step 6**.

---

## 📤 Step 4: Push Project to GitHub

### 4.1 Check Git Status

```powershell
cd "d:\Hackathon\CodeLite\Project\Latest\Supply_chain_carbon_footprint_tracker"

# Check git status
git status

# You should see .env.local, .env.example, vercel.json, etc. as untracked
```

### 4.2 Configure Git (First Time Only)

```powershell
# Set your GitHub username
git config --global user.name "Your Name"

# Set your GitHub email
git config --global user.email "your.email@github.com"
```

### 4.3 Create `.gitignore` if Missing

**File: `.gitignore` in project root**

Verify it exists and contains:
```
node_modules
.env
.env.local
.env.*.local
dist
build
__pycache__
*.pyc
.venv
venv
.vercel
```

### 4.4 Commit and Push

```powershell
# Add all files
git add .

# Commit
git commit -m "Prepare for Vercel deployment: add vercel.json, env config, serverless functions"

# Check remote (should show origin pointing to GitHub)
git remote -v

# Push to GitHub
git push origin main

# If you get auth error, use GitHub token (create at https://github.com/settings/tokens)
```

**If you don't have a GitHub repository yet:**

```powershell
# Go to https://github.com/new and create a new repository
# Copy the repository URL (e.g., https://github.com/your-username/carbonchain.git)

# Back in PowerShell:
git remote add origin https://github.com/your-username/carbonchain.git
git branch -M main
git push -u origin main
```

---

## 🌐 Step 5: Connect Vercel to GitHub

### 5.1 Visit Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click **New Project**
3. Under "Import Git Repository", look for your repository
4. If not visible, click **Search** and find it
5. Click **Import**

### 5.2 Configure Project Settings

On the **Import Project** screen:

1. **Project Name**: `carbonchain-pro` (or your preferred name)
2. **Root Directory**: Leave as `.` (dot)
3. **Framework Preset**: Select **Other**
4. **Build Command**: 
   ```
   npm run build --prefix frontend && npm install --prefix backend
   ```
5. **Output Directory**: `frontend/dist`
6. **Install Command**: 
   ```
   npm install --legacy-peer-deps --prefix frontend && npm install --prefix backend
   ```

**Screenshot reference:**
```
┌─────────────────────────────────────────────┐
│ Project Name: carbonchain-pro               │
│ Root Directory: ./                          │
│ Framework: Other                            │
│ Build Command: npm run build...             │
│ Output Directory: frontend/dist             │
│ Install Command: npm install...             │
└─────────────────────────────────────────────┘
```

---

## 🔐 Step 6: Set Environment Variables

### 6.1 Before Clicking Deploy

**DON'T CLICK DEPLOY YET!** 

Click **Environment Variables** section and add each variable:

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | (from Step 2.4) |
| `JWT_SECRET` | (from Step 3.2) |
| `GEMINI_API_KEY` | (from Step 3.1) |
| `NODE_ENV` | `production` |
| `PYTHON_BACKEND_URL` | `http://localhost:8000` (for now) |
| `NODE_BACKEND_URL` | `https://your-project.vercel.app` (after deployment) |
| `ALLOWED_ORIGINS` | `https://your-project.vercel.app` (after deployment) |

**Exact Steps:**

1. Scroll down to **Environment Variables**
2. Click **Add Environment Variable**
3. For first variable:
   - Name: `MONGODB_URI`
   - Value: `mongodb+srv://carbonchain_admin:YourPassword@cluster0.xxxxx.mongodb.net/carbonchain?retryWrites=true&w=majority`
   - Click **Add Variable**
4. Repeat for each variable above
5. Make sure all 7 variables are visible

---

## 🚀 Step 7: Deploy

### 7.1 Click Deploy

Click the **Deploy** button at bottom right.

Status will show: `Building...` → `Analyzing...` → `Building...` → `Ready`

Wait 2-3 minutes for deployment to complete.

### 7.2 Check Deployment URL

Once complete, you'll see:
```
✅ Deployment Complete
https://your-project-name.vercel.app
```

**Copy this URL** - you'll need it to update environment variables.

---

## 🔄 Step 8: Update Environment Variables (Round 2)

The URLs weren't complete in Step 6 because we needed to know the deployment URL.

### 8.1 Go to Project Settings

1. In Vercel dashboard, click your project
2. Click **Settings** tab
3. Go to **Environment Variables** (left sidebar)

### 8.2 Update Production Variables

Click each variable to edit:

1. **`NODE_BACKEND_URL`**: Change from placeholder to:
   ```
   https://your-project-name.vercel.app
   ```

2. **`ALLOWED_ORIGINS`**: Change to:
   ```
   https://your-project-name.vercel.app,https://www.your-project-name.vercel.app
   ```

3. **`PYTHON_BACKEND_URL`**: Keep as placeholder for now (we'll update this after Python deployment)
   ```
   http://localhost:8000
   ```

### 8.3 Redeploy with New Variables

1. Go to **Deployments** tab
2. Click the three dots (⋮) on latest deployment
3. Click **Redeploy**
4. Click **Redeploy** again on confirmation
5. Wait for deployment (2-3 minutes)

---

## ✅ Step 9: Test Your Deployment

### 9.1 Test Frontend

1. Visit `https://your-project-name.vercel.app`
2. Frontend should load (you'll see the dashboard)

### 9.2 Test Backend Health Check

Open your browser and visit:
```
https://your-project-name.vercel.app/api/health
```

You should see:
```json
{
  "success": true,
  "message": "CarbonChain Pro Server is Running on Vercel",
  "timestamp": "2026-02-22T...",
  "environment": "production"
}
```

### 9.3 Check Vercel Logs

If something fails, see logs:

```powershell
# Install Vercel CLI (one time)
npm install -g vercel

# View logs
vercel logs https://your-project-name.vercel.app --follow

# If errors appear, they'll show here
```

---

## 🐍 Step 10: Deploy Python Backend (Optional but Recommended)

**Note**: Python performance is limited on Vercel. We recommend **Railway** instead.

### 10.1 Deploy to Railway (Recommended)

1. Go to https://railway.app
2. Sign up with GitHub
3. Click **New Project** → **Deploy from GitHub repo**
4. Select your repository
5. Select directory: `backend/emission_engine`
6. Railway auto-detects Python
7. Configure environment variables (same as Node backend)
8. Railway gives you a URL like: `https://python-backend.railway.app`

### 10.2 Update Vercel Environment Variable

Back on Vercel:

1. Settings → Environment Variables
2. Edit `PYTHON_BACKEND_URL`
3. Change to: `https://python-backend.railway.app`
4. Save
5. Redeploy (Deployments → Redeploy)

---

## 🔗 Step 11: Connect All Services

Now all three services can communicate:

```
Frontend (Vercel)
  ↓ /api → (same server)
  ↓
Node Backend (Vercel)
  ↓ PYTHON_BACKEND_URL → (Railway)
  ↓
Python Backend (Railway)
  ↓ NODE_BACKEND_URL → (Vercel)
  ↓
Node Backend to callback
```

---

## 🧪 Step 12: Full Integration Test

### Test Flow

1. **Login** at `https://your-domain.vercel.app`
2. **Add a Company**
3. **Add a Product**
4. **Add Supply Chain Nodes**
5. **Run Analysis** - this will:
   - Call Python backend for emissions calculation
   - Python will call Node backend to save results
   - Results appear on dashboard

### Check Logs

```powershell
# Check Vercel logs
vercel logs https://your-project.vercel.app --follow

# Check Railway logs (if Python deployed there)
railway logs
```

If you see errors, the logs will help identify the issue.

---

## 📊 Step 13: Monitor Deployment

### 13.1 Vercel Analytics

1. In Vercel dashboard → Your Project
2. Click **Analytics** tab
3. Monitor:
   - Page performance
   - Function calls
   - Edge infrastructure

### 13.2 Database Monitoring

1. Go to MongoDB Atlas
2. Deployments → Your database
3. Click **Monitoring** to see:
   - Queries per second
   - Storage usage
   - Active connections

---

## 🆘 Troubleshooting

### Problem: Build Fails

**Check logs:**
```powershell
vercel logs https://your-project.vercel.app
```

**Common fixes:**
- Missing dependencies: `npm install --legacy-peer-deps`
- Invalid MongoDB URI: Check @ symbol and password encoding
- Wrong Node version: Vercel uses Node 18+ by default

### Problem: Frontend Loads but API Returns 404

**Solution:**
1. Check `FRONTEND_URL` environment variable
2. Verify `vercel.json` routes configuration
3. Check `/api/health` endpoint works: `https://your-domain.vercel.app/api/health`

### Problem: Can't Connect to MongoDB

**Check:**
1. MongoDB Atlas IP whitelist allows `0.0.0.0/0` (all IPs)
2. Connection string includes database name (`?retryWrites=true`)
3. Password is URL-encoded (if contains special chars)

### Problem: Python Backend Not Responding

**For Railway deployment:**
```bash
# Check Python logs
railway logs

# Restart the service
railway restart
```

### Problem: CORS Errors

**Check:**
1. `ALLOWED_ORIGINS` includes your Vercel URL
2. Python `ALLOWED_ORIGINS` matches Node backend URL
3. Both have `https://` for production

---

## 📋 Checklist - Before Going Live

- [ ] Frontend loads at `https://your-domain.vercel.app`
- [ ] `/api/health` returns 200 status
- [ ] MongoDB connection successful
- [ ] Can add a company
- [ ] Can add a product
- [ ] Can add supply chain nodes
- [ ] Can run emissions analysis
- [ ] Python backend responding (check logs)
- [ ] Analytics dashboard working
- [ ] Login/authentication working

---

## 🎉 You're Live!

Your application is now deployed to Vercel! 

**Next Steps:**
1. Add a custom domain (optional) - Vercel Settings → Domains
2. Enable auto-deployments on GitHub push
3. Set up monitoring/alerts
4. Share your URL: `https://your-project.vercel.app`

---

## 📚 Additional Resources

- **Vercel Docs**: https://vercel.com/docs
- **Environment Variables**: See [ENV_CONFIGURATION.md](./ENV_CONFIGURATION.md)
- **Deployment Guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **MongoDB Atlas**: https://docs.atlas.mongodb.com
- **Railway Docs**: https://docs.railway.app

---

**Stuck? Check the logs first!**
```powershell
vercel logs https://your-project.vercel.app --follow
```

Last updated: February 22, 2026
