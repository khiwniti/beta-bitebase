"""
Configuration settings for CopilotKit Service
"""

from typing import List
from pydantic import BaseSettings


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
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003",
        "http://localhost:3004",
        "https://bitebase.com",
        "https://staff.bitebase.com",
        "https://tools.bitebase.com",
        "https://workflows.bitebase.com",
        "https://tasks.bitebase.com"
    ]
    
    # API Keys
    OPENAI_API_KEY: str = ""
    
    class Config:
        env_file = ".env"


settings = Settings()
