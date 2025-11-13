from sqlalchemy import create_engine, Column, Integer, String, Enum
from sqlalchemy.orm import sessionmaker, declarative_base, relationship
import enum

# --- SQLAlchemy Base ---
Base = declarative_base()


# --- Define Enum for Roles ---
class UserRole(str, enum.Enum):
    """Các vai trò cơ bản trong hệ thống."""
    TUTOR = "tutor"
    ADMIN = "admin"


# --- Define Model ---
class MututorUser(Base):
    """Bảng người dùng cho hệ thống MuChat."""
    __tablename__ = "users"

    #id = Column(Integer, primary_key=True, autoincrement=True)
    id = Column(String, primary_key=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    role = Column(Enum(UserRole), nullable=False, index=True)
    
    # --- ADDED RELATIONSHIP ---
    # This allows Course.tutor to back-populate correctly
    

    def __repr__(self):
        return f"<MututorUser(id={self.id}, username='{self.username}', role='{self.role.value}')>"


# --- Main Logic ---
if __name__ == "__main__":
    DATABASE_URL = "sqlite:///muchat.db"
    engine = create_engine(DATABASE_URL, echo=False)

    # Reset tables for testing
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)

    # Create session
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()

    # Mock data
    mock_users = [
        {"username": "a.nguyen21", "role": UserRole.TUTOR, "id": "2210001"},
        {"username": "c.levan", "role": UserRole.TUTOR, "id": "1235"},
        {"username": "e.hoang21", "role": UserRole.TUTOR, "id": "2310003"},
        {"username": "d.phamthi", "role": UserRole.ADMIN, "id": "0102"},
    ]

    print(f"--- Populating '{DATABASE_URL}' with mock data ---")

    try:
        for u in mock_users:
            # Check for existing username
            existing = db.query(MututorUser).filter_by(username=u["username"]).first()
            if existing:
                print(f"User '{u['username']}' already exists, skipping.")
                continue

            new_user = MututorUser(**u)
            db.add(new_user)
            print(f"Added: {new_user}")

        db.commit()
        print("\n--- Data committed successfully ---")

        # Verify all users
        all_users = db.query(MututorUser).all()
        print("\n--- Current users in 'muchat.db' ---")
        for user in all_users:
            print(user)

    except Exception as e:
        db.rollback()
        print(f"❌ Error: {e}")

    finally:
        db.close()
        print("\n--- Database session closed ---")