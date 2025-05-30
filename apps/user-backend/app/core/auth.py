"""
Authentication and authorization utilities
"""

from typing import Optional
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import httpx
import structlog
from .config import settings

logger = structlog.get_logger()
security = HTTPBearer()


class User:
    """User model for authentication"""
    def __init__(self, id: str, email: str, first_name: str = "", last_name: str = ""):
        self.id = id
        self.email = email
        self.first_name = first_name
        self.last_name = last_name


async def verify_clerk_token(token: str) -> Optional[User]:
    """Verify Clerk JWT token and return user info"""
    try:
        # In a real implementation, you would verify the JWT token with Clerk
        # For now, we'll simulate a successful verification
        if token and len(token) > 10:  # Basic validation
            return User(
                id="user_123",
                email="user@example.com",
                first_name="Test",
                last_name="User"
            )
        return None
    except Exception as e:
        logger.error("Token verification failed", exc_info=e)
        return None


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> User:
    """Get current authenticated user"""
    try:
        user = await verify_clerk_token(credentials.credentials)
        if not user:
            raise HTTPException(
                status_code=401,
                detail="Invalid authentication credentials"
            )
        return user
    except Exception as e:
        logger.error("Authentication failed", exc_info=e)
        raise HTTPException(
            status_code=401,
            detail="Authentication failed"
        )
