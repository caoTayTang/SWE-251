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
        "e.hoang21@hcmut.edu.vn"
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
        {"id": 2, "name": "Vật lý đại cương", "resource_type": ResourceType.MATERIAL, "file_type": FileType.DOCX, "file_size": "1.3 MB", "uploader_id": "1235"},
        {"id": 3, "name": "Hóa học cơ sở", "resource_type": ResourceType.MATERIAL, "file_type": FileType.PPTX, "file_size": "2.8 MB", "uploader_id": "2210001"},
        
        # Exams
        {"id": 4, "name": "Đề thi Giải tích 1 - 2024", "resource_type": ResourceType.EXAM, "file_type": FileType.PDF, "file_size": "1.8 MB", "uploader_id": "2210001"},
        {"id": 5, "name": "Đề thi Lập trình C - 2023", "resource_type": ResourceType.EXAM, "file_type": FileType.DOCX, "file_size": "1.2 MB", "uploader_id": "1235"},
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
            "student_id": "2010002",
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
            "position": "Giảng viên" # Lecturer
        },
        {
            "full_name": "Phạm Thị D",
            "email": "d.phamthi@hcmut.edu.vn",
            "role": HcmutUserRole.STAFF,
            "status": AcademicStatus.ACTIVE,
            "staff_id": "0102",
            "department": "Ban Giám hiệu",
            "position": "Ban quản lý" # Management
        },
        {
            "full_name": "Hoàng Văn E",
            "email": "e.hoang21@hcmut.edu.vn",
            "role": HcmutUserRole.STUDENT,
            "status": AcademicStatus.ON_LEAVE,
            "student_id": "2310003",
            "department": "Khoa Kỹ thuật Hóa học",
            "major": "Kỹ thuật Hóa học"
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
            {"name": "H6-301", "capacity": 50, "room_type": RoomType.STANDARD_ROOM},
            {"name": "C6-510", "capacity": 80, "room_type": RoomType.LAB},
            {"name": "GDH6", "capacity": 100, "room_type": RoomType.LECTURE_HALL},
            {"name": "B1-202", "capacity": 50, "room_type": RoomType.STANDARD_ROOM},
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
        
        nguoi_dat_gv = db.query(Staff).filter_by(id="1235").first()
        
        if not nguoi_dat_gv:
            print("Lỗi: Không tìm thấy Giảng viên (Staff) với ID '1235'.")
            print("Vui lòng chạy HCMUT_DATACORE.py TRƯỚC khi chạy file này.")
        else:
            print(f"Tìm thấy người đặt phòng mẫu: {nguoi_dat_gv.full_name} (ID: {nguoi_dat_gv.id})")
            
           
            phong_h6_301 = rooms_in_db.get("H6-301")
            phong_c6_510 = rooms_in_db.get("C6-510")
            phong_gdh6 = rooms_in_db.get("GDH6")


            schedule_data = [
                {
                    "room_id": phong_h6_301.id, "user_id": nguoi_dat_gv.id,
                    "date": date(2025, 11, 18), # Thứ 3
                    "start_time": time(7, 30), "end_time": time(9, 30),
                    "status": RoomStatus.BOOKED,
                    "note": "Giảng dạy: CO1001 - Nhập môn Lập trình"
                },
                {
                    "room_id": phong_h6_301.id, "user_id": nguoi_dat_gv.id,
                    "date": date(2025, 11, 20), # Thứ 5
                    "start_time": time(9, 30), "end_time": time(11, 30),
                    "status": RoomStatus.BOOKED,
                    
                },
                {
                    "room_id": phong_c6_510.id, "user_id": nguoi_dat_gv.id,
                    "date": date(2025, 11, 19), # Thứ 4
                    "start_time": time(13, 30), "end_time": time(16, 30),
                    "status": RoomStatus.BOOKED,
                   
                },
                {
                    "room_id": phong_gdh6.id, "user_id": nguoi_dat_gv.id,
                    "date": date(2025, 11, 21), # Thứ 6
                    "start_time": time(9, 0), "end_time": time(11, 0),
                    "status": RoomStatus.BOOKED,
                    "note": "Hội thảo chuyên đề"
                },
            ]
            
            for data in schedule_data:

                lich = db.query(RoomSchedule).filter_by(
                    room_id=data["room_id"],
                    date=data["date"],
                    start_time=data["start_time"]
                ).first()
                
                if not lich:
     
                    lich = RoomSchedule(**data)
                    db.add(lich)

                    print(f"  -> Đã thêm lịch đặt phòng: {phong_h6_301.name} "
                          f"ngày {data['date']} "
                          f"({data['status'].value})")
            
            db.commit()
            print("--- Đã lưu dữ liệu Lịch Đặt Phòng ---")


        print("\n--- Xác minh dữ liệu từ CSDL (Bảng Lịch Đặt Phòng) ---")

        all_schedules = db.query(RoomSchedule).join(Room).join(User).all()
        
        if not all_schedules:
            print("Không tìm thấy lịch đặt phòng nào.")

        for lich in all_schedules:
            print(f"  -> [Lịch ID: {lich.id}]")
            print(f"     Phòng: {lich.room.name} (Sức chứa: {lich.room.capacity})")
            print(f"     Người đặt: {lich.user.full_name}")
            print(f"     Thời gian: {lich.date.strftime('%d/%m/%Y')} "
                  f"từ {lich.start_time.strftime('%H:%M')} "
                  f"đến {lich.end_time.strftime('%H:%M')}")
            print(f"     Trạng thái: {lich.status.value}")
            print(f"     Mục đích: {lich.note}\n")

    except Exception as e:
        print(f"\n--- ĐÃ XẢY RA LỖI ---")
        print(e)
        db.rollback()
    finally:

        db.close()
        print("--- Đã đóng phiên CSDL (Coordinator) ---")

if __name__ == "__main__":
    DATABASE_URL = "sqlite:///./app/hcmut_database/hcmut.db"
    engine = create_engine(DATABASE_URL, echo=False)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()

    seed_room(engine,db)
    print("Seeding data...")

