"""
CopilotKit API endpoints
"""

from typing import Dict, Any, List
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import structlog
import httpx

from app.core.auth import get_current_user
from app.core.config import settings
from app.models.user import User

logger = structlog.get_logger()
router = APIRouter()


class CopilotAction(BaseModel):
    """CopilotKit action request"""
    action: str
    parameters: Dict[str, Any]
    context: Dict[str, Any] = {}


class CopilotResponse(BaseModel):
    """CopilotKit action response"""
    success: bool
    result: Any
    message: str


@router.post("/actions/execute")
async def execute_copilot_action(
    action_request: CopilotAction,
    current_user: User = Depends(get_current_user)
) -> CopilotResponse:
    """
    Execute a CopilotKit action
    """
    try:
        logger.info(
            "CopilotKit action requested",
            user_id=current_user.id,
            action=action_request.action
        )
        
        # Route to CopilotKit service
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{settings.COPILOTKIT_URL}/actions/execute",
                json={
                    "action": action_request.action,
                    "parameters": action_request.parameters,
                    "context": action_request.context,
                    "user_id": current_user.id
                },
                timeout=30.0
            )
            
            if response.status_code == 200:
                result = response.json()
                return CopilotResponse(
                    success=True,
                    result=result,
                    message="Action executed successfully"
                )
            else:
                return CopilotResponse(
                    success=False,
                    result=None,
                    message="Action execution failed"
                )
                
    except httpx.RequestError:
        # Fallback for when CopilotKit service is not available
        return await execute_fallback_action(action_request, current_user)
    except Exception as e:
        logger.error("CopilotKit action failed", exc_info=e)
        raise HTTPException(status_code=500, detail="Action execution failed")


async def execute_fallback_action(
    action_request: CopilotAction,
    current_user: User
) -> CopilotResponse:
    """
    Fallback action execution when CopilotKit service is unavailable
    """
    action = action_request.action
    parameters = action_request.parameters
    
    if action == "analyze_location":
        return CopilotResponse(
            success=True,
            result={
                "location": parameters.get("location", "Unknown"),
                "score": 8.5,
                "insights": [
                    "High foot traffic area",
                    "Good public transportation access",
                    "Moderate competition level"
                ]
            },
            message="Location analysis completed (fallback mode)"
        )
    
    elif action == "search_restaurants":
        return CopilotResponse(
            success=True,
            result={
                "restaurants": [
                    {
                        "name": "Sample Restaurant",
                        "cuisine": "Thai",
                        "rating": 4.5,
                        "distance": "0.5 km"
                    }
                ],
                "total": 1
            },
            message="Restaurant search completed (fallback mode)"
        )
    
    elif action == "generate_report":
        return CopilotResponse(
            success=True,
            result={
                "report_id": "fallback_report_001",
                "status": "generated",
                "download_url": "/api/v1/reports/fallback_report_001/download"
            },
            message="Report generation initiated (fallback mode)"
        )
    
    else:
        return CopilotResponse(
            success=False,
            result=None,
            message=f"Unknown action: {action}"
        )


@router.get("/actions")
async def list_available_actions(
    current_user: User = Depends(get_current_user)
) -> Dict[str, List[Dict[str, Any]]]:
    """
    List available CopilotKit actions
    """
    try:
        actions = [
            {
                "name": "analyze_location",
                "description": "Analyze a location for restaurant potential",
                "parameters": ["location", "radius"],
                "category": "analysis"
            },
            {
                "name": "search_restaurants",
                "description": "Search for restaurants in an area",
                "parameters": ["location", "cuisine_type", "radius"],
                "category": "search"
            },
            {
                "name": "generate_report",
                "description": "Generate a market analysis report",
                "parameters": ["report_type", "location", "format"],
                "category": "reporting"
            },
            {
                "name": "get_demographics",
                "description": "Get demographic data for an area",
                "parameters": ["location", "radius"],
                "category": "analysis"
            },
            {
                "name": "compare_locations",
                "description": "Compare multiple locations",
                "parameters": ["locations", "criteria"],
                "category": "analysis"
            }
        ]
        
        return {"actions": actions}
        
    except Exception as e:
        logger.error("Failed to list actions", exc_info=e)
        raise HTTPException(status_code=500, detail="Failed to list actions")


@router.get("/context/{session_id}")
async def get_copilot_context(
    session_id: str,
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    Get CopilotKit context for a session
    """
    try:
        # Mock context data
        return {
            "session_id": session_id,
            "user_id": current_user.id,
            "context": {
                "current_location": "Bangkok, Thailand",
                "preferred_cuisine": "Thai",
                "budget_range": "$$",
                "analysis_history": [
                    "Sukhumvit area analysis",
                    "Silom district comparison"
                ]
            },
            "last_updated": "2024-01-15T10:30:00Z"
        }
        
    except Exception as e:
        logger.error("Failed to get context", exc_info=e)
        raise HTTPException(status_code=500, detail="Failed to get context")
