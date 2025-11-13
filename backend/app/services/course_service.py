from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, date, time
from ..models.course import Course, CourseStatus, Level, CourseSession, Subject, CourseFormat


class CourseService:
    def __init__(self, db: Session):
        self.db = db

    def create(self, title: str, tutor_id: str, subject_id: int, max_students: int,
               description: Optional[str] = None, cover_image_url: Optional[str] = None,
               level: Level = Level.BEGINNER, status: CourseStatus = CourseStatus.PENDING) -> Course:
        course = Course(
            title=title,
            description=description,
            cover_image_url=cover_image_url,
            tutor_id=tutor_id,
            subject_id=subject_id,
            level=level,
            max_students=max_students,
            status=status
        )
        self.db.add(course)
        self.db.commit()
        self.db.refresh(course)
        return course

    def get_by_id(self, course_id: int) -> Optional[Course]:
        return self.db.query(Course).filter(Course.id == course_id).first()

    def get_all(self, skip: int = 0, limit: int = 100) -> List[Course]:
        return self.db.query(Course).offset(skip).limit(limit).all()

    def get_by_tutor(self, tutor_id: str) -> List[Course]:
        return self.db.query(Course).filter(Course.tutor_id == tutor_id).all()

    def get_by_subject(self, subject_id: int) -> List[Course]:
        return self.db.query(Course).filter(Course.subject_id == subject_id).all()

    def get_by_status(self, status: CourseStatus) -> List[Course]:
        return self.db.query(Course).filter(Course.status == status).all()

    def get_by_level(self, level: Level) -> List[Course]:
        return self.db.query(Course).filter(Course.level == level).all()

    def update(self, course_id: int, title: Optional[str] = None, description: Optional[str] = None,
               cover_image_url: Optional[str] = None, level: Optional[Level] = None,
               max_students: Optional[int] = None, status: Optional[CourseStatus] = None) -> Optional[Course]:
        course = self.get_by_id(course_id)
        if not course:
            return None
        
        if title is not None:
            course.title = title
        if description is not None:
            course.description = description
        if cover_image_url is not None:
            course.cover_image_url = cover_image_url
        if level is not None:
            course.level = level
        if max_students is not None:
            course.max_students = max_students
        if status is not None:
            course.status = status
        
        course.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(course)
        return course

    def delete(self, course_id: int) -> bool:
        course = self.get_by_id(course_id)
        if not course:
            return False
        
        self.db.delete(course)
        self.db.commit()
        return True
    
class CourseSessionService:
    def __init__(self, db: Session):
        self.db = db

    def create(self, course_id: int, session_number: int, session_date: date,
               start_time: time, end_time: time, format: CourseFormat = CourseFormat.OFFLINE,
               location: Optional[str] = None) -> CourseSession:
        session = CourseSession(
            course_id=course_id,
            session_number=session_number,
            session_date=session_date,
            start_time=start_time,
            end_time=end_time,
            format=format,
            location=location
        )
        self.db.add(session)
        self.db.commit()
        self.db.refresh(session)
        return session

    def get_by_id(self, session_id: int) -> Optional[CourseSession]:
        return self.db.query(CourseSession).filter(CourseSession.id == session_id).first()

    def get_all(self, skip: int = 0, limit: int = 100) -> List[CourseSession]:
        return self.db.query(CourseSession).offset(skip).limit(limit).all()

    def get_by_course(self, course_id: int) -> List[CourseSession]:
        return self.db.query(CourseSession).filter(CourseSession.course_id == course_id).order_by(CourseSession.session_number).all()

    def get_by_date(self, session_date: date) -> List[CourseSession]:
        return self.db.query(CourseSession).filter(CourseSession.session_date == session_date).all()

    def get_by_format(self, format: CourseFormat) -> List[CourseSession]:
        return self.db.query(CourseSession).filter(CourseSession.format == format).all()

    def update(self, session_id: int, session_number: Optional[int] = None,
               session_date: Optional[date] = None, start_time: Optional[time] = None,
               end_time: Optional[time] = None, format: Optional[CourseFormat] = None,
               location: Optional[str] = None) -> Optional[CourseSession]:
        session = self.get_by_id(session_id)
        if not session:
            return None
        
        if session_number is not None:
            session.session_number = session_number
        if session_date is not None:
            session.session_date = session_date
        if start_time is not None:
            session.start_time = start_time
        if end_time is not None:
            session.end_time = end_time
        if format is not None:
            session.format = format
        if location is not None:
            session.location = location
        
        self.db.commit()
        self.db.refresh(session)
        return session

    def delete(self, session_id: int) -> bool:
        session = self.get_by_id(session_id)
        if not session:
            return False
        
        self.db.delete(session)
        self.db.commit()
        return True
    
class SubjectService:
    def __init__(self, db: Session):
        self.db = db

    def create(self, id: int, name: str) -> Subject:
        subject = Subject(id=id, name=name)
        self.db.add(subject)
        self.db.commit()
        self.db.refresh(subject)
        return subject

    def get_by_id(self, subject_id: int) -> Optional[Subject]:
        return self.db.query(Subject).filter(Subject.id == subject_id).first()

    def get_by_name(self, name: str) -> Optional[Subject]:
        return self.db.query(Subject).filter(Subject.name == name).first()

    def get_all(self, skip: int = 0, limit: int = 100) -> List[Subject]:
        return self.db.query(Subject).offset(skip).limit(limit).all()

    def update(self, subject_id: int, name: Optional[str] = None) -> Optional[Subject]:
        subject = self.get_by_id(subject_id)
        if not subject:
            return None
        
        if name is not None:
            subject.name = name
        
        self.db.commit()
        self.db.refresh(subject)
        return subject

    def delete(self, subject_id: int) -> bool:
        subject = self.get_by_id(subject_id)
        if not subject:
            return False
        
        self.db.delete(subject)
        self.db.commit()
        return True