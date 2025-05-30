"""
LangGraph service for AI workflow orchestration
"""

import json
from typing import Dict, Any, List
import httpx
import structlog
from ..core.config import settings

logger = structlog.get_logger()


class LangGraphService:
    """Service for interacting with LangGraph AI agent"""
    
    def __init__(self):
        self.base_url = settings.LANGGRAPH_URL
    
    async def process_chat_message(
        self,
        message: str,
        user_id: str,
        context: Dict[str, Any] = None,
        location: str = None,
        cuisine_type: str = None
    ) -> Dict[str, Any]:
        """Process chat message through LangGraph"""
        try:
            async with httpx.AsyncClient() as client:
                payload = {
                    "message": message,
                    "user_id": user_id,
                    "context": context or {},
                    "location": location,
                    "cuisine_type": cuisine_type
                }
                
                response = await client.post(
                    f"{self.base_url}/chat",
                    json=payload,
                    timeout=30.0
                )
                response.raise_for_status()
                
                return response.json()
                
        except httpx.RequestError as e:
            logger.error("LangGraph request failed", exc_info=e)
            # Fallback response
            return {
                "response": "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
                "message_id": "fallback_001",
                "timestamp": "2024-01-01T00:00:00Z",
                "suggestions": [
                    "Try asking about restaurant locations",
                    "Ask for market analysis",
                    "Request help with menu planning"
                ]
            }
        except Exception as e:
            logger.error("Unexpected error in LangGraph service", exc_info=e)
            raise
    
    async def execute_workflow(
        self,
        workflow_name: str,
        parameters: Dict[str, Any],
        user_id: str
    ) -> Dict[str, Any]:
        """Execute a specific LangGraph workflow"""
        try:
            async with httpx.AsyncClient() as client:
                payload = {
                    "workflow": workflow_name,
                    "parameters": parameters,
                    "user_id": user_id
                }
                
                response = await client.post(
                    f"{self.base_url}/workflows/execute",
                    json=payload,
                    timeout=60.0
                )
                response.raise_for_status()
                
                return response.json()
                
        except Exception as e:
            logger.error("Workflow execution failed", exc_info=e)
            raise
    
    async def get_workflow_status(
        self,
        workflow_id: str,
        user_id: str
    ) -> Dict[str, Any]:
        """Get status of a running workflow"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/workflows/{workflow_id}/status",
                    params={"user_id": user_id},
                    timeout=10.0
                )
                response.raise_for_status()
                
                return response.json()
                
        except Exception as e:
            logger.error("Failed to get workflow status", exc_info=e)
            raise
