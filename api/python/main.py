import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/emission-report")
async def get_emission_report():
    """Generate emission report"""
    return {
        "status": "success",
        "message": "Python backend running on Vercel",
        "service": "emission-calculator"
    }

@app.post("/calculate-emissions")
async def calculate_emissions(data: dict):
    """Calculate emissions from supply chain data"""
    try:
        # Import your calculation logic here
        # from backend.emission_engine.emission_calculator import calculate
        return {
            "success": True,
            "data": data,
            "emissions": 0  # placeholder
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.get("/health")
async def health_check():
    """Python backend health check"""
    return {
        "status": "healthy",
        "service": "python-emission-engine",
        "timestamp": str(pd.Timestamp.now())
    }
