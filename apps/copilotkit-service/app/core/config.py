"""
Configuration settings for CopilotKit Service
"""

from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings"""
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/2"
    CONTEXT_TTL: int = 3600  # 1 hour
    
    # External Services
    OLLAMA_URL: str = "http://localhost:11434"
    MCP_GATEWAY_URL: str = "http://localhost:8002"
    USER_BACKEND_URL: str = "http://localhost:8000"
    
    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:12000,https://work-1-sriexewjfolcezbr.prod-runtime.all-hands.dev,https://work-2-sriexewjfolcezbr.prod-runtime.all-hands.dev"
    
    @property
    def allowed_origins_list(self) -> List[str]:
        """Parse ALLOWED_ORIGINS string into list"""
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]
    
    # API Keys
    OPENAI_API_KEY: str = ""
    
    class Config:
        env_file = ".env"


settings = Settings()
