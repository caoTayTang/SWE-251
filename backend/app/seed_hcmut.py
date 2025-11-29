from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from datetime import datetime, time, date, timedelta
from hcmut_database import*

def seed_sso(engine, db: Session):
    Base.metadata.drop_all(bind=engine, tables=[
        SSOUser.__table__,])
    Base.metadata.create_all(bind=engine, tables=[
        SSOUser.__table__,])
    
    sample_emails = [
        "a.nguyen21@hcmut.edu.vn",
        "b.tran20@hcmut.edu.vn",
        "c.levan@hcmut.edu.vn",
        "d.phamthi@hcmut.edu.vn",
        "e.hoang21@hcmut.edu.vn",
        "f.vu22@hcmut.edu.vn",
        "g.pham23@hcmut.edu.vn",
        "h.duong21@hcmut.edu.vn",
        "i.hoang22@hcmut.edu.vn",
        "thuan.luong1808@gmail.com",
        "dai.lechi@hcmut.edu.vn",
        "huy.nguyen2504@hcmut.edu.vn",
        "thinh.vovan@hcmut.edu.vn",
        "dat.pham2005@hcmut.edu.vn"
    ]

    DEFAULT_PASS = "toi_yeu_mu"

    print(f"Start seed")
    
    try:

        for email in sample_emails:
            username = email.split('@')[0]
            

            existing_user = db.query(SSOUser).filter(SSOUser.username == username).first()
            
            if not existing_user:
                new_sso_user = SSOUser(username=username)
                new_sso_user.set_password(DEFAULT_PASS)
                
                db.add(new_sso_user)
                print(f"Đang tạo SSO User: {username}")
            else:
                print(f"SSO User đã tồn tại: {username}")

        db.commit()

    except Exception as e:
        db.rollback()
    finally:
        db.close()
        print("\n--- Đã đóng phiên CSDL (hcmut.db) ---")

def seed_lib(engine, db:Session):
    Base.metadata.drop_all(bind=engine, tables=[
        LibraryResource.__table__,])
    Base.metadata.create_all(bind=engine, tables=[
        LibraryResource.__table__,])
    
    sample_resources = [
        # Materials
        {"id": 1, "name": "Giải tích 1 - Chương 1", "resource_type": ResourceType.MATERIAL, "file_type": FileType.PDF, "file_size": "2.1 MB", "uploader_id": "2210001"},
        {"id": 2, "name": "Vật lý Đại cương", "resource_type": ResourceType.MATERIAL, "file_type": FileType.DOCX, "file_size": "1.3 MB", "uploader_id": "1235"},
        {"id": 3, "name": "Hóa học cơ sở", "resource_type": ResourceType.MATERIAL, "file_type": FileType.PPTX, "file_size": "2.8 MB", "uploader_id": "2210001"},
        {"id": 4, "name": "Đại số tuyến tính - Slide", "resource_type": ResourceType.MATERIAL, "file_type": FileType.PDF, "file_size": "3.2 MB", "uploader_id": "b.tran20"},
        {"id": 5, "name": "Lập trình C++ - Tài liệu", "resource_type": ResourceType.MATERIAL, "file_type": FileType.DOCX, "file_size": "1.9 MB", "uploader_id": "c.levan"},
        
        # Exams
        {"id": 6, "name": "Đề thi Giải tích 1 - 2024", "resource_type": ResourceType.EXAM, "file_type": FileType.PDF, "file_size": "1.8 MB", "uploader_id": "2210001"},
        {"id": 7, "name": "Đề thi Lập trình C - 2023", "resource_type": ResourceType.EXAM, "file_type": FileType.DOCX, "file_size": "1.2 MB", "uploader_id": "1235"},
        {"id": 8, "name": "Đề thi Vật lý - Midterm 2024", "resource_type": ResourceType.EXAM, "file_type": FileType.PDF, "file_size": "2.1 MB", "uploader_id": "c.levan"},
        {"id": 9, "name": "Đề thi Hóa học - Final 2024", "resource_type": ResourceType.EXAM, "file_type": FileType.PDF, "file_size": "1.5 MB", "uploader_id": "2210001"},
        
        # Solutions
        {"id": 10, "name": "Đáp án Giải tích 1", "resource_type": ResourceType.EXAM, "file_type": FileType.PDF, "file_size": "2.5 MB", "uploader_id": "1235"},
        {"id": 11, "name": "Giải bài tập Lập trình", "resource_type": ResourceType.MATERIAL, "file_type": FileType.DOCX, "file_size": "1.7 MB", "uploader_id": "c.levan"},
    ]

    print("--- Bắt đầu thêm dữ liệu mẫu vào HCMUT_Library ---")
    
    try:

        for data in sample_resources:
            uploader = db.query(User).filter_by(id=data["uploader_id"]).first()
            if not uploader:
                print(f"Lỗi: Không tìm thấy Uploader ID: {data['uploader_id']}. Bỏ qua tài liệu: {data['name']}")
                print("Vui lòng chạy HCMUT_DATACORE.py trước để tạo users.")
                continue

            existing_resource = db.query(LibraryResource).filter_by(id=data["id"]).first()
            
            if not existing_resource:
                new_resource = LibraryResource(
                    id=data["id"],
                    name=data["name"],
                    resource_type=data["resource_type"],
                    file_type=data["file_type"],
                    file_size=data["file_size"],
                    uploader_id=data["uploader_id"]
                )
                db.add(new_resource)
                print(f"Đang thêm tài liệu: {data['name']} (Người tải lên: {uploader.full_name})")
            else:
                print(f"Tài liệu đã tồn tại: {data['name']}")

        db.commit()

    except Exception as e:
        print(f"Đã xảy ra lỗi: {e}")
        db.rollback()
    finally:
        db.close()
        print("\n--- Đã đóng phiên CSDL (Library) ---")

