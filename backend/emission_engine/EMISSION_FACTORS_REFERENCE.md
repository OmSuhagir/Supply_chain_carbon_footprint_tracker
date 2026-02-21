# 📊 Emission Factors Reference Guide

Complete documentation of all emission factors, energy sources, transport modes, and calculation parameters used by CarbonChain Pro.

---

## 📋 File Overview

**Location:** `emission_factors.json`
**Version:** 2.0
**Last Updated:** 2026-02-21
**Status:** Production-Ready

This JSON file contains all reference data for:
- Transport mode emissions and costs
- Energy source emissions and pricing
- Industry benchmarks
- Seasonal adjustments
- Carbon pricing mechanisms

---

## 🚚 Transport Modes

### Truck (Diesel)
```json
{
  "emission_per_km": 0.12,
  "emission_per_ton_km": 0.015,
  "cost_per_km": 1.5,
  "capacity_tons": 25,
  "speed_kmh": 80,
  "reliability_score": 0.85,
  "flexibility_score": 0.95
}
```
- **Best For:** Medium distances, time-sensitive shipments, flexible routes
- **Environmental Impact:** HIGH
- **Fuel Type:** Diesel
- **Typical Use:** Regional distribution, last-mile delivery

### Rail (Freight Train)
```json
{
  "emission_per_km": 0.04,
  "emission_per_ton_km": 0.003,
  "cost_per_km": 1.1,
  "capacity_tons": 500,
  "speed_kmh": 100,
  "reliability_score": 0.90,
  "flexibility_score": 0.40
}
```
- **Best For:** High volume, long distances, cost-effective transport
- **Environmental Impact:** LOW
- **Fuel Type:** Diesel/Electric
- **Typical Use:** Bulk shipments, intercity transport

### Ship (Container Ship)
```json
{
  "emission_per_km": 0.02,
  "emission_per_ton_km": 0.0008,
  "cost_per_km": 0.75,
  "capacity_tons": 10000,
  "speed_kmh": 25,
  "reliability_score": 0.92,
  "flexibility_score": 0.20
}
```
- **Best For:** International shipments, bulk goods, lowest emissions
- **Environmental Impact:** VERY LOW ⭐
- **Fuel Type:** Bunker fuel/LNG
- **Typical Use:** Global trade, container shipping
- **Cost Per Ton-km:** 0.0008 (Best efficiency!)

### Air (Cargo Plane)
```json
{
  "emission_per_km": 0.6,
  "emission_per_ton_km": 0.12,
  "cost_per_km": 2.5,
  "capacity_tons": 80,
  "speed_kmh": 900,
  "reliability_score": 0.88,
  "flexibility_score": 0.90
}
```
- **Best For:** Urgent shipments, high-value goods, express delivery
- **Environmental Impact:** CRITICAL ⚠️
- **Fuel Type:** Jet fuel
- **Typical Use:** Emergency, perishables, time-critical
- **Emission Per Ton-km:** 0.12 (Highest!)

### Electric Truck
```json
{
  "emission_per_km": 0.03,
  "emission_per_ton_km": 0.004,
  "cost_per_km": 1.2,
  "capacity_tons": 25,
  "speed_kmh": 80,
  "fuel_type": "electricity",
  "availability": "growing"
}
```
- **Best For:** Regional routes, sustainability focus
- **Environmental Impact:** LOW ✅
- **Fuel Type:** Electricity
- **Premium:** 25% higher cost, 75% lower emissions

### Bicycle
```json
{
  "emission_per_km": 0.0,
  "emission_per_ton_km": 0.0,
  "cost_per_km": 0.1,
  "capacity_tons": 0.05,
  "speed_kmh": 20,
  "fuel_type": "human_power"
}
```
- **Best For:** Urban delivery, last-mile, zero emissions ♟️
- **Environmental Impact:** ZERO
- **Perfect For:** Cities, short distances

---

## ⚡ Energy Sources

