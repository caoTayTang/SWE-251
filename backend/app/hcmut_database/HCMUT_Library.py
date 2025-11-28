#Mockup for HCMUT library
import enum
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship, sessionmaker
from datetime import datetime

from .base import Base

class ResourceType(str, enum.Enum):
    """Phân loại tài liệu (material) hay đề thi (exam)"""
    MATERIAL = "material"
    EXAM = "exam"

class FileType(str, enum.Enum):
    """Loại file cơ bản dựa trên mock data"""
    PDF = "pdf"
    DOCX = "docx"
    PPTX = "pptx"
    OTHER = "other"


class LibraryResource(Base):
    """
    Model cho một tài nguyên trong thư viện (Tài liệu hoặc Đề thi).
    """
    __tablename__ = "library_resources"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    
    resource_type = Column(Enum(ResourceType), nullable=False, index=True) 
    
    file_type = Column(Enum(FileType), nullable=False)
    file_size = Column(String, nullable=True) # "2.1 MB"
    
    uploader_id = Column(String, ForeignKey("datacore_users.id"), nullable=False)
    
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    
    uploader = relationship("User") 

    def __repr__(self):
        return (f"<LibraryResource(id={self.id}, name='{self.name[:20]}...', "
                f"type={self.resource_type.value})>")


    
    