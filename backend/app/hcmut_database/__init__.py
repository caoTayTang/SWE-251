from .HCMUT_DATACORE import User, Student, Staff, HcmutUserRole, AcademicStatus
from .HCMUT_Cooridator import RoomSchedule, Room, RoomStatus, RoomType
from .HCMUT_Library import ResourceType, LibraryResource, FileType
from .HCMUT_SSO import SSOUser
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .base import Base
from .HCMUT_API import HCMUT_API

DATABASE_URL = "sqlite:///./app/hcmut_database/hcmut.db"
engine = create_engine(DATABASE_URL, echo=False)
hcmut_session = sessionmaker(autocommit=False, autoflush=False, expire_on_commit=False, bind=engine)
hcmut_api = HCMUT_API(hcmut_session)
__all__ = [
    "User",
    "HcmutUserRole",
    "AcademicStatus",
    "Student",
    "Staff",
    "RoomSchedule",
    "Room",
    "RoomStatus",
    "RoomType",
    "ResourceType",
    "LibraryResource",
    "FileType",
    "SSOUser",
    "HCMUT_API",
    "hcmut_api",
    "Base",
    "hcmut_session",
]