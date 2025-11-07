# from fastapi import APIRouter
# from typing import List
# from datetime import datetime
# from app.models.course import Course, CreateCourseRequest

# router = APIRouter(prefix="/courses", tags=["Courses"])

# # Mock data
# courses = [
#     {
#         'id': 1, 'name': 'Introduction to Python', 'instructor': 'Dr. Jane Doe',
#         'status': 'confirmed', 'enrollments': 8, 'maxSlots': 10,
#         'startTime': '2025-11-05T10:00', 'endTime': '2025-11-05T12:00',
#         'format': 'online', 'location': 'Zoom Link'
#     },
#     {
#         'id': 2, 'name': 'Advanced Mathematics', 'instructor': 'Prof. John Smith',
#         'status': 'confirmed', 'enrollments': 15, 'maxSlots': 20,
#         'startTime': '2025-11-06T14:00', 'endTime': '2025-11-06T16:00',
#         'format': 'offline', 'location': 'Room A101'
#     },
#     {
#         'id': 3, 'name': 'Web Development Basics', 'instructor': 'Dr. Jane Doe',
#         'status': 'pending', 'enrollments': 5, 'maxSlots': 12,
#         'startTime': '2025-11-07T09:00', 'endTime': '2025-11-07T11:00',
#         'format': 'online', 'location': 'Google Meet'
#     }
# ]

# # Get all courses
# @router.get("/", response_model=List[Course])
# def get_courses():
#     return courses

# # Create a new course
# @router.post("/", response_model=dict)
# def create_course(course: CreateCourseRequest):
#     new_course = course.dict()
#     new_course['id'] = int(datetime.now().timestamp())
#     new_course['status'] = 'pending'
#     new_course['enrollments'] = 0
#     courses.append(new_course)
#     return {'success': True, 'id': new_course['id']}

# # Enroll in course
# @router.post("/{course_id}/enroll", response_model=dict)
# def enroll_in_course(course_id: int):
#     for c in courses:
#         if c['id'] == course_id:
#             if c['enrollments'] < c['maxSlots']:
#                 c['enrollments'] += 1
#                 return {'success': True, 'message': f"Enrolled in {c['name']}"}
#             else:
#                 return {'success': False, 'message': "Course is full"}
#     return {'success': False, 'message': "Course not found"}

# # Unenroll from course
# @router.post("/{course_id}/unenroll", response_model=dict)
# def unenroll_from_course(course_id: int):
#     for c in courses:
#         if c['id'] == course_id:
#             if c['enrollments'] > 0:
#                 c['enrollments'] -= 1
#                 return {'success': True, 'message': f"Unenrolled from {c['name']}"}
#             else:
#                 return {'success': False, 'message': "No students enrolled"}
#     return {'success': False, 'message': "Course not found"}

# backend/app/api/courses.py
from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from pydantic import BaseModel
from datetime import date

router = APIRouter(prefix="/api", tags=["courses"])

# ============= REQUEST/RESPONSE MODELS =============

class CourseCreate(BaseModel):
    title: str
    description: str
    max_students: int
    schedule: str
    location: str
    start_date: date
    end_date: date
    subject: str
    level: str  # beginner, intermediate, advanced

class CourseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    max_students: Optional[int] = None
    schedule: Optional[str] = None
    location: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    subject: Optional[str] = None
    level: Optional[str] = None

class CourseResponse(BaseModel):
    id: int
    title: str
    description: str
    tutor_id: int
    tutor_name: str
    tutor_email: str
    tutor_rating: float
    enrolled_count: int
    max_students: int
    schedule: str
    location: str
    start_date: date
    end_date: date
    subject: str
    level: str
    status: str  # open, full, closed
    is_enrolled: Optional[bool] = None

class EnrollmentResponse(BaseModel):
    success: bool
    message: str
    course_id: int

