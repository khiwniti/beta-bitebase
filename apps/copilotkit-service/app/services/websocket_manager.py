"""
WebSocket connection manager
"""

from typing import List, Dict
from fastapi import WebSocket
import structlog

logger = structlog.get_logger()


class WebSocketManager:
    """Manages WebSocket connections"""
    
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.user_connections: Dict[str, List[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, user_id: str = None):
        """Accept new WebSocket connection"""
        await websocket.accept()
        self.active_connections.append(websocket)
        
        if user_id:
            if user_id not in self.user_connections:
                self.user_connections[user_id] = []
            self.user_connections[user_id].append(websocket)
        
        logger.info(
            "WebSocket connected",
            user_id=user_id,
            total_connections=len(self.active_connections)
        )
    
    def disconnect(self, websocket: WebSocket, user_id: str = None):
        """Remove WebSocket connection"""
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        
        if user_id and user_id in self.user_connections:
            if websocket in self.user_connections[user_id]:
                self.user_connections[user_id].remove(websocket)
            
            # Clean up empty user connection lists
            if not self.user_connections[user_id]:
                del self.user_connections[user_id]
        
        logger.info(
            "WebSocket disconnected",
            user_id=user_id,
            total_connections=len(self.active_connections)
        )
    
    async def send_personal_message(self, message: str, websocket: WebSocket):
        """Send message to specific WebSocket"""
        try:
            await websocket.send_text(message)
        except Exception as e:
            logger.error("Failed to send personal message", exc_info=e)
    
    async def send_to_user(self, message: str, user_id: str):
        """Send message to all connections for a user"""
        if user_id in self.user_connections:
            for websocket in self.user_connections[user_id]:
                try:
                    await websocket.send_text(message)
                except Exception as e:
                    logger.error(
                        "Failed to send message to user",
                        exc_info=e,
                        user_id=user_id
                    )
    
    async def broadcast(self, message: str):
        """Broadcast message to all connections"""
        for websocket in self.active_connections:
            try:
                await websocket.send_text(message)
            except Exception as e:
                logger.error("Failed to broadcast message", exc_info=e)
