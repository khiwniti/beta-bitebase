"""
Chat API endpoints
"""

from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from pydantic import BaseModel
import structlog
import httpx

from app.core.auth import get_current_user
from app.core.config import settings
from app.models.user import User
from app.services.chat import ChatService
from app.services.langgraph import LangGraphService

logger = structlog.get_logger()
router = APIRouter()


class ChatMessage(BaseModel):
    """Chat message model"""
    message: str
    context: Optional[Dict[str, Any]] = None
    location: Optional[str] = None
    cuisine_type: Optional[str] = None


class ChatResponse(BaseModel):
    """Chat response model"""
    response: str
    message_id: str
    timestamp: str
    context: Optional[Dict[str, Any]] = None
    suggestions: Optional[List[str]] = None


class ChatHistory(BaseModel):
    """Chat history model"""
    messages: List[Dict[str, Any]]
    total_count: int
    page: int
    page_size: int


@router.post("/", response_model=ChatResponse)
async def send_chat_message(
    message: ChatMessage,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user)
) -> ChatResponse:
    """
    Send a chat message to the AI assistant
    """
    try:
        logger.info(
            "Processing chat message",
            user_id=current_user.id,
            message_length=len(message.message)
        )
        
        # Initialize chat service
        chat_service = ChatService()
        
        # Process message through LangGraph AI agent
        langgraph_service = LangGraphService()
        
        # Send to LangGraph for processing
        ai_response = await langgraph_service.process_chat_message(
            message=message.message,
            user_id=current_user.id,
            context=message.context,
            location=message.location,
            cuisine_type=message.cuisine_type
        )
        
        # Save chat history in background
        background_tasks.add_task(
            chat_service.save_chat_message,
            user_id=current_user.id,
            user_message=message.message,
            ai_response=ai_response["response"],
            context=message.context
        )
        
        return ChatResponse(
            response=ai_response["response"],
            message_id=ai_response["message_id"],
            timestamp=ai_response["timestamp"],
            context=ai_response.get("context"),
            suggestions=ai_response.get("suggestions", [])
        )
        
    except Exception as e:
        logger.error(
            "Error processing chat message",
            exc_info=e,
            user_id=current_user.id
        )
        raise HTTPException(
            status_code=500,
            detail="Failed to process chat message"
        )


@router.get("/history", response_model=ChatHistory)
async def get_chat_history(
    page: int = 1,
    page_size: int = 50,
    current_user: User = Depends(get_current_user)
) -> ChatHistory:
    """
    Get chat history for the current user
    """
    try:
        chat_service = ChatService()
        
        history = await chat_service.get_chat_history(
            user_id=current_user.id,
            page=page,
            page_size=page_size
        )
        
        return ChatHistory(
            messages=history["messages"],
            total_count=history["total_count"],
            page=page,
            page_size=page_size
        )
        
    except Exception as e:
        logger.error(
            "Error fetching chat history",
            exc_info=e,
            user_id=current_user.id
        )
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch chat history"
        )


@router.delete("/history")
async def clear_chat_history(
    current_user: User = Depends(get_current_user)
) -> Dict[str, str]:
    """
    Clear chat history for the current user
    """
    try:
        chat_service = ChatService()
        
        await chat_service.clear_chat_history(user_id=current_user.id)
        
        logger.info(
            "Chat history cleared",
            user_id=current_user.id
        )
        
        return {"message": "Chat history cleared successfully"}
        
    except Exception as e:
        logger.error(
            "Error clearing chat history",
            exc_info=e,
            user_id=current_user.id
        )
        raise HTTPException(
            status_code=500,
            detail="Failed to clear chat history"
        )


@router.post("/feedback")
async def submit_chat_feedback(
    message_id: str,
    feedback: str,
    rating: int,
    current_user: User = Depends(get_current_user)
) -> Dict[str, str]:
    """
    Submit feedback for a chat message
    """
    try:
        if rating < 1 or rating > 5:
            raise HTTPException(
                status_code=400,
                detail="Rating must be between 1 and 5"
            )
        
        chat_service = ChatService()
        
        await chat_service.save_feedback(
            message_id=message_id,
            user_id=current_user.id,
            feedback=feedback,
            rating=rating
        )
        
        logger.info(
            "Chat feedback submitted",
            user_id=current_user.id,
            message_id=message_id,
            rating=rating
        )
        
        return {"message": "Feedback submitted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(
            "Error submitting feedback",
            exc_info=e,
            user_id=current_user.id,
            message_id=message_id
        )
        raise HTTPException(
            status_code=500,
            detail="Failed to submit feedback"
        )


@router.get("/suggestions")
async def get_chat_suggestions(
    context: Optional[str] = None,
    current_user: User = Depends(get_current_user)
) -> Dict[str, List[str]]:
    """
    Get suggested chat prompts based on context
    """
    try:
        # Default suggestions
        suggestions = [
            "Analyze market opportunities in Bangkok",
            "Compare competitor pricing strategies",
            "Show demographic insights for my location",
            "Generate a location scoring analysis",
            "Help me optimize my menu pricing",
            "What are the latest food trends?"
        ]
        
        # Context-specific suggestions
        if context == "market_analysis":
            suggestions = [
                "What's the competition level in this area?",
                "Show me foot traffic patterns",
                "Analyze demographic data for restaurants",
                "Compare this location to similar areas"
            ]
        elif context == "restaurant_setup":
            suggestions = [
                "Help me choose the best location",
                "What cuisine type works best here?",
                "Estimate startup costs for this area",
                "Show me successful restaurant examples"
            ]
        
        return {"suggestions": suggestions}
        
    except Exception as e:
        logger.error(
            "Error getting chat suggestions",
            exc_info=e,
            user_id=current_user.id
        )
        raise HTTPException(
            status_code=500,
            detail="Failed to get chat suggestions"
        )
