# 
from fastapi import WebSocket
from typing import Dict, List
from .logger import get_logger

logger = get_logger("websocket")
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)

        print(f"✅ User {user_id} connected. Total active: {len(self.active_connections)}") 
        print(f"   List users: {list(self.active_connections.keys())}")

    def disconnect(self, websocket: WebSocket, user_id: str):
        if user_id in self.active_connections:
            if websocket in self.active_connections[user_id]:
                self.active_connections[user_id].remove(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
            print(f"❌ User {user_id} disconnected.")

    async def send_personal_message(self, message: dict, user_id: str):
        print("Active con", self.active_connections)
        if user_id in self.active_connections:
            for connection in self.active_connections[user_id]:
                print(f"📤 Sending to {user_id}: {message['type']}")
                await connection.send_json(message)
        else:
            logger.warning(f"No user found with id: {user_id}")
            print(f"⚠️ Cannot send to {user_id}: User is OFFLINE")

manager = ConnectionManager()