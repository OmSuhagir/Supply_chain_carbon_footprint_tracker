"""
net_zero_tracker.py - Net-Zero target tracking and forecasting

Handles:
- Net-zero alignment percentage calculation
- Status determination (RED/AMBER/GREEN)
- Year-end emission forecasting
- On-track/off-track detection
"""

from typing import Dict, Any
from datetime import datetime
from utils import round_value, get_status_badge


class NetZeroTracker:
    """Track product net-zero targets and progress"""
    
    def __init__(self):
        """Initialize tracker"""
        pass
    
    def calculate_net_zero_alignment(self, yearly_target: float, current_emission: float) -> Dict[str, Any]:
        """
        Calculate net-zero alignment percentage
        
        Formula:
        Net-Zero Alignment % = ((Target - Current Emission) / Target) × 100
        
        Args:
            yearly_target: Yearly net-zero target in kg CO2
            current_emission: Current year emission in kg CO2
        
        Returns:
            dict: Alignment percentage with status and details
        """
        
        if yearly_target == 0:
            return {
                "alignment_percentage": 0,
                "status": "invalid",
                "message": "Target cannot be zero"
            }
        
        # Calculate alignment percentage
        alignment = ((yearly_target - current_emission) / yearly_target) * 100
        alignment = round_value(alignment, 2)
        
        # Clamp between 0 and 100 for display
        clamped_alignment = max(0, min(alignment, 100))
        
        # Get status information
        status_info = get_status_badge(clamped_alignment)
        
        # Calculate remaining emission budget
        remaining_budget = yearly_target - current_emission
        
        return {
            "alignment_percentage": clamped_alignment,
            "remaining_emission_budget": round_value(remaining_budget),
            "current_emission": round_value(current_emission),
            "yearly_target": round_value(yearly_target),
            "status": status_info["status"],
            "color": status_info["color"],
            "label": status_info["label"],
            "emoji": status_info["emoji"],
            "is_on_track": clamped_alignment >= 50
        }
    
    def forecast_year_end_emission(self, current_emission: float, days_passed: int, 
                                   yearly_target: float = None) -> Dict[str, Any]:
        """
        Forecast year-end emission based on current trajectory
        
        Logic:
        - If X kg CO2 emitted in Y days
        - Project: (X / Y) * 365 = annual emission at current rate
        
        Args:
            current_emission: Current emission so far
            days_passed: Days passed in current year
            yearly_target: Optional yearly target for comparison
        
        Returns:
            dict: Year-end forecast with comparison
        """
        
        if days_passed == 0 or days_passed > 365:
            return {
                "forecast_year_end": 0,
                "status": "invalid",
                "message": "Days passed must be between 1 and 365"
            }
        
        # Calculate daily average emission rate
        daily_rate = current_emission / days_passed
        
        # Project to year-end (365 days)
        forecast_year_end = daily_rate * 365
        forecast_year_end = round_value(forecast_year_end)
        
        result = {
            "current_emission": round_value(current_emission),
            "daily_average_rate": round_value(daily_rate),
            "days_passed": days_passed,
            "forecast_year_end": forecast_year_end,
            "days_remaining": 365 - days_passed
        }
        
        # Add target comparison if provided
        if yearly_target:
            excess_emission = forecast_year_end - yearly_target
            result["yearly_target"] = yearly_target
            result["projected_excess"] = round_value(excess_emission)
            result["will_exceed_target"] = excess_emission > 0
            result["excess_percentage"] = round_value((excess_emission / yearly_target) * 100) if yearly_target > 0 else 0
        
        return result
    
    def calculate_progress_metrics(self, yearly_target: float, current_emission: float, 
                                   days_passed: int = 365) -> Dict[str, Any]:
        """
        Calculate comprehensive progress metrics
        
        Args:
            yearly_target: Yearly net-zero target
            current_emission: Current emission
            days_passed: Days in year (default 365 for complete year)
        
        Returns:
            dict: Detailed progress metrics
        """
        
        # Get alignment info
        alignment_info = self.calculate_net_zero_alignment(yearly_target, current_emission)
        
        # Get forecast if year is not complete
        forecast_info = {}
        if days_passed < 365:
            forecast_info = self.forecast_year_end_emission(current_emission, days_passed, yearly_target)
        
        # Calculate progress percentage (daily)
        progress_days = round_value((days_passed / 365) * 100)
        
        # Calculate required daily reduction
        remaining_budget = yearly_target - current_emission
        days_remaining = 365 - days_passed
        required_daily_reduction = remaining_budget / days_remaining if days_remaining > 0 else 0
        
        return {
            "alignment_info": alignment_info,
            "forecast_info": forecast_info,
            "progress_percentage": progress_days,
            "required_daily_reduction": round_value(required_daily_reduction),
            "days_remaining_in_year": days_remaining,
            "summary": self._generate_summary(alignment_info, forecast_info, remaining_budget)
        }
    
    def _generate_summary(self, alignment_info: Dict, forecast_info: Dict, 
                         remaining_budget: float) -> str:
        """
        Generate human-readable summary message
        
        Args:
            alignment_info: Alignment calculation result
            forecast_info: Forecast result
            remaining_budget: Remaining emission budget
        
        Returns:
            str: Summary message
        """
        
        alignment = alignment_info.get("alignment_percentage", 0)
        
        if alignment >= 80:
            if remaining_budget > 0:
                return f"✅ On track! You can emit {round_value(remaining_budget)} kg CO2 more before hitting target."
            else:
                return "✅ Target achieved!"
        elif alignment >= 50:
            if remaining_budget > 0:
                return f"⚠️ At risk. Reduce emissions by {round_value(abs(remaining_budget))} kg CO2 to reach target."
            else:
                return "⚠️ Target exceeded."
        else:
            excess = abs(remaining_budget)
            return f"🔴 Critical. Reduce emissions by {round_value(excess)} kg CO2 urgently to reach target."
    
    def get_milestone_recommendations(self, yearly_target: float, current_emission: float) -> Dict[str, Any]:
        """
        Get milestone-based recommendations
        
        Args:
            yearly_target: Yearly target
            current_emission: Current emission
        
        Returns:
            dict: Milestone recommendations
        """
        
        alignment = self.calculate_net_zero_alignment(yearly_target, current_emission)
        alignment_pct = alignment["alignment_percentage"]
        
        # Define milestones
        milestones = [
            {
                "name": "Quarter 1",
                "target": yearly_target * 0.25,
                "achieved": alignment_pct >= 25
            },
            {
                "name": "Quarter 2",
                "target": yearly_target * 0.50,
                "achieved": alignment_pct >= 50
            },
            {
                "name": "Quarter 3",
                "target": yearly_target * 0.75,
                "achieved": alignment_pct >= 75
            },
            {
                "name": "Year-End",
                "target": yearly_target,
                "achieved": alignment_pct >= 100
            }
        ]
        
        return {
            "milestones": milestones,
            "current_progress": alignment_pct,
            "next_milestone": self._get_next_milestone(milestones)
        }
    
    def _get_next_milestone(self, milestones: list) -> str:
        """Get next unachieved milestone"""
        for milestone in milestones:
            if not milestone["achieved"]:
                return milestone["name"]
        return "All Milestones Achieved!"


def calculate_alignment(yearly_target: float, current_emission: float) -> Dict[str, Any]:
    """
    Helper function to calculate net-zero alignment
    
    Args:
        yearly_target: Yearly target in kg CO2
        current_emission: Current emission in kg CO2
    
    Returns:
        dict: Alignment information
    """
    tracker = NetZeroTracker()
    return tracker.calculate_net_zero_alignment(yearly_target, current_emission)
