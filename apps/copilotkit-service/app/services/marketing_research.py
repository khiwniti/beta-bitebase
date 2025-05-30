"""
Marketing Research Agent Adapter for CopilotKit
"""

import httpx
import json
import asyncio
from typing import Dict, Any, List, Optional
import structlog
from pydantic import BaseModel

logger = structlog.get_logger()

class MarketingResearchAdapter:
    """Adapter for the Marketing Research Agent to work with CopilotKit"""
    
    def __init__(self, base_url: str = "http://localhost:5001"):
        """Initialize the adapter with the base URL of the marketing research service"""
        self.base_url = base_url
        self.client = httpx.AsyncClient(timeout=60.0)  # Longer timeout for research operations
    
    async def get_marketing_insight(self, query: str) -> Dict[str, Any]:
        """Get marketing insights for a specific query"""
        try:
            response = await self.client.post(
                f"{self.base_url}/api/marketing-insight",
                json={"query": query}
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error("Error getting marketing insight", error=str(e), query=query)
            return {
                "response": f"Error retrieving marketing insights: {str(e)}",
                "error": str(e)
            }
    
    async def get_comprehensive_research(self, query: str) -> Dict[str, Any]:
        """Generate a comprehensive marketing research report"""
        try:
            response = await self.client.post(
                f"{self.base_url}/api/comprehensive-research",
                json={"query": query}
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error("Error getting comprehensive research", error=str(e), query=query)
            return {
                "response": f"Error generating comprehensive research: {str(e)}",
                "error": str(e)
            }
    
    async def analyze_competitive_landscape(self, query: str) -> Dict[str, Any]:
        """Analyze the competitive landscape for a restaurant or cafe"""
        try:
            response = await self.client.post(
                f"{self.base_url}/api/competitive-landscape",
                json={"query": query}
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error("Error analyzing competitive landscape", error=str(e), query=query)
            return {
                "response": f"Error analyzing competitive landscape: {str(e)}",
                "error": str(e)
            }
    
    async def generate_marketing_campaign(self, query: str) -> Dict[str, Any]:
        """Generate a marketing campaign plan"""
        try:
            response = await self.client.post(
                f"{self.base_url}/api/marketing-campaign",
                json={"query": query}
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error("Error generating marketing campaign", error=str(e), query=query)
            return {
                "response": f"Error generating marketing campaign: {str(e)}",
                "error": str(e)
            }
    
    async def list_datasets(self) -> Dict[str, Any]:
        """List available marketing research datasets"""
        try:
            response = await self.client.get(f"{self.base_url}/api/datasets")
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error("Error listing datasets", error=str(e))
            return {
                "datasets": {},
                "error": str(e)
            }
    
    async def process_marketing_request(self, request: Dict[str, Any]) -> Dict[str, Any]:
        """Process a marketing research request based on the specified action"""
        query = request.get("query", "")
        action = request.get("action", "insight")
        
        if not query:
            return {"response": "Please provide a query for marketing research", "error": "No query provided"}
        
        try:
            if action == "insight":
                return await self.get_marketing_insight(query)
            elif action == "research":
                return await self.get_comprehensive_research(query)
            elif action == "competitive":
                return await self.analyze_competitive_landscape(query)
            elif action == "campaign":
                return await self.generate_marketing_campaign(query)
            elif action == "datasets":
                return await self.list_datasets()
            else:
                return {"response": f"Unknown action: {action}", "error": "Invalid action"}
        except Exception as e:
            logger.error(f"Error processing marketing request: {str(e)}", action=action, query=query)
            return {
                "response": f"I encountered an error while processing your marketing research request: {str(e)}",
                "error": str(e)
            }
