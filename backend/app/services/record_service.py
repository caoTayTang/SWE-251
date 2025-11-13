from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from ..models.record import MeetingRecord, MeetingRecordStatus


class MeetingRecordService:
    def __init__(self, db: Session):
        self.db = db

    def create(self, course_id: int, tutor_id: str, 
               attendees: Optional[str] = None, discussion_points: Optional[str] = None,
               status: MeetingRecordStatus = MeetingRecordStatus.PENDING) -> MeetingRecord:
        record = MeetingRecord(
            course_id=course_id,
            tutor_id=tutor_id,
            attendees=attendees,
            discussion_points=discussion_points,
            status=status
        )
        self.db.add(record)
        self.db.commit()
        self.db.refresh(record)
        return record

    def get_by_id(self, record_id: int) -> Optional[MeetingRecord]:
        return self.db.query(MeetingRecord).filter(MeetingRecord.id == record_id).first()

    def get_all(self, skip: int = 0, limit: int = 100) -> List[MeetingRecord]:
        return self.db.query(MeetingRecord).offset(skip).limit(limit).all()

    def get_by_course(self, course_id: int) -> List[MeetingRecord]:
        return self.db.query(MeetingRecord).filter(MeetingRecord.course_id == course_id).all()

    def get_by_tutor(self, tutor_id: str) -> List[MeetingRecord]:
        return self.db.query(MeetingRecord).filter(MeetingRecord.tutor_id == tutor_id).all()

    def get_by_status(self, status: MeetingRecordStatus) -> List[MeetingRecord]:
        return self.db.query(MeetingRecord).filter(MeetingRecord.status == status).all()

    def update(self, record_id: int, attendees: Optional[str] = None,
               discussion_points: Optional[str] = None, 
               status: Optional[MeetingRecordStatus] = None) -> Optional[MeetingRecord]:
        record = self.get_by_id(record_id)
        if not record:
            return None
        
        if attendees is not None:
            record.attendees = attendees
        if discussion_points is not None:
            record.discussion_points = discussion_points
        if status is not None:
            record.status = status
        
        record.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(record)
        return record

    def approve(self, record_id: int) -> Optional[MeetingRecord]:
        return self.update(record_id, status=MeetingRecordStatus.APPROVED)

    def reject(self, record_id: int) -> Optional[MeetingRecord]:
        return self.update(record_id, status=MeetingRecordStatus.REJECTED)

    def delete(self, record_id: int) -> bool:
        record = self.get_by_id(record_id)
        if not record:
            return False
        
        self.db.delete(record)
        self.db.commit()
        return True