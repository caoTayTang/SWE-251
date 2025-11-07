from fastapi import APIRouter
from typing import List
from app.models.notification import Notification

router = APIRouter(prefix="/notifications", tags=["Notifications"])

# Mock notifications
notifications = [
    { 'id': 1, 'message': 'New student enrolled in Python course', 'isRead': False, 'createdAt': '2025-10-30T10:00' },
    { 'id': 2, 'message': 'Course approval pending', 'isRead': False, 'createdAt': '2025-10-29T15:30' },
]

@router.get("/", response_model=List[Notification])
def get_notifications():
    return notifications
