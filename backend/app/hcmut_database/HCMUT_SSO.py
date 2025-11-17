#Mockup for HCMUT_SSO
import hashlib
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean, Enum, ForeignKey
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
from .base import Base



class SSOUser(Base):
    """
    Mô phỏng bảng người dùng trong hệ thống HCMUT_SSO.
    Bảng này CHỈ lưu trữ thông tin xác thực cốt lõi.
    """
    __tablename__ = "sso_users"

    
    # username là phần trước @ của email
    username = Column(String, primary_key=True, index=True, nullable=False) 
    
    # Thông tin mật khẩu đã hash bằng hashlib
    hashed_password = Column(String, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    # --- Phương thức Hash Mật khẩu (dùng hashlib) ---
    def set_password(self, plain_password):
        """Hashes and sets the password using hashlib."""   
        self.hashed_password = hashlib.sha256(plain_password.encode('utf-8')).hexdigest()

    def check_password(self, plain_password):
        """Verifies a plain-text password against the stored hash."""
        return self.hashed_password == hashlib.sha256(plain_password.encode('utf-8')).hexdigest()

    def __repr__(self):
        return f"username={self.username})>"



    

    