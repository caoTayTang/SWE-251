from fastapi import APIRouter, Body
from ..models import *
from ..services import *
from fastapi.responses import JSONResponse
from ..core import *
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from .auth import get_current_user_from_session

router = APIRouter()

record_service = MeetingRecordService(mututor_session)
course_service = CourseService(mututor_session)

@router.get("/courses/{course_id}/records")
def get_course_records(
    course_id: int,
    current_user: MuSession = Depends(get_current_user_from_session)
):
    """Get all meeting records for a course (tutor only for their courses, admin can view all)"""
    if current_user.role not in [UserRole('tutor'), UserRole('admin')]:
        raise HTTPException(status_code=403, detail="Not authorized, requires TUTOR or ADMIN role")
    
    try:
        course = course_service.get_by_id(course_id)
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")

        if current_user.role == UserRole('tutor') and course.tutor_id != current_user.user_id:
            raise HTTPException(status_code=403, detail="You can only view records for your own courses")
        
        records = record_service.get_by_course(course_id)
        
        records_data = []
        for record in records:
            records_data.append({
                "id": record.id,
                "course_id": record.course_id,
                "tutor_id": record.tutor_id,
                "attendees": record.attendees,
                "discussion_points": record.discussion_points,
                "created_at": record.created_at.isoformat(),
                "updated_at": record.updated_at.isoformat()
            })
        
        return {
            "status": "success",
            "course_id": course_id,
            "course_title": course.title,
            "total_records": len(records_data),
            "records": records_data
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get meeting records: {str(e)}")

@router.post("/courses/{course_id}/records")
def create_course_record(
    course_id: int,
    data: dict = Body(...),
    current_user: MuSession = Depends(get_current_user_from_session)
):
    """Create a new meeting record for a course (tutor only for their courses)"""
    if current_user.role != UserRole('tutor'):
        raise HTTPException(status_code=403, detail="Not authorized, requires TUTOR role")
    
    record_data = data.get('recordData')
    
    if not record_data:
        raise HTTPException(status_code=400, detail="Missing recordData")
    
    try:
        course = course_service.get_by_id(course_id)
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")

        if course.tutor_id != current_user.user_id:
            raise HTTPException(status_code=403, detail="You can only create records for your own courses")
        
        attendees = record_data.get('attendees')
        discussion_points = record_data.get('discussionPoints')
        
        if not discussion_points:
            raise HTTPException(status_code=400, detail="Missing required field: discussionPoints")
        
        record = record_service.create(
            course_id=course_id,
            tutor_id=current_user.user_id,
            attendees=attendees,
            discussion_points=discussion_points
        )
        
        return {
            "status": "success",
            "message": "Meeting record created successfully",
            "record": {
                "id": record.id,
                "course_id": record.course_id,
                "tutor_id": record.tutor_id,
                "attendees": record.attendees,
                "discussion_points": record.discussion_points,
                "created_at": record.created_at.isoformat()
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create meeting record: {str(e)}")

@router.put("/records/{record_id}")
def update_meeting_record(
    record_id: int,
    data: dict = Body(...),
    current_user: MuSession = Depends(get_current_user_from_session)
):
    """Update a meeting record (tutor only for their own records)"""
    if current_user.role != UserRole('tutor'):
        raise HTTPException(status_code=403, detail="Not authorized, requires TUTOR role")
    
    updated_data = data.get('updatedData')
    
    if not updated_data:
        raise HTTPException(status_code=400, detail="Missing updatedData")
    
    try:
        record = record_service.get_by_id(record_id)
        if not record:
            raise HTTPException(status_code=404, detail="Meeting record not found")

        if record.tutor_id != current_user.user_id:
            raise HTTPException(status_code=403, detail="You can only update your own records")
        
        updated_record = record_service.update(
            record_id=record_id,
            attendees=updated_data.get('attendees'),
            discussion_points=updated_data.get('discussionPoints')
        )
        
        if not updated_record:
            raise HTTPException(status_code=500, detail="Failed to update meeting record")
        
        return {
            "status": "success",
            "message": "Meeting record updated successfully",
            "record": {
                "id": updated_record.id,
                "course_id": updated_record.course_id,
                "attendees": updated_record.attendees,
                "discussion_points": updated_record.discussion_points,
                "updated_at": updated_record.updated_at.isoformat()
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update meeting record: {str(e)}")

@router.delete("/records/{record_id}")
def delete_meeting_record(
    record_id: int,
    current_user: MuSession = Depends(get_current_user_from_session)
):
    """Delete a meeting record (tutor only for their own records)"""
    if current_user.role != UserRole('tutor'):
        raise HTTPException(status_code=403, detail="Not authorized, requires TUTOR role")
    
    try:
        record = record_service.get_by_id(record_id)
        if not record:
            raise HTTPException(status_code=404, detail="Meeting record not found")
        
        if record.tutor_id != current_user.user_id:
            raise HTTPException(status_code=403, detail="You can only delete your own records")
        
        success = record_service.delete(record_id)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to delete meeting record")
        
        return {
            "status": "success",
            "message": "Meeting record deleted successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete meeting record: {str(e)}")