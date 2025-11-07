# app/models/course.py
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class Course(BaseModel):
    id: int
    name: str = Field(..., alias="title")  # Support both 'name' and 'title'
    instructor: str = Field(..., alias="tutor_name")
    instructor_email: Optional[str] = Field(None, alias="tutor_email")
    instructor_rating: Optional[float] = Field(4.5, alias="tutor_rating")
    description: Optional[str] = ""
    subject: Optional[str] = None
    level: Optional[str] = "beginner"  # beginner, intermediate, advanced
    status: str  # pending, confirmed, open, full, closed
    enrollments: int = Field(..., alias="enrolled_count")
    maxSlots: int = Field(..., alias="max_students")
    startTime: str = Field(..., alias="start_date")
    endTime: str = Field(..., alias="end_date")
    schedule: Optional[str] = None  # e.g., "Thứ 2, 4, 6 - 18:00-20:00"
    format: str  # online, offline, hybrid
    location: str
    is_enrolled: Optional[bool] = None
    tutor_id: Optional[int] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    
    class Config:
        populate_by_name = True  # Allow both original and alias names

class CreateCourseRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=200, description="Course name/title")
    instructor: Optional[str] = None  # Will be set from current user
    description: str = Field("", max_length=1000)
    subject: Optional[str] = None
    level: str = Field("beginner", pattern="^(beginner|intermediate|advanced)$")
    maxSlots: int = Field(..., ge=1, le=100, description="Maximum number of students")
    startTime: str = Field(..., description="Start date (YYYY-MM-DD or ISO format)")
    endTime: str = Field(..., description="End date (YYYY-MM-DD or ISO format)")
    schedule: str = Field(..., description="Class schedule, e.g., 'Thứ 2, 4, 6 - 18:00-20:00'")
    format: str = Field(..., pattern="^(online|offline|hybrid)$")
    location: str = Field(..., min_length=1, description="Location or meeting link")
    
class UpdateCourseRequest(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    subject: Optional[str] = None
    level: Optional[str] = Field(None, pattern="^(beginner|intermediate|advanced)$")
    maxSlots: Optional[int] = Field(None, ge=1, le=100)
    startTime: Optional[str] = None
    endTime: Optional[str] = None
    schedule: Optional[str] = None
    format: Optional[str] = Field(None, pattern="^(online|offline|hybrid)$")
    location: Optional[str] = None
    status: Optional[str] = Field(None, pattern="^(pending|confirmed|open|full|closed)$")

class EnrollmentResponse(BaseModel):
    success: bool
    message: str
    course_id: Optional[int] = None
    enrolled_count: Optional[int] = None

class CourseStudent(BaseModel):
    id: int
    name: str
    email: str
    enrolled_date: str
    status: str = "active"  # active, completed, dropped

class CourseDetailResponse(Course):
    students: Optional[list[CourseStudent]] = []
    can_enroll: bool = True
    enrollment_message: Optional[str] = None