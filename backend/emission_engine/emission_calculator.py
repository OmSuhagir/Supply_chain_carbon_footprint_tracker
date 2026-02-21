"""
emission_calculator.py - Core emission calculation engine

Handles:
- Transport emission calculation
- Energy emission calculation
- Node-level emission computation
- Total product emission aggregation
"""

from typing import Dict, List, Any
from utils import load_emission_factors, round_value, calculate_percentage


class EmissionCalculator:
    """Calculate emissions for supply chain nodes and products"""
    
    def __init__(self):
        """Initialize calculator with emission factors"""
        self.factors = load_emission_factors()
        self.transport_factors = self.factors.get("transport_modes", {})
        self.energy_factors = self.factors.get("energy_sources", {})
    
    def calculate_node_emission(self, node_data: Dict) -> Dict[str, Any]:
        """
        Calculate emission for a single supply chain node
        
        Formula: 
        Emission = (distance_km × transport_factor) + (1 × energy_factor)
        
        Args:
            node_data: Dictionary containing node information
                - distance_km: Distance traveled
                - transport_mode: Type of transport (truck, rail, ship, air)
                - energy_source: Energy type (coal, gas, solar, wind, hydro)
        
        Returns:
            dict: Emission breakdown and total for this node
        """
        
        # Extract node parameters
        distance_km = node_data.get("distance_km", 0)
        transport_mode = node_data.get("transport_mode", "truck").lower()
        energy_source = node_data.get("energy_source", "gas").lower()
        stage_name = node_data.get("stage_name", "Unknown")
        
        # Get emission factors for this transport mode and energy source
        transport_factor = self.transport_factors.get(transport_mode, {}).get("emission_per_km", 0.12)
        energy_factor = self.energy_factors.get(energy_source, {}).get("emission_factor", 0.5)
        
        # Calculate transport emission (distance × factor)
        transport_emission = distance_km * transport_factor
        
        # Energy emission is fixed per node (per unit operation)
        # Using 1 as the unit - this represents one operation/shipment
        energy_emission = 1 * energy_factor
        
        # Total emission for this node
        total_emission = transport_emission + energy_emission
        
        return {
            "stage_name": stage_name,
            "transport_mode": transport_mode,
            "distance_km": distance_km,
            "transport_emission": round_value(transport_emission),
            "energy_source": energy_source,
            "energy_emission": round_value(energy_emission),
            "total_emission": round_value(total_emission),
            "transport_factor": transport_factor,
            "energy_factor": energy_factor
        }
    
    def calculate_product_total_emission(self, supply_chain_nodes: List[Dict]) -> Dict[str, Any]:
        """
        Calculate total emission for all supply chain nodes of a product
        
        Args:
            supply_chain_nodes: List of node dictionaries
        
        Returns:
            dict: Total emission with breakdown and analysis
        """
        
        if not supply_chain_nodes:
            return {
                "total_emission": 0,
                "node_count": 0,
                "highest_emission_stage": None,
                "highest_emission_value": 0,
                "nodes_breakdown": []
            }
        
        # Calculate emission for each node
        nodes_breakdown = []
        total_emission = 0
        highest_emission_value = 0
        highest_emission_stage = None
        
        for node in supply_chain_nodes:
            node_emission = self.calculate_node_emission(node)
            nodes_breakdown.append(node_emission)
            
            node_total = node_emission["total_emission"]
            total_emission += node_total
            
            # Track highest emission stage
            if node_total > highest_emission_value:
                highest_emission_value = node_total
                highest_emission_stage = node_emission["stage_name"]
        
        # Calculate percentage contribution of each node
        for node in nodes_breakdown:
            percentage = calculate_percentage(node["total_emission"], total_emission)
            node["percentage_of_total"] = round_value(percentage)
        
        return {
            "total_emission": round_value(total_emission),
            "node_count": len(supply_chain_nodes),
            "highest_emission_stage": highest_emission_stage,
            "highest_emission_value": round_value(highest_emission_value),
            "nodes_breakdown": nodes_breakdown,
            "average_emission_per_node": round_value(total_emission / len(supply_chain_nodes)) if supply_chain_nodes else 0
        }
    
    def get_transport_mode_comparison(self, distance_km: float, current_mode: str) -> List[Dict]:
        """
        Compare emission for different transport modes for same distance
        
        Args:
            distance_km: Distance to travel
            current_mode: Current transport mode
        
        Returns:
            list: Comparison of all transport modes with emissions and costs
        """
        
        comparison = []
        
        for mode_name, mode_data in self.transport_factors.items():
            factor = mode_data["emission_per_km"]
            emission = distance_km * factor
            is_current = (mode_name.lower() == current_mode.lower())
            
            comparison.append({
                "transport_mode": mode_name,
                "emission_per_km": factor,
                "total_emission": round_value(emission),
                "is_current": is_current,
                "cost_efficiency": mode_data.get("cost_efficiency", 1.0)
            })
        
        # Sort by emission (lowest first)
        comparison.sort(key=lambda x: x["total_emission"])
        
        return comparison
    
    def get_energy_source_comparison(self) -> List[Dict]:
        """
        Compare emissions for different energy sources
        
        Returns:
            list: Comparison of all energy sources with emissions
        """
        
        comparison = []
        
        for source_name, source_data in self.energy_factors.items():
            factor = source_data["emission_factor"]
            is_renewable = source_data.get("renewable", False)
            
            comparison.append({
                "energy_source": source_name,
                "emission_factor": factor,
                "renewable": is_renewable,
                "description": source_data.get("description", "")
            })
        
        # Sort by emission (lowest first)
        comparison.sort(key=lambda x: x["emission_factor"])
        
        return comparison


def calculate_emissions_batch(supply_chain_nodes: List[Dict]) -> Dict[str, Any]:
    """
    Helper function to calculate emissions for a batch of nodes
    
    Args:
        supply_chain_nodes: List of supply chain nodes
    
    Returns:
        dict: Emission results
    """
    calculator = EmissionCalculator()
    return calculator.calculate_product_total_emission(supply_chain_nodes)
