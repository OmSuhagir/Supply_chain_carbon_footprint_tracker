# Environment Variables Configuration Guide

This guide explains how to properly configure environment variables for your full-stack CarbonChain Pro application across different environments.

## 📋 Overview

Your application has three main services that communicate with each other:

```
Frontend (React)
    ↓ (VITE_API_BASE_URL)
    ↓
Node.js Backend (Express)
    ↓ (PYTHON_BACKEND_URL)
    ↓
Python Backend (FastAPI)
    ↓ (NODE_BACKEND_URL)
    ↓
Node.js Backend
```

## 🏠 Local Development

**File: `.env.local`**

```env
# ========== DATABASE ==========
MONGODB_URI=mongodb://localhost:27017/carbonchain_local

# ========== AUTHENTICATION ==========
JWT_SECRET=dev_secret_key_change_in_production

# ========== AI / EXTERNAL APIs ==========
GEMINI_API_KEY=dev_gemini_key_change_in_production

# ========== ENVIRONMENT ==========
NODE_ENV=development

# ========== SERVICE URLs ==========
# Frontend (React Vite dev server)
FRONTEND_URL=http://localhost:5173

# Python backend (FastAPI)
PYTHON_BACKEND_URL=http://localhost:8000

# Node backend (Express)
NODE_BACKEND_URL=http://localhost:5000

# ========== CORS Configuration ==========
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://localhost:3001
```

**How to use:**
1. Copy `.env.example` to `.env.local` (already done)
2. Keep these values as-is for local development
3. Your app automatically detects `localhost` and uses these values

---

## 🚀 Production (Vercel)

**Where to set:** Vercel Dashboard → Project Settings → Environment Variables

```env
# ========== DATABASE ==========
# Replace with your real MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/carbonchain?retryWrites=true&w=majority

# ========== AUTHENTICATION ==========
# Generate a random secure string (minimum 32 characters)
JWT_SECRET=your_random_32_character_secret_key_here_12345

# ========== AI / EXTERNAL APIs ==========
# Get this from Google Cloud Console
GEMINI_API_KEY=AIzaSyD...your_actual_gemini_key...

# ========== ENVIRONMENT ==========
NODE_ENV=production

# ========== SERVICE URLs ==========
# Your Vercel deployment URL
FRONTEND_URL=https://your-domain.vercel.app

# Python backend hosted on Railway/Render/Fly.io
PYTHON_BACKEND_URL=https://your-python-service.railway.app

# Your Vercel deployment (Node backend is co-located with frontend)
NODE_BACKEND_URL=https://your-domain.vercel.app

# ========== CORS Configuration ==========
# Frontend URL and any other allowed origins
ALLOWED_ORIGINS=https://your-domain.vercel.app,https://www.your-domain.vercel.app
```

---

## 🔄 How Services Communicate

### 1️⃣ Frontend → Node Backend

**In React frontend** ([frontend/src/services/api.js](../frontend/src/services/api.js)):

```javascript
// Uses VITE_API_BASE_URL or detects environment
const API_BASE_URL = 
  import.meta.env.VITE_API_BASE_URL ||  // from .env file
  (window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api' 
    : '/api');  // Vercel: same-origin
```

**Local**: `http://localhost:5000/api`
**Production**: `/api` (same server)

### 2️⃣ Node Backend → Python Backend

**In Node.js backend** ([backend/services/analysisService.js](../backend/services/analysisService.js)):

```javascript
const PYTHON_BACKEND_URL = process.env.PYTHON_BACKEND_URL || 'http://localhost:8000';
// Usage:
const response = await axios.post(
  PYTHON_BACKEND_URL + '/api/emissions/calculate-total',
  data
);
```

**Local**: `http://localhost:8000`
**Production**: `https://python-service.railway.app` (external service)

### 3️⃣ Python Backend → Node Backend (Callback)

**In Python backend** ([backend/emission_engine/main.py](../backend/emission_engine/main.py)):

```python
NODE_BACKEND_URL = os.getenv('NODE_BACKEND_URL', 'http://localhost:5000')
nodejs_url = NODE_BACKEND_URL + "/api/analysis/receive-analysis"
```

**Local**: `http://localhost:5000`
**Production**: `https://your-domain.vercel.app` (Vercel deployment)

### 4️⃣ CORS Configuration

**In Python backend** ([backend/emission_engine/main.py](../backend/emission_engine/main.py)):

```python
ALLOWED_ORIGINS = os.getenv(
    'ALLOWED_ORIGINS',
    'http://localhost:5173,http://localhost:3000,http://localhost:3001'
).split(',')
```

