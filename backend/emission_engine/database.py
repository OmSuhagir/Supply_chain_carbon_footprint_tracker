"""
database.py - MongoDB integration for CarbonChain Pro

This module handles all MongoDB operations for storing and retrieving:
- Company data
- Product data
- Supply chain nodes
- Emission results
- Optimization insights
- Net-zero progress tracking

Connection string should be set in environment variables:
DB_URL=mongodb://localhost:27017/
DB_NAME=carbonchain_pro
"""

from datetime import datetime
from typing import Dict, List, Optional, Any
import os
import json

# Lazy import for bson - only import when needed
try:
    from bson.objectid import ObjectId
except ImportError:
    # If pymongo not installed, create a dummy ObjectId
    ObjectId = str

# MongoDB connection - will be initialized when needed
# For this optimization guide, we show the structure and functions

class MongoDBManager:
    """Handle all MongoDB operations"""
    
    # Note: These would connect to MongoDB in production
    # For now, this is the data structure mapper
    
    @staticmethod
    def get_nodes_by_product_id(product_id: str) -> List[Dict[str, Any]]:
        """
        Fetch supply chain nodes for a product from MongoDB
        Args:
            product_id: Product MongoDB ObjectId
        Returns:
            list: List of node dicts
        """
        from pymongo import MongoClient
        db_url = os.getenv("DB_URL", "mongodb://localhost:27017/")
        db_name = os.getenv("DB_NAME", "carbonchain_pro")
        client = MongoClient(db_url)
        db = client[db_name]
        nodes = list(db.supplychainnodes.find({"productId": product_id}))
        # Convert ObjectId fields to str
        for node in nodes:
            node["_id"] = str(node["_id"])
            node["productId"] = str(node["productId"])
        return nodes
    
    # ==========================================
    # COMPANY OPERATIONS
    # ==========================================
    
    @staticmethod
    def create_company(company_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a new company record
        
        Args:
            company_data: {
                "name": "Company Name",
                "industry": "Manufacturing",
                "sustainabilityGoal": "Net Zero by 2030",
                "headquartersLocation": "New York, USA"
            }
            
        Returns:
            dict: Created company with _id
        """
        company = {
            "name": company_data.get("name"),
            "industry": company_data.get("industry"),
            "sustainabilityGoal": company_data.get("sustainabilityGoal"),
            "headquartersLocation": company_data.get("headquartersLocation"),
            "createdAt": datetime.utcnow().isoformat(),
            "updatedAt": datetime.utcnow().isoformat()
        }
        # In production: db.companies.insert_one(company)
        # For now: return company with mock ID
        company["_id"] = str(ObjectId())
        return company
    
    @staticmethod
    def get_company_by_id(company_id: str) -> Optional[Dict[str, Any]]:
        """
        Get company by ID
        
        Args:
            company_id: Company MongoDB ObjectId
            
        Returns:
            dict: Company data or None
        """
        # In production: return db.companies.find_one({"_id": ObjectId(company_id)})
        pass
    
    @staticmethod
    def authenticate_company(email: str, password: str) -> Optional[Dict[str, Any]]:
        """
        Authenticate company login
        
        Args:
            email: Company email
            password: Company password (should be hashed in production)
            
        Returns:
            dict: Company data with auth token or None
        """
        # In production: Find company by email, verify password
        # return db.companies.find_one({"email": email})
        pass
    
    # ==========================================
    # PRODUCT OPERATIONS
    # ==========================================
    
    @staticmethod
    def create_product(company_id: str, product_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a new product for a company
        
        Args:
            company_id: Parent company ID
            product_data: {
                "name": "Product Name",
                "description": "Product description",
                "yearlyNetZeroTarget": 5000,  # kg CO2e
                "currentYearEmission": 0
            }
            
        Returns:
            dict: Created product with _id
        """
        product = {
            "companyId": ObjectId(company_id),
            "name": product_data.get("name"),
            "description": product_data.get("description"),
            "yearlyNetZeroTarget": product_data.get("yearlyNetZeroTarget"),
            "currentYearEmission": product_data.get("currentYearEmission", 0),
            "carbonEfficiencyScore": 0,
            "createdAt": datetime.utcnow().isoformat(),
            "updatedAt": datetime.utcnow().isoformat()
        }
        # In production: db.products.insert_one(product)
        product["_id"] = str(ObjectId())
        return product
    
    @staticmethod
    def get_company_products(company_id: str) -> List[Dict[str, Any]]:
        """
        Get all products for a company
        
        Args:
            company_id: Company ID
            
        Returns:
            list: All products for the company
        """
        # In production: return db.products.find({"companyId": ObjectId(company_id)})
        pass
    
    @staticmethod
    def update_product(product_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update product data
        
        Args:
            product_id: Product ID
            updates: Fields to update
            
        Returns:
            dict: Updated product
        """
        updates["updatedAt"] = datetime.utcnow().isoformat()
        # In production: return db.products.find_one_and_update(
        #    {"_id": ObjectId(product_id)},
        #    {"$set": updates}
        # )
        pass
    
    # ==========================================
    # SUPPLY CHAIN NODE OPERATIONS
    # ==========================================
    
    @staticmethod
    def create_supply_chain_node(product_id: str, node_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a supply chain node for a product
        
        Args:
            product_id: Parent product ID
            node_data: {
                "stageName": "Raw Material Transport",
                "supplierName": "Supplier Inc",
                "transportMode": "truck",
                "distanceKm": 500,
                "energySource": "gas",
                "transportCost": 1500,
                "transportTimeDays": 2
            }
            
        Returns:
            dict: Created node with _id
        """
        node = {
            "productId": ObjectId(product_id),
            "stageName": node_data.get("stageName"),
            "supplierName": node_data.get("supplierName"),
            "transportMode": node_data.get("transportMode"),
            "distanceKm": node_data.get("distanceKm"),
            "energySource": node_data.get("energySource"),
            "transportCost": node_data.get("transportCost"),
            "transportTimeDays": node_data.get("transportTimeDays"),
            "emission": 0,  # Will be calculated
            "createdAt": datetime.utcnow().isoformat(),
            "updatedAt": datetime.utcnow().isoformat()
        }
        # In production: db.supply_chain_nodes.insert_one(node)
        node["_id"] = str(ObjectId())
        return node
    
    @staticmethod
    def get_product_nodes(product_id: str) -> List[Dict[str, Any]]:
        """
        Get all supply chain nodes for a product
        
        Args:
            product_id: Product ID
            
        Returns:
            list: All nodes for the product
        """
        # In production: return db.supply_chain_nodes.find({"productId": ObjectId(product_id)})
        pass
    
    # ==========================================
    # EMISSION RESULT OPERATIONS
    # ==========================================
    
    @staticmethod
    def store_emission_result(product_id: str, calculation_result: Dict[str, Any], 
                             efficiency_scores: Dict[str, Any], 
                             alignment_percentage: float) -> Dict[str, Any]:
        """
        Store emission calculation result in database
        
        Args:
            product_id: Product ID
            calculation_result: Result from emission calculator
            efficiency_scores: Efficiency scores (carbon, cost, time)
            alignment_percentage: Net-zero alignment %
            
        Returns:
            dict: Created emission result document
        """
        result = {
            "productId": ObjectId(product_id),
            "totalEmission": calculation_result.get("total_emission"),
            "highestEmissionStage": calculation_result.get("highest_emission_stage"),
            "carbonEfficiencyScore": efficiency_scores.get("carbon_efficiency_score"),
            "costEfficiencyScore": efficiency_scores.get("cost_efficiency_score"),
            "timeEfficiencyScore": efficiency_scores.get("time_efficiency_score"),
            "netZeroAlignmentPercentage": alignment_percentage,
            "analysisDate": datetime.utcnow().isoformat()
        }
        # In production: db.emission_results.insert_one(result)
        result["_id"] = str(ObjectId())
        return result
    
    @staticmethod
    def get_latest_emission_result(product_id: str) -> Optional[Dict[str, Any]]:
        """
        Get latest emission result for a product
        
        Args:
            product_id: Product ID
            
        Returns:
            dict: Latest emission result or None
        """
        # In production: return db.emission_results.find_one(
        #    {"productId": ObjectId(product_id)},
        #    sort=[("analysisDate", -1)]
        # )
        pass
    
    # ==========================================
    # OPTIMIZATION INSIGHT OPERATIONS
    # ==========================================
    
    @staticmethod
    def create_optimization_insight(product_id: str, stage_name: str, 
                                   insight_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Store optimization recommendation
        
        Args:
            product_id: Product ID
            stage_name: Supply chain stage name
            insight_data: {
                "currentTransport": "truck",
                "suggestedTransport": "rail",
                "carbonSaved": 150,  # kg CO2e
                "costSaved": 500,    # currency units
                "timeImpactDays": 1,
                "riskLevel": "low",
                "recommendationText": "Switch to rail for 75% carbon reduction"
            }
            
        Returns:
            dict: Created optimization insight
        """
        insight = {
            "productId": ObjectId(product_id),
            "stageName": stage_name,
            "currentTransport": insight_data.get("currentTransport"),
            "suggestedTransport": insight_data.get("suggestedTransport"),
            "carbonSaved": insight_data.get("carbonSaved"),
            "costSaved": insight_data.get("costSaved"),
            "timeImpactDays": insight_data.get("timeImpactDays"),
            "riskLevel": insight_data.get("riskLevel"),
            "recommendationText": insight_data.get("recommendationText"),
            "createdAt": datetime.utcnow().isoformat(),
            "updatedAt": datetime.utcnow().isoformat()
        }
        # In production: db.optimization_insights.insert_one(insight)
        insight["_id"] = str(ObjectId())
        return insight
    
    @staticmethod
    def get_product_insights(product_id: str) -> List[Dict[str, Any]]:
        """
        Get all optimization insights for a product
        
        Args:
            product_id: Product ID
            
        Returns:
            list: All insights for the product
        """
        # In production: return db.optimization_insights.find({"productId": ObjectId(product_id)})
        pass
    
    # ==========================================
    # NET ZERO PROGRESS OPERATIONS
    # ==========================================
    
    @staticmethod
    def create_net_zero_progress(product_id: str, year: int, 
                                progress_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Store net-zero progress record
        
        Args:
            product_id: Product ID
            year: Year of tracking
            progress_data: {
                "targetEmission": 5000,
                "actualEmission": 5200,
                "alignmentPercentage": 96
            }
            
        Returns:
            dict: Created progress record
        """
        progress = {
            "productId": ObjectId(product_id),
            "year": year,
            "targetEmission": progress_data.get("targetEmission"),
            "actualEmission": progress_data.get("actualEmission"),
            "alignmentPercentage": progress_data.get("alignmentPercentage"),
            "recordedAt": datetime.utcnow().isoformat()
        }
        # In production: db.net_zero_progress.insert_one(progress)
        progress["_id"] = str(ObjectId())
        return progress
    
    @staticmethod
    def get_product_progress_history(product_id: str, year: Optional[int] = None) -> List[Dict[str, Any]]:
        """
        Get net-zero progress history for a product
        
        Args:
            product_id: Product ID
            year: Optional year filter
            
        Returns:
            list: Progress records
        """
        # In production:
        # if year:
        #     return db.net_zero_progress.find({"productId": ObjectId(product_id), "year": year})
        # return db.net_zero_progress.find({"productId": ObjectId(product_id)})
        pass
    
    # ==========================================
    # DASHBOARD AGGREGATION
    # ==========================================
    
    @staticmethod
    def get_company_dashboard_data(company_id: str) -> Dict[str, Any]:
        """
        Get aggregated dashboard data for a company
        
        Returns:
            dict: {
                "companyInfo": Company data,
                "products": [Product list with latest metrics],
                "totalEmission": Sum of all product emissions,
                "averageAlignment": Average net-zero alignment,
                "topRecommendations": Best optimization insights,
                "emissionTrend": Historical progression
            }
        """
        # In production: Use MongoDB aggregation pipeline
        dashboard = {
            "companyInfo": None,
            "products": [],
            "summaryMetrics": {
                "totalEmission": 0,
                "averageAlignment": 0,
                "productCount": 0,
                "nodesCount": 0
            },
            "topRecommendations": [],
            "emissionTrend": [],
            "costOptimization": []
        }
        return dashboard
    
    @staticmethod
    def get_product_dashboard(product_id: str) -> Dict[str, Any]:
        """
        Get detailed dashboard for a specific product
        
        Returns:
            dict: {
                "productInfo": Product data,
                "emissionMetrics": Latest calculations,
                "supplyChainBreakdown": All nodes with emissions,
                "efficiencyScores": Carbon, cost, time scores,
                "recommendations": Optimization insights,
                "progressTrack": Historical alignment
            }
        """
        dashboard = {
            "productInfo": None,
            "emissionMetrics": None,
            "supplyChainBreakdown": [],
            "efficiencyScores": {
                "carbon": 0,
                "cost": 0,
                "time": 0
            },
            "recommendations": [],
            "progressTrack": {
                "currentYear": [],
                "previousYears": []
            }
        }
        return dashboard


class DataMapper:
    """Map between FastAPI models and MongoDB documents"""
    
    @staticmethod
    def map_supply_chain_node_to_db(node_dict: Dict) -> Dict:
        """Convert FastAPI SupplyChainNode to DB document"""
        return {
            "stageName": node_dict.get("stage_name"),
            "supplierName": node_dict.get("supplier_name"),
            "transportMode": node_dict.get("transport_mode"),
            "distanceKm": node_dict.get("distance_km"),
            "energySource": node_dict.get("energy_source"),
            "transportCost": node_dict.get("transport_cost"),
            "transportTimeDays": node_dict.get("transport_time_days"),
        }
    
    @staticmethod
    def map_calculation_to_db(calculation_result: Dict, 
                            product_id: str, 
                            efficiency_scores: Dict,
                            alignment: float) -> Dict:
        """Convert calculation result to EmissionResult document"""
        return {
            "productId": product_id,
            "totalEmission": calculation_result.get("total_emission"),
            "highestEmissionStage": calculation_result.get("highest_emission_stage"),
            "carbonEfficiencyScore": efficiency_scores.get("carbon_efficiency_score"),
            "costEfficiencyScore": efficiency_scores.get("cost_efficiency_score"),
            "timeEfficiencyScore": efficiency_scores.get("time_efficiency_score"),
            "netZeroAlignmentPercentage": alignment,
            "analysisDate": datetime.utcnow().isoformat()
        }
