from pydantic import BaseModel

class Notification(BaseModel):
    id: int
    message: str
    isRead: bool
    createdAt: str