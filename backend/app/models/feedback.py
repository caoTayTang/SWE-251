# <filename>feedback.py</filename>
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, Enum, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
# from ..database import Base # OLD - Inconsistent
from user import Base # FIXED: Import Base from the same place as course.py

class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    

    #user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    user_id = Column(String, nullable=False, index=True)
    topic = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    is_anonymous = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships

    #user = relationship("MututorUser", back_populates="feedbacks_given", foreign_keys=[user_id])

    def __repr__(self):
        return f"<Feedback(id={self.id}, topic={self.topic}, status={self.status})>"


class SessionEvaluation(Base):
    __tablename__ = "session_evaluations"

    id = Column(Integer, primary_key=True, index=True)
    
    # This FK now correctly points to the new 'id' in CourseSession
    session_id = Column(Integer, ForeignKey("course_sessions.id"), nullable=False)  
    enrollment_id = Column(Integer, ForeignKey("enrollments.id"), nullable=False)
    rating = Column(Integer, nullable=False)  # 1-5 scale
    comment = Column(Text, nullable=True)
    is_anonymous = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    session = relationship("CourseSession", back_populates="evaluations")
    enrollment = relationship("Enrollment", back_populates="evaluations")

    def __repr__(self):
        return f"<SessionEvaluation(id={self.id}, session_id={self.session_id}, rating={self.rating})>"