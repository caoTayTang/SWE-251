from sqlalchemy import Column, Integer, String, DateTime, Boolean, Enum, ForeignKey, Text, Time, Date
from sqlalchemy.orm import relationship
from datetime import datetime, time, date, timedelta
import enum
from user import Base, MututorUser


# --- Enums for Course Status and Format (Kept from original) ---

class CourseStatus(str, enum.Enum):
    PENDING = "pending"   # Course created, not yet open for enrollmenat
    OPEN = "open"       # Open for enrollment (mock: "active")
    ONGOING = "ongoing"   # Course is in progress
    COMPLETED = "completed" # Course has finished
    CANCELLED = "cancelled" # Course was cancelled
    INACTIVE = "inactive" # Added from mock data

class CourseFormat(str, enum.Enum):
    ONLINE = "online"
    OFFLINE = "offline"

# --- New Models based on Mock Data ---

class Subject(Base):
    """
    Model for course subjects (e.g., 'Toán cao cấp', 'Lập trình').
    Corresponds to mockSubjects.
    """
    __tablename__ = "subjects"
    # Using specific ID 101, 102 etc. from mock data
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True, index=True)

    # Relationship
    courses = relationship("Course", back_populates="subject")

    def __repr__(self):
        return f"<Subject(id={self.id}, name={self.name})>"

class Level(str, enum.Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"

# --- Main Course Model (Modified) ---

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    
    cover_image_url = Column(String, nullable=True)
   
    # --- Foreign Keys ---
    # FIXED: Changed Integer to String to match MututorUser.id
    tutor_id = Column(String, ForeignKey("users.id"), nullable=False, index=True) 
    
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False, index=True)
    level = Column(Enum(Level), nullable=False, default=Level.BEGINNER)

    max_students = Column(Integer, nullable=False)
    status = Column(Enum(CourseStatus), default=CourseStatus.PENDING, index=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    
    subject = relationship("Subject", back_populates="courses")
    
    enrollments = relationship("Enrollment", back_populates="course", cascade="all, delete-orphan")
    
    sessions = relationship("CourseSession", back_populates="course", cascade="all, delete-orphan")
    
    meeting_records = relationship("MeetingRecord", back_populates="course")

    def __repr__(self):
        return f"<Course(id={self.id}, title={self.title}, status={self.status})>"



class CourseSession(Base):
    """
    Model for individual recurring sessions of a course.
    Corresponds to the 'schedule' array in the mock data.
    """
    __tablename__ = "course_sessions"

    id = Column(Integer, primary_key=True, index=True) 
    
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False, index=True)
    
    session_number = Column(Integer, nullable=False)
    
    session_date = Column(Date, nullable=False) 
    
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)

    format = Column(Enum(CourseFormat), default=CourseFormat.OFFLINE)
    location = Column(String, nullable=True)  #  class room for offline courses or link for online courses

    # Relationship
    course = relationship("Course", back_populates="sessions")
    evaluations = relationship("SessionEvaluation", back_populates="session", cascade="all, delete-orphan")
    
    def __repr__(self):
        # --- MODIFIED: Updated repr ---
        return f"<CourseSession(course_id={self.course_id}, session_id={self.id}, date={self.session_date})>"



