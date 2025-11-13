from .HCMUT_DATACORE import User, Student, Staff
from .HCMUT_Cooridator import RoomSchedule, Room
from .HCMUT_Library import ResourceType, LibraryResource, FileType
from .HCMUT_SSO import SSOUser
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///hcmut.db"
engine = create_engine(DATABASE_URL, echo=False)
hcmut_session = sessionmaker(autocommit=False, autoflush=False, bind=engine)


__all__ = [
    "User",
    "Student",
    "Staff",
    "RoomSchedule",
    "Room",
    "ResourceType",
    "LibraryResource",
    "FileType",
    "SSOUser",
    "hcmut_session",
]