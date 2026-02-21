#!/usr/bin/env python3
"""
manual_test.py - Manual testing script for Python engine endpoints

Run with: python manual_test.py

This script provides an interactive menu to test endpoints manually
without requiring pytest or any special setup.

Tests all 24 endpoints with various scenarios.
"""

import requests
import json
from typing import Dict, Any
from datetime import datetime
import sys

# Color codes for terminal output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
CYAN = '\033[96m'
BOLD = '\033[1m'
RESET = '\033[0m'

BASE_URL = "http://localhost:8000"

# Test data templates
SUPPLY_CHAIN_SMALL = {
    "supply_chain_nodes": [
        {
            "stage_name": "Raw Material",
            "transport_mode": "truck",
            "distance_km": 500,
            "energy_source": "gas"
        }
    ]
}

SUPPLY_CHAIN_MEDIUM = {
    "supply_chain_nodes": [
        {
            "stage_name": "Raw Material Transport",
            "transport_mode": "truck",
            "distance_km": 500,
            "energy_source": "gas"
        },
        {
            "stage_name": "Manufacturing",
            "transport_mode": "rail",
            "distance_km": 1000,
            "energy_source": "coal"
        },
        {
            "stage_name": "Distribution",
            "transport_mode": "ship",
            "distance_km": 2000,
            "energy_source": "solar"
        }
    ]
}

SUPPLY_CHAIN_COMPLEX = {
    "supply_chain_nodes": [
        {
            "stage_name": "Supplier A",
            "transport_mode": "truck",
            "distance_km": 300,
            "energy_source": "gas"
        },
        {
            "stage_name": "Supplier B",
            "transport_mode": "rail",
            "distance_km": 800,
            "energy_source": "coal"
        },
        {
            "stage_name": "Manufacturing Plant",
            "transport_mode": "truck",
            "distance_km": 200,
            "energy_source": "solar"
        },
        {
            "stage_name": "Warehouse",
            "transport_mode": "truck",
            "distance_km": 150,
            "energy_source": "wind"
        },
        {
            "stage_name": "Distribution",
            "transport_mode": "ship",
            "distance_km": 5000,
            "energy_source": "hydro"
        }
    ]
}


def check_server():
    """Check if server is running"""
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=2)
        if response.status_code == 200:
            return True
    except Exception as e:
        print(f"{RED}❌ Server not reachable: {e}{RESET}")
        print(f"{YELLOW}Please start the server first: python main.py{RESET}\n")
        return False


def print_header(title: str):
    """Print a formatted header"""
    print(f"\n{CYAN}{BOLD}{'='*70}{RESET}")
    print(f"{CYAN}{BOLD}{title.center(70)}{RESET}")
    print(f"{CYAN}{BOLD}{'='*70}{RESET}\n")


def print_response(response: requests.Response, test_name: str):
    """Print formatted response"""
    try:
        data = response.json()
        
        if response.status_code == 200:
            print(f"{GREEN}✅ {test_name}{RESET}")
            print(f"{BLUE}Status:{RESET} {response.status_code}")
            print(f"{BLUE}Response:{RESET}\n{json.dumps(data, indent=2)}\n")
        else:
            print(f"{RED}❌ {test_name}{RESET}")
            print(f"{BLUE}Status:{RESET} {response.status_code}")
            print(f"{BLUE}Error:{RESET}\n{json.dumps(data, indent=2)}\n")
    except Exception as e:
        print(f"{RED}❌ Error parsing response: {e}{RESET}")
        print(f"{BLUE}Raw response:{RESET} {response.text}\n")


def test_health_checks():
    """Test 1: Health check endpoints"""
    print_header("Test 1: Health Check Endpoints")

    # Test root endpoint
    try:
        response = requests.get(f"{BASE_URL}/")
        print_response(response, "GET /")
    except Exception as e:
        print(f"{RED}❌ Error: {e}{RESET}\n")

    # Test health endpoint
    try:
        response = requests.get(f"{BASE_URL}/health")
        print_response(response, "GET /health")
    except Exception as e:
        print(f"{RED}❌ Error: {e}{RESET}\n")


