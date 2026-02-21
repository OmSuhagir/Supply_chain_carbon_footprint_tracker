"""
main.py - FastAPI server for CarbonChain Pro computation engine

This is the FastAPI application that exposes all Python calculation engines as REST endpoints.
The Node.js backend will call these endpoints to perform complex calculations.

How to run:
    pip install fastapi uvicorn pandas
    python main.py

The server will run on http://localhost:8000

API Documentation available at:
    http://localhost:8000/docs (Interactive Swagger UI)
    http://localhost:8000/redoc (ReDoc documentation)
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime

# Import our calculation modules
from emission_calculator import EmissionCalculator, calculate_emissions_batch
from net_zero_tracker import NetZeroTracker, calculate_alignment
from optimization_engine import OptimizationEngine, compare_scenarios
from business_intelligence import BusinessIntelligence, get_efficiency_scores
from audit_report_generator import AuditReportGenerator, generate_audit_report
from utils import get_current_timestamp
from database import MongoDBManager
import requests

# =====================
# INITIALIZE FASTAPI APP
# =====================
app = FastAPI(
    title="CarbonChain Pro - Emission Calculation Engine",
    description="Python computation engine for carbon emission calculations, net-zero tracking, and optimization",
    version="1.0.0"
)

# =====================
# CORS CONFIGURATION
# =====================
# Allow requests from React frontend on localhost:5173 (Vite default)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================
# PYDANTIC MODELS
# =====================
# These define the request/response schemas

class SupplyChainNode(BaseModel):
    """Supply chain node data"""
    stage_name: str
    supplier_name: Optional[str] = None
    transport_mode: str  # truck, rail, ship, air
    distance_km: float
    energy_source: str  # coal, gas, solar, wind, hydro
    transport_cost: Optional[float] = 0
    transport_time_days: Optional[float] = 0


class EmissionRequest(BaseModel):
    """Request for emission calculation"""
    supply_chain_nodes: List[SupplyChainNode]


class NodeEmissionResponse(BaseModel):
    """Response for single node emission calculation"""
    stage_name: str
    transport_mode: str
    distance_km: float
    energy_source: str
    transport_emission: float
    energy_emission: float
    total_emission: float
    percentage_of_total: Optional[float] = None


class EmissionResponse(BaseModel):
    """Response for total emission calculation"""
    total_emission: float
    node_count: int
    highest_emission_stage: str
    highest_emission_value: float
    average_emission_per_node: float
    nodes_breakdown: List[Dict]


class NetZeroRequest(BaseModel):
    """Request for net-zero alignment calculation"""
    yearly_target: float
    current_emission: float


class NetZeroResponse(BaseModel):
    """Response for net-zero alignment"""
    alignment_percentage: float
    remaining_emission_budget: float
    status: str
    label: str
    is_on_track: bool


class OptimizationRequest(BaseModel):
    """Request for scenario optimization"""
    current_scenario: Dict[str, Any]
    alternative_scenario: Dict[str, Any]


class ForecastRequest(BaseModel):
    """Request for year-end emission forecast"""
    current_emission: float
    days_passed: int
    yearly_target: Optional[float] = None


class EfficiencyRequest(BaseModel):
    """Request for efficiency scoring"""
    actual_emission: float
    actual_cost: float
    actual_time: float


class AuditReportRequest(BaseModel):
    """Request for audit report generation"""
    product_data: Dict[str, Any]
    supply_chain_nodes: List[SupplyChainNode]
    emission_results: Dict[str, Any]
    efficiency_scores: Dict[str, Any]
    recommendations: List[Dict[str, Any]]
    company_name: Optional[str] = "CarbonChain Pro"


# =====================
# ROOT ENDPOINT
# =====================
@app.get("/")
async def root():
    """
    Welcome endpoint - shows API information
    
    Returns:
        dict: API information
    """
    return {
        "application": "CarbonChain Pro - Emission Calculation Engine",
        "version": "1.0.0",
        "status": "running",
        "timestamp": get_current_timestamp(),
        "documentation": "/docs",
        "endpoints_count": 10,
        "message": "API is ready for requests from Node.js backend"
    }


@app.get("/health")
async def health_check():
    """
    Health check endpoint
    
    Returns:
        dict: Health status
    """
    return {
        "status": "healthy",
        "timestamp": get_current_timestamp()
    }


# =====================
# 1. EMISSION CALCULATION ENDPOINTS
# =====================

@app.post("/api/emissions/calculate-single-node", response_model=Dict)
async def calculate_single_node_emission(node: SupplyChainNode):
    """
    Calculate emission for a single supply chain node
    
    Args:
        node: Supply chain node details
    
    Returns:
        dict: Node emission breakdown
    """
    try:
        calculator = EmissionCalculator()
        result = calculator.calculate_node_emission(node.dict())
        return {
            "success": True,
            "data": result,
            "timestamp": get_current_timestamp()
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error calculating node emission: {str(e)}")


@app.post("/api/emissions/calculate-total", response_model=Dict)
async def calculate_total_emission(request: EmissionRequest = None, product_id: str = None):
    """
    Calculate total emission for all supply chain nodes
    If product_id is provided, fetch nodes from MongoDB.
    Otherwise, use provided supply_chain_nodes.
    Send analysis result to Node.js server.
    """
    try:
        nodes = []
        if product_id:
            # Fetch nodes from MongoDB
            nodes = MongoDBManager.get_nodes_by_product_id(product_id)
        elif request and request.supply_chain_nodes:
            nodes = [node.dict() for node in request.supply_chain_nodes]
        else:
            raise Exception("No supply chain nodes provided")

        result = calculate_emissions_batch(nodes)

        # Send analysis result to Node.js server
        try:
            nodejs_url = "http://localhost:5000/api/analysis/receive-analysis"
            requests.post(nodejs_url, json={"product_id": product_id, "analysis_result": result})
        except Exception as send_err:
            print(f"Failed to send analysis to Node.js: {send_err}")

        return {
            "success": True,
            "data": result,
            "timestamp": get_current_timestamp()
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error calculating total emission: {str(e)}")


@app.post("/api/emissions/transport-comparison", response_model=Dict)
async def compare_transport_modes(distance_km: float, current_mode: str = "truck"):
    """
    Compare emission for different transport modes
    
    Args:
        distance_km: Distance to travel
        current_mode: Current transport mode
    
    Returns:
        dict: Comparison of transport modes
    """
    try:
        calculator = EmissionCalculator()
        result = calculator.get_transport_mode_comparison(distance_km, current_mode)
        return {
            "success": True,
            "data": result,
            "timestamp": get_current_timestamp()
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error comparing transport modes: {str(e)}")


@app.post("/api/emissions/energy-comparison", response_model=Dict)
async def compare_energy_sources():
    """
    Compare emission for different energy sources
    
    Returns:
        dict: Comparison of energy sources
    """
    try:
        calculator = EmissionCalculator()
        result = calculator.get_energy_source_comparison()
        return {
            "success": True,
            "data": result,
            "timestamp": get_current_timestamp()
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error comparing energy sources: {str(e)}")


# =====================
# 2. NET-ZERO TRACKING ENDPOINTS
# =====================

@app.post("/api/net-zero/calculate-alignment", response_model=Dict)
async def calculate_net_zero_alignment(request: NetZeroRequest):
    """
    Calculate net-zero alignment percentage
    
    Args:
        request: Yearly target and current emission
    
    Returns:
        dict: Net-zero alignment with status
    """
    try:
        tracker = NetZeroTracker()
        result = tracker.calculate_net_zero_alignment(request.yearly_target, request.current_emission)
        return {
            "success": True,
            "data": result,
            "timestamp": get_current_timestamp()
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error calculating alignment: {str(e)}")


@app.post("/api/net-zero/forecast-year-end", response_model=Dict)
async def forecast_year_end_emission(request: ForecastRequest):
    """
    Forecast year-end emission based on current trajectory
    
    Args:
        request: Current emission, days passed, and optional target
    
    Returns:
        dict: Year-end emission forecast
    """
    try:
        tracker = NetZeroTracker()
        result = tracker.forecast_year_end_emission(
            request.current_emission,
            request.days_passed,
            request.yearly_target
        )
        return {
            "success": True,
            "data": result,
            "timestamp": get_current_timestamp()
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error forecasting year-end emission: {str(e)}")


@app.post("/api/net-zero/progress-metrics", response_model=Dict)
async def get_progress_metrics(request: NetZeroRequest, days_passed: int = 365):
    """
    Get comprehensive progress metrics
    
    Args:
        request: Yearly target and current emission
        days_passed: Days passed in year
    
    Returns:
        dict: Detailed progress metrics
    """
    try:
        tracker = NetZeroTracker()
        result = tracker.calculate_progress_metrics(
            request.yearly_target,
            request.current_emission,
            days_passed
        )
        return {
            "success": True,
            "data": result,
            "timestamp": get_current_timestamp()
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error calculating progress metrics: {str(e)}")


@app.post("/api/net-zero/milestones", response_model=Dict)
async def get_milestones(request: NetZeroRequest):
    """
    Get milestone recommendations
    
    Args:
        request: Yearly target and current emission
    
    Returns:
        dict: Milestone recommendations
    """
    try:
        tracker = NetZeroTracker()
        result = tracker.get_milestone_recommendations(request.yearly_target, request.current_emission)
        return {
            "success": True,
            "data": result,
            "timestamp": get_current_timestamp()
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error getting milestones: {str(e)}")


# =====================
# 3. OPTIMIZATION ENDPOINTS
# =====================

@app.post("/api/optimization/compare-scenarios", response_model=Dict)
async def compare_optimization_scenarios(request: OptimizationRequest):
    """
    Compare current vs alternative scenario
    
    Args:
        request: Current and alternative scenarios
    
    Returns:
        dict: Comparison with recommendation
    """
    try:
        engine = OptimizationEngine()
        result = engine.compare_alternatives(request.current_scenario, request.alternative_scenario)
        return {
            "success": True,
            "data": result,
            "timestamp": get_current_timestamp()
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error comparing scenarios: {str(e)}")


@app.post("/api/optimization/business-risk-score", response_model=Dict)
async def calculate_business_risk(time_increase_days: float, demand_urgency: str = "medium"):
    """
    Calculate business risk score for time delays
    
    Args:
        time_increase_days: Additional delivery days
        demand_urgency: Demand urgency level
    
    Returns:
        dict: Risk score and assessment
    """
    try:
        engine = OptimizationEngine()
        result = engine.calculate_business_risk_score(time_increase_days, demand_urgency)
        return {
            "success": True,
            "data": result,
            "timestamp": get_current_timestamp()
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error calculating risk score: {str(e)}")


# =====================
# 4. BUSINESS INTELLIGENCE ENDPOINTS
# =====================

@app.post("/api/intelligence/carbon-efficiency", response_model=Dict)
async def get_carbon_efficiency(actual_emission: float, benchmark_emission: Optional[float] = None):
    """
    Calculate carbon efficiency score
    
    Args:
        actual_emission: Actual emission value
        benchmark_emission: Benchmark emission (auto-calculated if not provided)
    
    Returns:
        dict: Carbon efficiency score with analysis
    """
    try:
        bi = BusinessIntelligence()
        result = bi.calculate_carbon_efficiency_score(actual_emission, benchmark_emission)
        return {
            "success": True,
            "data": result,
            "timestamp": get_current_timestamp()
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error calculating carbon efficiency: {str(e)}")


@app.post("/api/intelligence/cost-efficiency", response_model=Dict)
async def get_cost_efficiency(actual_cost: float, benchmark_cost: Optional[float] = None):
    """
    Calculate cost efficiency score
    
    Args:
        actual_cost: Actual cost value
        benchmark_cost: Benchmark cost (auto-calculated if not provided)
    
    Returns:
        dict: Cost efficiency score with analysis
    """
    try:
        bi = BusinessIntelligence()
        result = bi.calculate_cost_efficiency_score(actual_cost, benchmark_cost)
        return {
            "success": True,
            "data": result,
            "timestamp": get_current_timestamp()
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error calculating cost efficiency: {str(e)}")


@app.post("/api/intelligence/time-efficiency", response_model=Dict)
async def get_time_efficiency(actual_time: float, benchmark_time: Optional[float] = None):
    """
    Calculate time efficiency score
    
    Args:
        actual_time: Actual time in days
        benchmark_time: Benchmark time (auto-calculated if not provided)
    
    Returns:
        dict: Time efficiency score with analysis
    """
    try:
        bi = BusinessIntelligence()
        result = bi.calculate_time_efficiency_score(actual_time, benchmark_time)
        return {
            "success": True,
            "data": result,
            "timestamp": get_current_timestamp()
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error calculating time efficiency: {str(e)}")


@app.post("/api/intelligence/all-efficiency-scores", response_model=Dict)
async def get_all_efficiency_scores(request: EfficiencyRequest):
    """
    Get all efficiency scores at once
    
    Args:
        request: Carbon, cost, and time values
    
    Returns:
        dict: All efficiency scores with overall rating
    """
    try:
        scores = get_efficiency_scores(request.actual_emission, request.actual_cost, request.actual_time)
        return {
            "success": True,
            "data": scores,
            "timestamp": get_current_timestamp()
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error calculating efficiency scores: {str(e)}")


@app.post("/api/intelligence/strategic-recommendations", response_model=Dict)
async def get_strategic_recommendations(request: EfficiencyRequest, current_cost: float):
    """
    Get strategic recommendations
    
    Args:
        request: Efficiency scores data
        current_cost: Current total cost
    
    Returns:
        dict: Strategic recommendations
    """
    try:
        bi = BusinessIntelligence()
        result = bi.generate_strategic_recommendations(
            request.actual_emission * 0.4,  # Carbon score weight
            request.actual_cost * 0.35,      # Cost score weight
            request.actual_time * 0.25,      # Time score weight
            request.actual_emission,
            current_cost
        )
        return {
            "success": True,
            "data": result,
            "timestamp": get_current_timestamp()
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error generating recommendations: {str(e)}")


# =====================
# 5. AUDIT REPORT ENDPOINTS
# =====================

@app.post("/api/audit/generate-report", response_model=Dict)
async def generate_audit_report_endpoint(request: AuditReportRequest):
    """
    Generate comprehensive audit report data
    
    Args:
        request: Complete audit report request data
    
    Returns:
        dict: Complete audit report data ready for PDF generation
    """
    try:
        nodes = [node.dict() for node in request.supply_chain_nodes]
        result = generate_audit_report(
            request.product_data,
            nodes,
            request.emission_results,
            request.efficiency_scores,
            request.recommendations
        )
        return {
            "success": True,
            "data": result,
            "timestamp": get_current_timestamp()
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error generating audit report: {str(e)}")


# =====================
# ERROR HANDLERS
# =====================

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Handle HTTP exceptions"""
    return {
        "success": False,
        "error": exc.detail,
        "status_code": exc.status_code,
        "timestamp": get_current_timestamp()
    }


# =====================
# RUN SERVER
# =====================
if __name__ == "__main__":
    import uvicorn
    
    print("=" * 60)
    print("🚀 CarbonChain Pro - Emission Calculation Engine")
    print("=" * 60)
    print("Starting FastAPI server...")
    print("Server will run on: http://localhost:8000")
    print("API Documentation: http://localhost:8000/docs")
    print("=" * 60)
    
    # Run with auto-reload enabled for development
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
