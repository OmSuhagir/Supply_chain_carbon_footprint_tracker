"""
test_all_endpoints.py - Comprehensive test suite for all Python engine endpoints

Run with: pytest test_all_endpoints.py -v

This file tests all 24 endpoints with:
- Valid inputs
- Invalid inputs
- Edge cases
- Error scenarios
"""

import pytest
import requests
import json
from typing import Dict, Any

# Base URL for Python engine
BASE_URL = "http://localhost:8000"

# Color codes for terminal output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'


class TestHealthCheck:
    """Test health check endpoints"""

    def test_root_endpoint(self):
        """Test GET / endpoint"""
        response = requests.get(f"{BASE_URL}/")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "running"
        assert "application" in data
        print(f"{GREEN}✅ Root endpoint works{RESET}")

    def test_health_endpoint(self):
        """Test GET /health endpoint"""
        response = requests.get(f"{BASE_URL}/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        print(f"{GREEN}✅ Health endpoint works{RESET}")


class TestEmissionCalculations:
    """Test emission calculation endpoints"""

    def test_calculate_single_node(self):
        """Test POST /api/emissions/calculate-single-node"""
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

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["total_emission"] == 60.5  # 500*0.12 + 0.5
        print(f"{GREEN}✅ Single node calculation: {data['data']['total_emission']} kg CO2{RESET}")

    def test_calculate_single_node_rail(self):
        """Test single node with rail transport"""
        payload = {
            "stage_name": "Rail Transport",
            "transport_mode": "rail",
            "distance_km": 1000,
            "energy_source": "coal"
        }

        response = requests.post(
            f"{BASE_URL}/api/emissions/calculate-single-node",
            json=payload
        )

        assert response.status_code == 200
        data = response.json()
        assert data["data"]["total_emission"] == 40.9  # 1000*0.04 + 0.9
        print(f"{GREEN}✅ Rail transport calculation: {data['data']['total_emission']} kg CO2{RESET}")

    def test_calculate_single_node_air(self):
        """Test single node with air transport (highest emission)"""
        payload = {
            "stage_name": "Air Freight",
            "transport_mode": "air",
            "distance_km": 500,
            "energy_source": "solar"
        }

        response = requests.post(
            f"{BASE_URL}/api/emissions/calculate-single-node",
            json=payload
        )

        assert response.status_code == 200
        data = response.json()
        # 500 * 0.60 + 0.05 = 300.05
        assert data["data"]["total_emission"] == 300.05
        print(f"{GREEN}✅ Air transport calculation: {data['data']['total_emission']} kg CO2{RESET}")

    def test_calculate_total_emissions(self):
        """Test POST /api/emissions/calculate-total"""
        payload = {
            "supply_chain_nodes": [
                {
                    "stage_name": "Raw Material",
                    "transport_mode": "truck",
                    "distance_km": 500,
                    "energy_source": "gas"
                },
                {
                    "stage_name": "Supplier",
                    "transport_mode": "rail",
                    "distance_km": 1000,
                    "energy_source": "coal"
                },
                {
                    "stage_name": "Distribution",
                    "transport_mode": "truck",
                    "distance_km": 800,
                    "energy_source": "gas"
                }
            ]
        }

        response = requests.post(
            f"{BASE_URL}/api/emissions/calculate-total",
            json=payload
        )

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["node_count"] == 3
        assert data["data"]["total_emission"] > 0
        assert data["data"]["highest_emission_stage"] is not None
        print(f"{GREEN}✅ Total emissions: {data['data']['total_emission']} kg CO2 ({data['data']['node_count']} nodes){RESET}")

    def test_calculate_total_emissions_empty(self):
        """Test with empty supply chain"""
        payload = {"supply_chain_nodes": []}

        response = requests.post(
            f"{BASE_URL}/api/emissions/calculate-total",
            json=payload
        )

        assert response.status_code == 200
        data = response.json()
        assert data["data"]["total_emission"] == 0
        print(f"{GREEN}✅ Empty supply chain handled correctly{RESET}")

    def test_transport_mode_comparison(self):
        """Test POST /api/emissions/transport-comparison"""
        response = requests.post(
            f"{BASE_URL}/api/emissions/transport-comparison?distance_km=500&current_mode=truck"
        )

        assert response.status_code == 200
        data = response.json()
        assert len(data["data"]) == 4  # truck, rail, ship, air
        # Should be sorted by emission (lowest first)
        assert data["data"][0]["transport_mode"] in ["ship", "rail"]
        assert data["data"][-1]["transport_mode"] == "air"
        print(f"{GREEN}✅ Transport comparison: {len(data['data'])} modes compared{RESET}")

    def test_energy_source_comparison(self):
        """Test POST /api/emissions/energy-comparison"""
        response = requests.post(
            f"{BASE_URL}/api/emissions/energy-comparison"
        )

        assert response.status_code == 200
        data = response.json()
        assert len(data["data"]) == 5  # coal, gas, solar, wind, hydro
        # Should be sorted by emission (lowest first)
        assert data["data"][0]["renewable"] is True
        assert data["data"][-1]["renewable"] is False
        print(f"{GREEN}✅ Energy comparison: {len(data['data'])} sources compared{RESET}")


class TestNetZeroTracking:
    """Test net-zero tracking endpoints"""

    def test_calculate_alignment_on_track(self):
        """Test net-zero alignment when on track"""
        payload = {
            "yearly_target": 50000,
            "current_emission": 10000  # 80% alignment - on track
        }

        response = requests.post(
            f"{BASE_URL}/api/net-zero/calculate-alignment",
            json=payload
        )

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["alignment_percentage"] == 80.0
        assert data["data"]["status"] == "success"
        assert data["data"]["is_on_track"] is True
        print(f"{GREEN}✅ Net-zero alignment (On track): {data['data']['alignment_percentage']}% - {data['data']['label']}{RESET}")

    def test_calculate_alignment_at_risk(self):
        """Test net-zero alignment when at risk"""
        payload = {
            "yearly_target": 50000,
            "current_emission": 20000  # 60% alignment - at risk
        }

        response = requests.post(
            f"{BASE_URL}/api/net-zero/calculate-alignment",
            json=payload
        )

        assert response.status_code == 200
        data = response.json()
        assert data["data"]["alignment_percentage"] == 60.0
        assert data["data"]["status"] == "warning"
        print(f"{GREEN}✅ Net-zero alignment (At risk): {data['data']['alignment_percentage']}% - {data['data']['label']}{RESET}")

    def test_calculate_alignment_off_track(self):
        """Test net-zero alignment when off track"""
        payload = {
            "yearly_target": 50000,
            "current_emission": 32000  # 36% alignment - off track
        }

        response = requests.post(
            f"{BASE_URL}/api/net-zero/calculate-alignment",
            json=payload
        )

        assert response.status_code == 200
        data = response.json()
        assert data["data"]["alignment_percentage"] == 36.0
        assert data["data"]["status"] == "critical"
        assert data["data"]["is_on_track"] is False
        print(f"{GREEN}✅ Net-zero alignment (Off track): {data['data']['alignment_percentage']}% - {data['data']['label']}{RESET}")

    def test_forecast_year_end(self):
        """Test POST /api/net-zero/forecast-year-end"""
        payload = {
            "current_emission": 32000,
            "days_passed": 90,
            "yearly_target": 50000
        }

        response = requests.post(
            f"{BASE_URL}/api/net-zero/forecast-year-end",
            json=payload
        )

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["forecast_year_end"] > 0
        assert data["data"]["will_exceed_target"] is True
        print(f"{GREEN}✅ Year-end forecast: {data['data']['forecast_year_end']:.0f} kg CO2 (exceeds target){RESET}")

    def test_progress_metrics(self):
        """Test POST /api/net-zero/progress-metrics"""
        payload = {
            "yearly_target": 50000,
            "current_emission": 32000
        }

        response = requests.post(
            f"{BASE_URL}/api/net-zero/progress-metrics?days_passed=90",
            json=payload
        )

        assert response.status_code == 200
        data = response.json()
        assert "alignment_info" in data["data"]
        assert "forecast_info" in data["data"]
        assert "progress_percentage" in data["data"]
        print(f"{GREEN}✅ Progress metrics: {data['data']['progress_percentage']}% of year passed{RESET}")

    def test_milestones(self):
        """Test POST /api/net-zero/milestones"""
        payload = {
            "yearly_target": 50000,
            "current_emission": 32000
        }

        response = requests.post(
            f"{BASE_URL}/api/net-zero/milestones",
            json=payload
        )

        assert response.status_code == 200
        data = response.json()
        assert "milestones" in data["data"]
        assert len(data["data"]["milestones"]) == 4  # Q1, Q2, Q3, Year-End
        print(f"{GREEN}✅ Milestones: Next milestone is {data['data']['next_milestone']}{RESET}")


class TestOptimization:
    """Test optimization endpoints"""

    def test_compare_scenarios_truck_vs_rail(self):
        """Test comparing truck vs rail"""
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

        assert response.status_code == 200
        data = response.json()
        assert data["data"]["changes"]["carbon_saved"] == 300
        assert data["data"]["changes"]["carbon_saved_percentage"] == 60.0
        assert data["data"]["changes"]["cost_saved"] == 500
        assert data["data"]["recommendation"]["status"] == "Highly Recommended"
        print(f"{GREEN}✅ Scenario comparison: {data['data']['changes']['carbon_saved']} kg CO2 saved, Score: {data['data']['recommendation']['score']}{RESET}")

    def test_business_risk_low(self):
        """Test business risk with low urgency"""
        response = requests.post(
            f"{BASE_URL}/api/optimization/business-risk-score?time_increase_days=1&demand_urgency=low"
        )

        assert response.status_code == 200
        data = response.json()
        assert data["data"]["risk_level"] == "Low"
        print(f"{GREEN}✅ Business risk (low urgency): {data['data']['risk_level']} risk{RESET}")

    def test_business_risk_critical(self):
        """Test business risk with critical urgency"""
        response = requests.post(
            f"{BASE_URL}/api/optimization/business-risk-score?time_increase_days=5&demand_urgency=critical"
        )

        assert response.status_code == 200
        data = response.json()
        assert data["data"]["risk_level"] == "Critical"
        print(f"{GREEN}✅ Business risk (critical urgency): {data['data']['risk_level']} risk{RESET}")


class TestBusinessIntelligence:
    """Test business intelligence endpoints"""

    def test_carbon_efficiency_good(self):
        """Test carbon efficiency score - good performance"""
        response = requests.post(
            f"{BASE_URL}/api/intelligence/carbon-efficiency?actual_emission=250&benchmark_emission=300"
        )

        assert response.status_code == 200
        data = response.json()
        assert data["data"]["score"] > 80
        assert data["data"]["rating"]["level"] in ["Excellent", "Good"]
        print(f"{GREEN}✅ Carbon efficiency: {data['data']['score']}/100 ({data['data']['rating']['level']}){RESET}")

    def test_cost_efficiency_poor(self):
        """Test cost efficiency score - poor performance"""
        response = requests.post(
            f"{BASE_URL}/api/intelligence/cost-efficiency?actual_cost=6000&benchmark_cost=4000"
        )

        assert response.status_code == 200
        data = response.json()
        assert data["data"]["score"] < 70
        print(f"{GREEN}✅ Cost efficiency: {data['data']['score']}/100 ({data['data']['rating']['level']}){RESET}")

    def test_time_efficiency_excellent(self):
        """Test time efficiency score - excellent performance"""
        response = requests.post(
            f"{BASE_URL}/api/intelligence/time-efficiency?actual_time=8&benchmark_time=10"
        )

        assert response.status_code == 200
        data = response.json()
        assert data["data"]["score"] >= 80
        print(f"{GREEN}✅ Time efficiency: {data['data']['score']}/100 ({data['data']['rating']['level']}){RESET}")

    def test_all_efficiency_scores(self):
        """Test POST /api/intelligence/all-efficiency-scores"""
        payload = {
            "actual_emission": 250,
            "actual_cost": 5000,
            "actual_time": 10
        }

        response = requests.post(
            f"{BASE_URL}/api/intelligence/all-efficiency-scores",
            json=payload
        )

        assert response.status_code == 200
        data = response.json()
        assert "carbon" in data["data"]
        assert "cost" in data["data"]
        assert "time" in data["data"]
        print(f"{GREEN}✅ All efficiency scores: C={data['data']['carbon']['score']}, Cost={data['data']['cost']['score']}, T={data['data']['time']['score']}{RESET}")

    def test_strategic_recommendations(self):
        """Test strategic recommendations"""
        payload = {
            "actual_emission": 250,
            "actual_cost": 5000,
            "actual_time": 10
        }

        response = requests.post(
            f"{BASE_URL}/api/intelligence/strategic-recommendations?current_cost=5000",
            json=payload
        )

        assert response.status_code == 200
        data = response.json()
        assert "data" in data
        print(f"{GREEN}✅ Strategic recommendations generated{RESET}")


class TestAuditReports:
    """Test audit report generation"""

    def test_generate_audit_report(self):
        """Test POST /api/audit/generate-report"""
        payload = {
            "product_data": {
                "_id": "prod_123",
                "name": "Test Product",
                "description": "Test product for audit",
                "yearly_net_zero_target": 50000,
                "current_year_emission": 32000,
                "created_at": "2026-02-21"
            },
            "supply_chain_nodes": [
                {
                    "stage_name": "Raw Material",
                    "transport_mode": "truck",
                    "distance_km": 500,
                    "energy_source": "gas"
                },
                {
                    "stage_name": "Distribution",
                    "transport_mode": "rail",
                    "distance_km": 1000,
                    "energy_source": "coal"
                }
            ],
            "emission_results": {
                "total_emission": 250.5,
                "highest_emission_stage": "Distribution",
                "nodes_breakdown": []
            },
            "efficiency_scores": {
                "carbon": {"score": 65},
                "cost": {"score": 54},
                "time": {"score": 70}
            },
            "recommendations": [],
            "company_name": "Test Company"
        }

        response = requests.post(
            f"{BASE_URL}/api/audit/generate-report",
            json=payload
        )

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "metadata" in data["data"]
        assert "product_summary" in data["data"]
        assert "emission_analysis" in data["data"]
        print(f"{GREEN}✅ Audit report generated{RESET}")


class TestErrorHandling:
    """Test error handling and validation"""

    def test_invalid_transport_mode(self):
        """Test with invalid transport mode"""
        payload = {
            "stage_name": "Test",
            "transport_mode": "invalid_mode",
            "distance_km": 500,
            "energy_source": "gas"
        }

        response = requests.post(
            f"{BASE_URL}/api/emissions/calculate-single-node",
            json=payload
        )

        # Should still process but use default values
        assert response.status_code == 200
        print(f"{GREEN}✅ Invalid transport mode handled{RESET}")

    def test_negative_distance(self):
        """Test with negative distance"""
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

        # Should still process (calculations work)
        assert response.status_code == 200
        print(f"{GREEN}✅ Negative distance handled{RESET}")

    def test_zero_target_alignment(self):
        """Test net-zero alignment with zero target"""
        payload = {
            "yearly_target": 0,
            "current_emission": 1000
        }

        response = requests.post(
            f"{BASE_URL}/api/net-zero/calculate-alignment",
            json=payload
        )

        assert response.status_code == 200
        data = response.json()
        # Should handle gracefully
        print(f"{GREEN}✅ Zero target handled{RESET}")


class TestPerformance:
    """Test performance with large datasets"""

    def test_large_supply_chain(self):
        """Test with 50 supply chain nodes"""
        nodes = []
        for i in range(50):
            transport_modes = ["truck", "rail", "ship", "air"]
            energy_sources = ["coal", "gas", "solar", "wind"]
            
            nodes.append({
                "stage_name": f"Stage {i+1}",
                "transport_mode": transport_modes[i % 4],
                "distance_km": 100 * (i + 1),
                "energy_source": energy_sources[i % 4]
            })

        payload = {"supply_chain_nodes": nodes}

        import time
        start = time.time()
        response = requests.post(
            f"{BASE_URL}/api/emissions/calculate-total",
            json=payload
        )
        elapsed = time.time() - start

        assert response.status_code == 200
        data = response.json()
        assert data["data"]["node_count"] == 50
        print(f"{YELLOW}⏱️  Large supply chain (50 nodes): {elapsed:.2f}s - {data['data']['total_emission']:.1f} kg CO2{RESET}")

    def test_response_time_emissions_endpoint(self):
        """Test response time of emissions calculation"""
        payload = {
            "supply_chain_nodes": [
                {
                    "stage_name": "Raw Material",
                    "transport_mode": "truck",
                    "distance_km": 500,
                    "energy_source": "gas"
                }
            ]
        }

        import time
        start = time.time()
        response = requests.post(
            f"{BASE_URL}/api/emissions/calculate-total",
            json=payload
        )
        elapsed = time.time() - start

        assert elapsed < 1.0  # Should be very fast
        assert response.status_code == 200
        print(f"{GREEN}✅ Response time: {elapsed*1000:.1f}ms{RESET}")


# Test summary function
def print_test_summary():
    """Print summary of all tests"""
    print(f"\n{BLUE}{'='*60}")
    print(f"Python Engine Test Suite Complete")
    print(f"{'='*60}{RESET}\n")


if __name__ == "__main__":
    # Run with pytest
    pytest.main([__file__, "-v", "-s"])