### Coal (Highest Emissions)
```json
{
  "emission_factor": 0.9,
  "emission_per_mwh": 820,
  "cost_per_mwh": 50,
  "availability": 0.85,
  "health_impact": "critical",
  "decommission_status": "phasing_out"
}
```
- **Emissions Per MWh:** 820 kg CO2e ⚠️ (Highest)
- **Grid Reliability:** 90%
- **Status:** Being phased out in most countries
- **Health Impact:** Critical - air pollution

### Natural Gas
```json
{
  "emission_factor": 0.5,
  "emission_per_mwh": 450,
  "cost_per_mwh": 60,
  "availability": 0.88,
  "health_impact": "moderate"
}
```
- **Emissions Per MWh:** 450 kg CO2e (Mid-range)
- **Grid Reliability:** 92%
- **Status:** Stable, transitional fuel
- **Use Case:** Peak load management

### Solar ☀️ (Growing)
```json
{
  "emission_factor": 0.05,
  "emission_per_mwh": 45,
  "cost_per_mwh": 40,
  "availability": 0.25,
  "intermittency": "high",
  "peak_hours": "9am-5pm"
}
```
- **Emissions Per MWh:** 45 kg CO2e ✅
- **Grid Reliability:** 70%
- **Availability Factor:** 25% (weather dependent)
- **Best Hours:** 9 AM - 5 PM
- **Scalability:** VERY HIGH 📈

### Wind 💨 (Renewable)
```json
{
  "emission_factor": 0.02,
  "emission_per_mwh": 18,
  "cost_per_mwh": 45,
  "availability": 0.35,
  "best_season": "winter"
}
```
- **Emissions Per MWh:** 18 kg CO2e ✅ (Low)
- **Grid Reliability:** 75%
- **Availability Factor:** 35%
- **Best Season:** Winter
- **Scalability:** VERY HIGH 📈

### Hydroelectric 💧 (Best Reliability)
```json
{
  "emission_factor": 0.01,
  "emission_per_mwh": 9,
  "cost_per_mwh": 55,
  "availability": 0.90,
  "intermittency": "low",
  "grid_reliability": 0.95
}
```
- **Emissions Per MWh:** 9 kg CO2e ⭐ (Lowest)
- **Grid Reliability:** 95% (Best!)
- **Availability Factor:** 90%
- **Intermittency:** Low
- **Scalability:** Medium (location limited)

### Nuclear ⚛️
```json
{
  "emission_factor": 0.08,
  "emission_per_mwh": 72,
  "cost_per_mwh": 75,
  "availability": 0.92,
  "grid_reliability": 0.98
}
```
- **Emissions Per MWh:** 72 kg CO2e (Low, but radioactive)
- **Grid Reliability:** 98% (Best!)
- **No Intermittency:** Constant power
- **Scalability:** Low (high capital cost)

### Geothermal 🌋
```json
{
  "emission_factor": 0.03,
  "emission_per_mwh": 27,
  "cost_per_mwh": 65,
  "availability": 0.85,
  "geographic_limitation": "high"
}
```
- **Emissions Per MWh:** 27 kg CO2e ✅
- **Grid Reliability:** 93%
- **No Intermittency:** Constant
- **Geographic Limitation:** Only certain regions
- **Scalability:** Low (location specific)

---

## 📊 Benchmark Values

### Transport Benchmarks
```json
{
  "average_truck_emission_per_km": 0.15,
  "average_transport_cost_per_km": 1.5,
  "average_transport_time_per_km": 0.05,
  "average_truck_utilization": 0.65,
  "industry_standard_emission": 0.18
}
```

### Energy Benchmarks
```json
{
  "grid_average_emission_factor": 0.35,
  "renewable_percentage": 0.28,
  "grid_avg_cost_per_mwh": 55,
  "peak_demand_multiplier": 1.3
}
```

### Operations Benchmarks
```json
{
  "manufacturing_emission_per_ton": 2.5,
  "waste_management_emission_per_ton": 0.3,
  "warehousing_emission_per_month": 0.1
}
```

---

## 🎯 Demand Urgency Factors

These multipliers adjust transport priority and cost based on urgency:

