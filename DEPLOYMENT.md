# CarbonChain Pro - Vercel Deployment Guide

This guide explains how to deploy your full-stack application (Frontend, Node.js Backend, and Python Engine) to Vercel.

## 📋 Deployment Architecture

```
Repository (GitHub) 
    ├── frontend/          → React + Vite (served at root)
    ├── backend/           → Express.js API
    ├── api/               → Vercel Serverless Functions (wrapper)
    └── api/python/        → Python FastAPI functions
```

## ✅ Prerequisites

1. **Vercel Account**: Sign up at https://vercel.com (free tier available)
2. **GitHub Repository**: Push your project to GitHub
3. **MongoDB Atlas**: Database at https://www.mongodb.com/cloud/atlas (free tier)
4. **Environment Variables**: All secrets prepared

## 🚀 Step-by-Step Deployment

### Step 1: Prepare Your Local Environment

```bash
# Install Vercel CLI
npm install -g vercel@latest

# Login to Vercel
vercel login

# Navigate to project directory
cd "d:\Hackathon\CodeLite\Project\Latest\Supply_chain_carbon_footprint_tracker"
```

### Step 2: Update Backend Configuration

**Modify [backend/server.js](backend/server.js):**

The Express app needs to export as a default function for Vercel serverless:

```javascript
// Add at the end of server.js (around line 60)
module.exports = app;

// OR for ES modules
export default app;
```

**Check [backend/config/connectdb.js](backend/config/connectdb.js):**

Ensure it handles connection pooling:

```javascript
// connection should be re-used across function invocations
if (!mongoose.connection.readyState) {
  await mongoose.connect(process.env.MONGODB_URI);
}
```

### Step 3: Update Frontend for Production

**Create [frontend/.env.production](frontend/.env.production):**

```env
VITE_API_BASE_URL=/api
```

**Update [frontend/vite.config.js](frontend/vite.config.js):**

```javascript
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    proxy: {
      '/api': 'http://localhost:5000'  // for local dev
    }
  }
})
```

### Step 4: Configure Vercel Deployment

The [vercel.json](vercel.json) is already created. Review it:

- **buildCommand**: Builds frontend and installs backend deps
- **outputDirectory**: Points to frontend dist
- **functions**: Configures serverless runtimes
- **routes**: Maps requests to the correct handler

### Step 5: Set Environment Variables on Vercel

Visit Vercel Project Settings and add these variables:

```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/carbonchain
JWT_SECRET=<32+ character random string>
GEMINI_API_KEY=<your gemini key>
NODE_ENV=production
FRONTEND_URL=https://your-domain.vercel.app
PYTHON_BACKEND_URL=https://python-backend.railway.app
NODE_BACKEND_URL=https://your-domain.vercel.app
ALLOWED_ORIGINS=https://your-domain.vercel.app,https://www.your-domain.vercel.app
```

**Important URLs:**
- `FRONTEND_URL`: Your Vercel deployment URL (e.g., `https://carbonchain.vercel.app`)
- `PYTHON_BACKEND_URL`: Python service URL (Railway/Render/Fly.io - see note below)
- `NODE_BACKEND_URL`: Your Node backend URL on Vercel (same as FRONTEND_URL)
- `ALLOWED_ORIGINS`: For CORS - list your frontend and API URLs

**How to add:**
1. Go to https://vercel.com/dashboard
2. Click your project
3. Settings → Environment Variables
4. Add each variable above

### Step 6: Deploy to Vercel

**Option A: Using GitHub (Recommended)**

1. Push code to GitHub: 
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. Go to https://vercel.com/dashboard
3. Click "New Project"
4. Select your GitHub repository
5. Framework preset: **Other** (since it's monorepo)
6. Project Settings:
   - **Root Directory**: `./`
   - **Build Command**: `npm run build --prefix frontend && npm install --prefix backend`
   - **Output Directory**: `frontend/dist`
7. Add environment variables (see Step 5)
8. Click **Deploy**

**Option B: Using Vercel CLI (Alternative)**

```bash
# Deploy from project root
vercel --prod

# OR with environment file
vercel --prod --env-file=.env.production
```

### Step 7: Configure Routes (if needed)

If routes aren't working, update [vercel.json](vercel.json) routes section:

```json
"routes": [
  {
    "src": "/api/(.*)",
    "dest": "api/index.js?url=/$1",
    "methods": ["GET", "POST", "PUT", "DELETE", "PATCH"]
  },
  {
    "src": "/(.*)",
    "dest": "/index.html"
  }
]
```

### Step 8: Test Deployment

Once deployed, test endpoints:

```bash
# Health check
curl https://your-project.vercel.app/api/health

# Frontend
# Visit https://your-project.vercel.app
```

Check Vercel logs for errors:
```bash
vercel logs <deployment-url> --follow
```

## 🐍 Python Backend Considerations

**Note**: Vercel's Python support has limitations (execution time, dependencies size).

**Options:**
1. **Keep on Vercel**: Use lightweight Python functions
2. **Move to Railway**: Better Python support
   - Go to https://railway.app
   - Deploy `backend/emission_engine/` as Python service
   - Add PYTHON_BACKEND_URL to environment variables

**If Using Railway for Python:**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and init
railway login

# Create new project for Python service
cd backend/emission_engine/
railway init
railway link

# Deploy
railway up
```

Then update [frontend/src/services/api.js](frontend/src/services/api.js):

```javascript
const PYTHON_BASE_URL = import.meta.env.VITE_PYTHON_API_URL || '/api/python';
```

## 🔧 Troubleshooting

### Build Fails
- Check logs: `vercel logs`
- Verify all dependencies in [backend/package.json](backend/package.json)
- Ensure MongoDB URI is valid

### API Routes Return 404
- Check [vercel.json](vercel.json) `routes` configuration
- Verify function files exist in `api/` directory
- Check function exports match Vercel format

### Database Connection Timeout
- Add IP whitelist in MongoDB Atlas (or allow all)
- Increase timeout in [backend/config/connectdb.js](backend/config/connectdb.js)
- Use connection pooling

### Large Dependencies Issue
- Remove unused packages: `npm prune --prefix backend`
- Move code parsing to client-side when possible
- Consider moving Python engine to Railway

## 📊 Monitoring

Monitor your deployment:

```bash
# View latest deployment
vercel promote <deployment-url>

# Check analytics
vercel analytics enable

# View logs
vercel logs --follow
```

## 🔄 Redeploy on Code Changes

With GitHub integration, pushes to main branch auto-redeploy:

```bash
git push origin main  # Automatic Vercel redeploy
```

Or manual deploy:
```bash
vercel --prod
```

## 📝 Environment Variables Summary

| Variable | Source | Example |
|----------|--------|---------|
| `MONGODB_URI` | MongoDB Atlas | `mongodb+srv://...` |
| `JWT_SECRET` | Generate random | `abc123...xyz789` |
| `GEMINI_API_KEY` | Google Console | `AIzaSy...` |
| `NODE_ENV` | Constant | `production` |
| `FRONTEND_URL` | Vercel URL | `https://carbonchain.vercel.app` |

## ✨ Next Steps

1. Test all API endpoints in production
2. Monitor Vercel Analytics dashboard
3. Set up error tracking (optional): Sentry, LogRocket
4. Configure custom domain (optional)
5. Enable automatic deployments on push

---

**Need Help?**
- Vercel Docs: https://vercel.com/docs
- Open issue in your repository
- Contact Vercel support
