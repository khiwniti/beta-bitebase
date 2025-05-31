"""
Configuration settings for BiteBase User Backend
"""

import os
from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import field_validator


class Settings(BaseSettings):
    """Application settings"""

    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "BiteBase User Backend"

    # Security
    SECRET_KEY: str = "your-secret-key-here"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days

    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:12000,https://work-1-sriexewjfolcezbr.prod-runtime.all-hands.dev,https://work-2-sriexewjfolcezbr.prod-runtime.all-hands.dev"
    ALLOWED_HOSTS: str = "localhost,127.0.0.1,0.0.0.0,work-1-sriexewjfolcezbr.prod-runtime.all-hands.dev,work-2-sriexewjfolcezbr.prod-runtime.all-hands.dev"

    # Database
    # Default local database URL (used for development)
    DATABASE_URL: str = "postgresql+asyncpg://postgres:password@localhost:5432/bitebase"
    
    # Neon.tech database URL (used for staging/production)
    NEON_DATABASE_URL: str = "postgresql+asyncpg://bitebasedb_staging_owner:npg_vzp02ERAaXoQ@ep-damp-tooth-a4orgq86-pooler.us-east-1.aws.neon.tech/bitebasedb_staging?sslmode=require"
    
    # Use Neon.tech in staging/production environments
    USE_NEON_DB: bool = True
    
    DATABASE_POOL_SIZE: int = 10
    DATABASE_MAX_OVERFLOW: int = 20

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    REDIS_CACHE_TTL: int = 3600  # 1 hour

    # External APIs
    OPENAI_API_KEY: Optional[str] = None
    CLERK_SECRET_KEY: Optional[str] = None
    AUTH0_DOMAIN: Optional[str] = None
    AUTH0_CLIENT_ID: Optional[str] = None
    AUTH0_CLIENT_SECRET: Optional[str] = None

    # CopilotKit
    COPILOTKIT_URL: str = "http://localhost:8001"

    # MCP Gateway
    MCP_GATEWAY_URL: str = "http://localhost:8002"

    # LangGraph
    LANGGRAPH_URL: str = "http://localhost:8003"

    # A2A Server
    A2A_SERVER_URL: str = "http://localhost:8004"

    # Ollama
    OLLAMA_URL: str = "http://localhost:11434"

    # Monitoring
    PROMETHEUS_ENABLED: bool = True
    SENTRY_DSN: Optional[str] = None

    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "json"

    def get_allowed_origins(self) -> List[str]:
        """Get ALLOWED_ORIGINS as a list"""
        if isinstance(self.ALLOWED_ORIGINS, str):
            return [i.strip() for i in self.ALLOWED_ORIGINS.split(",")]
        return self.ALLOWED_ORIGINS

    def get_allowed_hosts(self) -> List[str]:
        """Get ALLOWED_HOSTS as a list"""
        if isinstance(self.ALLOWED_HOSTS, str):
            return [i.strip() for i in self.ALLOWED_HOSTS.split(",")]
        return self.ALLOWED_HOSTS

    class Config:
        env_file = ".env"
        case_sensitive = True


# Create settings instance
settings = Settings()


# Environment-specific overrides
if settings.ENVIRONMENT == "production":
    settings.DEBUG = False
    settings.LOG_LEVEL = "WARNING"
    settings.USE_NEON_DB = True
elif settings.ENVIRONMENT == "staging":
    settings.DEBUG = False
    settings.LOG_LEVEL = "INFO"
    settings.USE_NEON_DB = True
elif settings.ENVIRONMENT == "development":
    settings.DEBUG = True
    settings.LOG_LEVEL = "DEBUG"
    # In development, can use either local or Neon.tech based on USE_NEON_DB setting

# Set the active database URL based on configuration
if settings.USE_NEON_DB:
    settings.DATABASE_URL = settings.NEON_DATABASE_URL