# ============= DEPENDENCY: Get Current User =============
# Replace this with your actual authentication logic
async def get_current_user():
    # Mock user for development
    return {
        "id": 1,
        "name": "Nguyễn Văn A",
        "email": "nguyenvana@hcmut.edu.vn",
        "role": "tutor"  # or "tutee"
    }

# ============= TUTOR ENDPOINTS =============

@router.get("/tutor/courses", response_model=List[CourseResponse])
async def get_tutor_courses(current_user: dict = Depends(get_current_user)):
    """
    Get all courses created by the current tutor
    Following sequence diagram: "Lấy danh sách các khóa học"
    """
    # TODO: Implement database query
    # Example:
    # courses = db.query(Course).filter(Course.tutor_id == current_user["id"]).all()
    
    # Mock data for development
    return [
        {
            "id": 1,
            "title": "Giải tích 1",
            "description": "Khóa học Giải tích 1 dành cho sinh viên năm nhất",
            "tutor_id": current_user["id"],
            "tutor_name": current_user["name"],
            "tutor_email": current_user["email"],
            "tutor_rating": 4.8,
            "enrolled_count": 12,
            "max_students": 20,
            "schedule": "Thứ 2, 4, 6 - 18:00-20:00",
            "location": "H1-201",
            "start_date": "2025-11-10",
            "end_date": "2026-01-20",
            "subject": "Toán",
            "level": "beginner",
            "status": "open"
        }
    ]

@router.post("/tutor/courses", response_model=CourseResponse)
async def create_course(
    course_data: CourseCreate,
    current_user: dict = Depends(get_current_user)
):
    """
    Create a new course
    Following sequence diagram: "Gửi yêu cầu đăng ký khóa học" -> "Kiểm tra dữ liệu kiện"
    """
    # Validate data
    if not course_data.title or not course_data.description:
        raise HTTPException(status_code=400, detail="Thiếu thông tin bắt buộc")
    
    if course_data.max_students <= 0:
        raise HTTPException(status_code=400, detail="Số lượng sinh viên phải lớn hơn 0")
    
    # TODO: Save to database
    # new_course = Course(**course_data.dict(), tutor_id=current_user["id"])
    # db.add(new_course)
    # db.commit()
    # db.refresh(new_course)
    
    # Mock response
    return {
        "id": 999,  # Generated ID
        "title": course_data.title,
        "description": course_data.description,
        "tutor_id": current_user["id"],
        "tutor_name": current_user["name"],
        "tutor_email": current_user["email"],
        "tutor_rating": 4.5,
        "enrolled_count": 0,
        "max_students": course_data.max_students,
        "schedule": course_data.schedule,
        "location": course_data.location,
        "start_date": course_data.start_date,
        "end_date": course_data.end_date,
        "subject": course_data.subject,
        "level": course_data.level,
        "status": "open"
    }

@router.put("/tutor/courses/{course_id}", response_model=CourseResponse)
async def update_course(
    course_id: int,
    course_data: CourseUpdate,
    current_user: dict = Depends(get_current_user)
):
    """
    Update an existing course
    Following sequence diagram: "Cập nhật danh sách thành gia"
    """
    # TODO: Check if course exists and belongs to current tutor
    # course = db.query(Course).filter(
    #     Course.id == course_id,
    #     Course.tutor_id == current_user["id"]
    # ).first()
    # 
    # if not course:
    #     raise HTTPException(status_code=404, detail="Không tìm thấy khóa học")
    
    # TODO: Update course fields
    # for field, value in course_data.dict(exclude_unset=True).items():
    #     setattr(course, field, value)
    # db.commit()
    
    # Mock response
    return {
        "id": course_id,
        "title": course_data.title or "Updated Course",
        "description": course_data.description or "Updated description",
        "tutor_id": current_user["id"],
        "tutor_name": current_user["name"],
        "tutor_email": current_user["email"],
        "tutor_rating": 4.5,
        "enrolled_count": 10,
        "max_students": course_data.max_students or 20,
        "schedule": course_data.schedule or "TBD",
        "location": course_data.location or "TBD",
        "start_date": course_data.start_date or "2025-11-01",
        "end_date": course_data.end_date or "2026-01-01",
        "subject": course_data.subject or "General",
        "level": course_data.level or "beginner",
        "status": "open"
    }

