"""
BiteBase MCP Gateway
Model Context Protocol Gateway for routing tool calls to MCP servers
"""

import os
import asyncio
from typing import Dict, Any, List, Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import uvicorn
import httpx
import structlog
from pydantic import BaseModel

from app.core.config import settings
from app.core.logging import setup_logging
from app.core.auth import verify_auth0_token
from app.services.mcp_router import MCPRouter
from app.services.tool_registry import ToolRegistry

# Setup logging
setup_logging()
logger = structlog.get_logger()

# Security
security = HTTPBearer()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    # Startup
    logger.info("Starting BiteBase MCP Gateway")
    
    # Initialize services
    app.state.mcp_router = MCPRouter()
    app.state.tool_registry = ToolRegistry()
    
    # Register MCP servers
    await register_mcp_servers(app.state.tool_registry)
    
    yield
    
    # Shutdown
    logger.info("Shutting down MCP Gateway")


# Create FastAPI application
app = FastAPI(
    title="BiteBase MCP Gateway",
    description="Model Context Protocol Gateway for tool routing",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ToolCall(BaseModel):
    """Tool call request model"""
    tool_name: str
    parameters: Dict[str, Any]
    user_id: str
    session_id: Optional[str] = None
    context: Optional[Dict[str, Any]] = None


class ToolResponse(BaseModel):
    """Tool call response model"""
    result: Any
    tool_name: str
    execution_time: float
    success: bool
    error: Optional[str] = None


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify Auth0 token and get current user"""
    try:
        user = await verify_auth0_token(credentials.credentials)
        return user
    except Exception as e:
        logger.error("Authentication failed", exc_info=e)
        raise HTTPException(status_code=401, detail="Invalid authentication token")


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "mcp-gateway",
        "version": "1.0.0"
    }


@app.get("/tools")
async def list_available_tools(user = Depends(get_current_user)):
    """List all available MCP tools"""
    try:
        tool_registry = app.state.tool_registry
        tools = await tool_registry.get_all_tools()
        
        return {
            "tools": tools,
            "total_count": len(tools),
            "categories": list(set(tool.get("category") for tool in tools))
        }
        
    except Exception as e:
        logger.error("Error listing tools", exc_info=e)
        raise HTTPException(status_code=500, detail="Failed to list tools")


@app.post("/tools/call", response_model=ToolResponse)
async def call_tool(
    tool_call: ToolCall,
    user = Depends(get_current_user)
):
    """
    Route tool call to appropriate MCP server
    """
    try:
        logger.info(
            "Processing tool call",
            tool_name=tool_call.tool_name,
            user_id=tool_call.user_id
        )
        
        mcp_router = app.state.mcp_router
        
        # Route tool call to appropriate MCP server
        result = await mcp_router.route_tool_call(
            tool_name=tool_call.tool_name,
            parameters=tool_call.parameters,
            user_id=tool_call.user_id,
            context=tool_call.context or {}
        )
        
        return ToolResponse(
            result=result["result"],
            tool_name=tool_call.tool_name,
            execution_time=result["execution_time"],
            success=result["success"],
            error=result.get("error")
        )
        
    except Exception as e:
        logger.error(
            "Tool call failed",
            exc_info=e,
            tool_name=tool_call.tool_name,
            user_id=tool_call.user_id
        )
        raise HTTPException(status_code=500, detail="Tool call failed")


# Geospatial MCP endpoints
@app.post("/geospatial/analyze")
async def geospatial_analyze(
    request: Dict[str, Any],
    user = Depends(get_current_user)
):
    """Geospatial analysis through MCP"""
    return await call_mcp_server("geospatial", "analyze", request)


@app.post("/geospatial/search")
async def geospatial_search(
    request: Dict[str, Any],
    user = Depends(get_current_user)
):
    """Geospatial search through MCP"""
    return await call_mcp_server("geospatial", "search", request)


# Restaurant MCP endpoints
@app.post("/restaurant/search")
async def restaurant_search(
    request: Dict[str, Any],
    user = Depends(get_current_user)
):
    """Restaurant search through MCP"""
    return await call_mcp_server("restaurant", "search", request)


@app.post("/restaurant/analyze")
async def restaurant_analyze(
    request: Dict[str, Any],
    user = Depends(get_current_user)
):
    """Restaurant analysis through MCP"""
    return await call_mcp_server("restaurant", "analyze", request)


# Marketing MCP endpoints
@app.post("/marketing/campaign")
async def marketing_campaign(
    request: Dict[str, Any],
    user = Depends(get_current_user)
):
    """Marketing campaign through MCP"""
    return await call_mcp_server("marketing", "campaign", request)


@app.post("/marketing/analytics")
async def marketing_analytics(
    request: Dict[str, Any],
    user = Depends(get_current_user)
):
    """Marketing analytics through MCP"""
    return await call_mcp_server("marketing", "analytics", request)


# SEO MCP endpoints
@app.post("/seo/analyze")
async def seo_analyze(
    request: Dict[str, Any],
    user = Depends(get_current_user)
):
    """SEO analysis through MCP"""
    return await call_mcp_server("seo", "analyze", request)


@app.post("/seo/optimize")
async def seo_optimize(
    request: Dict[str, Any],
    user = Depends(get_current_user)
):
    """SEO optimization through MCP"""
    return await call_mcp_server("seo", "optimize", request)


# Accounting MCP endpoints
@app.post("/accounting/transactions")
async def accounting_transactions(
    request: Dict[str, Any],
    user = Depends(get_current_user)
):
    """Accounting transactions through MCP"""
    return await call_mcp_server("accounting", "transactions", request)


@app.post("/accounting/reports")
async def accounting_reports(
    request: Dict[str, Any],
    user = Depends(get_current_user)
):
    """Accounting reports through MCP"""
    return await call_mcp_server("accounting", "reports", request)


async def call_mcp_server(server_name: str, endpoint: str, request: Dict[str, Any]):
    """Helper function to call MCP server"""
    try:
        mcp_router = app.state.mcp_router
        
        result = await mcp_router.call_mcp_server(
            server_name=server_name,
            endpoint=endpoint,
            data=request
        )
        
        return result
        
    except Exception as e:
        logger.error(
            "MCP server call failed",
            exc_info=e,
            server=server_name,
            endpoint=endpoint
        )
        raise HTTPException(status_code=500, detail=f"MCP server call failed: {str(e)}")


async def register_mcp_servers(tool_registry: ToolRegistry):
    """Register all MCP servers with the tool registry"""
    
    # MCP Server configurations
    mcp_servers = [
        {
            "name": "geospatial",
            "url": f"{settings.MCP_SERVERS_BASE_URL}/geospatial",
            "tools": ["analyze_location", "search_nearby", "calculate_distance", "get_demographics"],
            "category": "geospatial",
            "description": "Geospatial analysis and mapping tools"
        },
        {
            "name": "restaurant",
            "url": f"{settings.MCP_SERVERS_BASE_URL}/restaurant",
            "tools": ["search_restaurants", "analyze_competition", "get_reviews", "menu_analysis"],
            "category": "restaurant",
            "description": "Restaurant data management and analysis"
        },
        {
            "name": "marketing",
            "url": f"{settings.MCP_SERVERS_BASE_URL}/marketing",
            "tools": ["create_campaign", "analyze_performance", "target_audience", "content_generation"],
            "category": "marketing",
            "description": "Marketing analytics and campaign tools"
        },
        {
            "name": "seo",
            "url": f"{settings.MCP_SERVERS_BASE_URL}/seo",
            "tools": ["keyword_analysis", "content_optimization", "backlink_analysis", "rank_tracking"],
            "category": "seo",
            "description": "Search engine optimization tools"
        },
        {
            "name": "accounting",
            "url": f"{settings.MCP_SERVERS_BASE_URL}/accounting",
            "tools": ["record_transaction", "generate_report", "calculate_metrics", "budget_analysis"],
            "category": "accounting",
            "description": "Financial management and reporting"
        },
        {
            "name": "inventory",
            "url": f"{settings.MCP_SERVERS_BASE_URL}/inventory",
            "tools": ["track_inventory", "manage_suppliers", "order_management", "cost_analysis"],
            "category": "inventory",
            "description": "Supply chain and inventory management"
        },
        {
            "name": "workforce",
            "url": f"{settings.MCP_SERVERS_BASE_URL}/workforce",
            "tools": ["schedule_staff", "track_hours", "calculate_payroll", "performance_metrics"],
            "category": "workforce",
            "description": "Employee scheduling and management"
        },
        {
            "name": "customer_journey",
            "url": f"{settings.MCP_SERVERS_BASE_URL}/customer-journey",
            "tools": ["track_journey", "analyze_touchpoints", "segment_customers", "predict_behavior"],
            "category": "analytics",
            "description": "Customer experience tracking and analysis"
        },
        {
            "name": "location_intelligence",
            "url": f"{settings.MCP_SERVERS_BASE_URL}/location-intelligence",
            "tools": ["market_analysis", "site_selection", "trade_area_analysis", "foot_traffic"],
            "category": "intelligence",
            "description": "Advanced location-based insights"
        },
        {
            "name": "postgresql",
            "url": f"{settings.MCP_SERVERS_BASE_URL}/postgresql",
            "tools": ["execute_query", "get_schema", "backup_data", "optimize_performance"],
            "category": "database",
            "description": "Database management and queries"
        },
        {
            "name": "slack",
            "url": f"{settings.MCP_SERVERS_BASE_URL}/slack",
            "tools": ["send_message", "create_channel", "get_users", "post_notification"],
            "category": "communication",
            "description": "Team communication integration"
        },
        {
            "name": "duckduckgo",
            "url": f"{settings.MCP_SERVERS_BASE_URL}/duckduckgo",
            "tools": ["web_search", "news_search", "image_search", "instant_answers"],
            "category": "research",
            "description": "Web search and research tools"
        }
    ]
    
    # Register each MCP server
    for server_config in mcp_servers:
        await tool_registry.register_server(server_config)
        logger.info(f"Registered MCP server: {server_config['name']}")


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8002,
        reload=settings.ENVIRONMENT == "development",
        log_level="info"
    )
