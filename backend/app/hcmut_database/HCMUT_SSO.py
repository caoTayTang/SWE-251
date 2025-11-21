#Mockup for HCMUT_SSO
import hashlib
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Enum, ForeignKey
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from .base import Base



class SSOUser(Base):
    """
    Mô phỏng bảng người dùng trong hệ thống HCMUT_SSO.
    Bảng này CHỈ lưu trữ thông tin xác thực cốt lõi.
    """
    __tablename__ = "sso_users"

    username = Column(String, primary_key=True, index=True, nullable=False) 

    hashed_password = Column(String, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    def set_password(self, plain_password):
        """Hashes and sets the password using hashlib."""   
        self.hashed_password = hashlib.sha256(plain_password.encode('utf-8')).hexdigest()

    def check_password(self, plain_password):
        """Verifies a plain-text password against the stored hash."""
        return self.hashed_password == hashlib.sha256(plain_password.encode('utf-8')).hexdigest()

    def __repr__(self):
        return f"username={self.username})>"



    

    