def test_emissions():
    """Test 2: Emission calculation endpoints"""
    print_header("Test 2: Emission Calculation Endpoints (4 tests)")

    # Test 1: Single node - Truck
    try:
        payload = {
            "stage_name": "Raw Material Transport",
            "transport_mode": "truck",
            "distance_km": 500,
            "energy_source": "gas"
        }
        response = requests.post(
            f"{BASE_URL}/api/emissions/calculate-single-node",
            json=payload
        )
        print_response(response, "Single Node (Truck, 500km, Gas)")
    except Exception as e:
        print(f"{RED}❌ Error: {e}{RESET}\n")

    # Test 2: Single node - Air (highest emissions)
    try:
        payload = {
            "stage_name": "Air Freight",
            "transport_mode": "air",
            "distance_km": 500,
            "energy_source": "coal"
        }
        response = requests.post(
            f"{BASE_URL}/api/emissions/calculate-single-node",
            json=payload
        )
        print_response(response, "Single Node (Air, 500km, Coal - HIGHEST)")
    except Exception as e:
        print(f"{RED}❌ Error: {e}{RESET}\n")

    # Test 3: Total emissions - Small
    try:
        response = requests.post(
            f"{BASE_URL}/api/emissions/calculate-total",
            json=SUPPLY_CHAIN_SMALL
        )
        print_response(response, "Total Emissions (1 node)")
    except Exception as e:
        print(f"{RED}❌ Error: {e}{RESET}\n")

    # Test 4: Total emissions - Complex
    try:
        response = requests.post(
            f"{BASE_URL}/api/emissions/calculate-total",
            json=SUPPLY_CHAIN_COMPLEX
        )
        print_response(response, "Total Emissions (5 nodes - Complex)")
    except Exception as e:
        print(f"{RED}❌ Error: {e}{RESET}\n")

    # Test 5: Transport comparison
    try:
        response = requests.post(
            f"{BASE_URL}/api/emissions/transport-comparison?distance_km=1000&current_mode=truck"
        )
        print_response(response, "Transport Mode Comparison (1000km)")
    except Exception as e:
        print(f"{RED}❌ Error: {e}{RESET}\n")

    # Test 6: Energy source comparison
    try:
        response = requests.post(
            f"{BASE_URL}/api/emissions/energy-comparison"
        )
        print_response(response, "Energy Source Comparison")
    except Exception as e:
        print(f"{RED}❌ Error: {e}{RESET}\n")


def test_net_zero():
    """Test 3: Net-zero tracking endpoints"""
    print_header("Test 3: Net-Zero Tracking Endpoints (4 tests)")

    # Test 1: Alignment - On Track (80%)
    try:
        payload = {
            "yearly_target": 50000,
            "current_emission": 10000  # 80% = on track
        }
        response = requests.post(
            f"{BASE_URL}/api/net-zero/calculate-alignment",
            json=payload
        )
        print_response(response, "Alignment - ON TRACK (80%)")
    except Exception as e:
        print(f"{RED}❌ Error: {e}{RESET}\n")

    # Test 2: Alignment - At Risk (60%)
    try:
        payload = {
            "yearly_target": 50000,
            "current_emission": 20000  # 60% = at risk
        }
        response = requests.post(
            f"{BASE_URL}/api/net-zero/calculate-alignment",
            json=payload
        )
        print_response(response, "Alignment - AT RISK (60%)")
    except Exception as e:
        print(f"{RED}❌ Error: {e}{RESET}\n")

    # Test 3: Alignment - Off Track (36%)
    try:
        payload = {
            "yearly_target": 50000,
            "current_emission": 32000  # 36% = off track
        }
        response = requests.post(
            f"{BASE_URL}/api/net-zero/calculate-alignment",
            json=payload
        )
        print_response(response, "Alignment - OFF TRACK (36%)")
    except Exception as e:
        print(f"{RED}❌ Error: {e}{RESET}\n")

    # Test 4: Year-end forecast
    try:
        payload = {
            "current_emission": 32000,
            "days_passed": 90,
            "yearly_target": 50000
        }
        response = requests.post(
            f"{BASE_URL}/api/net-zero/forecast-year-end",
            json=payload
        )
        print_response(response, "Year-End Forecast (90 days passed)")
    except Exception as e:
        print(f"{RED}❌ Error: {e}{RESET}\n")

    # Test 5: Progress metrics
    try:
        payload = {
            "yearly_target": 50000,
            "current_emission": 32000
        }
        response = requests.post(
            f"{BASE_URL}/api/net-zero/progress-metrics?days_passed=90",
            json=payload
        )
        print_response(response, "Progress Metrics")
    except Exception as e:
        print(f"{RED}❌ Error: {e}{RESET}\n")

    # Test 6: Milestones
    try:
        payload = {
            "yearly_target": 50000,
            "current_emission": 32000
        }
        response = requests.post(
            f"{BASE_URL}/api/net-zero/milestones",
            json=payload
        )
        print_response(response, "Milestone Tracking")
    except Exception as e:
        print(f"{RED}❌ Error: {e}{RESET}\n")


