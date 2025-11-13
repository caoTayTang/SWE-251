# <filename>notification.py</filename>
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, Enum, Text
from sqlalchemy.orm import relationship
from datetime import datetime, time, date, timedelta
import enum

from .user import Base # FIXED: Import Base from the same place as course.py

class NotificationType(str, enum.Enum):
    SESSION_REMINDER = "session_reminder"
    SCHEDULE_CHANGE = "schedule_change"
    ENROLLMENT_SUCCESS = "enrollment_success"
    ENROLLMENT_CANCELLED = "enrollment_cancelled"
    FEEDBACK_REQUEST = "feedback_request"
    SYSTEM_ANNOUNCEMENT = "system_announcement"

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    
    # FIXED: Changed from Integer to String to match the MututorUser.id
    user_id = Column(String, nullable=False, index=True)  #target user
    
    type = Column(Enum(NotificationType), nullable=False)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    related_id = Column(Integer, nullable=True)  # ID of related course.
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships

    #user = relationship("MututorUser", back_populates="notifications") 

    def __repr__(self):
        return f"<Notification(id={self.id}, type={self.type}, is_read={self.is_read})>"
    
if __name__ == "__main__":
    # --- Imports for standalone seeding ---
    from sqlalchemy.orm import sessionmaker
    from sqlalchemy import create_engine
    


    # Define database URL and engine, consistent with user.py
    DATABASE_URL = "sqlite:///muchat.db"
    engine = create_engine(DATABASE_URL, echo=False)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    # --- IMPORTANT ---
    # We imported MututorUser at the top.

    print("Connecting to database to seed data...")
    # Create all tables KNOWN TO Base.
    print("Dropping old tables...")
    Base.metadata.drop_all(bind=engine, tables=[
        Notification.__table__ # 🔹 ADDED
    ])

    # Recreate them
    print("Recreating tables...")
    Base.metadata.create_all(bind=engine, tables=[
        Notification.__table__ # 🔹 ADDED
    ])
    
    db = SessionLocal()
    
    print("Seeding data...")

    try:
        print("Seeding Notifications...")
        
        # We will assign all mock notifications to TUTEE_ID_1 for this example
        TUTEE_ID_1 = '2010002'
        TUTOR_ID_1 = '2310003'
        now = datetime.utcnow()

        notifications_data = [
            {
                "id": 1,
                "user_id": TUTEE_ID_1,
                "type": NotificationType.SESSION_REMINDER,
                "title": "Nhắc nhở sự kiện",
                "content": "Khóa học Kinh tế lượng sắp bắt đầu",
                "is_read": False, # Mock 'unread: true'
                "related_id": 1, # Course ID
                "created_at": now - timedelta(hours=2) # Mock '2 giờ trước'
            },
            {
                "id": 2,
                "user_id": TUTEE_ID_1,
                "type": NotificationType.ENROLLMENT_SUCCESS,
                "title": "Đăng ký thành công",
                "content": "Bạn đã được thêm vào lớp Lập trình C++",
                "is_read": False, # Mock 'unread: true'
                "related_id": 2, # Course ID
                "created_at": now - timedelta(days=1) # Mock '1 ngày trước'
            },
            {
                "id": 3,
                "user_id": TUTOR_ID_1,
                "type": NotificationType.FEEDBACK_REQUEST,
                "title": "Có feedback",
                "content": "Thầy đẹp trai quá",
                "is_read": True, 
                "related_id": None,
                "created_at": now - timedelta(days=3) # Mock '3 ngày trước'
            }
        ]

        for data in notifications_data:
            notification = db.query(Notification).filter_by(id=data['id']).first()
            if not notification:
                db.add(Notification(**data))
                print(f"Added Notification: id={data['id']} (User: {data['user_id']}, Title: {data['title']})")
        
        db.commit()
        print("Committed Notifications.")
        # --- End New Section ---

        print("\n--- Successfully seeded database! ---")

    except Exception as e:
        print(f"\n--- An error occurred during seeding ---")
        print(e)
        db.rollback()
    finally:
        db.close()
        print("Database session closed.")