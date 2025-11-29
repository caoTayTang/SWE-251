from models import*
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from datetime import datetime, time, date, timedelta

def seed_user(engine, db):
    Base.metadata.drop_all(bind=engine, tables=[
        MututorUser.__table__,])
    Base.metadata.create_all(bind=engine, tables=[
        MututorUser.__table__,])

    mock_users = [
        {"username": "a.nguyen21", "role": UserRole.TUTOR, "id": "2210001"},
        {"username": "c.levan", "role": UserRole.TUTOR, "id": "1235"},
        {"username": "thinh.vovan", "role": UserRole.TUTOR, "id": "2313318"},
        {"username": "d.phamthi", "role": UserRole.ADMIN, "id": "0102"},
        {"username": "dat.pham2005", "role": UserRole.TUTOR, "id": "2310687"},
        {"username": "dai.lechi", "role": UserRole.TUTOR, "id": "2310621"},
        {"username": "huy.nguyen2504", "role": UserRole.TUTOR, "id": "2311209"},
        {"username": "thuan.luong1808", "role": UserRole.TUTOR, "id": "2313348"},
    ]

    print(f"--- Populating '{DATABASE_URL}' with mock data ---")

    try:
        for u in mock_users:
            existing = db.query(MututorUser).filter_by(username=u["username"]).first()
            if existing:
                print(f"User '{u['username']}' already exists, skipping.")
                continue

            new_user = MututorUser(**u)
            db.add(new_user)
            print(f"Added: {new_user}")

        db.commit()
        print("\n--- Data committed successfully ---")

    except Exception as e:
        db.rollback()
        print(f"Error: {e}")

    finally:
        db.close()
        print("\n--- Database session closed ---")

def seed_notification(engine, db):
    Base.metadata.drop_all(bind=engine, tables=[
        Notification.__table__,])
    Base.metadata.create_all(bind=engine, tables=[
        Notification.__table__,])
    
    print("Seeding data...")

    try:
        print("Seeding Notifications...")

        # Using student IDs from seed_hcmut.py
        TUTEE_ID_1 = '2310001'  # Phạm Văn G
        TUTEE_ID_2 = '2310003'  # Hoàng Văn E
        TUTOR_ID_1 = '2313348'  # Lương Minh Thuận
        TUTOR_ID_2 = '2210001'  # Nguyễn Văn A (also tutor)
        now = datetime.utcnow()

        notifications_data = [
            {
                "id": 1,
                "user_id": TUTEE_ID_2,
                "type": NotificationType.SESSION_REMINDER,
                "title": "Nhắc nhở sự kiện",
                "content": "Khóa học Kinh tế lượng sắp bắt đầu",
                "is_read": False,
                "related_id": 1, 
                "created_at": now - timedelta(hours=2) 
            },
            {
                "id": 2,
                "user_id": TUTEE_ID_1,
                "type": NotificationType.ENROLLMENT_SUCCESS,
                "title": "Đăng ký thành công",
                "content": "Bạn đã được thêm vào lớp Lập trình C++",
                "is_read": False, 
                "related_id": 2, 
                "created_at": now - timedelta(days=1)
            },
            {
                "id": 5,
                "user_id": TUTOR_ID_2,
                "type": NotificationType.ENROLLMENT_SUCCESS,
                "title": "Sinh viên mới đăng ký",
                "content": "Có 2 sinh viên mới đăng ký khóa học Kinh tế lượng",
                "is_read": False,
                "related_id": 1,
                "created_at": now - timedelta(hours=3)
            },
            {
                "id": 6,
                "user_id": TUTEE_ID_1,
                "type": NotificationType.SCHEDULE_CHANGE,
                "title": "Cập nhật khóa học",
                "content": "Nội dung khóa học đã được cập nhật với tài liệu mới",
                "is_read": True,
                "related_id": 1,
                "created_at": now - timedelta(days=5)
            },
        ]

        for data in notifications_data:
            notification = db.query(Notification).filter_by(id=data['id']).first()
            if not notification:
                db.add(Notification(**data))
                print(f"Added Notification: id={data['id']} (User: {data['user_id']}, Title: {data['title']})")
        
        db.commit()
        print("Committed Notifications.")
    except Exception as e:
        print(f"\n--- An error occurred during seeding ---")
        print(e)
        db.rollback()
    finally:
        db.close()
        print("Database session closed.")

