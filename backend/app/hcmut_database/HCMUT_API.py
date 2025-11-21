from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy import and_, or_
from typing import List, Optional, Dict
from datetime import datetime, date, time, timezone, timedelta
from .HCMUT_DATACORE import User, Student, Staff, HcmutUserRole, AcademicStatus
from .HCMUT_Cooridator import RoomSchedule, Room, RoomStatus, RoomType
from .HCMUT_Library import ResourceType, LibraryResource, FileType
from .HCMUT_SSO import SSOUser

#Mockup API calls
class HCMUT_API:
    def __init__(self, db_session: sessionmaker):
        self.db_session = db_session

    #def check_course_conflict(self, tutor_id:str, session_list: List, resource_list: List)

    # ==================== SSO APIs ====================
    
    def check_password(self, username: str, plain_password: str) -> bool:
        """
        Verify user credentials against SSO database.
        
        Args:
            username: Username to check
            plain_password: Plain text password to verify
            
        Returns:
            bool: True if password is correct, False otherwise
        """
        with self.db_session() as session:
            sso_user = session.query(SSOUser).filter(SSOUser.username == username).first()
            if sso_user:
                return sso_user.check_password(plain_password)
            return False

    # ==================== User/Student/Staff APIs ====================
    
    def get_user_by_id(self, user_id: str) -> Optional[User]:
        """
        Get user by ID. Returns User, Student, or Staff based on polymorphic identity.
        
        Args:
            user_id: User ID to search for
            
        Returns:
            User object (or Student/Staff subclass) if found, None otherwise
        """
        with self.db_session() as session:
            return session.query(User).filter(User.id == user_id).first()
    
    def get_user_by_username(self, username: str) -> Optional[User]:
        """
        Get user by username.
        
        Args:
            username: Username to search for
            
        Returns:
            User object if found, None otherwise
        """
        with self.db_session() as session:
            return session.query(User).filter(User.username == username).first()
    
    def get_student_by_id(self, student_id: str) -> Optional[Student]:
        """
        Get student by ID.
        
        Args:
            student_id: Student ID to search for
            
        Returns:
            Student object if found, None otherwise
        """
        with self.db_session() as session:
            return session.query(Student).filter(Student.student_id == student_id).first()
    
    def get_staff_by_id(self, staff_id: str) -> Optional[Staff]:
        """
        Get staff by ID.
        
        Args:
            staff_id: Staff ID to search for
            
        Returns:
            Staff object if found, None otherwise
        """
        with self.db_session() as session:
            return session.query(Staff).filter(Staff.staff_id == staff_id).first()
    
    def get_all_students(self, department: Optional[str] = None, 
                         status: Optional[AcademicStatus] = None) -> List[Student]:
        """
        Get all students with optional filters.
        
        Args:
            department: Filter by department (optional)
            status: Filter by academic status (optional)
            
        Returns:
            List of Student objects
        """
        with self.db_session() as session:
            query = session.query(Student)
            
            if department:
                query = query.filter(Student.department == department)
            if status:
                query = query.filter(Student.status == status)
                
            return query.all()
    
    def get_all_staff(self, department: Optional[str] = None,
                      position: Optional[str] = None) -> List[Staff]:
        """
        Get all staff with optional filters.
        
        Args:
            department: Filter by department (optional)
            position: Filter by position (optional)
            
        Returns:
            List of Staff objects
        """
        with self.db_session() as session:
            query = session.query(Staff)
            
            if department:
                query = query.filter(Staff.department == department)
            if position:
                query = query.filter(Staff.position == position)
                
            return query.all()

    # ==================== Library APIs ====================
    
    def get_library_resource_by_id(self, resource_id: int) -> Optional[LibraryResource]:
        """
        Get library resource by ID.
        
        Args:
            resource_id: Resource ID to search for
            
        Returns:
            LibraryResource object if found, None otherwise
        """
        with self.db_session() as session:
            return session.query(LibraryResource).filter(LibraryResource.id == resource_id).first()
    
    def get_library_resources_by_type(self, resource_type: ResourceType) -> List[LibraryResource]:
        """
        Get all library resources by type (MATERIAL or EXAM).
        
        Args:
            resource_type: Type of resource to filter by
            
        Returns:
            List of LibraryResource objects
        """
        with self.db_session() as session:
            return session.query(LibraryResource).filter(
                LibraryResource.resource_type == resource_type
            ).all()
    
    def get_all_library_resources(self, 
                                   resource_type: Optional[ResourceType] = None,
                                   file_type: Optional[FileType] = None,
                                   uploader_id: Optional[str] = None) -> List[LibraryResource]:
        """
        Get all library resources with optional filters.
        
        Args:
            resource_type: Filter by resource type (optional)
            file_type: Filter by file type (optional)
            uploader_id: Filter by uploader ID (optional)
            
        Returns:
            List of LibraryResource objects
        """
        with self.db_session() as session:
            query = session.query(LibraryResource)
            
            if resource_type:
                query = query.filter(LibraryResource.resource_type == resource_type)
            if file_type:
                query = query.filter(LibraryResource.file_type == file_type)
            if uploader_id:
                query = query.filter(LibraryResource.uploader_id == uploader_id)
                
            return query.all()
    
    def search_library_resources(self, search_term: str) -> List[LibraryResource]:
        """
        Search library resources by name.
        
        Args:
            search_term: Term to search in resource names
            
        Returns:
            List of matching LibraryResource objects
        """
        with self.db_session() as session:
            return session.query(LibraryResource).filter(
                LibraryResource.name.ilike(f"%{search_term}%")
            ).all()
    

    # ==================== Room & Schedule APIs ====================
    
    def get_room_by_id(self, room_id: int) -> Optional[Room]:
        """
        Get room by ID.
        
        Args:
            room_id: Room ID to search for
            
        Returns:
            Room object if found, None otherwise
        """
        with self.db_session() as session:
            return session.query(Room).filter(Room.id == room_id).first()
    
    def get_room_by_name(self, room_name: str) -> Optional[Room]:
        """
        Get room by name (e.g., "H6-301").
        
        Args:
            room_name: Room name to search for
            
        Returns:
            Room object if found, None otherwise
        """
        with self.db_session() as session:
            return session.query(Room).filter(Room.name == room_name).first()
    
    def get_all_rooms(self, room_type: Optional[RoomType] = None) -> List[Room]:
        """
        Get all rooms with optional type filter.
        
        Args:
            room_type: Filter by room type (optional)
            
        Returns:
            List of Room objects
        """
        with self.db_session() as session:
            query = session.query(Room)
            
            if room_type:
                query = query.filter(Room.room_type == room_type)
                
            return query.all()
    
    def get_schedule_session(self, room_id, session_date, start_time, end_time)->Optional[RoomSchedule]:     
        if isinstance(session_date,str):
            session_date = datetime.strptime(session_date, '%Y-%m-%d').date()
        if isinstance(start_time,str):
            start_time = datetime.strptime(start_time, '%H:%M').time()
        if isinstance(end_time,str):
            end_time = datetime.strptime(end_time, '%H:%M').time() 
        with self.db_session() as session:
            return session.query(RoomSchedule).filter(
                RoomSchedule.room_id == room_id,
                RoomSchedule.start_time == start_time,
                RoomSchedule.end_time == end_time 
        ).first()

    def get_free_rooms_by_datetime(self, target_date: date, 
                                    start_time: time, 
                                    end_time: time, exclude_room = None) -> List[Room]:
        """
        Get all rooms that are FREE for a specific date and time range.
        
        Args:
            target_date: Date to check
            start_time: Start time of desired booking
            end_time: End time of desired booking
            
        Returns:
            List of available Room objects
        """
        if exclude_room:
            exclude_room = self.get_room_by_name(exclude_room)

        with self.db_session() as session:
            # Find all rooms that have overlapping booked schedules
            booked_rooms = session.query(RoomSchedule.room_id).filter(
                and_(
                    RoomSchedule.date == target_date,
                    RoomSchedule.status == RoomStatus.BOOKED,
                    or_(
                        # Overlapping conditions
                        and_(RoomSchedule.start_time <= start_time, RoomSchedule.end_time > start_time),
                        and_(RoomSchedule.start_time < end_time, RoomSchedule.end_time >= end_time),
                        and_(RoomSchedule.start_time >= start_time, RoomSchedule.end_time <= end_time)
                    )
                )
            ).distinct().all()
   

            booked_room_ids = [room_id for (room_id,) in booked_rooms]
            if exclude_room.id in booked_room_ids:
                booked_room_ids.remove(exclude_room.id)

            free_rooms = session.query(Room).filter(
                ~Room.id.in_(booked_room_ids)
            ).all()
            
            return free_rooms
    
    def can_book_room(self, room_id: int, target_date: date,
                      start_time: time, end_time: time, exclude_session: Dict = None) -> bool:
        """
        Check if a specific room can be booked for the given date and time.
        
        Args:
            room_id: ID of the room to check
            target_date: Date to check
            start_time: Start time of desired booking
            end_time: End time of desired booking
            
        Returns:
            bool: True if room is available, False otherwise
        """
        with self.db_session() as session:
            overlapping = session.query(RoomSchedule).filter(
                and_(
                    RoomSchedule.room_id == room_id,
                    RoomSchedule.date == target_date,
                    RoomSchedule.status == RoomStatus.BOOKED,
                    or_(
                        and_(RoomSchedule.start_time <= start_time, RoomSchedule.end_time > start_time),
                        and_(RoomSchedule.start_time < end_time, RoomSchedule.end_time >= end_time),
                        and_(RoomSchedule.start_time >= start_time, RoomSchedule.end_time <= end_time)
                    )
                )
            )
            if exclude_session:
                old_schedule = self.get_schedule_session(room_id, exclude_session.get("session_date"), exclude_session.get("start_time"), exclude_session.get("end_time"))
                if not old_schedule:
                    return False
                overlapping = overlapping.filter(
                    RoomSchedule.id != old_schedule.id
                )
            
            return overlapping.first() is None
    
    def book_room(self, room_name: str, user_id: str, target_date: date,
                  start_time: time, end_time: time, 
                  note: Optional[str] = None) -> Optional[RoomSchedule]:
        """
        Book a room for a specific date and time.
        
        Args:
            room_id: ID of the room to book
            user_id: ID of the user making the booking
            target_date: Date to book
            start_time: Start time of booking
            end_time: End time of booking
            note: Optional note for the booking
            
        Returns:
            RoomSchedule object if successful, None if room is not available
        """
        with self.db_session() as session:
            # First check if the room can be booked
            room = self.get_room_by_name(room_name)
            if not room: return None
 
            new_schedule = RoomSchedule(
                room_id=room.id,
                user_id=user_id,
                date=target_date,
                start_time=start_time,
                end_time=end_time,
                status=RoomStatus.BOOKED,
                note=note
            )
            
            session.add(new_schedule)
            session.commit()
            session.refresh(new_schedule)
            return new_schedule
    
    def get_room_schedule(self, room_id: int, target_date: Optional[date] = None) -> List[RoomSchedule]:
        """
        Get all schedules for a specific room, optionally filtered by date.
        
        Args:
            room_id: ID of the room
            target_date: Optional date filter
            
        Returns:
            List of RoomSchedule objects
        """
        with self.db_session() as session:
            query = session.query(RoomSchedule).filter(RoomSchedule.room_id == room_id)
            
            if target_date:
                query = query.filter(RoomSchedule.date == target_date)
                
            return query.order_by(RoomSchedule.date, RoomSchedule.start_time).all()
    
    def get_user_bookings(self, user_id: str, 
                          from_date: Optional[date] = None) -> List[RoomSchedule]:
        """
        Get all bookings for a specific user.
        
        Args:
            user_id: ID of the user
            from_date: Optional start date filter (defaults to today)
            
        Returns:
            List of RoomSchedule objects
        """
        with self.db_session() as session:
            query = session.query(RoomSchedule).filter(RoomSchedule.user_id == user_id)
            
            if from_date:
                query = query.filter(RoomSchedule.date >= from_date)
            else:
                query = query.filter(RoomSchedule.date >= date.today())
                
            return query.order_by(RoomSchedule.date, RoomSchedule.start_time).all()
    
    def cancel_booking(self, schedule_id: int, user_id: str) -> bool:
        """
        Cancel a room booking. Only the user who made the booking can cancel it.
        
        Args:
            schedule_id: ID of the schedule to cancel
            user_id: ID of the user attempting to cancel
            
        Returns:
            bool: True if cancellation successful, False otherwise
        """
        with self.db_session() as session:
            schedule = session.query(RoomSchedule).filter(
                    RoomSchedule.id == schedule_id,
                    RoomSchedule.user_id == user_id
            ).first()
            
            if schedule:
                session.delete(schedule)
                session.commit()
                return True
            return False
    
    def validate_course_resources(self, resource_ids: List[int]) -> Dict:
        """
        Validate that all resource IDs exist in the library database.
        
        Args:
            resource_ids: List of resource IDs to validate
            
        Returns:
            Dict with:
            - valid (bool): Whether all resources exist
            - errors (List[str]): List of error messages for invalid resources
            - valid_resources (List[int]): List of valid resource IDs
        """
        errors = []
        valid_resources = []
        
        with self.db_session() as session:
            for resource_id in resource_ids:
                resource = session.query(LibraryResource).filter(
                    LibraryResource.id == resource_id
                ).first()
                
                if not resource:
                    errors.append(f"Resource ID {resource_id} does not exist in library database")
                else:
                    valid_resources.append(resource_id)
        
        return {
            "valid": len(errors) == 0,
            "errors": errors,
            "valid_resources": valid_resources
        }