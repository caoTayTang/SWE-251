from .user import MututorUser, UserRole, Base
from .course import Course, CourseStatus, CourseFormat, Subject, Level, CourseSession, CourseResource
from .enrollment import Enrollment, EnrollmentStatus
from .feedback import Feedback, SessionEvaluation
from .notification import Notification, NotificationType
from .record import MeetingRecord, MeetingRecordStatus
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///muchat.db"
engine = create_engine(DATABASE_URL, echo=False)
mututor_session = sessionmaker(autocommit=False, autoflush=False, bind=engine)


__all__ = [
    "MututorUser",
    "UserRole",
    "Course",
    "CourseStatus",
    "CourseFormat",
    "Subject",
    "Level",
    "CourseSession",
    "CourseResource",
    "Enrollment",
    "EnrollmentStatus",
    "Feedback",
    "SessionEvaluation",
    "Notification",
    "NotificationType",
    "MeetingRecord",
    "MeetingRecordStatus",
    "mututor_session"
]