def seed_course(engine,db):
    Base.metadata.drop_all(bind=engine, tables=[
        Course.__table__,
        CourseSession.__table__,
        CourseResource.__table__
    ])

    Base.metadata.create_all(bind=engine, tables=[
        Course.__table__,
        CourseSession.__table__,
        CourseResource.__table__
    ])

    print("Seeding Courses and Sessions...")
    try: 
        # Course 1 - Tutor: 2210001 (Nguyễn Văn A)
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
            db.add_all([
                CourseSession(session_number=1, course=course1, session_date=date(2025, 11, 27), start_time=time(18, 0), end_time=time(20, 0), location="https://meet.google.com/toi-yeu-mu", format=CourseFormat.ONLINE),
                CourseSession(session_number=2, course=course1, session_date=date(2025, 12, 4), start_time=time(18, 0), end_time=time(20, 0), location="H1-201", format=CourseFormat.OFFLINE),
                CourseResource(course_id=1,resource_id=3),
                CourseResource(course_id=1,resource_id=4)
            ])
            print("Added Course: Kinh tế lượng for noob")

        # Course 2 - Tutor: 1235 (Lê Văn C)
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
                CourseSession(session_number=2, course=course2, session_date=date(2025, 11, 18), start_time=time(19, 0), end_time=time(21, 0), location="B4-305", format=CourseFormat.OFFLINE),
                CourseResource(course_id=2,resource_id=1),
                CourseResource(course_id=2,resource_id=2)
            ])
            print("Added Course: Lập trình C++")

        # Course 3 - Tutor: 2313318 (Võ Văn Thịnh)
        course3 = db.query(Course).filter_by(id=3).first()
        if not course3:
            course3 = Course(
                id=3, tutor_id="2313318", subject_id=101, level=Level.INTERMEDIATE,
                title="Giải tích 1 Nâng cao",
                description="Khóa học giải tích 1 cho các sinh viên muốn nâng cao kỹ năng",
                status=CourseStatus.OPEN, max_students=25,
                created_at=datetime.fromisoformat("2025-10-15T09:00:00Z")
            )
            db.add(course3)
            db.add_all([
                CourseSession(session_number=1, course=course3, session_date=date(2025, 11, 12), start_time=time(10, 0), end_time=time(12, 0), location="B1-202", format=CourseFormat.OFFLINE),
                CourseSession(session_number=2, course=course3, session_date=date(2025, 11, 26), start_time=time(10, 0), end_time=time(12, 0), location="https://meet.google.com/giai-tich", format=CourseFormat.ONLINE),
                CourseResource(course_id=3,resource_id=3),
            ])
            print("Added Course: Giải tích 1 Nâng cao")

        # Course 4 - Tutor: 2310687 (Phạm Lê Tiến Đạt)
        course4 = db.query(Course).filter_by(id=4).first()
        if not course4:
            course4 = Course(
                id=4, tutor_id="2310687", subject_id=103, level=Level.BEGINNER,
                title="Vật lý Đại cương",
                description="Khóa học cơ bản về vật lý đại cương",
                status=CourseStatus.OPEN, max_students=30,
                created_at=datetime.fromisoformat("2025-09-01T14:00:00Z")
            )
            db.add(course4)
            db.add_all([
                CourseSession(session_number=1, course=course4, session_date=date(2025, 11, 10), start_time=time(14, 0), end_time=time(16, 0), location="C5-301", format=CourseFormat.OFFLINE),
                CourseSession(session_number=2, course=course4, session_date=date(2025, 11, 17), start_time=time(14, 0), end_time=time(16, 0), location="C5-301", format=CourseFormat.OFFLINE),
                CourseResource(course_id=4,resource_id=4),
            ])
            print("Added Course: Vật lý Đại cương")

        # Course 5 - Tutor: 2310621 (Lê Chí Đại)
        course5 = db.query(Course).filter_by(id=5).first()
        if not course5:
            course5 = Course(
                id=5, tutor_id="2310621", subject_id=104, level=Level.ADVANCED,
                title="Triết học Phương Đông",
                description="Khóa học về các tư tưởng triết học phương đông cổ điển",
                status=CourseStatus.OPEN, max_students=20,
                created_at=datetime.fromisoformat("2025-10-10T11:00:00Z")
            )
            db.add(course5)
            db.add_all([
                CourseSession(session_number=1, course=course5, session_date=date(2025, 11, 14), start_time=time(15, 0), end_time=time(17, 0), location="H2-201", format=CourseFormat.OFFLINE),
                CourseSession(session_number=2, course=course5, session_date=date(2025, 11, 21), start_time=time(15, 0), end_time=time(17, 0), location="https://meet.google.com/triet-hoc", format=CourseFormat.ONLINE),
                CourseResource(course_id=5,resource_id=1),
            ])
            print("Added Course: Triết học Phương Đông")

        # Course 6 - Tutor: 2313348 (Lương Minh Thuận)
        course6 = db.query(Course).filter_by(id=6).first()
        if not course6:
            course6 = Course(
                id=6, tutor_id="2313348", subject_id=666, level=Level.ADVANCED,
                title="Học với Abe",
                description="Cam on vi da den",
                status=CourseStatus.OPEN, max_students=20,
                created_at=datetime.fromisoformat("2025-10-10T11:00:00Z")
            )
            db.add(course6)
            db.add_all([
                CourseSession(session_number=1, course=course6, session_date=date(2025, 11, 14), start_time=time(15, 0), end_time=time(17, 0), location="H1-205", format=CourseFormat.OFFLINE),
                CourseSession(session_number=2, course=course6, session_date=date(2025, 11, 21), start_time=time(15, 0), end_time=time(17, 0), location="C6-202", format=CourseFormat.OFFLINE),
            ])
            print("Added Course: Học với Abe")
    
        db.commit()
        print("Committed Courses and Sessions.")
    except Exception as e:
        print(f"\n--- An error occurred during seeding ---")
        print(e)
        db.rollback()
    finally:
        db.close()
        print("Database session closed.")

