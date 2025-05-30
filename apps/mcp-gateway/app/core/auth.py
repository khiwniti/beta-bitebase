"""
Auth0 authentication for MCP Gateway
"""

import jwt
from typing import Dict, Any
import httpx
import structlog
from .config import settings

logger = structlog.get_logger()


async def verify_auth0_token(token: str) -> Dict[str, Any]:
    """Verify Auth0 JWT token"""
    try:
        # In a real implementation, you would verify with Auth0
        # For now, we'll do basic validation
        if token and len(token) > 10:
            return {
                "sub": "auth0|user123",
                "email": "user@example.com",
                "permissions": ["read:tools", "execute:tools"]
            }
        else:
            raise Exception("Invalid token")
            
    except Exception as e:
        logger.error("Token verification failed", exc_info=e)
        raise Exception("Authentication failed")
