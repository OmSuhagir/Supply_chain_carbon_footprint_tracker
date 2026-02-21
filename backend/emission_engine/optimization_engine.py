"""
optimization_engine.py - Cost, Carbon, and Time tradeoff analysis

Handles:
- Alternative scenario comparison
- Carbon saved/lost calculation
- Cost impact calculation
- Time tradeoff analysis
- Business risk scoring for time delays
"""

from typing import Dict, List, Any
from utils import round_value, calculate_percentage, safe_divide


class OptimizationEngine:
    """Analyze and optimize supply chain alternatives"""
    
    def __init__(self):
        """Initialize optimization engine"""
        pass
    
    def compare_alternatives(self, current_scenario: Dict, alternative_scenario: Dict) -> Dict[str, Any]:
        """
        Compare current scenario with alternative scenario
        
        Args:
            current_scenario: Current node configuration
                - transport_mode, distance_km, transport_cost, transport_time_days, emission
            alternative_scenario: Alternative node configuration
                - transport_mode, distance_km, transport_cost, transport_time_days, emission
        
        Returns:
            dict: Comparison metrics with savings/losses
        """
        
        # Extract values with defaults
        current_emission = current_scenario.get("total_emission", 0)
        current_cost = current_scenario.get("transport_cost", 0)
        current_time = current_scenario.get("transport_time_days", 0)
        current_mode = current_scenario.get("transport_mode", "truck")
        
        alt_emission = alternative_scenario.get("total_emission", 0)
        alt_cost = alternative_scenario.get("transport_cost", 0)
        alt_time = alternative_scenario.get("transport_time_days", 0)
        alt_mode = alternative_scenario.get("transport_mode", "truck")
        
        # Calculate changes
        carbon_saved = current_emission - alt_emission
        carbon_saved_pct = calculate_percentage(carbon_saved, current_emission)
        
        cost_change = current_cost - alt_cost
        cost_change_pct = calculate_percentage(cost_change, current_cost)
        
        time_change = alt_time - current_time  # Positive means increased time
        time_change_pct = calculate_percentage(time_change, current_time)
        
        return {
            "comparison": {
                "current": {
                    "mode": current_mode,
                    "emission": round_value(current_emission),
                    "cost": round_value(current_cost),
                    "time_days": round_value(current_time)
                },
                "alternative": {
                    "mode": alt_mode,
                    "emission": round_value(alt_emission),
                    "cost": round_value(alt_cost),
                    "time_days": round_value(alt_time)
                }
            },
            "changes": {
                "carbon_saved": round_value(carbon_saved),
                "carbon_saved_percentage": round_value(carbon_saved_pct),
                "carbon_improved": carbon_saved > 0,
                "cost_saved": round_value(cost_change),
                "cost_saved_percentage": round_value(cost_change_pct),
                "cost_improved": cost_change > 0,
                "time_increased": round_value(time_change),
                "time_increased_percentage": round_value(time_change_pct),
                "time_worsened": time_change > 0
            },
            "recommendation": self._generate_recommendation(
                carbon_saved, cost_change, time_change, carbon_saved_pct, cost_change_pct
            )
        }
    
    def _generate_recommendation(self, carbon_saved: float, cost_change: float, 
                                 time_change: float, carbon_pct: float, cost_pct: float) -> Dict[str, Any]:
        """
        Generate recommendation based on tradeoffs
        
        Args:
            carbon_saved: Carbon savings
            cost_change: Cost change (positive = savings)
            time_change: Time change (positive = delay)
            carbon_pct: Carbon percentage change
            cost_pct: Cost percentage change
        
        Returns:
            dict: Recommendation with rationale
        """
        
        score = 0
        factors = []
        
        # Score based on carbon impact
        if carbon_saved > 0:
            score += 30
            factors.append(f"✔ {round_value(carbon_pct)}% carbon reduction")
        else:
            score -= 20
            factors.append(f"✗ {round_value(abs(carbon_pct))}% carbon increase")
        
        # Score based on cost impact
        if cost_change > 0:
            score += 30
            factors.append(f"✔ {round_value(cost_pct)}% cost savings")
        elif cost_change < 0:
            score -= 15
            factors.append(f"✗ {round_value(abs(cost_pct))}% cost increase")
        else:
            score += 10
            factors.append("✔ No cost change")
        
        # Score based on time impact
        if time_change > 3:  # More than 3 days delay
            score -= 25
            factors.append(f"⚠ {round_value(time_change)} days delivery delay")
        elif time_change > 0:
            score -= 10
            factors.append(f"⚠ {round_value(time_change)} days delivery delay")
        elif time_change < 0:
            score += 15
            factors.append(f"✔ {round_value(abs(time_change))} days faster")
        else:
            score += 5
            factors.append("✔ No time change")
        
        # Determine recommendation
        if score >= 50:
            status = "Highly Recommended"
            icon = "🟢"
        elif score >= 20:
            status = "Recommended"
            icon = "🟡"
        elif score >= -10:
            status = "Neutral"
            icon = "⚪"
        else:
            status = "Not Recommended"
            icon = "🔴"
        
        return {
            "status": status,
            "score": round_value(score),
            "icon": icon,
            "factors": factors
        }
    
    def calculate_hybrid_logistics(self, distances: List[float], transport_modes: List[str], 
                                   split_percentage: float = 50) -> Dict[str, Any]:
        """
        Calculate hybrid logistics solution (e.g., 50% truck + 50% rail)
        
        Args:
            distances: List of distances for each segment
            transport_modes: List of transport modes for each segment
            split_percentage: Split ratio (default 50%)
        
        Returns:
            dict: Hybrid logistics analysis
        """
        
        # This is a simplified model - in production you'd have more complexity
        result = {
            "split_percentage": split_percentage,
            "hybrid_solution": [],
            "total_hybrid_emission": 0,
            "total_hybrid_cost": 0,
            "total_hybrid_time": 0
        }
        
        return result
    
    def calculate_business_risk_score(self, time_increase_days: float, demand_urgency: str = "medium") -> Dict[str, Any]:
        """
        Calculate business risk score for time-based delays
        
        Formula:
        Risk Score = Time Increase × Demand Urgency Factor
        
        Args:
            time_increase_days: Additional days in delivery
            demand_urgency: Urgency level (low, medium, high, critical)
        
        Returns:
            dict: Risk score and assessment
        """
        
        urgency_factors = {
            "low": 0.3,
            "medium": 0.6,
            "high": 1.0,
            "critical": 1.5
        }
        
        urgency_factor = urgency_factors.get(demand_urgency.lower(), 0.6)
        
        # Calculate risk score
        risk_score = time_increase_days * urgency_factor
        risk_score = round_value(risk_score, 2)
        
        # Determine risk level
        if risk_score < 0.5:
            risk_level = "Low"
            color = "#22C55E"  # Green
        elif risk_score < 1.5:
            risk_level = "Medium"
            color = "#F59E0B"  # Amber
        elif risk_score < 3:
            risk_level = "High"
            color = "#EF4444"  # Red
        else:
            risk_level = "Critical"
            color = "#991B1B"  # Dark red
        
        # Generate recommendation
        recommendation = self._generate_risk_recommendation(risk_level, time_increase_days, demand_urgency)
        
        return {
            "risk_score": risk_score,
            "risk_level": risk_level,
            "color": color,
            "time_increase_days": round_value(time_increase_days),
            "demand_urgency": demand_urgency,
            "urgency_factor": urgency_factor,
            "recommendation": recommendation
        }
    
    def _generate_risk_recommendation(self, risk_level: str, time_increase: float, 
                                     urgency: str) -> str:
        """Generate risk mitigation recommendation"""
        
        if risk_level == "Low":
            return "Alternative transport is viable for this shipment."
        elif risk_level == "Medium":
            return f"For {urgency}-demand items, consider hybrid logistics (50% truck + 50% rail) to balance speed and emissions."
        elif risk_level == "High":
            return "Consider carbon offset credits or green premium pricing for this route instead of changing transport mode."
        else:  # Critical
            return "For critical shipments, maintain current transport mode. Suggest sustainable alternatives for future planning."
    
    def get_optimization_recommendations(self, current_scenario: Dict, 
                                        supply_mode_alternatives: List[Dict]) -> List[Dict]:
        """
        Get ranked optimization recommendations
        
        Args:
            current_scenario: Current scenario data
            supply_mode_alternatives: List of alternative scenarios
        
        Returns:
            list: Ranked recommendations
        """
        
        recommendations = []
        
        for alternative in supply_mode_alternatives:
            comparison = self.compare_alternatives(current_scenario, alternative)
            recommendation = {
                "alternative_mode": alternative.get("transport_mode", "unknown"),
                "comparison": comparison,
                "rank_score": comparison["recommendation"]["score"]
            }
            recommendations.append(recommendation)
        
        # Sort by score (highest first)
        recommendations.sort(key=lambda x: x["rank_score"], reverse=True)
        
        return recommendations


def compare_scenarios(current: Dict, alternative: Dict) -> Dict[str, Any]:
    """
    Helper function to compare two scenarios
    
    Args:
        current: Current scenario
        alternative: Alternative scenario
    
    Returns:
        dict: Comparison results
    """
    engine = OptimizationEngine()
    return engine.compare_alternatives(current, alternative)
