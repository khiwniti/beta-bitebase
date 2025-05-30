"""
API v1 router
"""

from fastapi import APIRouter

from .endpoints import chat, restaurants, analytics, reports, copilotkit

api_router = APIRouter()

# Include endpoint routers
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(restaurants.router, prefix="/restaurants", tags=["restaurants"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
api_router.include_router(copilotkit.router, prefix="/copilotkit", tags=["copilotkit"])