This tells Python which domains can call it.

**Local**: Allows `localhost:5173` (frontend), `localhost:3000`, `localhost:3001`
**Production**: Uses `ALLOWED_ORIGINS` env var (only your Vercel URL)

---

## 📝 Environment Variables Reference

| Variable | Purpose | Local Value | Production Value |
|----------|---------|-------------|-----------------|
| `MONGODB_URI` | Database connection | `mongodb://localhost:27017/carbonchain_local` | MongoDB Atlas URL |
| `JWT_SECRET` | Auth token signing | `dev_secret...` | Random 32+ chars |
| `GEMINI_API_KEY` | Google AI API | Dev key | Real API key |
| `NODE_ENV` | App environment | `development` | `production` |
| `FRONTEND_URL` | Frontend domain | `http://localhost:5173` | `https://your-domain.vercel.app` |
| `PYTHON_BACKEND_URL` | Python service | `http://localhost:8000` | `https://python.railway.app` |
| `NODE_BACKEND_URL` | Node service callback | `http://localhost:5000` | `https://your-domain.vercel.app` |
| `ALLOWED_ORIGINS` | CORS whitelist | Localhost URLs | Production URLs |

---

## 🔧 Step-by-Step Setup

### For Local Development

1. **Backend** - Ensure `.env.local` exists:
   ```bash
   cd backend
   # Check .env.local is present (should be default values)
   cat .env.local
   ```

2. **Frontend** - No special setup needed, automatically uses `/api`

3. **Python** - Loads from environment:
   ```bash
   cd backend/emission_engine
   # These will come from .env.local
   python main.py
   ```

### For Production (Vercel)

1. **Set Vercel Environment Variables:**
   - Go to https://vercel.com/dashboard
   - Select your project
   - Settings → Environment Variables
   - Add all variables from the "Production" section above

2. **Update GitHub secrets (optional):**
   ```bash
   git add .env.example
   git commit -m "Add env variables to git (remove secrets)"
   git push origin main
   ```

3. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

---

## 🚨 Important Security Notes

1. **Never commit `.env.local`** - Already in `.gitignore`
2. **Never share `JWT_SECRET`** or API keys
3. **Use strong `JWT_SECRET`** - Generate with:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
4. **Vercel environment variables** are encrypted at rest
5. **Different secrets for different environments** - Local != Production

---

## 🔍 Troubleshooting

### Frontend Can't Reach Backend
- **Check**: `FRONTEND_URL` environment variable
- **Local**: Should auto-detect `http://localhost:5000`
- **Production**: Check that API base is `/api`

### Backend Can't Reach Python
- **Check**: `PYTHON_BACKEND_URL` environment variable
- **Local**: Should be `http://localhost:8000`
- **Production**: Should be your Railway/Render URL
- **Debug**: `echo $PYTHON_BACKEND_URL` in backend server

### Python Can't Reach Backend (Callback)
- **Check**: `NODE_BACKEND_URL` environment variable
- **Local**: Should be `http://localhost:5000`  
- **Production**: Should be `https://your-domain.vercel.app`
- **Check CORS**: `ALLOWED_ORIGINS` includes the calling domain

### MongoDB Connection Fails
- **Local**: `mongodb://localhost:27017` - ensure MongoDB running
- **Production**: Use MongoDB Atlas connection string
- **Check**: Database name matches (`/carbonchain`)

---

## 📱 Example Environment Files

### Local Development (.env.local) ✅
```
MONGODB_URI=mongodb://localhost:27017/carbonchain_local
JWT_SECRET=dev_secret_key_12345
GEMINI_API_KEY=dev_key
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
PYTHON_BACKEND_URL=http://localhost:8000
NODE_BACKEND_URL=http://localhost:5000
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Production (Vercel) ✅
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/carbonchain
JWT_SECRET=<random-32-chars>
GEMINI_API_KEY=AIzaSy...
NODE_ENV=production
FRONTEND_URL=https://carbonchain.vercel.app
PYTHON_BACKEND_URL=https://python-service.railway.app
NODE_BACKEND_URL=https://carbonchain.vercel.app
ALLOWED_ORIGINS=https://carbonchain.vercel.app,https://www.carbonchain.vercel.app
```

---

## 🆘 Running with Specific Env

**Force a specific environment file:**

```bash
# Backend
export NODE_ENV=production
export $(cat .env.production | xargs)
npm start

# Python
export $(cat .env.production | xargs)
python main.py
```

---

**Last Updated**: February 22, 2026
