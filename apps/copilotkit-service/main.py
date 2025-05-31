"""
BiteBase CopilotKit Service
FastAPI service for CopilotKit integration with WebSocket support
"""

import os
import json
import asyncio
from typing import Dict, Any, List, Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import redis.asyncio as redis
import httpx
import structlog
from pydantic import BaseModel

from app.core.config import settings
from app.core.logging import setup_logging
from app.services.ollama import OllamaService
from app.services.copilot import CopilotService
from app.services.websocket_manager import WebSocketManager

# Setup logging
setup_logging()
logger = structlog.get_logger()

# Redis connection
redis_client = None
websocket_manager = WebSocketManager()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    global redis_client
    
    # Startup
    logger.info("Starting BiteBase CopilotKit Service")
    
    # Initialize Redis
    redis_client = redis.from_url(settings.REDIS_URL)
    await redis_client.ping()
    logger.info("Redis connection established")
    
    # Initialize services
    app.state.ollama_service = OllamaService()
    app.state.copilot_service = CopilotService(redis_client)
    
    yield
    
    # Shutdown
    logger.info("Shutting down CopilotKit Service")
    if redis_client:
        await redis_client.close()


# Create FastAPI application
app = FastAPI(
    title="BiteBase CopilotKit Service",
    description="CopilotKit integration service with WebSocket support",
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


class CopilotMessage(BaseModel):
    """CopilotKit message model"""
    message: str
    user_id: str
    session_id: str
    context: Optional[Dict[str, Any]] = None
    actions: Optional[List[str]] = None


class CopilotResponse(BaseModel):
    """CopilotKit response model"""
    response: str
    message_id: str
    session_id: str
    actions: Optional[List[Dict[str, Any]]] = None
    suggestions: Optional[List[str]] = None


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "copilotkit-service",
        "version": "1.0.0"
    }


@app.websocket("/copilotkit")
async def copilotkit_websocket(websocket: WebSocket):
    """
    Main CopilotKit WebSocket endpoint
    Handles real-time communication with frontend CopilotKit components
    """
    await websocket_manager.connect(websocket)
    logger.info("CopilotKit WebSocket connection established")
    
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            logger.info(
                "Received CopilotKit message",
                message_type=message_data.get("type"),
                user_id=message_data.get("user_id")
            )
            
            # Process different message types
            if message_data.get("type") == "chat":
                await handle_chat_message(websocket, message_data)
            elif message_data.get("type") == "action":
                await handle_action_request(websocket, message_data)
            elif message_data.get("type") == "context_update":
                await handle_context_update(websocket, message_data)
            else:
                await websocket.send_text(json.dumps({
                    "type": "error",
                    "message": "Unknown message type"
                }))
                
    except WebSocketDisconnect:
        logger.info("CopilotKit WebSocket disconnected")
        websocket_manager.disconnect(websocket)
    except Exception as e:
        logger.error("WebSocket error", exc_info=e)
        await websocket.send_text(json.dumps({
            "type": "error",
            "message": "Internal server error"
        }))


async def handle_chat_message(websocket: WebSocket, message_data: Dict[str, Any]):
    """Handle chat messages from CopilotKit"""
    try:
        copilot_service = app.state.copilot_service
        
        # Process message through Ollama
        response = await copilot_service.process_chat_message(
            message=message_data.get("message", ""),
            user_id=message_data.get("user_id"),
            session_id=message_data.get("session_id"),
            context=message_data.get("context", {})
        )
        
        # Prepare response data
        response_data = {
            "type": "chat_response",
            "response": response["response"],
            "message_id": response["message_id"],
            "session_id": response["session_id"],
            "suggestions": response.get("suggestions", [])
        }
        
        # Add marketing-specific data if this is a marketing response
        if response.get("is_marketing_response"):
            response_data["charts"] = response.get("charts", {})
            response_data["sentiment"] = response.get("sentiment", {})
            response_data["keywords"] = response.get("keywords", [])
            response_data["is_marketing_response"] = True
        
        # Send response back to client
        await websocket.send_text(json.dumps(response_data))
        
    except Exception as e:
        logger.error("Error handling chat message", exc_info=e)
        await websocket.send_text(json.dumps({
            "type": "error",
            "message": "Failed to process chat message"
        }))


