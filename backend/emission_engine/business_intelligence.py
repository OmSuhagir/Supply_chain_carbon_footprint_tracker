"""
business_intelligence.py - Business Intelligence scoring and recommendations

Handles:
- Carbon Efficiency Score (0-100)
- Cost Efficiency Score (0-100)
- Time Efficiency Score (0-100)
- Benchmark comparisons
- Strategic recommendations
"""

from typing import Dict, List, Any
from utils import round_value, calculate_percentage, clamp_score, safe_divide


class BusinessIntelligence:
    """Generate business intelligence metrics and recommendations"""
    
    def __init__(self):
        """Initialize BI engine"""
        self.benchmark_values = {
            "average_emission_per_km": 0.15,
            "average_cost_per_km": 0.5,
            "average_time_per_km": 0.05
        }
    
    def calculate_carbon_efficiency_score(self, actual_emission: float, 
                                         benchmark_emission: float = None) -> Dict[str, Any]:
        """
        Calculate Carbon Efficiency Score (0-100)
        
        Formula:
        Carbon Efficiency = (Benchmark / Actual) × 100
        
        Higher score = Better (lower emissions)
        
        Args:
            actual_emission: Actual emission in kg CO2
            benchmark_emission: Benchmark emission (default auto-calculated)
        
        Returns:
            dict: Carbon efficiency score with analysis
        """
        
        if benchmark_emission is None:
            # Auto-calculate benchmark as 20% lower than average
            benchmark_emission = actual_emission * 0.8
        
        if actual_emission == 0:
            score = 100
        else:
            # Score = benchmark/actual * 100
            # If actual < benchmark (efficient), score > 100, clamp to 100
            # If actual > benchmark (inefficient), score < 100
            score = safe_divide(benchmark_emission, actual_emission, 0) * 100
        
        # Clamp to 0-100
        score = clamp_score(score, 0, 100)
        score = round_value(score, 2)
        
        # Get performance rating
        rating = self._get_efficiency_rating(score)
        
        return {
            "score": score,
            "rating": rating,
            "actual_emission": round_value(actual_emission),
            "benchmark_emission": round_value(benchmark_emission),
            "efficiency_gap": round_value(benchmark_emission - actual_emission),
            "color": rating["color"],
            "description": rating["description"]
        }
    
    def calculate_cost_efficiency_score(self, actual_cost: float, 
                                       benchmark_cost: float = None) -> Dict[str, Any]:
        """
        Calculate Cost Efficiency Score (0-100)
        
        Formula:
        Cost Efficiency = (Benchmark / Actual) × 100
        
        Higher score = Better (lower costs)
        
        Args:
            actual_cost: Actual cost value
            benchmark_cost: Benchmark cost (default auto-calculated)
        
        Returns:
            dict: Cost efficiency score with analysis
        """
        
        if benchmark_cost is None:
            # Auto-calculate benchmark as 15% lower than actual
            benchmark_cost = actual_cost * 0.85
        
        if actual_cost == 0:
            score = 100
        else:
            score = safe_divide(benchmark_cost, actual_cost, 0) * 100
        
        # Clamp to 0-100
        score = clamp_score(score, 0, 100)
        score = round_value(score, 2)
        
        # Get performance rating
        rating = self._get_efficiency_rating(score)
        
        return {
            "score": score,
            "rating": rating,
            "actual_cost": round_value(actual_cost),
            "benchmark_cost": round_value(benchmark_cost),
            "efficiency_gap": round_value(benchmark_cost - actual_cost),
            "color": rating["color"],
            "description": rating["description"]
        }
    
    def calculate_time_efficiency_score(self, actual_time: float, 
                                       benchmark_time: float = None) -> Dict[str, Any]:
        """
        Calculate Time Efficiency Score (0-100)
        
        Formula:
        Time Efficiency = (Benchmark / Actual) × 100
        
        Higher score = Better (faster time)
        
        Args:
            actual_time: Actual delivery time in days
            benchmark_time: Benchmark time (default auto-calculated)
        
        Returns:
            dict: Time efficiency score with analysis
        """
        
        if benchmark_time is None:
            # Auto-calculate benchmark as 10% faster than actual
            benchmark_time = actual_time * 0.9
        
        if actual_time == 0:
            score = 100
        else:
            score = safe_divide(benchmark_time, actual_time, 0) * 100
        
        # Clamp to 0-100
        score = clamp_score(score, 0, 100)
        score = round_value(score, 2)
        
        # Get performance rating
        rating = self._get_efficiency_rating(score)
        
        return {
            "score": score,
            "rating": rating,
            "actual_time": round_value(actual_time),
            "benchmark_time": round_value(benchmark_time),
            "efficiency_gap": round_value(actual_time - benchmark_time),
            "color": rating["color"],
            "description": rating["description"]
        }
    
    def _get_efficiency_rating(self, score: float) -> Dict[str, str]:
        """
        Get efficiency rating based on score
        
        Args:
            score: Score 0-100
        
        Returns:
            dict: Rating info with color and description
        """
        
        if score >= 85:
            return {
                "level": "Excellent",
                "color": "#22C55E",  # Green
                "description": "Outstanding performance"
            }
        elif score >= 70:
            return {
                "level": "Good",
                "color": "#10B981",  # Emerald
                "description": "Above average performance"
            }
        elif score >= 50:
            return {
                "level": "Average",
                "color": "#F59E0B",  # Amber
                "description": "Meets standard expectations"
            }
        else:
            return {
                "level": "Below Average",
                "color": "#EF4444",  # Red
                "description": "Performance needs improvement"
            }
    
    def calculate_overall_efficiency(self, carbon_score: float, cost_score: float, 
                                    time_score: float, weights: Dict = None) -> Dict[str, Any]:
        """
        Calculate overall efficiency score (weighted average)
        
        Args:
            carbon_score: Carbon efficiency score
            cost_score: Cost efficiency score
            time_score: Time efficiency score
            weights: Weight distribution (default 40%, 35%, 25%)
        
        Returns:
            dict: Overall efficiency analysis
        """
        
        if weights is None:
            weights = {
                "carbon": 0.40,
                "cost": 0.35,
                "time": 0.25
            }
        
        # Calculate weighted average
        overall_score = (
            carbon_score * weights["carbon"] +
            cost_score * weights["cost"] +
            time_score * weights["time"]
        )
        
        overall_score = round_value(overall_score, 2)
        rating = self._get_efficiency_rating(overall_score)
        
        return {
            "overall_score": overall_score,
            "rating": rating,
            "component_scores": {
                "carbon": round_value(carbon_score),
                "cost": round_value(cost_score),
                "time": round_value(time_score)
            },
            "weights": weights,
            "strongest_area": self._get_strongest_area(carbon_score, cost_score, time_score),
            "weakest_area": self._get_weakest_area(carbon_score, cost_score, time_score)
        }
    
    def _get_strongest_area(self, carbon: float, cost: float, time: float) -> str:
        """Find the strongest performing area"""
        scores = {"Carbon": carbon, "Cost": cost, "Time": time}
        return max(scores, key=scores.get)
    
    def _get_weakest_area(self, carbon: float, cost: float, time: float) -> str:
        """Find the weakest performing area"""
        scores = {"Carbon": carbon, "Cost": cost, "Time": time}
        return min(scores, key=scores.get)
    
    def generate_strategic_recommendations(self, carbon_score: float, cost_score: float, 
                                          time_score: float, current_emission: float,
                                          current_cost: float) -> List[Dict[str, Any]]:
        """
        Generate strategic recommendations based on scores
        
        Args:
            carbon_score: Carbon efficiency score
            cost_score: Cost efficiency score
            time_score: Time efficiency score
            current_emission: Current total emission
            current_cost: Current total cost
        
        Returns:
            list: Ranked recommendations
        """
        
        recommendations = []
        
        # Carbon recommendations
        if carbon_score < 60:
            recommendations.append({
                "category": "Carbon Reduction",
                "priority": "High",
                "icon": "🌱",
                "suggestions": [
                    "Switch to renewable energy suppliers (solar, wind, hydro)",
                    "Replace air freight with rail or sea freight",
                    "Localize supplier network to reduce transport",
                    "Invest in electric fleet vehicles",
                    "Bulk shipping to reduce number of trips"
                ],
                "estimated_reduction": round_value(current_emission * 0.25)
            })
        elif carbon_score < 75:
            recommendations.append({
                "category": "Carbon Optimization",
                "priority": "Medium",
                "icon": "🍃",
                "suggestions": [
                    "Review energy sources for optimization",
                    "Explore hybrid logistics solutions",
                    "Implement carbon offset programs"
                ],
                "estimated_reduction": round_value(current_emission * 0.10)
            })
        
        # Cost recommendations
        if cost_score < 60:
            recommendations.append({
                "category": "Cost Reduction",
                "priority": "High",
                "icon": "💰",
                "suggestions": [
                    "Negotiate better rates with suppliers",
                    "Consolidate shipments",
                    "Use slower but cheaper transport modes",
                    "Implement vendor optimization"
                ],
                "estimated_savings": round_value(current_cost * 0.20)
            })
        elif cost_score < 75:
            recommendations.append({
                "category": "Cost Optimization",
                "priority": "Medium",
                "icon": "💵",
                "suggestions": [
                    "Review pricing agreements quarterly",
                    "Explore volume discounts"
                ],
                "estimated_savings": round_value(current_cost * 0.08)
            })
        
        # Time recommendations
        if time_score < 60:
            recommendations.append({
                "category": "Delivery Speed",
                "priority": "Medium",
                "icon": "⚡",
                "suggestions": [
                    "Optimize routing algorithms",
                    "Establish regional warehouses",
                    "Implement just-in-time logistics"
                ],
                "time_improvement": "10-15% faster"
            })
        
        return recommendations


def get_efficiency_scores(carbon: float, cost: float, time: float) -> Dict[str, Any]:
    """
    Helper function to get all efficiency scores
    
    Args:
        carbon: Carbon value
        cost: Cost value
        time: Time value
    
    Returns:
        dict: All efficiency scores
    """
    bi = BusinessIntelligence()
    carbon_score = bi.calculate_carbon_efficiency_score(carbon)
    cost_score = bi.calculate_cost_efficiency_score(cost)
    time_score = bi.calculate_time_efficiency_score(time)
    
    return {
        "carbon": carbon_score,
        "cost": cost_score,
        "time": time_score
    }
