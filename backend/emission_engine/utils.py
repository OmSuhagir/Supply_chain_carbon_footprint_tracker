"""
utils.py - Helper functions for CarbonChain Pro

Contains utility functions for data validation, conversions, and common operations
"""

import json
from datetime import datetime
from typing import Dict, Any, List


def load_emission_factors() -> Dict:
    """
    Load emission factors from JSON file
    
    Returns:
        dict: Emission factors configuration
    """
    try:
        with open('emission_factors.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print("Warning: emission_factors.json not found")
        return {}


def validate_transport_mode(mode: str) -> bool:
    """
    Validate transport mode exists in our factors
    
    Args:
        mode: Transport mode name
        
    Returns:
        bool: True if valid, False otherwise
    """
    valid_modes = ["truck", "rail", "ship", "air"]
    return mode.lower() in valid_modes


def validate_energy_source(source: str) -> bool:
    """
    Validate energy source exists in our factors
    
    Args:
        source: Energy source name
        
    Returns:
        bool: True if valid, False otherwise
    """
    valid_sources = ["coal", "gas", "solar", "wind", "hydro"]
    return source.lower() in valid_sources


def get_current_timestamp() -> str:
    """
    Get current timestamp in ISO format
    
    Returns:
        str: Current timestamp
    """
    return datetime.utcnow().isoformat()


def round_value(value: float, decimals: int = 2) -> float:
    """
    Round a value to specified decimal places
    
    Args:
        value: Value to round
        decimals: Number of decimal places
        
    Returns:
        float: Rounded value
    """
    return round(value, decimals)


def calculate_percentage_change(current: float, previous: float) -> float:
    """
    Calculate percentage change from previous to current value
    
    Args:
        current: Current value
        previous: Previous value
        
    Returns:
        float: Percentage change
    """
    if previous == 0:
        return 0
    return ((current - previous) / previous) * 100


def calculate_percentage(portion: float, total: float) -> float:
    """
    Calculate what percentage 'portion' is of 'total'
    
    Args:
        portion: Part of total
        total: Total value
        
    Returns:
        float: Percentage
    """
    if total == 0:
        return 0
    return (portion / total) * 100


def clamp_score(score: float, min_val: float = 0, max_val: float = 100) -> float:
    """
    Clamp a score between min and max values
    
    Args:
        score: Score to clamp
        min_val: Minimum value
        max_val: Maximum value
        
    Returns:
        float: Clamped score
    """
    return max(min_val, min(score, max_val))


def get_status_badge(alignment_percentage: float) -> Dict[str, str]:
    """
    Get status badge based on alignment percentage
    
    Args:
        alignment_percentage: Net-zero alignment percentage
        
    Returns:
        dict: Status info with color and label
    """
    if alignment_percentage < 50:
        return {
            "status": "critical",
            "color": "#EF4444",  # Red
            "label": "Off Track",
            "emoji": "🔴"
        }
    elif alignment_percentage < 80:
        return {
            "status": "warning",
            "color": "#F59E0B",  # Amber
            "label": "At Risk",
            "emoji": "🟡"
        }
    else:
        return {
            "status": "success",
            "color": "#22C55E",  # Green
            "label": "On Track",
            "emoji": "🟢"
        }


def format_emission_value(value: float) -> str:
    """
    Format emission value with unit
    
    Args:
        value: Emission in kg CO2
        
    Returns:
        str: Formatted value
    """
    if value >= 1000000:
        return f"{round_value(value / 1000000, 2)} MT CO2"
    elif value >= 1000:
        return f"{round_value(value / 1000, 2)} T CO2"
    else:
        return f"{round_value(value, 2)} kg CO2"


def format_cost_value(value: float, currency: str = "₹") -> str:
    """
    Format cost value with currency
    
    Args:
        value: Cost value
        currency: Currency symbol
        
    Returns:
        str: Formatted value
    """
    if value >= 1000000:
        return f"{currency}{round_value(value / 1000000, 2)}M"
    elif value >= 1000:
        return f"{currency}{round_value(value / 1000, 2)}K"
    else:
        return f"{currency}{round_value(value, 2)}"


def safe_divide(numerator: float, denominator: float, default: float = 0) -> float:
    """
    Safely divide two numbers, return default if division by zero
    
    Args:
        numerator: Top value
        denominator: Bottom value
        default: Default value if denominator is 0
        
    Returns:
        float: Result of division
    """
    if denominator == 0:
        return default
    return numerator / denominator
