#Mockup for HCMUT_DATACORE
import enum
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean, Enum, ForeignKey
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

# --- Database Base Setup ---
Base = declarative_base()

# --- Enum cho vai trò (Role) ---
class UserRole(str, enum.Enum):
    """
    Xác định các vai trò cơ bản trong hệ thống DATACORE.
    Đây là cột 'discriminator' (phân biệt) cho mô hình kế thừa.
    """
    STUDENT = "student"
    STAFF = "staff" # 'Cán bộ' in English

class AcademicStatus(str, enum.Enum):
    """Trạng thái học tập / giảng dạy"""
    ACTIVE = "active"
    INACTIVE = "inactive"
    GRADUATED = "graduated"
    ON_LEAVE = "on_leave"

# --- Superclass Model (Lớp cha) ---
class User(Base):
    """
    Đây là mô hình 'User' cơ sở (lớp cha).
    Nó lưu trữ tất cả thông tin chung được chia sẻ giữa Student và Staff
    lấy từ HCMUT_SSO và DATACORE.
    """
    __tablename__ = "datacore_users"

    id = Column(String, primary_key=True, nullable=False)
    
    # Thông tin cơ bản từ HCMUT_SSO
    username = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False) # Email học vụ
    profile_picture = Column(String, nullable=True) # Corresponds to avatarUrl
    # Cột phân biệt vai trò
    role = Column(Enum(UserRole), nullable=False, index=True)
    department = Column(String, nullable=False) # Khoa

    # Trạng thái chung
    status = Column(Enum(AcademicStatus), nullable=False, default=AcademicStatus.ACTIVE)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # --- Cấu hình Kế thừa (Inheritance) ---
    __mapper_args__ = {
        'polymorphic_identity': 'user',  # Định danh cơ sở
        'polymorphic_on': role           # Cột quyết định lớp con
    }

    def __repr__(self):
        return f"<User(id={self.id}, username={self.username}, role={self.role})>"

# --- Subclass Model: Student (Lớp con: Sinh viên) ---
class Student(User):
    """
    Lớp con Student. Kế thừa từ User.
    Lưu trữ thông tin cụ thể của sinh viên.
    """
    __tablename__ = "datacore_students"
    
    # Thông tin riêng của sinh viên
    student_id = Column(String,  ForeignKey("datacore_users.id"), primary_key=True) # MSSV
    major = Column(String, nullable=True) # Chuyên ngành
    CGPA = Column(Integer,nullable=True)

    # --- Cấu hình Kế thừa ---
    __mapper_args__ = {
        'polymorphic_identity': UserRole.STUDENT, # Định danh lớp này là 'student'
    }

    def __repr__(self):
        return (f"<Student(id={self.id}, username={self.username}, "
                f"student_id={self.student_id}, major={self.major})>")

# --- Subclass Model: Staff (Lớp con: Cán bộ) ---
class Staff(User):
    """
    Lớp con Staff (Cán bộ). Kế thừa từ User.
    Lưu trữ thông tin cụ thể của cán bộ.
    """
    __tablename__ = "datacore_staff"

    # Thông tin riêng của cán bộ
    staff_id = Column(String, ForeignKey("datacore_users.id"), primary_key=True) # Mã cán bộ
    position = Column(String, nullable=True) # Chức vụ (Giảng viên, Điều phối, Quản lý...)

    # --- Cấu hình Kế thừa ---
    __mapper_args__ = {
        'polymorphic_identity': UserRole.STAFF, # Định danh lớp này là 'staff'
    }

    def __repr__(self):
        return (f"<Staff(id={self.id}, username={self.username}, "
                f"staff_id={self.staff_id}, position={self.position})>")

# --- Khối thực thi chính để khởi tạo và thêm dữ liệu mẫu ---
if __name__ == "__main__":
    
    # 1. Thiết lập CSDL SQLite trong bộ nhớ
    DATABASE_URL = "sqlite:///hcmut.db"
    engine = create_engine(DATABASE_URL)
    # 2. Tạo tất cả các bảng (User, Student, Staff)
    Base.metadata.create_all(engine)
    
    # 3. Tạo một phiên (session) để tương tác với CSDL
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    # 4. Dữ liệu mẫu (Sample data)
    sample_data = [
        {
            "full_name": "Nguyễn Văn A",
            "email": "a.nguyen21@hcmut.edu.vn",
            "role": UserRole.STUDENT,
            "status": AcademicStatus.ACTIVE,
            "student_id": "2210001",
            "department": "Khoa Khoa học và Kỹ thuật Máy tính",
            "major": "Khoa học Máy tính"
        },
        {
            "full_name": "Trần Thị B",
            "email": "b.tran20@hcmut.edu.vn",
            "role": UserRole.STUDENT,
            "status": AcademicStatus.ACTIVE,
            "student_id": "2010002",
            "department": "Khoa Kỹ thuật Cơ khí",
            "major": "Kỹ thuật Cơ khí"
        },
        {
            "full_name": "Lê Văn C",
            "email": "c.levan@hcmut.edu.vn",
            "role": UserRole.STAFF,
            "status": AcademicStatus.ACTIVE,
            "staff_id": "1235",
            "department": "Khoa Khoa học và Kỹ thuật Máy tính",
            "position": "Giảng viên" # Lecturer
        },
        {
            "full_name": "Phạm Thị D",
            "email": "d.phamthi@hcmut.edu.vn",
            "role": UserRole.STAFF,
            "status": AcademicStatus.ACTIVE,
            "staff_id": "0102",
            "department": "Ban Giám hiệu",
            "position": "Ban quản lý" # Management
        },
        {
            "full_name": "Hoàng Văn E",
            "email": "e.hoang21@hcmut.edu.vn",
            "role": UserRole.STUDENT,
            "status": AcademicStatus.ON_LEAVE,
            "student_id": "2310003",
            "department": "Khoa Kỹ thuật Hóa học",
            "major": "Kỹ thuật Hóa học"
        }
    ]

    print("--- Bắt đầu thêm dữ liệu mẫu vào HCMUT_DATACORE ---")
    
    try:
        # 5. Vòng lặp qua dữ liệu và tạo đối tượng
        for data in sample_data:
            new_object = None
            if data["role"] == UserRole.STUDENT:
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
                
            elif data["role"] == UserRole.STAFF:
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
        
        # 6. Lưu tất cả thay đổi vào CSDL
        db.commit()
        print("--- Đã lưu dữ liệu thành công ---")
        
        # 7. Truy vấn CSDL để xác minh
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
        # 8. Đóng phiên
        db.close()
        print("\n--- Đã đóng phiên CSDL ---")