def seed_subject(engine, db):
    Base.metadata.drop_all(bind=engine, tables=[
        Subject.__table__,
    ])

    Base.metadata.create_all(bind=engine, tables=[
        Subject.__table__,
    ])

    try:
        print("Seeding Subjects...")
        subjects_data = [
            { "id": 101, "name": "Toán cao cấp" },
            { "id": 102, "name": "Lập trình" },
            { "id": 103, "name": "Vật lý" },
            { "id": 104, "name": "Triết học" },
            { "id": 105, "name": "Hóa học" },
            { "id": 106, "name": "Sinh học" },
            { "id": 107, "name": "Tiếng Anh" },
            { "id": 666, "name": "7 day lên cao thủ" },
            { "id": 336, "name": "Seminar"},
            { "id": 366, "name": "Miscellaneous"}
        ]
        for sub_data in subjects_data:
            if not db.query(Subject).filter_by(id=sub_data['id']).first():
                db.add(Subject(**sub_data))
        db.commit()
        print("Committed Subjects.")
    except Exception as e:
        print(f"\n--- An error occurred during seeding ---")
        print(e)
        db.rollback()
    finally:
        db.close()
        print("Database session closed.")

def seed_enrollment(engine,db):
    Base.metadata.drop_all(bind=engine, tables=[
        Enrollment.__table__,
    ])

    Base.metadata.create_all(bind=engine, tables=[
        Enrollment.__table__,
    ])
    try:
        print("Seeding Enrollments...")
        # Using student IDs from seed_hcmut.py
        TUTEE_ID_1 = "2310001"  # Phạm Văn G
        TUTEE_ID_2 = "2310003"  # Hoàng Văn E
        TUTEE_ID_3 = "2313348"
        enrollments_data = [
            { "id": 1, "tuteeId": TUTEE_ID_1, "courseId": 1, "enrolledAt": "2025-10-02T15:00:00Z" },
            { "id": 2, "tuteeId": TUTEE_ID_1, "courseId": 2, "enrolledAt": "2025-10-03T16:00:00Z" },
            { "id": 3, "tuteeId": TUTEE_ID_1, "courseId": 3, "enrolledAt": "2025-10-04T09:00:00Z" },
            { "id": 4, "tuteeId": TUTEE_ID_2, "courseId": 2, "enrolledAt": "2025-10-05T10:00:00Z" },
            { "id": 5, "tuteeId": TUTEE_ID_2, "courseId": 4, "enrolledAt": "2025-10-06T14:00:00Z" },
            { "id": 6, "tuteeId": TUTEE_ID_1, "courseId": 5, "enrolledAt": "2025-10-07T11:00:00Z" },
            { "id": 7, "tuteeId": TUTEE_ID_3, "courseId": 1, "enrolledAt": "2025-10-02T15:00:00Z" },
            { "id": 8, "tuteeId": TUTEE_ID_3, "courseId": 2, "enrolledAt": "2025-10-03T16:00:00Z" },
            { "id": 9, "tuteeId": TUTEE_ID_3, "courseId": 3, "enrolledAt": "2025-10-04T09:00:00Z" },
        ]
        for data in enrollments_data:
            if not db.query(Enrollment).filter_by(id=data['id']).first():
                if db.query(Course).filter_by(id=data['courseId']).first():
                    db.add(Enrollment(
                        id=data['id'], tutee_id=data['tuteeId'], course_id=data['courseId'],
                        enrollment_date=datetime.fromisoformat(data['enrolledAt']),
                        status=EnrollmentStatus.ENROLLED
                    ))
                    print(f"Added Enrollment: id={data['id']}")
        db.commit()
        print("Committed Enrollments.")
    except Exception as e:
        print(f"\n--- An error occurred during seeding ---")
        print(e)
        db.rollback()
    finally:
        db.close()
        print("Database session closed.")

