#Mockup for HCMUT Cooridator
import enum
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Enum, ForeignKey, Date, Time, Text
from sqlalchemy.orm import relationship, sessionmaker
from datetime import datetime, date, time
from .base import Base

class RoomType(str, enum.Enum):
    LECTURE_HALL = "lecture_hall" # Lecture Hall (GDH6)
    STANDARD_ROOM = "standard_room"     # Standard room (H6-301)
    LAB = "lab"     # Lab room (C6-510)
    MEETING_ROOM = "meeting_room"     

class RoomStatus(str, enum.Enum):
    FREE = "free"
    BOOKED = "booked"

class Room(Base):

    __tablename__ = "coordinator_room"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False, index=True) 
    capacity = Column(Integer, nullable=True) 
    room_type = Column(Enum(RoomType), default=RoomType.STANDARD_ROOM)

    schedules = relationship("RoomSchedule", back_populates="room")

    def __repr__(self):
        return (f"<PhongHoc(id={self.id}, ten_phong='{self.name}'")


class RoomSchedule(Base):

    __tablename__ = "coordinator_schedule"
    
    id = Column(Integer, primary_key=True, index=True)

    room_id = Column(Integer, ForeignKey("coordinator_room.id"), nullable=False)
    user_id = Column(String, ForeignKey("datacore_users.id"), nullable=True)  
    
    date = Column(Date, nullable=False, index=True) 
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False) 

    status = Column(Enum(RoomStatus), default=RoomStatus.FREE, index=True)
    
    note = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    room = relationship("Room", back_populates="schedules")
    user = relationship("User")

    def __repr__(self):
        return (f"<LichDatPhong(id={self.id}, phong_id={self.room_id}, "
                f"ngay='{self.date}', trang_thai='{self.status.value}')>")



    