| Level | Multiplier | Delivery Days | Priority |
|-------|-----------|----------------|----------|
| **Low** | 0.3 | 14-30 days | Cost optimization |
| **Medium** | 0.6 | 7-14 days | Balanced |
| **High** | 1.0 | 3-7 days | Speed focus |
| **Critical** | 1.5 | 0-3 days | Speed critical |

**Example:** A critical shipment costs 5x more but may require air freight.

---

## 🌍 Seasonal Adjustments

Weather and demand variations:

```json
{
  "spring": 1.0,    // Baseline
  "summer": 1.1,    // +10% due to heat, increased demand
  "autumn": 0.95,   // -5% favorable weather
  "winter": 1.2     // +20% due to snow, reduced efficiency
}
```

**Impact:** Multiply all emissions and costs by these factors.

---

## 🏭 Industry Standards

### Automotive
- **Emission Intensity:** 0.25 kg CO2e per unit
- **Transport Modes:** Truck, Rail (bulk shipping)
- **Annual Emission:** ~5,000 kg CO2e
- **Key Factor:** Vehicle size and weight

### Electronics
- **Emission Intensity:** 0.15 kg CO2e per unit
- **Transport Modes:** Air, Truck (speed-critical)
- **Annual Emission:** ~2,000 kg CO2e
- **Key Factor:** Market windows, rapid obsolescence

### Food & Beverage
- **Emission Intensity:** 0.35 kg CO2e per unit
- **Transport Modes:** Truck, Ship (refrigerated)
- **Annual Emission:** ~8,000 kg CO2e
- **Key Factor:** Cold chain requirements

### Chemicals
- **Emission Intensity:** 0.45 kg CO2e per unit
- **Transport Modes:** Truck, Rail (hazmat)
- **Annual Emission:** ~12,000 kg CO2e
- **Key Factor:** Safety regulations

---

## 💰 Carbon Pricing

### EU Emissions Trading System (ETS)
- **Current Price:** €85/ton CO2e
- **Trend:** Increasing annually
- **Impact:** +€85 per ton of emissions

### Carbon Taxes (Regional)
- **Region 1:** $50/ton CO2e
- **Region 2:** $35/ton CO2e
- **Impact:** Varies by location

### Corporate Carbon Offsets
- **Cost:** $25/ton CO2e
- **Use Case:** Voluntary reduction goals
- **Credibility:** Variable (VCS, Gold Standard, etc.)

---

## 📈 How to Use These Factors

### 1. Calculate Transport Emissions
```
Emissions = Distance (km) × Emission Per KM × Urgency Factor × Seasonal Factor
Example: 500 km × 0.12 (truck) × 1.0 (medium urgency) × 1.1 (summer) = 66 kg CO2e
```

### 2. Calculate Energy Emissions
```
Emissions = Energy (MWh) × Emission Factor
Example: 10 MWh × 0.05 (solar) = 0.5 kg CO2e (very low!)
```

### 3. Compare Transport Modes
```
Ship:  500 km × 0.02 = 10 kg CO2e   (Best) ✅
Rail:  500 km × 0.04 = 20 kg CO2e
Truck: 500 km × 0.12 = 60 kg CO2e
Air:   500 km × 0.60 = 300 kg CO2e  (Worst) ⚠️
```

### 4. Apply Carbon Cost
```
Total Cost = Transport Cost + (Emissions × Carbon Price)
Example: $100 + (60 kg × €85/ton) = $100 + €5.10 = ~$105
```

---

## 🔄 Updates & Maintenance

**Last Updated:** 2026-02-21
**Next Review:** 2026-08-21 (6-month cycle)
**Reason for Updates:**
- Carbon markets fluctuate
- Technology improves (e.g., electric vehicles)
- Grid mix changes (more renewables)
- New transport modes emerge

**To Update:** Edit `emission_factors.json` and restart the server.

---

## 📞 Questions?

- **API Endpoint:** POST `/api/emissions/calculate-single-node`
- **Example Response:** See QUICKSTART.md
- **Full Documentation:** See README.md

**All values are based on 2026 global averages and may vary by region.**
