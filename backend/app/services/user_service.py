from sqlalchemy.orm import Session
from typing import List, Optional
from ..models.user import MututorUser, UserRole


class UserService:
    def __init__(self, db: Session):
        self.db = db

    def create(self, id: str, username: str, role: UserRole) -> MututorUser:
        user = MututorUser(id=id, username=username, role=role)
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def get_by_id(self, user_id: str) -> Optional[MututorUser]:
        return self.db.query(MututorUser).filter(MututorUser.id == user_id).first()

    def get_by_username(self, username: str) -> Optional[MututorUser]:
        return self.db.query(MututorUser).filter(MututorUser.username == username).first()

    def get_all(self, skip: int = 0, limit: int = 100) -> List[MututorUser]:
        return self.db.query(MututorUser).offset(skip).limit(limit).all()

    def get_by_role(self, role: UserRole) -> List[MututorUser]:
        return self.db.query(MututorUser).filter(MututorUser.role == role).all()

    def update(self, user_id: str, username: Optional[str] = None, role: Optional[UserRole] = None) -> Optional[MututorUser]:
        user = self.get_by_id(user_id)
        if not user:
            return None
        
        if username is not None:
            user.username = username
        if role is not None:
            user.role = role
        
        self.db.commit()
        self.db.refresh(user)
        return user

    def delete(self, user_id: str) -> bool:
        user = self.get_by_id(user_id)
        if not user:
            return False
        
        self.db.delete(user)
        self.db.commit()
        return True