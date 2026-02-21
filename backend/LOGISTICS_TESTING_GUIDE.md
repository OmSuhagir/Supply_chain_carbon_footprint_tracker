# CarbonChain Pro - Logistics Testing Guide

## 🚚 Logistics Company Test Scenarios

This guide provides complete testing workflows for logistics companies using realistic supply chain data.

---

## 📥 Import Postman Collection

1. **Download file:** `CarbonChain_Pro_Logistics_Collection.postman_collection.json`
2. **In Postman:** Click `Import` → Select the JSON file
3. **Set Base URL:** The collection uses `{{BASE_URL}}` variable pointing to `http://localhost:5000`

All requests are pre-configured with logistics company data!

---

## 🏢 Test Scenario 1: FedEx Domestic Route

### Objective
Track carbon emissions for FedEx's domestic package delivery from Memphis hub to New York delivery.

### Step 1: Create FedEx Company
```
POST /api/companies
```

**Request Body:**
```json
{
  "name": "FedEx Corporation",
  "industry": "Logistics & Courier Services",
  "sustainabilityGoal": "Carbon Neutral by 2040",
  "headquartersLocation": "Memphis, Tennessee, USA"
}
```

**Save:** Note the returned `_id` (example: `65a7b2c1...`)

---

### Step 2: Create Domestic Route Product
```
POST /api/products
```

**Request Body:**
```json
{
  "companyId": "[FEDEX_ID_FROM_STEP_1]",
  "name": "Domestic Package Route A",
  "description": "Daily domestic parcel delivery route covering East Coast USA",
  "yearlyNetZeroTarget": 500000
}
```

**Save:** Note the product `_id`

---

### Step 3: Add Supply Chain Nodes (4 stages)

#### Node 1: Origin Hub (Memphis)
```
POST /api/supply-chain
```

```json
{
  "productId": "[PRODUCT_ID]",
  "stageName": "Origin Hub Processing",
  "supplierName": "FedEx Memphis Hub",
  "transportMode": "truck",
  "distanceKm": 0,
  "energySource": "natural gas",
  "transportCost": 0,
  "transportTimeDays": 1
}
```

#### Node 2: Regional Hub Transfer (Memphis → Atlanta)
```
POST /api/supply-chain
```

```json
{
  "productId": "[PRODUCT_ID]",
  "stageName": "Regional Hub Transfer",
  "supplierName": "FedEx Atlanta Distribution Center",
  "transportMode": "truck",
  "distanceKm": 650,
  "energySource": "diesel",
  "transportCost": 8500,
  "transportTimeDays": 2
}
```

#### Node 3: Local Delivery Center (Atlanta → New York)
```
POST /api/supply-chain
```

```json
{
  "productId": "[PRODUCT_ID]",
  "stageName": "Local Delivery Center",
  "supplierName": "FedEx New York Local Station",
  "transportMode": "truck",
  "distanceKm": 900,
  "energySource": "diesel",
  "transportCost": 12000,
  "transportTimeDays": 2
}
```

#### Node 4: Last-Mile Delivery
```
POST /api/supply-chain
```

```json
{
  "productId": "[PRODUCT_ID]",
  "stageName": "Last-Mile Delivery",
  "supplierName": "FedEx Courier Network",
  "transportMode": "truck",
  "distanceKm": 15,
  "energySource": "solar",
  "transportCost": 150,
  "transportTimeDays": 1
}
```

---

### Step 4: Run Carbon Analysis
```
POST /api/analysis/[PRODUCT_ID]
```

⚠️ **Note:** This calls `http://localhost:8000/calculate`. You need the Python service running.

**Expected Response:**
```json
{
  "success": true,
  "message": "Analysis completed successfully",
  "data": {
    "totalEmission": 3500.75,
    "highestEmissionStage": "Regional Hub Transfer",
    "carbonEfficiencyScore": 72,
    "costEfficiencyScore": 80,
    "timeEfficiencyScore": 85,
    "netZeroAlignmentPercentage": 99.3
  }
}
```

---

### Step 5: Get Analysis Results
```
GET /api/analysis/[PRODUCT_ID]
```

---

### Step 6: Add Optimization Insights

#### Insight 1: Switch Last-Mile to Electric Vehicles
```
POST /api/optimization
```

```json
{
  "productId": "[PRODUCT_ID]",
  "stageName": "Last-Mile Delivery",
  "currentTransport": "Diesel Truck",
  "suggestedTransport": "Electric Vehicle",
  "carbonSaved": 2500,
  "costSaved": 5000,
  "timeImpactDays": 0,
  "riskLevel": "low",
  "recommendationText": "Replace diesel delivery trucks with electric vehicles in urban areas. 80% reduction in emissions for last-mile delivery."
}
```

