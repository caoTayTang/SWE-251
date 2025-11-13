from sqlalchemy.orm import Session
from typing import List, Optional
from notification import Notification, NotificationType


class NotificationService:
    def __init__(self, db: Session):
        self.db = db

    def create(self, user_id: str, type: NotificationType, title: str, content: str,
               related_id: Optional[int] = None, is_read: bool = False) -> Notification:
        notification = Notification(
            user_id=user_id,
            type=type,
            title=title,
            content=content,
            related_id=related_id,
            is_read=is_read
        )
        self.db.add(notification)
        self.db.commit()
        self.db.refresh(notification)
        return notification

    def get_by_id(self, notification_id: int) -> Optional[Notification]:
        return self.db.query(Notification).filter(Notification.id == notification_id).first()

    def get_all(self, skip: int = 0, limit: int = 100) -> List[Notification]:
        return self.db.query(Notification).offset(skip).limit(limit).all()

    def get_by_user(self, user_id: str) -> List[Notification]:
        return self.db.query(Notification).filter(Notification.user_id == user_id).order_by(Notification.created_at.desc()).all()

    def get_unread_by_user(self, user_id: str) -> List[Notification]:
        return self.db.query(Notification).filter(
            Notification.user_id == user_id,
            Notification.is_read == False
        ).order_by(Notification.created_at.desc()).all()

    def get_by_type(self, type: NotificationType) -> List[Notification]:
        return self.db.query(Notification).filter(Notification.type == type).all()

    def mark_as_read(self, notification_id: int) -> Optional[Notification]:
        notification = self.get_by_id(notification_id)
        if not notification:
            return None
        
        notification.is_read = True
        self.db.commit()
        self.db.refresh(notification)
        return notification

    def mark_all_as_read(self, user_id: str) -> int:
        count = self.db.query(Notification).filter(
            Notification.user_id == user_id,
            Notification.is_read == False
        ).update({"is_read": True})
        self.db.commit()
        return count

    def update(self, notification_id: int, title: Optional[str] = None,
               content: Optional[str] = None, is_read: Optional[bool] = None) -> Optional[Notification]:
        notification = self.get_by_id(notification_id)
        if not notification:
            return None
        
        if title is not None:
            notification.title = title
        if content is not None:
            notification.content = content
        if is_read is not None:
            notification.is_read = is_read
        
        self.db.commit()
        self.db.refresh(notification)
        return notification

    def delete(self, notification_id: int) -> bool:
        notification = self.get_by_id(notification_id)
        if not notification:
            return False
        
        self.db.delete(notification)
        self.db.commit()
        return True