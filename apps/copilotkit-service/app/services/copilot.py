"""
CopilotKit service for managing AI interactions
"""

import json
import uuid
from datetime import datetime
from typing import Dict, Any, List
import redis.asyncio as redis
import structlog
from .ollama import OllamaService
from .marketing_research import MarketingResearchAdapter

logger = structlog.get_logger()


class CopilotService:
    """Service for CopilotKit interactions"""
    
    def __init__(self, redis_client: redis.Redis):
        self.redis_client = redis_client
        self.ollama_service = OllamaService()
        self.marketing_research = MarketingResearchAdapter()
    
    async def process_chat_message(
        self,
        message: str,
        user_id: str,
        session_id: str,
        context: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """Process chat message through AI"""
        try:
            message_id = str(uuid.uuid4())
            timestamp = datetime.utcnow().isoformat()
            
            # Get conversation context
            conversation_context = await self._get_conversation_context(
                user_id, session_id
            )
            
            # Check if this is a marketing research request
            if await self._is_marketing_query(message):
                return await self._process_marketing_request(
                    message, user_id, session_id, conversation_context
                )
            
            # Build prompt with context
            prompt = await self._build_prompt(
                message, context or {}, conversation_context
            )
            
            # Generate response using Ollama
            ai_response = await self.ollama_service.generate_response(
                prompt=prompt,
                context=context
            )
            
            # Save conversation
            await self._save_conversation_turn(
                user_id, session_id, message, ai_response["response"]
            )
            
            # Generate suggestions
            suggestions = await self._generate_suggestions(message, context)
            
            return {
                "response": ai_response["response"],
                "message_id": message_id,
                "session_id": session_id,
                "timestamp": timestamp,
                "suggestions": suggestions
            }
            
        except Exception as e:
            logger.error("Chat message processing failed", exc_info=e)
            raise
    
    async def _get_conversation_context(
        self, user_id: str, session_id: str
    ) -> List[Dict[str, str]]:
        """Get recent conversation history"""
        try:
            context_key = f"conversation:{user_id}:{session_id}"
            conversation_data = await self.redis_client.get(context_key)
            
            if conversation_data:
                return json.loads(conversation_data)
            return []
            
        except Exception as e:
            logger.error("Failed to get conversation context", exc_info=e)
            return []
    
    async def _build_prompt(
        self,
        message: str,
        context: Dict[str, Any],
        conversation_history: List[Dict[str, str]]
    ) -> str:
        """Build AI prompt with context"""
        
        system_prompt = """You are an expert restaurant business consultant and AI assistant for BiteBase, a comprehensive restaurant intelligence platform. 

        You provide expert guidance on:
        - Restaurant location analysis and site selection
        - Market research and competitor analysis  
        - Business planning and strategy development
        - Menu optimization and pricing strategies
        - Customer insights and demographic analysis
        - Marketing and promotional strategies
        - Operational efficiency and best practices
        - Financial planning and revenue optimization
        - Industry trends and market opportunities

        When users ask general restaurant business questions, provide detailed, actionable advice based on industry best practices. For location-specific questions, guide them to provide specific locations for detailed analysis.

        Be helpful, knowledgeable, and provide specific, actionable insights that restaurant owners and entrepreneurs can implement."""
        
        # Add conversation history
        history_text = ""
        if conversation_history:
            for turn in conversation_history[-3:]:  # Last 3 turns
                history_text += f"User: {turn['user']}\nAssistant: {turn['assistant']}\n"
        
        # Add current context
        context_text = ""
        if context:
            context_text = f"Current context: {json.dumps(context)}\n"
        
        prompt = f"{system_prompt}\n\n{history_text}{context_text}User: {message}\nAssistant:"
        
        return prompt
    
    async def _save_conversation_turn(
        self,
        user_id: str,
        session_id: str,
        user_message: str,
        ai_response: str
    ):
        """Save conversation turn to Redis"""
        try:
            context_key = f"conversation:{user_id}:{session_id}"
            
            # Get existing conversation
            conversation_data = await self.redis_client.get(context_key)
            conversation = json.loads(conversation_data) if conversation_data else []
            
            # Add new turn
            conversation.append({
                "user": user_message,
                "assistant": ai_response,
                "timestamp": datetime.utcnow().isoformat()
            })
            
            # Keep only last 10 turns
            conversation = conversation[-10:]
            
            # Save back to Redis
            await self.redis_client.setex(
                context_key,
                3600,  # 1 hour TTL
                json.dumps(conversation)
            )
            
        except Exception as e:
            logger.error("Failed to save conversation turn", exc_info=e)
    
    async def _generate_suggestions(
        self, message: str, context: Dict[str, Any]
    ) -> List[str]:
        """Generate follow-up suggestions"""
        
        message_lower = message.lower()
        suggestions = []
        
        if "location" in message_lower:
            suggestions = [
                "Analyze competitor density in this area",
                "Get demographic insights for this location",
                "Compare with similar locations",
                "Generate a location scoring report"
            ]
        elif "restaurant" in message_lower:
            suggestions = [
                "Search for similar restaurants nearby",
                "Analyze menu pricing strategies",
                "Get customer review insights",
                "Compare performance metrics"
            ]
        elif "market" in message_lower:
            suggestions = [
                "Show market trends for this area",
                "Analyze seasonal patterns",
                "Get foot traffic data",
                "Compare market opportunities"
            ]
        else:
            suggestions = [
                "Analyze a specific location",
                "Search for restaurants in an area",
                "Generate a market analysis report",
                "Get demographic insights"
            ]
        
        return suggestions[:4]  # Return max 4 suggestions
    
    async def _is_marketing_query(self, message: str) -> bool:
        """Determine if a message is related to marketing research"""
        marketing_keywords = [
            "marketing", "promotion", "campaign", "loyalty", "advertisement",
            "customer retention", "social media", "email marketing", "discount",
            "restaurant marketing", "cafe promotion", "menu pricing", "competitive analysis",
            "customer insights", "market research", "restaurant promotion"
        ]
        
        message_lower = message.lower()
        return any(keyword in message_lower for keyword in marketing_keywords)
    
    async def _process_marketing_request(
        self,
        message: str,
        user_id: str,
        session_id: str,
        conversation_context: List[Dict[str, str]]
    ) -> Dict[str, Any]:
        """Process marketing research request"""
        try:
            # Determine the type of marketing request
            message_lower = message.lower()
            
            # Define the action based on the message content
            action = "insight"  # Default action
            
            if any(term in message_lower for term in ["comprehensive", "detailed", "full report", "in-depth"]):
                action = "research"
            elif any(term in message_lower for term in ["competitive", "competition", "competitor", "landscape", "market position"]):
                action = "competitive"
            elif any(term in message_lower for term in ["campaign", "promotion plan", "marketing strategy", "promotion strategy"]):
                action = "campaign"
            elif any(term in message_lower for term in ["dataset", "data source", "what data"]):
                action = "datasets"
            
            # Process the marketing request
            marketing_response = await self.marketing_research.process_marketing_request({
                "query": message,
                "action": action
            })
            
            # Save the conversation turn
            await self._save_conversation_turn(
                user_id, 
                session_id, 
                message, 
                marketing_response["response"]
            )
            
            # Generate marketing-specific suggestions
            suggestions = await self._generate_marketing_suggestions(message, action)
            
            return {
                "response": marketing_response["response"],
                "message_id": str(uuid.uuid4()),
                "session_id": session_id,
                "timestamp": datetime.utcnow().isoformat(),
                "suggestions": suggestions,
                "charts": marketing_response.get("charts", {}),
                "sentiment": marketing_response.get("sentiment", {}),
                "keywords": marketing_response.get("keywords", []),
                "is_marketing_response": True
            }
            
        except Exception as e:
            logger.error("Marketing request processing failed", exc_info=e)
            return {
                "response": f"I encountered an error processing your marketing research request: {str(e)}",
                "message_id": str(uuid.uuid4()),
                "session_id": session_id,
                "timestamp": datetime.utcnow().isoformat(),
                "suggestions": [],
                "is_marketing_response": True,
                "error": str(e)
            }
    
    async def _generate_marketing_suggestions(
        self, message: str, action: str
    ) -> List[str]:
        """Generate marketing-specific follow-up suggestions"""
        
        if action == "research":
            return [
                "Compare with industry benchmarks",
                "Generate visual charts of this data",
                "Create a presentation version of this research",
                "Identify key action items from this research"
            ]
        elif action == "competitive":
            return [
                "Analyze specific competitors in this area",
                "Identify gaps in the market",
                "Suggest positioning strategies",
                "Create a competitive advantage plan"
            ]
        elif action == "campaign":
            return [
                "Create a implementation timeline",
                "Estimate budget requirements",
                "Generate social media content ideas",
                "Design loyalty program structure"
            ]
        else:  # Default for "insight" or other actions
            return [
                "Get comprehensive research on this topic",
                "Analyze the competitive landscape",
                "Create a marketing campaign plan",
                "Get customer insights for this market"
            ]