#### Insight 2: Use Rail for Regional Transfer
```
POST /api/optimization
```

```json
{
  "productId": "[PRODUCT_ID]",
  "stageName": "Regional Hub Transfer",
  "currentTransport": "Truck (Diesel)",
  "suggestedTransport": "Rail Freight",
  "carbonSaved": 1500,
  "costSaved": 3000,
  "timeImpactDays": 1,
  "riskLevel": "medium",
  "recommendationText": "Use rail for regional transfers to reduce emissions by 60% while minimizing cost impact."
}
```

---

### Step 7: Track Net-Zero Progress

#### 2026 Progress
```
POST /api/netzero-progress
```

```json
{
  "productId": "[PRODUCT_ID]",
  "year": 2026,
  "targetEmission": 500000,
  "actualEmission": 485000,
  "alignmentPercentage": 97.0
}
```

#### 2027 Progress
```
POST /api/netzero-progress
```

```json
{
  "productId": "[PRODUCT_ID]",
  "year": 2027,
  "targetEmission": 450000,
  "actualEmission": 420000,
  "alignmentPercentage": 93.3
}
```

#### 2030 Goal
```
POST /api/netzero-progress
```

```json
{
  "productId": "[PRODUCT_ID]",
  "year": 2030,
  "targetEmission": 250000,
  "actualEmission": 240000,
  "alignmentPercentage": 96.0
}
```

---

### Step 8: View Progress History
```
GET /api/netzero-progress/product/[PRODUCT_ID]
```

---

## 🏭 Test Scenario 2: DHL International Express Route

### Objective
Track international air-to-ground hybrid route with optimization opportunities.

### Steps (same pattern as FedEx)

#### Create Company
```json
{
  "name": "DHL Express",
  "industry": "International Logistics",
  "sustainabilityGoal": "Net Zero by 2050",
  "headquartersLocation": "Bonn, Germany"
}
```

#### Create Product
```json
{
  "companyId": "[DHL_ID]",
  "name": "Europe-Asia International Express",
  "description": "Express international shipping route from Europe to Asia",
  "yearlyNetZeroTarget": 750000
}
```

#### Supply Chain Nodes

**Node 1: European Hub Processing**
```json
{
  "productId": "[PRODUCT_ID]",
  "stageName": "European Hub",
  "supplierName": "DHL Bonn Processing Center",
  "transportMode": "truck",
  "distanceKm": 100,
  "energySource": "wind",
  "transportCost": 3000,
  "transportTimeDays": 1
}
```

**Node 2: Air Freight to Middle East**
```json
{
  "productId": "[PRODUCT_ID]",
  "stageName": "Air Transport - Europe to Middle East",
  "supplierName": "DHL Air Freight",
  "transportMode": "air",
  "distanceKm": 3500,
  "energySource": "jet fuel",
  "transportCost": 25000,
  "transportTimeDays": 2
}
```

**Node 3: Regional Warehouse**
```json
{
  "productId": "[PRODUCT_ID]",
  "stageName": "Dubai Distribution Hub",
  "supplierName": "DHL Dubai Logistics",
  "transportMode": "truck",
  "distanceKm": 50,
  "energySource": "solar",
  "transportCost": 2000,
  "transportTimeDays": 1
}
```

**Node 4: Air Freight to Asia**
```json
{
  "productId": "[PRODUCT_ID]",
  "stageName": "Air Transport - Middle East to Asia",
  "supplierName": "DHL Air Freight",
  "transportMode": "air",
  "distanceKm": 4000,
  "energySource": "jet fuel",
  "transportCost": 28000,
  "transportTimeDays": 2
}
```

#### Run Analysis
```
POST /api/analysis/[PRODUCT_ID]
```

#### Add Key Optimization: Air to Ocean Hybrid
```json
{
  "productId": "[PRODUCT_ID]",
  "stageName": "International Transport",
  "currentTransport": "All Air Freight",
  "suggestedTransport": "Ocean Shipping with Express Air for Time-Sensitive",
  "carbonSaved": 45000,
  "costSaved": 35000,
  "timeImpactDays": 7,
  "riskLevel": "medium",
  "recommendationText": "Use ocean freight for 70% of shipments, keep air for 30% urgent items. Reduces emissions by 60% while maintaining service levels."
}
```

---

## 🚛 Test Scenario 3: Amazon Same-Day Delivery Network

### Objective
Analyze last-mile delivery with focus on electrification opportunities.

#### Create Company
```json
{
  "name": "Amazon Logistics",
  "industry": "E-commerce & Last-Mile Delivery",
  "sustainabilityGoal": "Net Zero by 2040",
  "headquartersLocation": "Seattle, Washington, USA"
}
```