if __name__ == "__main__":
    from sqlalchemy.orm import sessionmaker
    from sqlalchemy import create_engine
    

    from enrollment import Enrollment, EnrollmentStatus
    from notification import Notification, NotificationType # From previous step
    from record import MeetingRecord, MeetingRecordStatus

    from feedback import Feedback, SessionEvaluation


    DATABASE_URL = "sqlite:///muchat.db"
    engine = create_engine(DATABASE_URL, echo=False)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    print("Connecting to database to seed data...")
    print("Dropping old tables...")
    Base.metadata.drop_all(bind=engine, tables=[
        Subject.__table__,
        Course.__table__,
        CourseSession.__table__,
        Enrollment.__table__,
        Feedback.__table__,           
        SessionEvaluation.__table__ ,
        MeetingRecord.__table__
    ])

    print("Recreating tables...")
    Base.metadata.create_all(bind=engine, tables=[
        Subject.__table__,
        Course.__table__,
        CourseSession.__table__,
        Enrollment.__table__,
        Feedback.__table__,          
        SessionEvaluation.__table__,
        MeetingRecord.__table__
    ])
    
    db = SessionLocal()
    
    print("Seeding data...")

    try:
        # --- 1. Seed Subjects ---
        print("Seeding Subjects...")
        subjects_data = [
            { "id": 101, "name": "Toán cao cấp" },
            { "id": 102, "name": "Lập trình" },
            { "id": 103, "name": "Vật lý" },
            { "id": 104, "name": "Triết học" },
            { "id": 666, "name": "7 day lên cao thủ" },
            { "id": 336, "name": "Seminar"},
            { "id": 366, "name": "Miscellaneous"}
        ]
        for sub_data in subjects_data:
            if not db.query(Subject).filter_by(id=sub_data['id']).first():
                db.add(Subject(**sub_data))
        db.commit()
        print("Committed Subjects.")

        # --- 2. Add Courses & Sessions ---
        print("Seeding Courses and Sessions...")
        
        # Course 1
        course1 = db.query(Course).filter_by(id=1).first()
        if not course1:
            course1 = Course(
                id=1, tutor_id="2210001", subject_id=366, level=Level.BEGINNER,
                title="Kinh tế lượng for noob",
                description="Khóa học Kinh tế lượng dành cho sinh viên năm nhất",
                status=CourseStatus.OPEN, max_students=20,
                created_at=datetime.fromisoformat("2025-10-01T10:00:00Z")
            )
            db.add(course1)
            # FIXED: 'id=1' is now 'session_number=1', etc. The 'id' PK is auto-generated.
            db.add_all([
                CourseSession(session_number=1, course=course1, session_date=date(2025, 11, 13), start_time=time(18, 0), end_time=time(20, 0), location="H1-201", format=CourseFormat.OFFLINE),
                CourseSession(session_number=2, course=course1, session_date=date(2025, 11, 20), start_time=time(18, 0), end_time=time(20, 0), location="H1-201", format=CourseFormat.OFFLINE),
                CourseSession(session_number=3, course=course1, session_date=date(2025, 11, 27), start_time=time(18, 0), end_time=time(20, 0), location="https://meet.google.com/toi-yeu-mu", format=CourseFormat.ONLINE),
            ])
            print("Added Course: Kinh tế lượng for noob")

        # Course 2
        course2 = db.query(Course).filter_by(id=2).first()
        if not course2:
            course2 = Course(
                id=2, tutor_id="1235", subject_id=102, level=Level.BEGINNER,
                title="Lập trình C++",
                description="Học lập trình C++ từ cơ bản đến nâng cao",
                status=CourseStatus.OPEN, max_students=15,
                created_at=datetime.fromisoformat("2025-09-20T08:00:00Z")
            )
            db.add(course2)
            db.add_all([
                CourseSession(session_number=1, course=course2, session_date=date(2025, 11, 11), start_time=time(19, 0), end_time=time(21, 0), location="https://meet.google.com/toi-yeu-mu", format=CourseFormat.ONLINE),
                CourseSession(session_number=2, course=course2, session_date=date(2025, 11, 18), start_time=time(19, 0), end_time=time(21, 0), location="B4-Lab1", format=CourseFormat.OFFLINE),
            ])
            print("Added Course: Lập trình C++")
            
        # (Course 3 and 4 omitted for brevity, logic is the same)
        # ...

        db.commit()
        print("Committed Courses and Sessions.")
        
        # --- 3. Add Enrollments ---
        print("Seeding Enrollments...")
        TUTEE_ID_1 = "2010002"
        enrollments_data = [
            { "id": 1, "tuteeId": TUTEE_ID_1, "courseId": 1, "enrolledAt": "2025-10-02T15:00:00Z" },
            { "id": 2, "tuteeId": TUTEE_ID_1, "courseId": 3, "enrolledAt": "2025-10-03T16:00:00Z" },
            { "id": 3, "tuteeId": TUTEE_ID_1, "courseId": 4, "enrolledAt": "2025-10-04T09:00:00Z" },
        ]
        for data in enrollments_data:
            if not db.query(Enrollment).filter_by(id=data['id']).first():
                if db.query(Course).filter_by(id=data['courseId']).first(): # Check course exists
                    db.add(Enrollment(
                        id=data['id'], tutee_id=data['tuteeId'], course_id=data['courseId'],
                        enrollment_date=datetime.fromisoformat(data['enrolledAt']),
                        status=EnrollmentStatus.ENROLLED
                    ))
                    print(f"Added Enrollment: id={data['id']}")
        db.commit()
        print("Committed Enrollments.")


        # --- 5. Add Feedbacks (🔹 NEW SECTION) ---
        print("Seeding Feedbacks...")
        # We create mock feedback data *based on* your topics
        feedback_data = [
            {
                "id": 1, "user_id": TUTEE_ID_1,
                "topic": "Góp ý về nội dung khóa học",
                "content": "Nội dung khóa học Kinh tế lượng (ID: 1) rất hay nhưng cần thêm ví dụ thực tế về R.",
                "is_anonymous": False
            },
            {
                "id": 2, "user_id": TUTEE_ID_1,
                "topic": "Báo lỗi hệ thống",
                "content": "Nút 'Xem chi tiết' ở trang danh sách khóa học bị vỡ giao diện trên điện thoại.",
                
            },
            {
                "id": 3, "user_id": "2210001", # A different user
                "topic": "Yêu cầu tính năng mới",
                "content": "Nên có tính năng chat realtime với giáo viên.",
                "is_anonymous": True
            },
            {
                "id": 4, "user_id": TUTEE_ID_1,
                "topic": "Khác",
                "content": "Làm thế nào để xem lại các buổi học đã qua?",
            }
        ]
        
        for data in feedback_data:
            if not db.query(Feedback).filter_by(id=data['id']).first():
                db.add(Feedback(**data))
                print(f"Added Feedback: id={data['id']} (Topic: {data['topic']})")
        
        db.commit()
        print("Committed Feedbacks.")

        # --- 6. Add Session Evaluations (Optional but good) ---
        print("Seeding Session Evaluations...")
        
        # Find the first session of course 1
        session_to_eval = db.query(CourseSession).filter_by(course_id=1, session_number=1).first()
        # Find the first enrollment
        enrollment_to_eval = db.query(Enrollment).filter_by(id=1).first()

        if session_to_eval and enrollment_to_eval:
            eval1 = db.query(SessionEvaluation).filter_by(id=1).first()
            if not eval1:
                db.add(SessionEvaluation(
                    id=1,
                    session_id=session_to_eval.id,
                    enrollment_id=enrollment_to_eval.id,
                    rating=5,
                    comment="Buổi học rất tuyệt!"
                ))
                print("Added SessionEvaluation: id=1")
            db.commit()
            print("Committed Session Evaluations.")

        print("Seeding Meeting Record...")
        
        # Find the course and tutor
        course1 = db.query(Course).filter_by(id=1).first()
        tutor1 = db.query(MututorUser).filter_by(id="2210001").first()
        
        if course1 and tutor1:
            record1 = db.query(MeetingRecord).filter_by(id=1).first()
            if not record1:
                db.add(MeetingRecord(
                    id=1, 
                    course_id=course1.id,
                    tutor_id=tutor1.id,
                    attendees="Tutor (2210001), 5 students",
                    discussion_points="Reviewed chapter 3 quiz results.",
                    status=MeetingRecordStatus.PENDING
                ))
                db.commit()
                print("Committed sample MeetingRecord.")
        
        print("\n--- Successfully seeded database! ---")

    except Exception as e:
        print(f"\n--- An error occurred during seeding ---")
        print(e)
        db.rollback()
    finally:
        db.close()
        print("Database session closed.")