from sqlalchemy.orm import Session, sessionmaker
from typing import List, Optional
from ..models.notification import Notification, NotificationType


class NotificationService:
    def __init__(self, db_session: sessionmaker):
        self.db_session = db_session

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
        db = self.db_session()
        db.add(notification)
        db.commit()
        db.refresh(notification)
        db.close()
        return notification

    def get_by_id(self, notification_id: int) -> Optional[Notification]:
        db = self.db_session()
        result = db.query(Notification).filter(Notification.id == notification_id).first()
        db.close()
        return result

    def get_all(self, skip: int = 0, limit: int = 100) -> List[Notification]:
        db = self.db_session()
        result = db.query(Notification).offset(skip).limit(limit).all()
        db.close()
        return result

    def get_by_user(self, user_id: str) -> List[Notification]:
        db = self.db_session()
        result = db.query(Notification).filter(Notification.user_id == user_id).order_by(Notification.created_at.desc()).all()
        db.close()
        return result

    def get_unread_by_user(self, user_id: str) -> List[Notification]:
        db = self.db_session()
        result = db.query(Notification).filter(
            Notification.user_id == user_id,
            Notification.is_read == False
        ).order_by(Notification.created_at.desc()).all()
        db.close()
        return result

    def get_by_type(self, type: NotificationType) -> List[Notification]:
        db = self.db_session()
        result = db.query(Notification).filter(Notification.type == type).all()
        db.close()
        return result

    def mark_as_read(self, notification_id: int) -> Optional[Notification]:
        db = self.db_session()
        notification = db.query(Notification).filter(Notification.id == notification_id).first()
        if not notification:
            db.close()
            return None
        
        notification.is_read = True
        db.commit()
        db.refresh(notification)
        db.close()
        return notification

    def mark_all_as_read(self, user_id: str) -> int:
        db = self.db_session()
        count = db.query(Notification).filter(
            Notification.user_id == user_id,
            Notification.is_read == False
        ).update({"is_read": True})
        db.commit()
        db.close()
        return count

    def update(self, notification_id: int, title: Optional[str] = None,
               content: Optional[str] = None, is_read: Optional[bool] = None) -> Optional[Notification]:
        db = self.db_session()
        notification = db.query(Notification).filter(Notification.id == notification_id).first()
        if not notification:
            db.close()
            return None
        
        if title is not None:
            notification.title = title
        if content is not None:
            notification.content = content
        if is_read is not None:
            notification.is_read = is_read
        
        db.commit()
        db.refresh(notification)
        db.close()
        return notification

    def delete(self, notification_id: int) -> bool:
        db = self.db_session()
        notification = db.query(Notification).filter(Notification.id == notification_id).first()
        if not notification:
            db.close()
            return False
        
        db.delete(notification)
        db.commit()
        db.close()
        return True