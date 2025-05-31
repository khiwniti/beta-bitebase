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
        
        # Enhanced keyword-based responses
        prompt_lower = prompt.lower()
        
        if "coffee shop" in prompt_lower and ("factors" in prompt_lower or "successful" in prompt_lower or "key" in prompt_lower):
            response = """Key factors for opening a successful coffee shop:

🏪 **Location & Demographics**
- High foot traffic areas (business districts, universities, residential neighborhoods)
- Target demographic analysis (age 25-45, income $40k+, coffee consumption habits)
- Visibility and accessibility with parking availability

☕ **Product & Menu Strategy**
- Quality coffee beans and consistent brewing methods
- Diverse menu (specialty drinks, food items, dietary options)
- Competitive pricing strategy ($3-6 for specialty drinks)

💰 **Financial Planning**
- Initial investment: $80k-$300k depending on size and location
- Break-even typically 12-18 months
- Focus on high-margin items (specialty drinks, pastries)

🎯 **Operations & Marketing**
- Skilled baristas and excellent customer service
- Strong brand identity and local community engagement
- Digital presence and loyalty programs

Would you like me to analyze a specific location for your coffee shop?"""
        
        elif "location" in prompt_lower and "analyze" in prompt_lower:
            response = "I can help you analyze locations for restaurant opportunities. Please provide the specific location (address or area) you'd like me to analyze, and I'll assess factors like demographics, competition, foot traffic, and market potential."
        
        elif "restaurant" in prompt_lower and ("open" in prompt_lower or "start" in prompt_lower):
            response = """Starting a restaurant involves several key considerations:

📍 **Location Analysis** - Demographics, foot traffic, competition density
💰 **Financial Planning** - Startup costs ($175k-$750k average), cash flow projections
🍽️ **Concept Development** - Cuisine type, target market, pricing strategy
📋 **Operational Setup** - Permits, equipment, staffing, suppliers
📈 **Marketing Strategy** - Brand positioning, digital presence, community engagement

Would you like me to dive deeper into any of these areas or analyze a specific location?"""
        
        elif "market" in prompt_lower and ("research" in prompt_lower or "analysis" in prompt_lower):
            response = "I can help with comprehensive market research including competitor analysis, demographic studies, foot traffic patterns, and market opportunity assessment. Please specify the location or type of analysis you need."
        
        elif "competition" in prompt_lower or "competitor" in prompt_lower:
            response = "I can analyze your competition by examining nearby restaurants, their pricing strategies, customer reviews, market positioning, and identifying gaps in the market. Please provide the location you're interested in."
        
        elif "hello" in prompt_lower or "hi" in prompt_lower:
            response = "Hello! I'm your BiteBase AI restaurant consultant. I can help you with location analysis, market research, business planning, competitor insights, and strategic recommendations for your restaurant venture."
        
        else:
            response = "I'm your BiteBase AI restaurant consultant. I can help with location analysis, market research, business planning, competitor analysis, and strategic insights. What specific aspect of your restaurant business would you like to explore?"
        
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