@router.delete("/tutor/courses/{course_id}")
async def delete_course(
    course_id: int,
    current_user: dict = Depends(get_current_user)
):
    """
    Delete a course
    Following sequence diagram: "Chọn khóa học muốn hủy đăng ký lý do"
    """
    # TODO: Check if course exists and belongs to current tutor
    # course = db.query(Course).filter(
    #     Course.id == course_id,
    #     Course.tutor_id == current_user["id"]
    # ).first()
    # 
    # if not course:
    #     raise HTTPException(status_code=404, detail="Không tìm thấy khóa học")
    
    # Check if there are enrolled students
    # if course.enrolled_count > 0:
    #     raise HTTPException(
    #         status_code=400,
    #         detail="Không thể xóa khóa học đã có sinh viên đăng ký"
    #     )
    
    # TODO: Delete from database
    # db.delete(course)
    # db.commit()
    
    return {
        "success": True,
        "message": "Xóa khóa học thành công"
    }

@router.get("/tutor/courses/{course_id}/students")
async def get_course_students(
    course_id: int,
    current_user: dict = Depends(get_current_user)
):
    """
    Get list of students enrolled in a course
    Following sequence diagram: "Cập nhật danh sách thành gia" -> "Gửi thông báo cho Tutee"
    """
    # TODO: Verify course ownership and fetch students
    # course = db.query(Course).filter(
    #     Course.id == course_id,
    #     Course.tutor_id == current_user["id"]
    # ).first()
    # 
    # if not course:
    #     raise HTTPException(status_code=404, detail="Không tìm thấy khóa học")
    
    # Mock data
    return [
        {
            "id": 1,
            "name": "Trần Văn B",
            "email": "tranvanb@hcmut.edu.vn",
            "enrolled_date": "2025-11-01"
        }
    ]

# ============= TUTEE ENDPOINTS =============

