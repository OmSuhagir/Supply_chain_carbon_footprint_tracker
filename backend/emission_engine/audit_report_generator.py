"""
audit_report_generator.py - Generate audit-ready report data

Handles:
- Comprehensive report data generation
- Emission calculations summary
- Methodology documentation
- Recommendations compilation
- JSON output for PDF generation
"""

from typing import Dict, List, Any
from datetime import datetime
from utils import round_value, format_emission_value, format_cost_value


class AuditReportGenerator:
    """Generate audit-ready report data"""
    
    def __init__(self):
        """Initialize report generator"""
        self.generated_at = datetime.utcnow().isoformat()
    
    def generate_audit_report_data(self, product_data: Dict, supply_chain_nodes: List[Dict],
                                   emission_results: Dict, efficiency_scores: Dict,
                                   recommendations: List[Dict],
                                   company_name: str = "CarbonChain Pro") -> Dict[str, Any]:
        """
        Generate comprehensive audit report data
        
        Args:
            product_data: Product information
            supply_chain_nodes: Supply chain node details
            emission_results: Emission calculation results
            efficiency_scores: Carbon/Cost/Time efficiency scores
            recommendations: Strategic recommendations
            company_name: Company name for report
        
        Returns:
            dict: Complete audit report data ready for PDF generation
        """
        
        report = {
            "metadata": self._generate_metadata(company_name),
            "product_summary": self._generate_product_summary(product_data),
            "supply_chain_analysis": self._generate_supply_chain_analysis(supply_chain_nodes, emission_results),
            "emission_analysis": self._generate_emission_analysis(emission_results),
            "efficiency_analysis": self._generate_efficiency_analysis(efficiency_scores),
            "net_zero_analysis": self._generate_net_zero_analysis(product_data, emission_results),
            "recommendations": self._generate_recommendations_section(recommendations),
            "methodology": self._generate_methodology(),
            "risk_analysis": self._generate_risk_analysis(efficiency_scores),
            "executive_summary": self._generate_executive_summary(product_data, emission_results, efficiency_scores)
        }
        
        return report
    
    def _generate_metadata(self, company_name: str) -> Dict[str, str]:
        """Generate report metadata"""
        return {
            "report_title": "Carbon Supply Chain Audit Report",
            "company_name": company_name,
            "generated_date": self.generated_at,
            "report_version": "1.0",
            "certified_by": "CarbonChain Pro AI Engine",
            "standard_reference": "GHG Protocol, Scope 3 Emissions"
        }
    
    def _generate_product_summary(self, product_data: Dict) -> Dict[str, Any]:
        """Generate product summary section"""
        return {
            "product_name": product_data.get("name", "Unknown"),
            "product_id": product_data.get("_id", "N/A"),
            "description": product_data.get("description", ""),
            "yearly_net_zero_target": round_value(product_data.get("yearly_net_zero_target", 0)),
            "current_year_emission": round_value(product_data.get("current_year_emission", 0)),
            "created_date": product_data.get("created_at", "")
        }
    
    def _generate_supply_chain_analysis(self, nodes: List[Dict], emission_results: Dict) -> Dict[str, Any]:
        """Generate detailed supply chain analysis"""
        
        supply_chain_breakdown = []
        total_distance = 0
        
        for i, node_info in enumerate(emission_results.get("nodes_breakdown", []), 1):
            total_distance += node_info.get("distance_km", 0)
            
            supply_chain_breakdown.append({
                "stage_number": i,
                "stage_name": node_info.get("stage_name", "Stage Unknown"),
                "transport_mode": node_info.get("transport_mode", "truck"),
                "distance_km": round_value(node_info.get("distance_km", 0)),
                "energy_source": node_info.get("energy_source", "gas"),
                "transport_emission": round_value(node_info.get("transport_emission", 0)),
                "energy_emission": round_value(node_info.get("energy_emission", 0)),
                "total_emission": round_value(node_info.get("total_emission", 0)),
                "percentage_of_total": round_value(node_info.get("percentage_of_total", 0))
            })
        
        return {
            "total_stages": len(nodes),
            "total_distance_km": round_value(total_distance),
            "highest_emission_stage": emission_results.get("highest_emission_stage", "Unknown"),
            "highest_emission_value": round_value(emission_results.get("highest_emission_value", 0)),
            "breakdown_by_stage": supply_chain_breakdown
        }
    
    def _generate_emission_analysis(self, emission_results: Dict) -> Dict[str, Any]:
        """Generate detailed emission analysis"""
        
        total_emission = emission_results.get("total_emission", 0)
        
        # Calculate emission distribution
        node_count = emission_results.get("node_count", 0)
        avg_emission = emission_results.get("average_emission_per_node", 0)
        
        return {
            "total_emission_kg_co2": round_value(total_emission),
            "total_emission_formatted": format_emission_value(total_emission),
            "average_emission_per_node": round_value(avg_emission),
            "number_of_nodes": node_count,
            "highest_emission_stage": emission_results.get("highest_emission_stage"),
            "highest_emission_value": round_value(emission_results.get("highest_emission_value", 0)),
            "calculation_basis": "Transport emissions + Energy emissions per node",
            "emission_intensity": round_value(total_emission / node_count if node_count > 0 else 0)
        }
    
    def _generate_efficiency_analysis(self, scores: Dict) -> Dict[str, Any]:
        """Generate efficiency analysis section"""
        
        carbon_score = scores.get("carbon", {})
        cost_score = scores.get("cost", {})
        time_score = scores.get("time", {})
        
        return {
            "carbon_efficiency": {
                "score": carbon_score.get("score", 0),
                "rating": carbon_score.get("rating", {}).get("level", "Unknown"),
                "description": carbon_score.get("description", "")
            },
            "cost_efficiency": {
                "score": cost_score.get("score", 0),
                "rating": cost_score.get("rating", {}).get("level", "Unknown"),
                "description": cost_score.get("description", "")
            },
            "time_efficiency": {
                "score": time_score.get("score", 0),
                "rating": time_score.get("rating", {}).get("level", "Unknown"),
                "description": time_score.get("description", "")
            },
            "overall_assessment": self._calculate_overall_assessment(carbon_score, cost_score, time_score)
        }
    
    def _calculate_overall_assessment(self, carbon: Dict, cost: Dict, time: Dict) -> str:
        """Calculate overall assessment message"""
        avg_score = (carbon.get("score", 0) + cost.get("score", 0) + time.get("score", 0)) / 3
        
        if avg_score >= 80:
            return "✅ Excellent overall supply chain efficiency with strong performance across all metrics."
        elif avg_score >= 60:
            return "✓ Good supply chain performance with opportunities for optimization in specific areas."
        elif avg_score >= 40:
            return "⚠ Moderate performance - significant opportunities for improvement identified."
        else:
            return "🔴 Performance below expectations - immediate action recommended."
    
    def _generate_net_zero_analysis(self, product_data: Dict, emission_results: Dict) -> Dict[str, Any]:
        """Generate net-zero target analysis"""
        
        yearly_target = product_data.get("yearly_net_zero_target", 0)
        current_emission = product_data.get("current_year_emission", 0)
        
        if yearly_target == 0:
            alignment = 0
        else:
            alignment = ((yearly_target - current_emission) / yearly_target) * 100
            alignment = max(0, min(alignment, 100))
        
        remaining_budget = yearly_target - current_emission
        
        # Determine status
        if alignment < 50:
            status = "OFF TRACK"
            status_color = "RED"
        elif alignment < 80:
            status = "AT RISK"
            status_color = "AMBER"
        else:
            status = "ON TRACK"
            status_color = "GREEN"
        
        return {
            "yearly_target": round_value(yearly_target),
            "current_emission": round_value(current_emission),
            "remaining_budget": round_value(remaining_budget),
            "alignment_percentage": round_value(alignment),
            "status": status,
            "status_color": status_color,
            "interpretation": self._interpret_net_zero_status(alignment, remaining_budget)
        }
    
    def _interpret_net_zero_status(self, alignment: float, remaining_budget: float) -> str:
        """Interpret net-zero status"""
        if alignment >= 80:
            return "On pace to meet yearly net-zero target."
        elif alignment >= 50:
            if remaining_budget > 0:
                return f"Additional emission reductions of {round_value(remaining_budget)} kg CO2 needed to meet target."
            else:
                return "Target already exceeded. Immediate mitigation required."
        else:
            return f"Significant reduction of {round_value(abs(remaining_budget))} kg CO2 required urgently."
    
    def _generate_recommendations_section(self, recommendations: List[Dict]) -> Dict[str, Any]:
        """Generate recommendations section"""
        
        return {
            "total_recommendations": len(recommendations),
            "recommendations_by_priority": self._categorize_by_priority(recommendations),
            "detailed_recommendations": recommendations,
            "implementation_focus": self._determine_implementation_focus(recommendations)
        }
    
    def _categorize_by_priority(self, recommendations: List[Dict]) -> Dict[str, List]:
        """Categorize recommendations by priority"""
        
        high = [r for r in recommendations if r.get("priority") == "High"]
        medium = [r for r in recommendations if r.get("priority") == "Medium"]
        low = [r for r in recommendations if r.get("priority") == "Low"]
        
        return {
            "high_priority": len(high),
            "medium_priority": len(medium),
            "low_priority": len(low)
        }
    
    def _determine_implementation_focus(self, recommendations: List[Dict]) -> str:
        """Determine implementation focus"""
        if not recommendations:
            return "Maintain current practices as efficiency is optimal."
        
        high_priority = [r for r in recommendations if r.get("priority") == "High"]
        if high_priority:
            focus = high_priority[0].get("category", "Unknown")
            return f"Focus implementation efforts on: {focus}"
        
        return "Review all recommendations and prioritize based on business needs."
    
    def _generate_methodology(self) -> Dict[str, str]:
        """Generate methodology section"""
        return {
            "calculation_framework": "GHG Protocol Scope 3 Emissions",
            "emission_formula": "Emission = (distance_km × transport_factor) + (1 × energy_factor)",
            "transport_factors": {
                "truck": "0.12 kg CO2/km",
                "rail": "0.04 kg CO2/km",
                "ship": "0.02 kg CO2/km",
                "air": "0.60 kg CO2/km"
            },
            "energy_factors": {
                "coal": "0.9 kg CO2/unit",
                "gas": "0.5 kg CO2/unit",
                "solar": "0.05 kg CO2/unit",
                "wind": "0.02 kg CO2/unit",
                "hydro": "0.01 kg CO2/unit"
            },
            "efficiency_scoring": "Benchmark comparison normalized to 0-100 scale",
            "data_sources": "Product database and emission factor reference library"
        }
    
    def _generate_risk_analysis(self, efficiency_scores: Dict) -> Dict[str, Any]:
        """Generate risk analysis section"""
        
        carbon_score = efficiency_scores.get("carbon", {}).get("score", 0)
        cost_score = efficiency_scores.get("cost", {}).get("score", 0)
        time_score = efficiency_scores.get("time", {}).get("score", 0)
        
        risks = []
        
        if carbon_score < 50:
            risks.append({
                "risk_type": "Environmental Risk",
                "severity": "High",
                "description": "High emissions may lead to regulatory penalties or customer dissatisfaction"
            })
        
        if cost_score < 50:
            risks.append({
                "risk_type": "Financial Risk",
                "severity": "High",
                "description": "High costs reduce profit margins and competitiveness"
            })
        
        if time_score < 50:
            risks.append({
                "risk_type": "Operational Risk",
                "severity": "Medium",
                "description": "Slow delivery times may impact customer satisfaction"
            })
        
        return {
            "risk_count": len(risks),
            "identified_risks": risks,
            "overall_risk_level": "High" if carbon_score < 50 or cost_score < 50 else "Medium" if any(s < 70 for s in [carbon_score, cost_score, time_score]) else "Low"
        }
    
    def _generate_executive_summary(self, product_data: Dict, emission_results: Dict, 
                                   scores: Dict) -> Dict[str, str]:
        """Generate executive summary"""
        
        total_emission = emission_results.get("total_emission", 0)
        yearly_target = product_data.get("yearly_net_zero_target", 0)
        
        return {
            "summary": f"This audit report analyzes the supply chain emissions for {product_data.get('name', 'Product')} with a total emission of {format_emission_value(total_emission)}.",
            "key_findings": [
                f"Total supply chain emissions: {format_emission_value(total_emission)}",
                f"Highest emission stage: {emission_results.get('highest_emission_stage', 'Unknown')}",
                f"Carbon efficiency score: {scores.get('carbon', {}).get('score', 0)}/100",
                f"Cost efficiency score: {scores.get('cost', {}).get('score', 0)}/100"
            ],
            "conclusion": "Review recommendations section for actionable improvement strategies."
        }


def generate_audit_report(product_data: Dict, nodes: List[Dict], emission_results: Dict,
                         scores: Dict, recommendations: List[Dict]) -> Dict[str, Any]:
    """
    Helper function to generate audit report data
    
    Args:
        product_data: Product information
        nodes: Supply chain nodes
        emission_results: Emission calculations
        scores: Efficiency scores
        recommendations: Strategic recommendations
    
    Returns:
        dict: Complete audit report data
    """
    generator = AuditReportGenerator()
    return generator.generate_audit_report_data(product_data, nodes, emission_results, 
                                               scores, recommendations)
