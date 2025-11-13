#Mockup for HCMUT_SSO
import hashlib
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean, Enum, ForeignKey
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

# --- Database Base Setup ---
# Base này sẽ được dùng để tạo bảng trong hcmut.db
Base = declarative_base()

# --- Mô hình Người dùng SSO (SSO User Model) ---
class SSOUser(Base):
    """
    Mô phỏng bảng người dùng trong hệ thống HCMUT_SSO.
    Bảng này CHỈ lưu trữ thông tin xác thực cốt lõi.
    """
    __tablename__ = "sso_users"

    
    # username là phần trước @ của email
    username = Column(String, primary_key=True, index=True, nullable=False) 
    
    # Thông tin mật khẩu đã hash bằng hashlib
    hashed_password = Column(String, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    # --- Phương thức Hash Mật khẩu (dùng hashlib) ---
    def set_password(self, plain_password):
        """Hashes and sets the password using hashlib."""   
        self.hashed_password = hashlib.sha256(plain_password.encode('utf-8')).hexdigest()

    def check_password(self, plain_password):
        """Verifies a plain-text password against the stored hash."""
        return self.hashed_password == hashlib.sha256(plain_password.encode('utf-8')).hexdigest()

    def __repr__(self):
        return f"username={self.username})>"


# --- Khối thực thi chính để khởi tạo và thêm dữ liệu ---
if __name__ == "__main__":
    
    # 1. Thiết lập CSDL SQLite dựa trên tệp 'hcmut.db'
    #    Tệp này sẽ được tạo trong cùng thư mục.
    DATABASE_URL = "sqlite:///hcmut.db"
    engine = create_engine(DATABASE_URL)
    
    # 2. Tạo bảng (chỉ tạo bảng sso_users nếu nó chưa tồn tại)
    #    LƯU Ý: Nếu HCMUT_DATACORE.py cũng chạy với Base,
    #    việc chạy cả hai sẽ tạo tất cả các bảng trong 'hcmut.db'.
    Base.metadata.create_all(engine)
    
    # 3. Tạo một phiên (session) để tương tác với CSDL
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    # 4. Dữ liệu mẫu (từ HCMUT_DATACORE)
    #    Chúng ta sẽ trích xuất email và tạo tài khoản SSO
    sample_emails = [
        "a.nguyen21@hcmut.edu.vn",
        "b.tran20@hcmut.edu.vn",
        "c.levan@hcmut.edu.vn",
        "d.phamthi@hcmut.edu.vn",
        "e.hoang21@hcmut.edu.vn"
    ]
    # Mật khẩu mặc định cho tất cả user mẫu
    DEFAULT_PASS = "toi_yeu_mu"

    print(f"--- Bắt đầu thêm dữ liệu mẫu vào SSO (hcmut.db) ---")
    
    try:
        # 5. Vòng lặp và tạo tài khoản SSO
        for email in sample_emails:
            # Trích xuất username từ email
            username = email.split('@')[0]
            
            # Kiểm tra xem user đã tồn tại chưa
            existing_user = db.query(SSOUser).filter(SSOUser.username == username).first()
            
            if not existing_user:
                new_sso_user = SSOUser(username=username)
                new_sso_user.set_password(DEFAULT_PASS)
                
                db.add(new_sso_user)
                print(f"Đang tạo SSO User: {username}")
            else:
                print(f"SSO User đã tồn tại: {username}")
        
        # 6. Lưu tất cả thay đổi vào CSDL
        db.commit()
        print("--- Đã lưu dữ liệu SSO thành công ---")
        
        # 7. Truy vấn CSDL để xác minh
        print("\n--- Xác minh dữ liệu SSO từ hcmut.db ---")
        all_sso_users = db.query(SSOUser).all()
        
        for user in all_sso_users:
            print(f"  -> {user}")
            print(f"     Hash: {user.hashed_password[:10]}...")
            is_correct = user.check_password(DEFAULT_PASS)
            print(f"     Check pass '{DEFAULT_PASS}': {is_correct}")

    except Exception as e:
        print(f"Đã xảy ra lỗi: {e}")
        db.rollback()
    finally:
        # 8. Đóng phiên
        db.close()
        print("\n--- Đã đóng phiên CSDL (hcmut.db) ---")