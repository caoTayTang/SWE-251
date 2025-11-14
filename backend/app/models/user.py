from sqlalchemy import create_engine, Column, Integer, String, Enum
from sqlalchemy.orm import sessionmaker, declarative_base, relationship
import enum
from .base import Base


# --- Define Enum for Roles ---
class UserRole(str, enum.Enum):
    """Các vai trò cơ bản trong hệ thống."""
    TUTOR = "tutor"
    ADMIN = "admin"


# --- Define Model ---
class MututorUser(Base):
    """Bảng người dùng cho hệ thống MuChat."""
    __tablename__ = "users"

    #id = Column(Integer, primary_key=True, autoincrement=True)
    id = Column(String, primary_key=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    role = Column(Enum(UserRole), nullable=False, index=True)
      

    def __repr__(self):
        return f"<MututorUser(id={self.id}, username='{self.username}', role='{self.role.value}')>"
    