def test_optimization():
    """Test 4: Optimization endpoints"""
    print_header("Test 4: Optimization Endpoints (2 tests)")

    # Test 1: Scenario comparison - Truck vs Rail
    try:
        payload = {
            "current_scenario": {
                "transport_mode": "truck",
                "total_emission": 500,
                "transport_cost": 2000,
                "transport_time_days": 3
            },
            "alternative_scenario": {
                "transport_mode": "rail",
                "total_emission": 200,
                "transport_cost": 1500,
                "transport_time_days": 5
            }
        }
        response = requests.post(
            f"{BASE_URL}/api/optimization/compare-scenarios",
            json=payload
        )
        print_response(response, "Scenario Comparison (Truck vs Rail)")
    except Exception as e:
        print(f"{RED}❌ Error: {e}{RESET}\n")

    # Test 2: Scenario comparison - Rail vs Ship
    try:
        payload = {
            "current_scenario": {
                "transport_mode": "rail",
                "total_emission": 200,
                "transport_cost": 1500,
                "transport_time_days": 5
            },
            "alternative_scenario": {
                "transport_mode": "ship",
                "total_emission": 100,
                "transport_cost": 1000,
                "transport_time_days": 10
            }
        }
        response = requests.post(
            f"{BASE_URL}/api/optimization/compare-scenarios",
            json=payload
        )
        print_response(response, "Scenario Comparison (Rail vs Ship)")
    except Exception as e:
        print(f"{RED}❌ Error: {e}{RESET}\n")

    # Test 3: Business risk - Low urgency
    try:
        response = requests.post(
            f"{BASE_URL}/api/optimization/business-risk-score?time_increase_days=1&demand_urgency=low"
        )
        print_response(response, "Business Risk Score (Low Urgency)")
    except Exception as e:
        print(f"{RED}❌ Error: {e}{RESET}\n")

    # Test 4: Business risk - Critical urgency
    try:
        response = requests.post(
            f"{BASE_URL}/api/optimization/business-risk-score?time_increase_days=5&demand_urgency=critical"
        )
        print_response(response, "Business Risk Score (Critical Urgency - HIGH RISK)")
    except Exception as e:
        print(f"{RED}❌ Error: {e}{RESET}\n")


