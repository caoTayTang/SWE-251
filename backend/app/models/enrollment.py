# <filename>enrollment.py</filename>
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
# from ..database import Base # OLD
from user import Base # FIXED: Import Base from the same place as course.py

class EnrollmentStatus(str, enum.Enum):
    ENROLLED = "enrolled"
    COMPLETED = "completed"
    DROPPED = "dropped"

class Enrollment(Base):
    __tablename__ = "enrollments"

    id = Column(Integer, primary_key=True, index=True)
    
    # FIXED: Changed from Integer to String to match the MututorUser.id (String)
    tutee_id = Column(String, nullable=False, index=True)
    
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False, index=True)
    status = Column(Enum(EnrollmentStatus), default=EnrollmentStatus.ENROLLED)
    
    # This column will be populated by 'enrolledAt' from mock data
    enrollment_date = Column(DateTime, default=datetime.utcnow)
    
    drop_reason = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    # This 'User' should be the class name in user.py (e.g., MututorUser)
    course = relationship("Course", back_populates="enrollments")
    evaluations = relationship("SessionEvaluation", back_populates="enrollment", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Enrollment(id={self.id}, tutee_id={self.tutee_id}, course_id={self.course_id})>"