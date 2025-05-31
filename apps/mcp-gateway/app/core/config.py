"""
Configuration for MCP Gateway
"""

from typing import List
from pydantic_settings import BaseSettings


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
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:12000,https://work-1-sriexewjfolcezbr.prod-runtime.all-hands.dev,https://work-2-sriexewjfolcezbr.prod-runtime.all-hands.dev"
    
    @property
    def allowed_origins_list(self) -> List[str]:
        """Parse ALLOWED_ORIGINS string into list"""
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]
    
    class Config:
        env_file = ".env"


settings = Settings()