def test_business_intelligence():
    """Test 5: Business intelligence endpoints"""
    print_header("Test 5: Business Intelligence Endpoints (5 tests)")

    # Test 1: Carbon efficiency - Excellent
    try:
        response = requests.post(
            f"{BASE_URL}/api/intelligence/carbon-efficiency?actual_emission=250&benchmark_emission=300"
        )
        print_response(response, "Carbon Efficiency (Excellent - 250/300)")
    except Exception as e:
        print(f"{RED}❌ Error: {e}{RESET}\n")

    # Test 2: Carbon efficiency - Poor
    try:
        response = requests.post(
            f"{BASE_URL}/api/intelligence/carbon-efficiency?actual_emission=400&benchmark_emission=300"
        )
        print_response(response, "Carbon Efficiency (Poor - 400/300)")
    except Exception as e:
        print(f"{RED}❌ Error: {e}{RESET}\n")

    # Test 3: Cost efficiency
    try:
        response = requests.post(
            f"{BASE_URL}/api/intelligence/cost-efficiency?actual_cost=5000&benchmark_cost=4000"
        )
        print_response(response, "Cost Efficiency (5000/4000)")
    except Exception as e:
        print(f"{RED}❌ Error: {e}{RESET}\n")

    # Test 4: Time efficiency
    try:
        response = requests.post(
            f"{BASE_URL}/api/intelligence/time-efficiency?actual_time=8&benchmark_time=10"
        )
        print_response(response, "Time Efficiency (8/10)")
    except Exception as e:
        print(f"{RED}❌ Error: {e}{RESET}\n")

    # Test 5: All efficiency scores
    try:
        payload = {
            "actual_emission": 250,
            "actual_cost": 5000,
            "actual_time": 10
        }
        response = requests.post(
            f"{BASE_URL}/api/intelligence/all-efficiency-scores",
            json=payload
        )
        print_response(response, "All Efficiency Scores Combined")
    except Exception as e:
        print(f"{RED}❌ Error: {e}{RESET}\n")

    # Test 6: Strategic recommendations
    try:
        payload = {
            "actual_emission": 250,
            "actual_cost": 5000,
            "actual_time": 10
        }
        response = requests.post(
            f"{BASE_URL}/api/intelligence/strategic-recommendations?current_cost=5000",
            json=payload
        )
        print_response(response, "Strategic Recommendations")
    except Exception as e:
        print(f"{RED}❌ Error: {e}{RESET}\n")


def test_audit_reports():
    """Test 6: Audit report generation"""
    print_header("Test 6: Audit Report Generation (1 test)")

    try:
        payload = {
            "product_data": {
                "_id": "prod_123",
                "name": "Electronics Product",
                "description": "Smartphone with carbon-neutral packaging",
                "yearly_net_zero_target": 50000,
                "current_year_emission": 32000,
                "created_at": "2026-02-21"
            },
            "supply_chain_nodes": SUPPLY_CHAIN_COMPLEX["supply_chain_nodes"],
            "emission_results": {
                "total_emission": 1250.5,
                "highest_emission_stage": "Distribution",
                "nodes_breakdown": []
            },
            "efficiency_scores": {
                "carbon": {"score": 65, "rating": {"level": "Average"}},
                "cost": {"score": 54, "rating": {"level": "Below Average"}},
                "time": {"score": 70, "rating": {"level": "Good"}}
            },
            "recommendations": [
                {
                    "category": "Transport",
                    "priority": "High",
                    "suggestion": "Switch air freight to rail for non-urgent shipments",
                    "estimated_impact": "40% emissions reduction"
                }
            ],
            "company_name": "Tech Solutions Inc."
        }
        response = requests.post(
            f"{BASE_URL}/api/audit/generate-report",
            json=payload
        )
        print_response(response, "Audit Report Generation")
    except Exception as e:
        print(f"{RED}❌ Error: {e}{RESET}\n")


