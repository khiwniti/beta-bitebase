"""
Chat service for handling AI conversations
"""

import json
import uuid
from datetime import datetime
from typing import Dict, Any, List
import redis.asyncio as redis
import structlog

logger = structlog.get_logger()


class ChatService:
    """Service for managing chat conversations"""
    
    def __init__(self):
        self.redis_client = None
    
    async def get_redis_client(self):
        """Get Redis client instance"""
        if not self.redis_client:
            self.redis_client = redis.from_url("redis://localhost:6379/0")
        return self.redis_client
    
    async def save_chat_message(
        self,
        user_id: str,
        user_message: str,
        ai_response: str,
        context: Dict[str, Any] = None
    ) -> str:
        """Save chat message to Redis"""
        try:
            redis_client = await self.get_redis_client()
            
            message_id = str(uuid.uuid4())
            timestamp = datetime.utcnow().isoformat()
            
            chat_data = {
                "message_id": message_id,
                "user_id": user_id,
                "user_message": user_message,
                "ai_response": ai_response,
                "context": context or {},
                "timestamp": timestamp
            }
            
            # Save individual message
            await redis_client.setex(
                f"chat_message:{message_id}",
                3600 * 24 * 7,  # 7 days
                json.dumps(chat_data)
            )
            
            # Add to user's chat history
            await redis_client.lpush(
                f"chat_history:{user_id}",
                message_id
            )
            
            # Limit history to last 100 messages
            await redis_client.ltrim(f"chat_history:{user_id}", 0, 99)
            
            return message_id
            
        except Exception as e:
            logger.error("Failed to save chat message", exc_info=e)
            raise
    
    async def get_chat_history(
        self,
        user_id: str,
        page: int = 1,
        page_size: int = 50
    ) -> Dict[str, Any]:
        """Get chat history for user"""
        try:
            redis_client = await self.get_redis_client()
            
            # Get message IDs from user's history
            start = (page - 1) * page_size
            end = start + page_size - 1
            
            message_ids = await redis_client.lrange(
                f"chat_history:{user_id}",
                start,
                end
            )
            
            # Get total count
            total_count = await redis_client.llen(f"chat_history:{user_id}")
            
            # Fetch message details
            messages = []
            for message_id in message_ids:
                message_data = await redis_client.get(f"chat_message:{message_id}")
                if message_data:
                    messages.append(json.loads(message_data))
            
            return {
                "messages": messages,
                "total_count": total_count,
                "page": page,
                "page_size": page_size
            }
            
        except Exception as e:
            logger.error("Failed to get chat history", exc_info=e)
            raise
    
    async def clear_chat_history(self, user_id: str):
        """Clear chat history for user"""
        try:
            redis_client = await self.get_redis_client()
            
            # Get all message IDs
            message_ids = await redis_client.lrange(f"chat_history:{user_id}", 0, -1)
            
            # Delete individual messages
            for message_id in message_ids:
                await redis_client.delete(f"chat_message:{message_id}")
            
            # Delete history list
            await redis_client.delete(f"chat_history:{user_id}")
            
        except Exception as e:
            logger.error("Failed to clear chat history", exc_info=e)
            raise
    
    async def save_feedback(
        self,
        message_id: str,
        user_id: str,
        feedback: str,
        rating: int
    ):
        """Save feedback for a chat message"""
        try:
            redis_client = await self.get_redis_client()
            
            feedback_data = {
                "message_id": message_id,
                "user_id": user_id,
                "feedback": feedback,
                "rating": rating,
                "timestamp": datetime.utcnow().isoformat()
            }
            
            await redis_client.setex(
                f"chat_feedback:{message_id}",
                3600 * 24 * 30,  # 30 days
                json.dumps(feedback_data)
            )
            
        except Exception as e:
            logger.error("Failed to save feedback", exc_info=e)
            raise
