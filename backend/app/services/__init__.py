from sqlalchemy.orm import Session
from .user_service import UserService
from .course_service import CourseService, CourseSessionService, SubjectService
from .enrollment_service import EnrollmentService
from .feedback_service import FeedbackService, SessionEvaluationService
from .notification_service import NotificationService
from .record_service import MeetingRecordService


class ServiceRegistry:
    def __init__(self, db: Session):
        self.db = db
        self.user = UserService(db)
        self.subject = SubjectService(db)
        self.course = CourseService(db)
        self.course_session = CourseSessionService(db)
        self.enrollment = EnrollmentService(db)
        self.feedback = FeedbackService(db)
        self.session_evaluation = SessionEvaluationService(db)
        self.notification = NotificationService(db)
        self.meeting_record = MeetingRecordService(db)


def get_services(db: Session) -> ServiceRegistry:
    return ServiceRegistry(db)


__all__ = [
    "UserService",
    "SubjectService",
    "CourseService",
    "CourseSessionService",
    "EnrollmentService",
    "FeedbackService",
    "SessionEvaluationService",
    "NotificationService",
    "MeetingRecordService",
    "ServiceRegistry",
    "get_services"
]