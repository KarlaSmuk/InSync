from uuid import UUID

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from .connection_manager import ConnectionManager
from .notifications import NotificationManager

router = APIRouter()
manager = ConnectionManager()
notification_manager = NotificationManager(manager)


@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: UUID):
    await manager.connect(websocket, user_id)
    try:
        while True:
            # Wait for messages (if needed for other functionality)
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(user_id)