def seed_user(engine, db:Session):
    Base.metadata.drop_all(bind=engine, tables=[
        User.__table__,
        Student.__table__,
        Staff.__table__,])
    Base.metadata.create_all(bind=engine, tables=[
        User.__table__,
        Student.__table__,
        Staff.__table__,])
    
    sample_data = [
        {
            "full_name": "Nguyễn Văn A",
            "email": "a.nguyen21@hcmut.edu.vn",
            "role": HcmutUserRole.STUDENT,
            "status": AcademicStatus.ACTIVE,
            "student_id": "2210001",
            "department": "Khoa Khoa học và Kỹ thuật Máy tính",
            "major": "Khoa học Máy tính"
        },
        {
            "full_name": "Trần Thị B",
            "email": "b.tran20@hcmut.edu.vn",
            "role": HcmutUserRole.STUDENT,
            "status": AcademicStatus.ACTIVE,
            "student_id": "2110002",
            "department": "Khoa Kỹ thuật Cơ khí",
            "major": "Kỹ thuật Cơ khí"
        },
        {
            "full_name": "Lê Văn C",
            "email": "c.levan@hcmut.edu.vn",
            "role": HcmutUserRole.STAFF,
            "status": AcademicStatus.ACTIVE,
            "staff_id": "1235",
            "department": "Khoa Khoa học và Kỹ thuật Máy tính",
            "position": "Giảng viên"
        },
        {
            "full_name": "Phạm Thị D",
            "email": "d.phamthi@hcmut.edu.vn",
            "role": HcmutUserRole.STAFF,
            "status": AcademicStatus.ACTIVE,
            "staff_id": "0102",
            "department": "Ban Giám hiệu",
            "position": "Ban quản lý"
        },
        {
            "full_name": "Hoàng Văn E",
            "email": "e.hoang21@hcmut.edu.vn",
            "role": HcmutUserRole.STUDENT,
            "status": AcademicStatus.ON_LEAVE,
            "student_id": "2310003",
            "department": "Khoa Kỹ thuật Hóa học",
            "major": "Kỹ thuật Hóa học"
        },
        {
            "full_name": "Vũ Văn F",
            "email": "f.vu22@hcmut.edu.vn",
            "role": HcmutUserRole.STUDENT,
            "status": AcademicStatus.ACTIVE,
            "student_id": "2210002",
            "department": "Khoa Khoa học và Kỹ thuật Máy tính",
            "major": "Khoa học Máy tính"
        },
        {
            "full_name": "Phạm Văn G",
            "email": "g.pham23@hcmut.edu.vn",
            "role": HcmutUserRole.STUDENT,
            "status": AcademicStatus.ACTIVE,
            "student_id": "2310001",
            "department": "Khoa Kỹ thuật Điện - Điện tử",
            "major": "Kỹ thuật Điện"
        },
        {
            "full_name": "Dương Thị H",
            "email": "h.duong21@hcmut.edu.vn",
            "role": HcmutUserRole.STAFF,
            "status": AcademicStatus.ACTIVE,
            "staff_id": "1105",
            "department": "Khoa Khoa học và Kỹ thuật Máy tính",
            "position": "Giảng Viên"
        },
        {
            "full_name": "Hoàng Minh I",
            "email": "i.hoang22@hcmut.edu.vn",
            "role": HcmutUserRole.STUDENT,
            "status": AcademicStatus.ACTIVE,
            "student_id": "2210003",
            "department": "Khoa Kinh tế Xây dựng",
            "major": "Quản lý xây dựng"
        },
         {
            "full_name": "Lương Minh Thuận",
            "email": "thuan.luong1808@hcmut.edu.vn",
            "role": HcmutUserRole.STUDENT,
            "status": AcademicStatus.ACTIVE,
            "student_id": "2313348",
            "department": "Khoa Khoa học và Kỹ thuật Máy tính",
            "major": "Khoa học máy tính"
        },
        {
            "full_name": "Lê Chí Đại",
            "email": "dai.lechi@hcmut.edu.vn",
            "role": HcmutUserRole.STUDENT,
            "status": AcademicStatus.ACTIVE,
            "student_id": "2310621",
            "department": "Khoa Khoa học và Kỹ thuật Máy tính",
            "major": "Khoa học máy tính"
        },
        {
            "full_name": "Nguyễn Quốc Huy",
            "email": "huy.nguyen2504@hcmut.edu.vn",
            "role": HcmutUserRole.STUDENT,
            "status": AcademicStatus.ACTIVE,
            "student_id": "2311209",
            "department": "Khoa Khoa học và Kỹ thuật Máy tính",
            "major": "Khoa học máy tính"
        },
        {
            "full_name": "Phạm Lê Tiến Đạt",
            "email": "dat.pham2005@hcmut.edu.vn",
            "role": HcmutUserRole.STUDENT,
            "status": AcademicStatus.ACTIVE,
            "student_id": "2310687",
            "department": "Khoa Khoa học và Kỹ thuật Máy tính",
            "major": "Khoa học máy tính"
        },
        {
            "full_name": "Võ Văn Thịnh",
            "email": "thinh.vovan@hcmut.edu.vn",
            "role": HcmutUserRole.STUDENT,
            "status": AcademicStatus.ACTIVE,
            "student_id": "2313318",
            "department": "Khoa Khoa học và Kỹ thuật Máy tính",
            "major": "Khoa học máy tính"
        }
    ]

    print("--- Bắt đầu thêm dữ liệu mẫu vào HCMUT_DATACORE ---")
    
    try:
        for data in sample_data:
            new_object = None
            if data["role"] == HcmutUserRole.STUDENT:
                new_object = Student(
                    id=data["student_id"],
                    username=data["email"].split('@')[0],
                    full_name=data["full_name"],
                    email=data["email"],
                    status=data["status"],      
                    department=data["department"],
                    major=data["major"]
                )
                print(f"Đang tạo Sinh viên: {data['full_name']}")
                
            elif data["role"] == HcmutUserRole.STAFF:
                new_object = Staff(
                    id=data["staff_id"],
                    username=data["email"].split('@')[0],
                    full_name=data["full_name"],
                    email=data["email"],
                    status=data["status"],
                    department=data["department"],
                    position=data["position"]
                )
                print(f"Đang tạo Cán bộ: {data['full_name']}")
            
            if new_object:
                db.add(new_object)

        db.commit()
        print("--- Đã lưu dữ liệu thành công ---")

        print("\n--- Xác minh dữ liệu từ CSDL ---")
        
        print("\nTruy vấn tất cả User (chung):")
        all_users = db.query(User).all()
        for user in all_users:
            print(f"  -> {user}")

        print("\nTruy vấn chỉ Student (riêng):")
        all_students = db.query(Student).all()
        for student in all_students:
            print(f"  -> {student}")

        print("\nTruy vấn chỉ Staff (riêng):")
        all_staff = db.query(Staff).all()
        for staff in all_staff:
            print(f"  -> {staff}")

    except Exception as e:
        print(f"Đã xảy ra lỗi: {e}")
        db.rollback()
    finally:
        db.close()
        print("\n--- Đã đóng phiên CSDL ---")