def seed_feeback_eval(engine,db):
    Base.metadata.drop_all(bind=engine, tables=[
        Feedback.__table__,
        SessionEvaluation.__table__,
    ])

    Base.metadata.create_all(bind=engine, tables=[
        Feedback.__table__,
        SessionEvaluation.__table__,
    ])
    # Using correct IDs from seed_hcmut.py
    TUTEE_ID_1 = "2310001"  # Phạm Văn G
    TUTEE_ID_2 = "2310003"  # Hoàng Văn E
    TUTOR_ID_1 = "2210001"  # Nguyễn Văn A
    print("Seeding Feedbacks...")
    try:
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
                "is_anonymous": False
            },
            {
                "id": 3, "user_id": TUTOR_ID_1, 
                "topic": "Yêu cầu tính năng mới",
                "content": "Nên có tính năng chat realtime với giáo viên.",
                "is_anonymous": True
            },
            {
                "id": 4, "user_id": TUTEE_ID_1,
                "topic": "Khác",
                "content": "Làm thế nào để xem lại các buổi học đã qua?",
                "is_anonymous": False
            },
            {
                "id": 5, "user_id": TUTEE_ID_2,
                "topic": "Góp ý về chất lượng giáo dục",
                "content": "Thầy giảng dạy rất tốt nhưng nên có thêm bài tập thực hành.",
                "is_anonymous": False
            },
            {
                "id": 6, "user_id": TUTEE_ID_2,
                "topic": "Báo lỗi hệ thống",
                "content": "Tải tài liệu bị bỏ lỡ một số file quan trọng.",
                "is_anonymous": True
            },
        ]
        
        for data in feedback_data:
            if not db.query(Feedback).filter_by(id=data['id']).first():
                db.add(Feedback(**data))
                print(f"Added Feedback: id={data['id']} (Topic: {data['topic']})")
        
        db.commit()
        print("Committed Feedbacks.")

        print("Seeding Session Evaluations...")

        evaluation_data = [
            {"id": 1, "course_id": 1, "session_number": 1, "enrollment_id": 1, "rating": 5, "comment": "Buổi học rất tuyệt!"},
            {"id": 2, "course_id": 2, "session_number": 1, "enrollment_id": 2, "rating": 4, "comment": "Tốt nhưng có thể chi tiết hơn"},
            {"id": 3, "course_id": 1, "session_number": 2, "enrollment_id": 4, "rating": 5, "comment": "Xuất sắc!"},
            {"id": 4, "course_id": 3, "session_number": 1, "enrollment_id": 3, "rating": 4, "comment": "Hữu ích và dễ hiểu"},
        ]

        for data in evaluation_data:
            if not db.query(SessionEvaluation).filter_by(id=data['id']).first():
                session = db.query(CourseSession).filter_by(
                    course_id=data['course_id'], 
                    session_number=data['session_number']
                ).first()
                
                if session:
                    db.add(SessionEvaluation(
                        id=data['id'],
                        session_id=session.id,
                        enrollment_id=data['enrollment_id'],
                        rating=data['rating'],
                        comment=data['comment']
                    ))
                    print("Added SessionEvaluation: id={}".format(data['id']))
        
        db.commit()
        print("Committed Session Evaluations.")
    except Exception as e:
        print(f"\n--- An error occurred during seeding ---")
        print(e)
        db.rollback()
    finally:
        db.close()
        print("Database session closed.")

