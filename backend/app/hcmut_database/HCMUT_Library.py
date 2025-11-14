#Mockup for HCMUT library
import enum
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship, sessionmaker
from datetime import datetime

from HCMUT_DATACORE import Base, User


class ResourceType(str, enum.Enum):
    """Phân loại tài liệu (material) hay đề thi (exam)"""
    MATERIAL = "material"
    EXAM = "exam"

class FileType(str, enum.Enum):
    """Loại file cơ bản dựa trên mock data"""
    PDF = "pdf"
    DOCX = "docx"
    PPTX = "pptx"
    OTHER = "other"

# --- Model Thư viện ---

class LibraryResource(Base):
    """
    Model cho một tài nguyên trong thư viện (Tài liệu hoặc Đề thi).
    """
    __tablename__ = "library_resources"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    
    # Cột này phân biệt 'material' và 'exam'
    resource_type = Column(Enum(ResourceType), nullable=False, index=True) 
    
    file_type = Column(Enum(FileType), nullable=False)
    file_size = Column(String, nullable=True) # VD: "2.1 MB"
    
    # Foreign key trỏ đến bảng 'datacore_users'
    # Phải là String để khớp với User.id (VD: "2210001")
    uploader_id = Column(String, ForeignKey("datacore_users.id"), nullable=False)
    
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    
    # Tạo relationship đến User
    uploader = relationship("User") 

    def __repr__(self):
        return (f"<LibraryResource(id={self.id}, name='{self.name[:20]}...', "
                f"type={self.resource_type.value})>")

# --- Khối thực thi chính để thêm dữ liệu mẫu ---

if __name__ == "__main__":
    
    # 1. Kết nối đến CÙNG MỘT CSDL mà HCMUT_DATACORE.py đã tạo
    DATABASE_URL = "sqlite:///hcmut.db"
    engine = create_engine(DATABASE_URL)
    
    # 2. Tạo bảng *mới* này trong CSDL
    # (Nó sẽ không ảnh hưởng đến các bảng User/Student/Staff đã có)
    Base.metadata.create_all(bind=engine, tables=[LibraryResource.__table__])
    
    # 3. Tạo một phiên (session)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()

    # 4. Dữ liệu mẫu (Đã điều chỉnh uploaderId để khớp với DATACORE)
    #    - Mock ID 1   -> '2210001' (Student Nguyễn Văn A)
    #    - Mock ID 999 -> '1235' (Staff Lê Văn C - Giảng viên)
    
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
        # 5. Vòng lặp qua dữ liệu và tạo đối tượng
        for data in sample_resources:
            
            # 5a. Kiểm tra xem Uploader có tồn tại trong CSDL không
            uploader = db.query(User).filter_by(id=data["uploader_id"]).first()
            if not uploader:
                print(f"Lỗi: Không tìm thấy Uploader ID: {data['uploader_id']}. Bỏ qua tài liệu: {data['name']}")
                print("Vui lòng chạy HCMUT_DATACORE.py trước để tạo users.")
                continue
                
            # 5b. Kiểm tra xem tài liệu đã tồn tại chưa
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
        
        # 6. Lưu tất cả thay đổi vào CSDL
        db.commit()
        print("--- Đã lưu dữ liệu thư viện thành công ---")
        
        # 7. Truy vấn CSDL để xác minh
        print("\n--- Xác minh dữ liệu từ CSDL (Bảng Library) ---")
        all_resources = db.query(LibraryResource).all()
        for res in all_resources:
            # Lấy thông tin uploader qua relationship
            uploader_name = db.query(User).filter_by(id=res.uploader_id).first().full_name
            print(f"  -> ID: {res.id}, Tên: {res.name}, Loại: {res.resource_type.value}, Người tải lên: {uploader_name}")

    except Exception as e:
        print(f"Đã xảy ra lỗi: {e}")
        db.rollback()
    finally:
        # 8. Đóng phiên
        db.close()
        print("\n--- Đã đóng phiên CSDL (Library) ---")