def seed_room(engine, db:Session):
    Base.metadata.drop_all(bind=engine, tables=[
        Room.__table__,
        RoomSchedule.__table__,])
    Base.metadata.create_all(bind=engine, tables=[
        Room.__table__,
        RoomSchedule.__table__,])
    
    try:

        print("Đang thêm dữ liệu Phòng Học (Rooms)...")
        

        room_data = [
            {"name": "H1-201", "capacity": 35, "room_type": RoomType.STANDARD_ROOM},
            {"name": "H1-205", "capacity": 80, "room_type": RoomType.STANDARD_ROOM},
            {"name": "B1-202", "capacity": 50, "room_type": RoomType.STANDARD_ROOM},
            {"name": "B4-305", "capacity": 60, "room_type": RoomType.STANDARD_ROOM},
            {"name": "C5-301", "capacity": 50, "room_type": RoomType.STANDARD_ROOM},
            {"name": "C6-202", "capacity": 45, "room_type": RoomType.STANDARD_ROOM},
            {"name": "H2-201", "capacity": 90, "room_type": RoomType.STANDARD_ROOM},
            {"name": "H2-205", "capacity": 55, "room_type": RoomType.STANDARD_ROOM},
            {"name": "H2-506", "capacity": 40, "room_type": RoomType.STANDARD_ROOM},
            {"name": "H2-401", "capacity": 60, "room_type": RoomType.STANDARD_ROOM},
            {"name": "H3-204", "capacity": 45, "room_type": RoomType.STANDARD_ROOM},
            {"name": "H6-301", "capacity": 50, "room_type": RoomType.STANDARD_ROOM},
            {"name": "H6-GDH6", "capacity": 100, "room_type": RoomType.LECTURE_HALL},
            {"name": "C4-401", "capacity": 40, "room_type": RoomType.LAB},
            {"name": "C6-302", "capacity": 30, "room_type": RoomType.LAB},
            {"name": "C6-510", "capacity": 80, "room_type": RoomType.LAB},
            {"name": "C5-402", "capacity": 25, "room_type": RoomType.LAB},
            {"name": "B4-403", "capacity": 70, "room_type": RoomType.STANDARD_ROOM},
        ]
        
   
        rooms_in_db = {}
        
        for data in room_data:
       
            room = db.query(Room).filter_by(name=data["name"]).first()
            if not room:
                
                room = Room(**data)
                db.add(room)
                print(f"  -> Đã thêm phòng: {data['name']}")
            
            rooms_in_db[data['name']] = room
        
        db.commit()
        print("--- Đã lưu dữ liệu Phòng Học ---")

        
        print("\nĐang thêm dữ liệu Lịch Đặt Phòng (Schedules)...")
        
        staff_list = db.query(Staff).limit(3).all()
        
        if not staff_list:
            print("Lỗi: Không tìm thấy Cán bộ (Staff). Vui lòng chạy seed_user() trước.")
        else: #fix here
            tutor_ids = {
                "2210001": db.query(User).filter_by(id="2210001").first(),  # Course 1
                "1235": db.query(User).filter_by(id="1235").first(),        # Course 2
                "2313318": db.query(User).filter_by(id="2313318").first(),  # Course 3
                "2310687": db.query(User).filter_by(id="2310687").first(),  # Course 4
                "2310621": db.query(User).filter_by(id="2310621").first(),  # Course 5
                "2313348": db.query(User).filter_by(id="2313348").first(),  # Course 6
            }

            schedule_data = [
                # Course 1 - Session 2
                {
                    "room_id": rooms_in_db.get("H1-201").id if rooms_in_db.get("H1-201") else None,
                    "user_id": tutor_ids["2210001"].id if tutor_ids["2210001"] else None,
                    "date": date(2025, 12, 4),
                    "start_time": time(18, 0), "end_time": time(20, 0),
                    "status": RoomStatus.BOOKED,
                    "note": "Kinh tế lượng for noob - Session 2"
                },
                # Course 2 - Session 2
                {
                    "room_id": rooms_in_db.get("B4-305").id if rooms_in_db.get("B4-305") else None,
                    "user_id": tutor_ids["1235"].id if tutor_ids["1235"] else None,
                    "date": date(2025, 11, 18),
                    "start_time": time(19, 0), "end_time": time(21, 0),
                    "status": RoomStatus.BOOKED,
                    "note": "Lập trình C++ - Session 2"
                },
                # Course 3 - Session 1
                {
                    "room_id": rooms_in_db.get("B1-202").id if rooms_in_db.get("B1-202") else None,
                    "user_id": tutor_ids["2313318"].id if tutor_ids["2313318"] else None,
                    "date": date(2025, 11, 12),
                    "start_time": time(10, 0), "end_time": time(12, 0),
                    "status": RoomStatus.BOOKED,
                    "note": "Giải tích 1 Nâng cao - Session 1"
                },
                # Course 4 - Session 1
                {
                    "room_id": rooms_in_db.get("C5-301").id if rooms_in_db.get("C5-301") else None,
                    "user_id": tutor_ids["2310687"].id if tutor_ids["2310687"] else None,
                    "date": date(2025, 11, 10),
                    "start_time": time(14, 0), "end_time": time(16, 0),
                    "status": RoomStatus.BOOKED,
                    "note": "Vật lý Đại cương - Session 1"
                },
                # Course 4 - Session 2
                {
                    "room_id": rooms_in_db.get("C5-301").id if rooms_in_db.get("C5-301") else None,
                    "user_id": tutor_ids["2310687"].id if tutor_ids["2310687"] else None,
                    "date": date(2025, 11, 17),
                    "start_time": time(14, 0), "end_time": time(16, 0),
                    "status": RoomStatus.BOOKED,
                    "note": "Vật lý Đại cương - Session 2"
                },
                # Course 5 - Session 1
                {
                    "room_id": rooms_in_db.get("H2-201").id if rooms_in_db.get("H2-201") else None,
                    "user_id": tutor_ids["2310621"].id if tutor_ids["2310621"] else None,
                    "date": date(2025, 11, 14),
                    "start_time": time(15, 0), "end_time": time(17, 0),
                    "status": RoomStatus.BOOKED,
                    "note": "Triết học Phương Đông - Session 1"
                },
                # Course 6 - Session 1
                {
                    "room_id": rooms_in_db.get("H1-205").id if rooms_in_db.get("H1-205") else None,
                    "user_id": tutor_ids["2313348"].id if tutor_ids["2313348"] else None,
                    "date": date(2025, 11, 14),
                    "start_time": time(15, 0), "end_time": time(17, 0),
                    "status": RoomStatus.BOOKED,
                    "note": "Học với Abe - Session 1"
                },
                # Course 6 - Session 2
                {
                    "room_id": rooms_in_db.get("C6-202").id if rooms_in_db.get("C6-202") else None,
                    "user_id": tutor_ids["2313348"].id if tutor_ids["2313348"] else None,
                    "date": date(2025, 11, 21),
                    "start_time": time(15, 0), "end_time": time(17, 0),
                    "status": RoomStatus.BOOKED,
                    "note": "Học với Abe - Session 2"
                },
            ]

            for data in schedule_data:
                if data["room_id"] and data["user_id"]:
                    lich = db.query(RoomSchedule).filter_by(
                        room_id=data["room_id"],
                        date=data["date"],
                        start_time=data["start_time"]
                    ).first()
                    
                    if not lich:
                        lich = RoomSchedule(**data)
                        db.add(lich)
                        print(f"  -> Đã thêm lịch đặt phòng: {data['note']}")
                else:
                    print(f"  -> Bỏ qua lịch (thiếu room hoặc user): {data['note']}")

            db.commit()
            print("--- Đã lưu dữ liệu Lịch Đặt Phòng ---")
    except Exception as e:
        print(f"\n--- An error occurred during seeding ---")
        print(e)
        db.rollback()
    finally:
        
        db.close()
        print("--- Đã đóng phiên CSDL (Coordinator) ---")

def seed_all(engine, db):
    seed_sso(engine, db)
    seed_user(engine, db)
    seed_lib(engine, db)
    seed_room(engine, db)

if __name__ == "__main__":
    DATABASE_URL = "sqlite:///./app/hcmut_database/hcmut.db"
    engine = create_engine(DATABASE_URL, echo=False)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()

    print("Seeding data...")
    seed_all(engine, db)