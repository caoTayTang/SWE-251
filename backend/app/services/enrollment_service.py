from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from ..models.enrollment import Enrollment, EnrollmentStatus


class EnrollmentService:
    def __init__(self, db: Session):
        self.db = db

    def create(self, tutee_id: str, course_id: int, 
               status: EnrollmentStatus = EnrollmentStatus.ENROLLED) -> Enrollment:
        enrollment = Enrollment(
            tutee_id=tutee_id,
            course_id=course_id,
            status=status
        )
        self.db.add(enrollment)
        self.db.commit()
        self.db.refresh(enrollment)
        return enrollment

    def get_by_id(self, enrollment_id: int) -> Optional[Enrollment]:
        return self.db.query(Enrollment).filter(Enrollment.id == enrollment_id).first()

    def get_all(self, skip: int = 0, limit: int = 100) -> List[Enrollment]:
        return self.db.query(Enrollment).offset(skip).limit(limit).all()

    def get_by_tutee(self, tutee_id: str) -> List[Enrollment]:
        return self.db.query(Enrollment).filter(Enrollment.tutee_id == tutee_id).all()

    def get_by_course(self, course_id: int) -> List[Enrollment]:
        return self.db.query(Enrollment).filter(Enrollment.course_id == course_id).all()

    def get_by_status(self, status: EnrollmentStatus) -> List[Enrollment]:
        return self.db.query(Enrollment).filter(Enrollment.status == status).all()

    def get_by_tutee_and_course(self, tutee_id: str, course_id: int) -> Optional[Enrollment]:
        return self.db.query(Enrollment).filter(
            Enrollment.tutee_id == tutee_id,
            Enrollment.course_id == course_id
        ).first()

    def update(self, enrollment_id: int, status: Optional[EnrollmentStatus] = None,
               drop_reason: Optional[str] = None) -> Optional[Enrollment]:
        enrollment = self.get_by_id(enrollment_id)
        if not enrollment:
            return None
        
        if status is not None:
            enrollment.status = status
        if drop_reason is not None:
            enrollment.drop_reason = drop_reason
        
        enrollment.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(enrollment)
        return enrollment

    def delete(self, enrollment_id: int) -> bool:
        enrollment = self.get_by_id(enrollment_id)
        if not enrollment:
            return False
        
        self.db.delete(enrollment)
        self.db.commit()
        return True