@router.get("/tutee/courses", response_model=List[CourseResponse])
async def get_available_courses(
    search: Optional[str] = None,
    status: Optional[str] = None,
    subject: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """
    Get all available courses for enrollment
    Following sequence diagram: "Mở danh sách các khóa đã đăng ký"
    """
    # TODO: Build query with filters
    # query = db.query(Course).filter(Course.status.in_(["open", "full"]))
    # 
    # if search:
    #     query = query.filter(
    #         (Course.title.ilike(f"%{search}%")) |
    #         (Course.description.ilike(f"%{search}%"))
    #     )
    # 
    # if status:
    #     query = query.filter(Course.status == status)
    # 
    # if subject:
    #     query = query.filter(Course.subject == subject)
    
    # Mock data
    return [
        {
            "id": 1,
            "title": "Giải tích 1",
            "description": "Khóa học Giải tích 1 dành cho sinh viên năm nhất",
            "tutor_id": 2,
            "tutor_name": "Nguyễn Văn A",
            "tutor_email": "nguyenvana@hcmut.edu.vn",
            "tutor_rating": 4.8,
            "enrolled_count": 12,
            "max_students": 20,
            "schedule": "Thứ 2, 4, 6 - 18:00-20:00",
            "location": "H1-201",
            "start_date": "2025-11-10",
            "end_date": "2026-01-20",
            "subject": "Toán",
            "level": "beginner",
            "status": "open",
            "is_enrolled": False
        }
    ]

@router.get("/tutee/enrolled-courses", response_model=List[CourseResponse])
async def get_enrolled_courses(current_user: dict = Depends(get_current_user)):
    """
    Get courses that the current tutee is enrolled in
    Following sequence diagram: "Hiển thị danh sách khóa học"
    """
    # TODO: Get enrolled courses from database
    # enrollments = db.query(Enrollment).filter(
    #     Enrollment.student_id == current_user["id"]
    # ).all()
    
    # Mock data
    return []

@router.post("/tutee/courses/{course_id}/enroll", response_model=EnrollmentResponse)
async def enroll_in_course(
    course_id: int,
    current_user: dict = Depends(get_current_user)
):
    """
    Enroll in a course
    Following sequence diagram: "Hủy đăng ký khóa học" -> "Cập nhật danh sách thành gia"
    """
    # TODO: Check if course exists
    # course = db.query(Course).filter(Course.id == course_id).first()
    # if not course:
    #     raise HTTPException(status_code=404, detail="Không tìm thấy khóa học")
    
    # Check if already enrolled
    # existing = db.query(Enrollment).filter(
    #     Enrollment.course_id == course_id,
    #     Enrollment.student_id == current_user["id"]
    # ).first()
    # if existing:
    #     raise HTTPException(status_code=400, detail="Bạn đã đăng ký khóa học này")
    
    # Check if course is full
    # if course.enrolled_count >= course.max_students:
    #     raise HTTPException(status_code=400, detail="Khóa học đã đầy")
    
    # TODO: Create enrollment
    # enrollment = Enrollment(
    #     course_id=course_id,
    #     student_id=current_user["id"]
    # )
    # db.add(enrollment)
    # course.enrolled_count += 1
    # db.commit()
    
    # TODO: Send notification to tutor
    # NotificationService.send_enrollment_notification(course, current_user)
    
    return {
        "success": True,
        "message": "Đăng ký khóa học thành công",
        "course_id": course_id
    }

@router.delete("/tutee/courses/{course_id}/unenroll")
async def unenroll_from_course(
    course_id: int,
    current_user: dict = Depends(get_current_user)
):
    """
    Unenroll from a course
    Following sequence diagram: "Hiển thị hủy khóa học thành công"
    """
    # TODO: Check if enrolled
    # enrollment = db.query(Enrollment).filter(
    #     Enrollment.course_id == course_id,
    #     Enrollment.student_id == current_user["id"]
    # ).first()
    # 
    # if not enrollment:
    #     raise HTTPException(status_code=404, detail="Bạn chưa đăng ký khóa học này")
    
    # TODO: Delete enrollment
    # db.delete(enrollment)
    # course = db.query(Course).filter(Course.id == course_id).first()
    # course.enrolled_count -= 1
    # db.commit()
    
    # TODO: Send notification to tutor
    # NotificationService.send_unenrollment_notification(course, current_user)
    
    return {
        "success": True,
        "message": "Hủy đăng ký thành công"
    }

# ============= COMMON ENDPOINTS =============

@router.get("/courses", response_model=List[CourseResponse])
async def get_all_courses():
    """
    Get all courses (public endpoint for browsing)
    """
    # TODO: Get from database
    return []

@router.get("/courses/{course_id}", response_model=CourseResponse)
async def get_course_detail(course_id: int):
    """
    Get detailed information about a specific course
    Following sequence diagram: "Truy vấn các khóa học"
    """
    # TODO: Get from database
    # course = db.query(Course).filter(Course.id == course_id).first()
    # if not course:
    #     raise HTTPException(status_code=404, detail="Không tìm thấy khóa học")
    
    # Mock data
    return {
        "id": course_id,
        "title": "Giải tích 1",
        "description": "Khóa học Giải tích 1 dành cho sinh viên năm nhất",
        "tutor_id": 1,
        "tutor_name": "Nguyễn Văn A",
        "tutor_email": "nguyenvana@hcmut.edu.vn",
        "tutor_rating": 4.8,
        "enrolled_count": 12,
        "max_students": 20,
        "schedule": "Thứ 2, 4, 6 - 18:00-20:00",
        "location": "H1-201",
        "start_date": "2025-11-10",
        "end_date": "2026-01-20",
        "subject": "Toán",
        "level": "beginner",
        "status": "open"
    }