#Mockup for HCMUT_DATACORE
import enum
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean, Enum, ForeignKey
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
from .base import Base


# --- Enum cho vai trò (Role) ---
class HcmutUserRole(str, enum.Enum):
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
    role = Column(Enum(HcmutUserRole), nullable=False, index=True)
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
        'polymorphic_identity': HcmutUserRole.STUDENT, # Định danh lớp này là 'student'
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
        'polymorphic_identity': HcmutUserRole.STAFF, # Định danh lớp này là 'staff'
    }

    def __repr__(self):
        return (f"<Staff(id={self.id}, username={self.username}, "
                f"staff_id={self.staff_id}, position={self.position})>")