async def handle_action_request(websocket: WebSocket, message_data: Dict[str, Any]):
    """Handle action requests from CopilotKit"""
    try:
        action_name = message_data.get("action")
        parameters = message_data.get("parameters", {})
        
        logger.info(
            "Processing CopilotKit action",
            action=action_name,
            user_id=message_data.get("user_id")
        )
        
        # Route action to appropriate service
        if action_name == "analyze_location":
            result = await execute_location_analysis(parameters)
        elif action_name == "generate_report":
            result = await execute_report_generation(parameters)
        elif action_name == "search_restaurants":
            result = await execute_restaurant_search(parameters)
        elif action_name == "marketing_research":
            result = await execute_marketing_research(parameters)
        elif action_name == "marketing_campaign":
            result = await execute_marketing_campaign(parameters)
        elif action_name == "competitive_analysis":
            result = await execute_competitive_analysis(parameters)
        else:
            result = {"error": f"Unknown action: {action_name}"}
        
        # Send action result back to client
        await websocket.send_text(json.dumps({
            "type": "action_result",
            "action": action_name,
            "result": result,
            "request_id": message_data.get("request_id")
        }))
        
    except Exception as e:
        logger.error("Error handling action request", exc_info=e)
        await websocket.send_text(json.dumps({
            "type": "error",
            "message": "Failed to execute action"
        }))


async def handle_context_update(websocket: WebSocket, message_data: Dict[str, Any]):
    """Handle context updates from CopilotKit"""
    try:
        user_id = message_data.get("user_id")
        session_id = message_data.get("session_id")
        context = message_data.get("context", {})
        
        # Store context in Redis
        context_key = f"copilot_context:{user_id}:{session_id}"
        await redis_client.setex(
            context_key,
            settings.CONTEXT_TTL,
            json.dumps(context)
        )
        
        logger.info(
            "Updated CopilotKit context",
            user_id=user_id,
            session_id=session_id
        )
        
        # Acknowledge context update
        await websocket.send_text(json.dumps({
            "type": "context_updated",
            "session_id": session_id
        }))
        
    except Exception as e:
        logger.error("Error handling context update", exc_info=e)


async def execute_location_analysis(parameters: Dict[str, Any]) -> Dict[str, Any]:
    """Execute location analysis action"""
    try:
        # Call MCP Gateway for geospatial analysis
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{settings.MCP_GATEWAY_URL}/geospatial/analyze",
                json=parameters,
                timeout=30.0
            )
            response.raise_for_status()
            return response.json()
            
    except Exception as e:
        logger.error("Location analysis failed", exc_info=e)
        return {"error": "Location analysis failed"}


async def execute_report_generation(parameters: Dict[str, Any]) -> Dict[str, Any]:
    """Execute report generation action"""
    try:
        # Call User Backend for report generation
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{settings.USER_BACKEND_URL}/api/v1/reports/generate",
                json=parameters,
                timeout=60.0
            )
            response.raise_for_status()
            return response.json()
            
    except Exception as e:
        logger.error("Report generation failed", exc_info=e)
        return {"error": "Report generation failed"}


async def execute_restaurant_search(parameters: Dict[str, Any]) -> Dict[str, Any]:
    """Execute restaurant search action"""
    try:
        # Call MCP Gateway for restaurant search
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{settings.MCP_GATEWAY_URL}/restaurant/search",
                json=parameters,
                timeout=30.0
            )
            response.raise_for_status()
            return response.json()
            
    except Exception as e:
        logger.error("Restaurant search failed", exc_info=e)
        return {"error": "Restaurant search failed"}