#### Create Product
```json
{
  "companyId": "[AMAZON_ID]",
  "name": "Same-Day Delivery Network",
  "description": "Last-mile same-day delivery using electric and hybrid vehicles",
  "yearlyNetZeroTarget": 300000
}
```

#### Supply Chain Nodes

**Node 1: Regional Distribution**
```json
{
  "productId": "[PRODUCT_ID]",
  "stageName": "Regional Distribution Center",
  "supplierName": "Amazon Distribution Hub",
  "transportMode": "truck",
  "distanceKm": 50,
  "energySource": "diesel",
  "transportCost": 5000,
  "transportTimeDays": 1
}
```

**Node 2: Last-Mile Sorting**
```json
{
  "productId": "[PRODUCT_ID]",
  "stageName": "Last-Mile Delivery Station",
  "supplierName": "Amazon Delivery Station",
  "transportMode": "truck",
  "distanceKm": 20,
  "energySource": "diesel",
  "transportCost": 2000,
  "transportTimeDays": 1
}
```

**Node 3: Final Delivery**
```json
{
  "productId": "[PRODUCT_ID]",
  "stageName": "Customer Delivery",
  "supplierName": "Amazon Courier",
  "transportMode": "truck",
  "distanceKm": 5,
  "energySource": "electric",
  "transportCost": 100,
  "transportTimeDays": 1
}
```

#### Optimization: Full Fleet Electrification
```json
{
  "productId": "[PRODUCT_ID]",
  "stageName": "Last-Mile Delivery",
  "currentTransport": "Diesel Fleet",
  "suggestedTransport": "100% Electric Vehicles",
  "carbonSaved": 8500,
  "costSaved": 12000,
  "timeImpactDays": 0,
  "riskLevel": "low",
  "recommendationText": "Transition to all-electric delivery fleet. Zero-emission last-mile with lower operational costs due to reduced fuel and maintenance."
}
```

---

## 📊 Logistics Metrics to Track

### Key Performance Indicators (KPIs)

| Metric | Target | Unit |
|--------|--------|------|
| Carbon Efficiency Score | > 80 | % |
| Cost Efficiency Score | > 85 | % |
| Time Efficiency Score | > 80 | % |
| Net-Zero Alignment | > 95 | % |
| Total CO2 per Shipment | < 50 | kg |

---

## 🔍 Realistic Logistics Transport Data

### Transport Modes & Emission Factors (per km per ton)
```
Air:     0.255 kg CO2/km
Truck:   0.061 kg CO2/km
Rail:    0.029 kg CO2/km
Ship:    0.010 kg CO2/km
```

### Energy Sources
```
Natural Gas: Low emissions, common in hubs
Diesel:      High emissions, traditional
Wind/Solar:  Zero-emission operations
Electric:    Zero tailpipe emissions
Jet Fuel:    Very high emissions
```

### Typical Route Distances
```
Regional Hub to Hub:     500-1500 km
Local Distribution:      50-150 km
Last-Mile Delivery:      5-30 km
International Air:       3000-12000 km
International Ocean:     5000-20000 km
```

---

## 💡 Sample Complete Workflow

### Total Delivery Journey: Memphis (FedEx) → New York

1. **Origin Hub:** 1 day, minimal emissions
2. **Hub to Hub:** 650 km by truck = ~40 kg CO2
3. **Regional Processing:** 900 km by truck = ~55 kg CO2
4. **Local Delivery:** 15 km by electric = ~0 kg CO2
5. **Total Journey:** 3 days, ~95 kg CO2

**Optimization Potential:**
- Switch hub transfer to rail: -30 kg CO2 (60% reduction)
- Full electric last-mile: Already optimized
- **Target:** Reduce to 50 kg CO2 (47% reduction overall)

---

## ✅ Verification Checklist

- [ ] All companies created
- [ ] All products linked to companies
- [ ] All supply chain nodes added (minimum 3 per route)
- [ ] Analysis ran successfully
- [ ] Carbon scores calculated
- [ ] Optimization insights created
- [ ] Progress tracked for 3+ years
- [ ] All data visible in GET endpoints

---

## 🔧 Troubleshooting

### Analysis Returns Error
**Cause:** Python service not running at `http://localhost:8000/calculate`
**Solution:** Start Python backend or mock the API response

### Missing Data in Analysis
**Cause:** No supply chain nodes created for product
**Solution:** Add at least 3 supply chain nodes before running analysis

### IDs Not Found
**Cause:** Using wrong ID from previous response
**Solution:** Always copy the `_id` field from response for next request

---

**Happy Testing! 🌱**
