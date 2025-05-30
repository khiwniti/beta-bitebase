"""
Ollama service for local LLM processing
"""

import json
from typing import Dict, Any, List
import httpx
import structlog
from ..core.config import settings

logger = structlog.get_logger()


class OllamaService:
    """Service for interacting with Ollama LLM"""
    
    def __init__(self):
        self.base_url = settings.OLLAMA_URL
        self.default_model = "llama2"  # Default model
    
    async def generate_response(
        self,
        prompt: str,
        model: str = None,
        context: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """Generate response using Ollama"""
        try:
            model = model or self.default_model
            
            async with httpx.AsyncClient() as client:
                payload = {
                    "model": model,
                    "prompt": prompt,
                    "stream": False,
                    "context": context or {}
                }
                
                response = await client.post(
                    f"{self.base_url}/api/generate",
                    json=payload,
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    result = response.json()
                    return {
                        "response": result.get("response", ""),
                        "model": model,
                        "done": result.get("done", True)
                    }
                else:
                    # Fallback response
                    return await self._get_fallback_response(prompt)
                    
        except Exception as e:
            logger.error("Ollama request failed", exc_info=e)
            return await self._get_fallback_response(prompt)
    
    async def _get_fallback_response(self, prompt: str) -> Dict[str, Any]:
        """Fallback response when Ollama is unavailable"""
        
        # Simple keyword-based responses
        prompt_lower = prompt.lower()
        
        if "location" in prompt_lower or "analyze" in prompt_lower:
            response = "I can help you analyze locations for restaurant opportunities. Please provide the specific location you'd like me to analyze."
        elif "restaurant" in prompt_lower or "food" in prompt_lower:
            response = "I can assist with restaurant-related queries including market analysis, competition research, and location optimization."
        elif "report" in prompt_lower:
            response = "I can help generate various reports including market analysis, competitor research, and location scoring reports."
        elif "hello" in prompt_lower or "hi" in prompt_lower:
            response = "Hello! I'm your BiteBase AI assistant. I can help you with restaurant market analysis, location research, and business insights."
        else:
            response = "I'm here to help with your restaurant business needs. You can ask me about location analysis, market research, competitor insights, or report generation."
        
        return {
            "response": response,
            "model": "fallback",
            "done": True
        }
    
    async def list_models(self) -> List[str]:
        """List available Ollama models"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/api/tags",
                    timeout=10.0
                )
                
                if response.status_code == 200:
                    result = response.json()
                    models = [model["name"] for model in result.get("models", [])]
                    return models
                else:
                    return [self.default_model]
                    
        except Exception as e:
            logger.error("Failed to list Ollama models", exc_info=e)
            return [self.default_model]