async def execute_marketing_research(parameters: Dict[str, Any]) -> Dict[str, Any]:
    """Execute marketing research request"""
    try:
        query = parameters.get("query", "")
        if not query:
            return {"error": "Query is required for marketing research"}
        
        marketing_adapter = app.state.copilot_service.marketing_research
        result = await marketing_adapter.get_comprehensive_research(query)
        
        return {
            "status": "success",
            "result": result
        }
    except Exception as e:
        logger.error("Marketing research execution failed", exc_info=e)
        return {
            "status": "error",
            "error": str(e)
        }


async def execute_marketing_campaign(parameters: Dict[str, Any]) -> Dict[str, Any]:
    """Execute marketing campaign generation request"""
    try:
        query = parameters.get("query", "")
        if not query:
            return {"error": "Query is required for marketing campaign generation"}
        
        marketing_adapter = app.state.copilot_service.marketing_research
        result = await marketing_adapter.generate_marketing_campaign(query)
        
        return {
            "status": "success",
            "result": result
        }
    except Exception as e:
        logger.error("Marketing campaign generation failed", exc_info=e)
        return {
            "status": "error",
            "error": str(e)
        }


async def execute_competitive_analysis(parameters: Dict[str, Any]) -> Dict[str, Any]:
    """Execute competitive landscape analysis"""
    try:
        query = parameters.get("query", "")
        location = parameters.get("location", "")
        
        # Combine location with query if provided separately
        if location and location not in query:
            query = f"{query} in {location}"
        
        if not query:
            return {"error": "Query is required for competitive analysis"}
        
        marketing_adapter = app.state.copilot_service.marketing_research
        result = await marketing_adapter.analyze_competitive_landscape(query)
        
        return {
            "status": "success",
            "result": result
        }
    except Exception as e:
        logger.error("Competitive analysis execution failed", exc_info=e)
        return {
            "status": "error",
            "error": str(e)
        }


@app.post("/copilotkit/chat", response_model=CopilotResponse)
async def chat_endpoint(message: CopilotMessage):
    """
    HTTP endpoint for CopilotKit chat (alternative to WebSocket)
    """
    try:
        copilot_service = app.state.copilot_service
        
        response = await copilot_service.process_chat_message(
            message=message.message,
            user_id=message.user_id,
            session_id=message.session_id,
            context=message.context or {}
        )
        
        return CopilotResponse(**response)
        
    except Exception as e:
        logger.error("Chat endpoint error", exc_info=e)
        raise HTTPException(status_code=500, detail="Failed to process chat message")


@app.get("/copilotkit/sessions/{user_id}")
async def get_user_sessions(user_id: str):
    """Get active CopilotKit sessions for a user"""
    try:
        # Get sessions from Redis
        pattern = f"copilot_session:{user_id}:*"
        keys = await redis_client.keys(pattern)
        
        sessions = []
        for key in keys:
            session_data = await redis_client.get(key)
            if session_data:
                sessions.append(json.loads(session_data))
        
        return {"sessions": sessions}
        
    except Exception as e:
        logger.error("Error getting user sessions", exc_info=e)
        raise HTTPException(status_code=500, detail="Failed to get sessions")


@app.post("/api/marketing-research")
async def marketing_research_endpoint(request: CopilotMessage):
    """Direct endpoint for marketing research requests"""
    try:
        copilot_service = app.state.copilot_service
        
        # Process the request
        response = await copilot_service._process_marketing_request(
            message=request.message,
            user_id=request.user_id,
            session_id=request.session_id,
            conversation_context=[]  # New conversation
        )
        
        return CopilotResponse(
            response=response["response"],
            message_id=response["message_id"],
            session_id=response["session_id"],
            suggestions=response.get("suggestions", []),
            actions=[{
                "name": "view_marketing_details",
                "display_name": "View Marketing Details",
                "description": "View detailed marketing analysis and visualizations",
                "parameters": {
                    "charts": response.get("charts", {}),
                    "sentiment": response.get("sentiment", {}),
                    "keywords": response.get("keywords", [])
                }
            }]
        )
        
    except Exception as e:
        logger.error("Marketing research endpoint error", exc_info=e)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process marketing research request: {str(e)}"
        )


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8001,
        reload=settings.ENVIRONMENT == "development",
        log_level="info"
    )
