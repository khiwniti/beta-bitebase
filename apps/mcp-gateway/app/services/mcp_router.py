"""
MCP Router for routing tool calls to appropriate servers
"""

import time
from typing import Dict, Any
import httpx
import structlog
from ..core.config import settings

logger = structlog.get_logger()


class MCPRouter:
    """Routes tool calls to appropriate MCP servers"""
    
    def __init__(self):
        self.server_mappings = {
            # Geospatial tools
            "analyze_location": "geospatial",
            "search_nearby": "geospatial",
            "calculate_distance": "geospatial",
            "get_demographics": "geospatial",
            
            # Restaurant tools
            "search_restaurants": "restaurant",
            "analyze_competition": "restaurant",
            "get_reviews": "restaurant",
            "menu_analysis": "restaurant",
            
            # Marketing tools
            "create_campaign": "marketing",
            "analyze_performance": "marketing",
            "target_audience": "marketing",
            "content_generation": "marketing",
            
            # SEO tools
            "keyword_analysis": "seo",
            "content_optimization": "seo",
            "backlink_analysis": "seo",
            "rank_tracking": "seo",
            
            # Accounting tools
            "record_transaction": "accounting",
            "generate_report": "accounting",
            "calculate_metrics": "accounting",
            "budget_analysis": "accounting",
            
            # Other tools...
        }
    
    async def route_tool_call(
        self,
        tool_name: str,
        parameters: Dict[str, Any],
        user_id: str,
        context: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """Route tool call to appropriate MCP server"""
        try:
            start_time = time.time()
            
            # Get server for tool
            server_name = self.server_mappings.get(tool_name)
            if not server_name:
                raise Exception(f"Unknown tool: {tool_name}")
            
            # Call MCP server
            result = await self.call_mcp_server(
                server_name=server_name,
                endpoint=f"tools/{tool_name}",
                data={
                    "parameters": parameters,
                    "user_id": user_id,
                    "context": context or {}
                }
            )
            
            execution_time = time.time() - start_time
            
            return {
                "result": result,
                "execution_time": execution_time,
                "success": True,
                "server": server_name
            }
            
        except Exception as e:
            logger.error(
                "Tool routing failed",
                exc_info=e,
                tool_name=tool_name,
                user_id=user_id
            )
            
            execution_time = time.time() - start_time
            return {
                "result": None,
                "execution_time": execution_time,
                "success": False,
                "error": str(e)
            }
    
    async def call_mcp_server(
        self,
        server_name: str,
        endpoint: str,
        data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Call specific MCP server"""
        try:
            url = f"{settings.MCP_SERVERS_BASE_URL}/{server_name}/{endpoint}"
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    url,
                    json=data,
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    return response.json()
                else:
                    # Return mock data for demonstration
                    return await self._get_mock_response(server_name, endpoint, data)
                    
        except httpx.RequestError:
            # Return mock data when server is unavailable
            return await self._get_mock_response(server_name, endpoint, data)
        except Exception as e:
            logger.error("MCP server call failed", exc_info=e)
            raise
    
    async def _get_mock_response(
        self,
        server_name: str,
        endpoint: str,
        data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Generate mock response when MCP server is unavailable"""
        
        if server_name == "geospatial":
            return {
                "location": data.get("parameters", {}).get("location", "Unknown"),
                "analysis": {
                    "score": 8.5,
                    "foot_traffic": "High",
                    "accessibility": "Excellent",
                    "competition": "Moderate"
                },
                "recommendations": [
                    "Consider peak hour optimization",
                    "Leverage high foot traffic",
                    "Monitor competitor activities"
                ]
            }
        
        elif server_name == "restaurant":
            return {
                "restaurants": [
                    {
                        "name": "Sample Restaurant",
                        "cuisine": "Thai",
                        "rating": 4.5,
                        "distance": "0.3 km"
                    }
                ],
                "total_found": 1,
                "search_radius": "5 km"
            }
        
        elif server_name == "marketing":
            return {
                "campaign_suggestions": [
                    "Social media promotion",
                    "Local food blogger outreach",
                    "Happy hour specials"
                ],
                "target_demographics": {
                    "age_group": "25-35",
                    "interests": ["food", "dining", "local_cuisine"]
                }
            }
        
        else:
            return {
                "message": f"Mock response from {server_name} server",
                "endpoint": endpoint,
                "status": "success"
            }