def seed_record(engine, db):
    Base.metadata.drop_all(bind=engine, tables=[
        MeetingRecord.__table__ ,
    ])

    Base.metadata.create_all(bind=engine, tables=[
        MeetingRecord.__table__,
    ])
    try:
        print("Seeding Meeting Record...")
        
        meeting_data = [
            {
                "id": 1,
                "course_id": 1,
                "tutor_id": "2210001",
                "attendees": "Tutor (2210001), 5 students",
                "discussion_points": "Reviewed chapter 3 quiz results.",
            },
            {
                "id": 2,
                "course_id": 2,
                "tutor_id": "1235",
                "attendees": "Tutor (1235), 8 students",
                "discussion_points": "Discussed C++ pointer concepts and debugging techniques.",
            },
            {
                "id": 3,
                "course_id": 3,
                "tutor_id": "2313318",
                "attendees": "Tutor (2313318), 10 students",
                "discussion_points": "Solved integral problems and discussed applications.",
            },
            {
                "id": 4,
                "course_id": 4,
                "tutor_id": "2310687",
                "attendees": "Tutor (2310687), 6 students",
                "discussion_points": "Lab session on motion and forces experiments.",
            },
        ]

        for data in meeting_data:
            record = db.query(MeetingRecord).filter_by(id=data['id']).first()
            if not record:
                course = db.query(Course).filter_by(id=data['course_id']).first()
                tutor = db.query(MututorUser).filter_by(id=data['tutor_id']).first()
                
                if course and tutor:
                    db.add(MeetingRecord(
                        id=data['id'],
                        course_id=course.id,
                        tutor_id=tutor.id,
                        attendees=data['attendees'],
                        discussion_points=data['discussion_points'],
                    ))
                    print(f"Added MeetingRecord: id={data['id']}")
        
        db.commit()
        print("Committed sample MeetingRecords.")

    except Exception as e:
        print(f"\n--- An error occurred during seeding ---")
        print(e)
        db.rollback()
    finally:
        db.close()
        print("Database session closed.")

def seed_session(engine, db):
    Base.metadata.drop_all(bind=engine, tables=[
        MuSession.__table__,])
    Base.metadata.create_all(bind=engine, tables=[
        MuSession.__table__,])

def seed_all(engine, db):
    seed_user(engine,db)
    seed_subject(engine,db)
    seed_course(engine,db)
    seed_enrollment(engine,db)
    seed_feeback_eval(engine,db)
    seed_record(engine,db)
    seed_notification(engine,db)

if __name__ == "__main__":
    DATABASE_URL = "sqlite:///./app/models/mututor.db"

    engine = create_engine(DATABASE_URL, echo=False)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    print("Seeding data...")
    seed_all(engine, db)