def test_edge_cases():
    """Test 7: Edge cases and error handling"""
    print_header("Test 7: Edge Cases & Error Handling (5 tests)")

    # Test 1: Empty supply chain
    try:
        payload = {"supply_chain_nodes": []}
        response = requests.post(
            f"{BASE_URL}/api/emissions/calculate-total",
            json=payload
        )
        print_response(response, "Empty Supply Chain")
    except Exception as e:
        print(f"{RED}❌ Error: {e}{RESET}\n")

    # Test 2: Very large distance
    try:
        payload = {
            "supply_chain_nodes": [
                {
                    "stage_name": "International Cruise",
                    "transport_mode": "ship",
                    "distance_km": 100000,
                    "energy_source": "coal"
                }
            ]
        }
        response = requests.post(
            f"{BASE_URL}/api/emissions/calculate-total",
            json=payload
        )
        print_response(response, "Very Large Distance (100,000 km)")
    except Exception as e:
        print(f"{RED}❌ Error: {e}{RESET}\n")

    # Test 3: Negative values (should still work)
    try:
        payload = {
            "stage_name": "Test",
            "transport_mode": "truck",
            "distance_km": -500,
            "energy_source": "gas"
        }
        response = requests.post(
            f"{BASE_URL}/api/emissions/calculate-single-node",
            json=payload
        )
        print_response(response, "Negative Distance (Edge Case)")
    except Exception as e:
        print(f"{RED}❌ Error: {e}{RESET}\n")

    # Test 4: Zero emission target
    try:
        payload = {
            "yearly_target": 0,
            "current_emission": 5000
        }
        response = requests.post(
            f"{BASE_URL}/api/net-zero/calculate-alignment",
            json=payload
        )
        print_response(response, "Zero Emission Target (Edge Case)")
    except Exception as e:
        print(f"{RED}❌ Error: {e}{RESET}\n")

    # Test 5: Very high efficiency score (benchmark higher than actual)
    try:
        response = requests.post(
            f"{BASE_URL}/api/intelligence/carbon-efficiency?actual_emission=100&benchmark_emission=1000"
        )
        print_response(response, "Excellent Efficiency (10x better than benchmark)")
    except Exception as e:
        print(f"{RED}❌ Error: {e}{RESET}\n")


def print_menu():
    """Print interactive menu"""
    print(f"\n{BOLD}{BLUE}{'='*70}{RESET}")
    print(f"{BOLD}{BLUE}Python Emission Engine - Manual Test Suite{RESET}")
    print(f"{BOLD}{BLUE}{'='*70}{RESET}\n")
    print("Select a test group to run:\n")
    print(f"  {BOLD}1.{RESET} Health Check Endpoints (2/2)")
    print(f"  {BOLD}2.{RESET} Emission Calculation Endpoints (6/6)")
    print(f"  {BOLD}3.{RESET} Net-Zero Tracking Endpoints (6/6)")
    print(f"  {BOLD}4.{RESET} Optimization Endpoints (4/4)")
    print(f"  {BOLD}5.{RESET} Business Intelligence Endpoints (6/6)")
    print(f"  {BOLD}6.{RESET} Audit Report Generation (1/1)")
    print(f"  {BOLD}7.{RESET} Edge Cases & Error Handling (5/5)")
    print(f"  {BOLD}8.{RESET} Run All Tests")
    print(f"  {BOLD}9.{RESET} Exit\n")


def main():
    """Main function"""
    print(f"{CYAN}{BOLD}Starting Python Engine Test Suite...{RESET}\n")
    
    if not check_server():
        return

    print(f"{GREEN}✅ Server is running!{RESET}\n")

    while True:
        print_menu()
        
        choice = input(f"{BOLD}Enter your choice (1-9): {RESET}").strip()

        if choice == "1":
            test_health_checks()
        elif choice == "2":
            test_emissions()
        elif choice == "3":
            test_net_zero()
        elif choice == "4":
            test_optimization()
        elif choice == "5":
            test_business_intelligence()
        elif choice == "6":
            test_audit_reports()
        elif choice == "7":
            test_edge_cases()
        elif choice == "8":
            test_health_checks()
            test_emissions()
            test_net_zero()
            test_optimization()
            test_business_intelligence()
            test_audit_reports()
            test_edge_cases()
            print_header("All Tests Completed!")
        elif choice == "9":
            print(f"\n{YELLOW}Exiting...{RESET}\n")
            break
        else:
            print(f"{RED}Invalid choice. Please try again.{RESET}")

        input(f"\n{BLUE}Press Enter to continue...{RESET}")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n\n{YELLOW}Test suite interrupted by user{RESET}\n")
        sys.exit(0)
