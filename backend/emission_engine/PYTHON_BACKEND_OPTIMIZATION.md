# 🔧 Python Backend Optimization Guide

## Overview

Your Python FastAPI backend has been optimized to work with the MongoDB schema. This guide shows you how to integrate company authentication, dashboard endpoints, and database storage with your existing calculation engines.

---

## 📁 New Files Created

### 1. `database.py` 
- **Purpose:** MongoDB operations layer
- **Contains:**
  - `MongoDBManager` - All CRUD operations for 6 collections:
    - Companies
    - Products
    - Supply Chain Nodes
    - Emission Results
    - Optimization Insights
    - Net Zero Progress
  - `DataMapper` - Convert FastAPI models ↔ MongoDB documents

### 2. `auth.py`
- **Purpose:** Authentication and authorization
- **Contains:**
  - `CompanyAuth` - Password hashing, JWT tokens
  - `SessionManager` - Company sessions, login/logout
  - `PermissionManager` - Role-based access control

---

## 🔐 Authentication Flow

### 1. Company Registration
```
Company Signs Up
  ↓
Hash password (SHA256)
  ↓
Store in MongoDB
  ↓
Return company_id
```

### 2. Company Login
```
Company enters email + password
  ↓
Query MongoDB for company by email
  ↓
Verify password hash
  ↓
Generate JWT tokens (access + refresh)
  ↓
Create session
  ↓
Return tokens + company info
```

### 3. Authenticated Requests
```
Client sends request with Bearer token
  ↓
FastAPI validates token
  ↓
Extract company_id from token
  ↓
Process request with company context
  ↓
All operations scoped to company
```

---

## 📊 New API Endpoints to Add

### Authentication Endpoints

#### 1. POST `/api/auth/register`
**Register a new company**

```python
from pydantic import BaseModel
from auth import CompanyAuth, SessionManager
from database import MongoDBManager

class CompanyRegister(BaseModel):
    name: str
    email: str
    password: str
    industry: str
    sustainabilityGoal: str
    headquartersLocation: str

@app.post("/api/auth/register")
async def register_company(data: CompanyRegister):
    """
    Register a new company
    """
    try:
        # Check if company exists
        existing = MongoDBManager.get_company_by_email(data.email)
        if existing:
            raise HTTPException(status_code=400, detail="Company already exists")
        
        # Hash password
        hashed_password = CompanyAuth.hash_password(data.password)
        
        # Create company
        company_data = {
            "name": data.name,
            "email": data.email,
            "password": hashed_password,
            "industry": data.industry,
            "sustainabilityGoal": data.sustainabilityGoal,
            "headquartersLocation": data.headquartersLocation
        }
        
        company = MongoDBManager.create_company(company_data)
        
        return {
            "success": True,
            "message": "Company registered successfully",
            "company_id": company["_id"],
            "timestamp": get_current_timestamp()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

#### 2. POST `/api/auth/login`
**Company login**

```python
class CompanyLogin(BaseModel):
    email: str
    password: str

