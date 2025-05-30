"""
Configuration for MCP Gateway
"""

from typing import List
from pydantic import BaseSettings


class Settings(BaseSettings):
    """MCP Gateway settings"""
    
    # Environment
    ENVIRONMENT: str = "development"
    
    # Auth0 Configuration
    AUTH0_DOMAIN: str = ""
    AUTH0_CLIENT_ID: str = ""
    AUTH0_CLIENT_SECRET: str = ""
    
    # MCP Servers
    MCP_SERVERS_BASE_URL: str = "http://localhost:8010"
    
    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003",
        "http://localhost:3004",
        "http://localhost:8000",
        "http://localhost:8001",
        "https://bitebase.com",
        "https://staff.bitebase.com",
        "https://tools.bitebase.com",
        "https://workflows.bitebase.com",
        "https://tasks.bitebase.com"
    ]
    
    class Config:
        env_file = ".env"


settings = Settings()
