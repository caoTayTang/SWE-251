#Mockup for HCMUT Cooridator
import enum
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Enum, ForeignKey, Date, Time, Text
from sqlalchemy.orm import relationship, sessionmaker
from datetime import datetime, date, time

from HCMUT_DATACORE import Base, User, Staff


class RoomType(str, enum.Enum):
    LECTURE_HALL = "lecture_hall" # Lecture Hall (GDH6)
    STANDARD_ROOM = "standard_room"     # Standard room (H6-301)
    LAB = "lab"     # Lab room (C6-510)
    MEETING_ROOM = "meeting_room"     

class RoomStatus(str, enum.Enum):
    FREE = "free"
    BOOKED = "booked"

class Room(Base):

    __tablename__ = "coordinator_room"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False, index=True) # VD: "H6-301"
    capacity = Column(Integer, nullable=True) # Sức chứa
    room_type = Column(Enum(RoomType), default=RoomType.STANDARD_ROOM)

    # Relationship: 
    schedules = relationship("RoomSchedule", back_populates="room")

    def __repr__(self):
        return (f"<PhongHoc(id={self.id}, ten_phong='{self.name}'")


class RoomSchedule(Base):

    __tablename__ = "coordinator_schedule"
    
    id = Column(Integer, primary_key=True, index=True)

    room_id = Column(Integer, ForeignKey("coordinator_room.id"), nullable=False)
    user_id = Column(String, ForeignKey("datacore_users.id"), nullable=True) # Link đến Staff
    
    date = Column(Date, nullable=False, index=True) # Yêu cầu: "day (dd/mm/yyyy)"
    start_time = Column(Time, nullable=False) # Yêu cầu: "time"
    end_time = Column(Time, nullable=False) # Yêu cầu: "time"
    

    status = Column(Enum(RoomStatus), default=RoomStatus.FREE, index=True)
    
    note = Column(Text, nullable=True) # Ghi chú thêm
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # --- Relationships ---
    room = relationship("Room", back_populates="schedules")
    user = relationship("User")

    def __repr__(self):
        return (f"<LichDatPhong(id={self.id}, phong_id={self.room_id}, "
                f"ngay='{self.date}', trang_thai='{self.status.value}')>")


if __name__ == "__main__":

    DATABASE_URL = "sqlite:///hcmut.db"
    engine = create_engine(DATABASE_URL)
    

    print("Đang tạo bảng Room và RoomSchedule (nếu chưa tồn tại)...")
    Base.metadata.drop_all(bind=engine, tables=[Room.__table__, RoomSchedule.__table__])

    Base.metadata.create_all(bind=engine, tables=[Room.__table__, RoomSchedule.__table__])
    
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()

    print("--- Bắt đầu thêm dữ liệu mẫu cho Coordinator ---")

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
                # Lịch 1 (Approved - Booked)
                {
                    "room_id": phong_h6_301.id, "user_id": nguoi_dat_gv.id,
                    "date": date(2025, 11, 18), # Thứ 3
                    "start_time": time(7, 30), "end_time": time(9, 30),
                    "status": RoomStatus.BOOKED,
                    "note": "Giảng dạy: CO1001 - Nhập môn Lập trình"
                },
                # Lịch 2 (Approved - Cùng phòng, khác ngày/giờ)
                {
                    "room_id": phong_h6_301.id,
                    "date": date(2025, 11, 20), # Thứ 5
                    "start_time": time(9, 30), "end_time": time(11, 30),
                    "status": RoomStatus.FREE,
                    
                },
                # Lịch 3 (Pending)
                {
                    "room_id": phong_c6_510.id,
                    "date": date(2025, 11, 19), # Thứ 4
                    "start_time": time(13, 30), "end_time": time(16, 30),
                    "status": RoomStatus.FREE,
                   
                },
                # Lịch 4 (Cancelled)
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