@app.post("/api/auth/login")
async def login_company(credentials: CompanyLogin):
    """
    Authenticate company and return tokens
    """
    try:
        # Find company by email
        company = MongoDBManager.get_company_by_email(credentials.email)
        if not company:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Verify password
        if not CompanyAuth.verify_password(credentials.password, company["password"]):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Create session
        session = SessionManager.create_session(company["_id"], company)
        
        return {
            "success": True,
            "accessToken": session["accessToken"],
            "refreshToken": session["refreshToken"],
            "company": {
                "id": company["_id"],
                "name": company["name"],
                "email": company["email"],
                "industry": company["industry"]
            },
            "timestamp": get_current_timestamp()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

#### 3. POST `/api/auth/logout`
**Company logout**

```python
from fastapi import Header

@app.post("/api/auth/logout")
async def logout_company(authorization: str = Header(None)):
    """
    Logout company (revoke session)
    """
    try:
        token = authorization.replace("Bearer ", "")
        session = SessionManager.verify_access_token(token)
        
        if not session:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        SessionManager.revoke_session(session["sessionId"])
        
        return {
            "success": True,
            "message": "Logged out successfully",
            "timestamp": get_current_timestamp()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

---

### Product Management Endpoints

#### 4. POST `/api/products/create`
**Create new product for company**

```python
class ProductCreate(BaseModel):
    name: str
    description: str
    yearlyNetZeroTarget: float

@app.post("/api/products/create")
async def create_product(product: ProductCreate, authorization: str = Header(None)):
    """
    Create new product for authenticated company
    """
    try:
        # Validate token
        token = authorization.replace("Bearer ", "")
        session = SessionManager.verify_access_token(token)
        if not session:
            raise HTTPException(status_code=401, detail="Unauthorized")
        
        company_id = session["companyId"]
        
        # Create product
        product_data = {
            "name": product.name,
            "description": product.description,
            "yearlyNetZeroTarget": product.yearlyNetZeroTarget,
            "currentYearEmission": 0
        }
        
        created_product = MongoDBManager.create_product(company_id, product_data)
        
        return {
            "success": True,
            "product": created_product,
            "timestamp": get_current_timestamp()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

#### 5. GET `/api/products/list`
**Get all products for company**

```python
@app.get("/api/products/list")
async def list_company_products(authorization: str = Header(None)):
    """
    Get all products for authenticated company
    """
    try:
        token = authorization.replace("Bearer ", "")
        session = SessionManager.verify_access_token(token)
        if not session:
            raise HTTPException(status_code=401, detail="Unauthorized")
        
        company_id = session["companyId"]
        products = MongoDBManager.get_company_products(company_id)
        
        return {
            "success": True,
            "products": products,
            "count": len(products),
            "timestamp": get_current_timestamp()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

---

### Supply Chain & Calculation Endpoints

#### 6. POST `/api/supply-chain/add-node`
**Add supply chain node to product**

```python
@app.post("/api/supply-chain/add-node")
async def add_supply_chain_node(
    product_id: str,
    node: SupplyChainNode,
    authorization: str = Header(None)
):
    """
    Add supply chain node to product
    """
    try:
        # Validate company authorization
        token = authorization.replace("Bearer ", "")
        session = SessionManager.verify_access_token(token)
        if not session:
            raise HTTPException(status_code=401, detail="Unauthorized")
        
        company_id = session["companyId"]
        
        # Verify company owns this product
        product = MongoDBManager.get_product(product_id)
        if product["companyId"] != company_id:
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Create node
        node_data = DataMapper.map_supply_chain_node_to_db(node.dict())
        created_node = MongoDBManager.create_supply_chain_node(product_id, node_data)
        
        return {
            "success": True,
            "node": created_node,
            "timestamp": get_current_timestamp()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

#### 7. POST `/api/emissions/calculate-and-store`
**Calculate emissions AND store result in MongoDB**

```python
@app.post("/api/emissions/calculate-and-store")
async def calculate_and_store_emissions(
    product_id: str,
    request: EmissionRequest,
    authorization: str = Header(None)
):
    """
    Calculate emissions for all supply chain nodes and store results
    """
    try:
        # Validate authorization
        token = authorization.replace("Bearer ", "")
        session = SessionManager.verify_access_token(token)
        if not session:
            raise HTTPException(status_code=401, detail="Unauthorized")
        
        company_id = session["companyId"]
        
        # Verify product ownership
        product = MongoDBManager.get_product(product_id)
        if product["companyId"] != company_id:
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Calculate emissions using existing engine
        calculator = EmissionCalculator()
        calculation_result = calculator.calculate_total_emission(
            [node.dict() for node in request.supply_chain_nodes]
        )
        
        # Calculate efficiency scores
        bi = BusinessIntelligence()
        efficiency_scores = bi.calculate_all_efficiency_scores(
            actual_emission=calculation_result["total_emission"],
            actual_cost=sum(node.transport_cost for node in request.supply_chain_nodes),
            actual_time=sum(node.transport_time_days for node in request.supply_chain_nodes)
        )
        
        # Calculate net-zero alignment
        target = product["yearlyNetZeroTarget"]
        current = calculation_result["total_emission"]
        nz_tracker = NetZeroTracker()
        alignment = nz_tracker.calculate_alignment(target, current)
        
        # Store results in MongoDB
        emission_result = MongoDBManager.store_emission_result(
            product_id,
            calculation_result,
            efficiency_scores,
            alignment["alignment_percentage"]
        )
        
        # Update product current emission
        MongoDBManager.update_product(product_id, {
            "currentYearEmission": current,
            "carbonEfficiencyScore": efficiency_scores["carbon_efficiency_score"]
        })
        
        return {
            "success": True,
            "calculation": calculation_result,
            "stored_result": emission_result,
            "efficiency_scores": efficiency_scores,
            "net_zero_alignment": alignment,
            "timestamp": get_current_timestamp()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

---

### Dashboard Endpoints

#### 8. GET `/api/dashboard/company`
**Get company dashboard**

```python
@app.get("/api/dashboard/company")
async def get_company_dashboard(authorization: str = Header(None)):
    """
    Get aggregated dashboard for entire company
    """
    try:
        token = authorization.replace("Bearer ", "")
        session = SessionManager.verify_access_token(token)
        if not session:
            raise HTTPException(status_code=401, detail="Unauthorized")
        
        company_id = session["companyId"]
        company = MongoDBManager.get_company_by_id(company_id)
        products = MongoDBManager.get_company_products(company_id)
        
        # Calculate aggregated metrics
        total_emission = 0
        total_target = 0
        all_nodes = 0
        
        for product in products:
            latest_result = MongoDBManager.get_latest_emission_result(product["_id"])
            if latest_result:
                total_emission += latest_result["totalEmission"]
            total_target += product["yearlyNetZeroTarget"]
            
            nodes = MongoDBManager.get_product_nodes(product["_id"])
            all_nodes += len(nodes)
        
        # Calculate average alignment
        avg_alignment = (total_target - total_emission) / total_target * 100 if total_target > 0 else 0
        
        # Get top recommendations
        top_recommendations = []
        for product in products:
            insights = MongoDBManager.get_product_insights(product["_id"])
            top_recommendations.extend(insights[:3])  # Top 3 per product
        
        top_recommendations = sorted(
            top_recommendations,
            key=lambda x: x.get("carbonSaved", 0),
            reverse=True
        )[:10]  # Overall top 10
        
        return {
            "success": True,
            "company": company,
            "dashboard": {
                "summaryMetrics": {
                    "totalEmission": round(total_emission, 2),
                    "yearlyTarget": round(total_target, 2),
                    "averageAlignment": round(avg_alignment, 2),
                    "productCount": len(products),
                    "supplyChainNodesCount": all_nodes,
                    "status": "on_track" if avg_alignment >= 80 else "needs_attention"
                },
                "products": products,
                "topRecommendations": top_recommendations,
                "performanceIndicators": {
                    "bestPerformingProduct": max(products, key=lambda p: p.get("carbonEfficiencyScore", 0)) if products else None,
                    "largestEmissionStage": None,
                    "costOptimizationPotential": sum(r.get("costSaved", 0) for r in top_recommendations)
                }
            },
            "timestamp": get_current_timestamp()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

#### 9. GET `/api/dashboard/product/{product_id}`
**Get product-specific dashboard**

```python
@app.get("/api/dashboard/product/{product_id}")
async def get_product_dashboard(product_id: str, authorization: str = Header(None)):
    """
    Get detailed dashboard for a specific product
    """
    try:
        token = authorization.replace("Bearer ", "")
        session = SessionManager.verify_access_token(token)
        if not session:
            raise HTTPException(status_code=401, detail="Unauthorized")
        
        company_id = session["companyId"]
        
        # Get product
        product = MongoDBManager.get_product(product_id)
        if product["companyId"] != company_id:
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Get supply chain nodes
        nodes = MongoDBManager.get_product_nodes(product_id)
        
        # Get latest emission result
        latest_result = MongoDBManager.get_latest_emission_result(product_id)
        
        # Get optimization insights
        insights = MongoDBManager.get_product_insights(product_id)
        
        # Get progress history
        progress_history = MongoDBManager.get_product_progress_history(product_id)
        
        # Calculate current alignment
        current_alignment = 0
        if latest_result:
            current_alignment = latest_result["netZeroAlignmentPercentage"]
        
        return {
            "success": True,
            "productInfo": product,
            "dashboard": {
                "emissionMetrics": {
                    "totalEmission": latest_result["totalEmission"] if latest_result else 0,
                    "targetEmission": product["yearlyNetZeroTarget"],
                    "remainingBudget": product["yearlyNetZeroTarget"] - (latest_result["totalEmission"] if latest_result else 0),
                    "alignmentPercentage": current_alignment,
                    "status": "on_track" if current_alignment >= 80 else "at_risk"
                },
                "supplyChainBreakdown": nodes,
                "efficiencyScores": {
                    "carbon": latest_result["carbonEfficiencyScore"] if latest_result else 0,
                    "cost": latest_result["costEfficiencyScore"] if latest_result else 0,
                    "time": latest_result["timeEfficiencyScore"] if latest_result else 0
                },
                "recommendations": insights,
                "progressTrack": progress_history,
                "potentialSavings": {
                    "totalCarbonSavings": sum(i.get("carbonSaved", 0) for i in insights),
                    "totalCostSavings": sum(i.get("costSaved", 0) for i in insights),
                    "recommendationCount": len(insights)
                }
            },
            "timestamp": get_current_timestamp()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

---

## 🔄 Data Flow Diagram

```
Frontend Login
   ↓
POST /api/auth/login
   ↓
SessionManager → Create tokens
   ↓
Return accessToken + refreshToken
   ↓
Frontend stores tokens (localStorage/sessionStorage)
   ↓
GET /api/dashboard/company (with Bearer token)
   ↓
SessionManager → Validate token
   ↓
Extract company_id
   ↓
MongoDBManager → Query company data + products + metrics
   ↓
Return aggregated dashboard
   ↓
POST /api/emissions/calculate-and-store
   ↓
Emission Calculator → Calculate emissions
   ↓
MongoDBManager → Store result + update product
   ↓
Return calculation + stored data
   ↓
Updated dashboard reflects new data
```

---

## 🎯 Integration Checklist

- [ ] Import `database.py` and `auth.py` in main.py
- [ ] Add Pydantic models for auth endpoints
- [ ] Add all 9 new endpoints to main.py
- [ ] Update existing calculation endpoints to include authorization
- [ ] Change existing endpoints to store results in MongoDB
- [ ] Add MongoDB connection string to environment
- [ ] Test company registration flow
- [ ] Test company login flow
- [ ] Test product creation
- [ ] Test emission calculation and storage
- [ ] Test dashboard endpoints
- [ ] Test authorization on protected endpoints

---

## 📝 Requirements to Install

```bash
pip install pymongo  # For MongoDB connection
pip install python-jose  # For JWT tokens (production)
pip install python-multipart  # For form data
```

---

## 🔑 Environment Variables

Create `.env` file:
```
DB_URL=mongodb://localhost:27017/
DB_NAME=carbonchain_pro
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

---

## 📊 Database Schema Mapping

| MongoDB Collection | FastAPI Models | Key Operations |
|---|---|---|
| companies | CompanyRegister, CompanyLogin | Register, Login, Get profile |
| products | ProductCreate | Create, List, Update emissions |
| supply_chain_nodes | SupplyChainNode | Add nodes, Get all for product |
| emission_results | EmissionResponse | Store calculations, Get latest |
| optimization_insights | OptimizationRequest | Store recommendations |
| net_zero_progress | NetZeroRequest | Track alignment over time |

---

## 🚀 Example Frontend Integration

```javascript
// React/Next.js example

// 1. Login
const login = async (email, password) => {
  const res = await fetch('http://localhost:8000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  localStorage.setItem('accessToken', data.accessToken);
  return data;
};

// 2. Get Dashboard
const getDashboard = async () => {
  const token = localStorage.getItem('accessToken');
  const res = await fetch('http://localhost:8000/api/dashboard/company', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
};

// 3. Create Product
const createProduct = async (name, description, target) => {
  const token = localStorage.getItem('accessToken');
  const res = await fetch('http://localhost:8000/api/products/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ name, description, yearlyNetZeroTarget: target })
  });
  return res.json();
};

// 4. Calculate Emissions
const calculateEmissions = async (productId, supplyChainNodes) => {
  const token = localStorage.getItem('accessToken');
  const res = await fetch(`http://localhost:8000/api/emissions/calculate-and-store?product_id=${productId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ supply_chain_nodes: supplyChainNodes })
  });
  return res.json();
};
```

---

## ✅ Success!

Your Python backend is now:
- ✅ Company-aware (scoped by company_id)
- ✅ Authenticated (JWT tokens)
- ✅ Database-integrated (MongoDB operations)
- ✅ Dashboard-ready (aggregated views)
- ✅ Authorization-protected (role-based access)

Each company has:
- Their own products
- Their own supply chain nodes
- Their own calculations stored in MongoDB
- Their own dashboard showing only their data

All calculations are stored in exactly the MongoDB format specified in your Node.js schema! 🎉
