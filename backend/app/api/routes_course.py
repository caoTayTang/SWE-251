from fastapi import APIRouter, Body
from ..models import*
from ..services import*
from fastapi.responses import JSONResponse
from ..core import*

router = APIRouter()

@router.get("/tutor/courses")
def get_courses():
    ###TODO
    return "OK"

@router.post("/courses")
def create_course(data: dict = Body(...)):
    course = data.get('courseData')
    return "OK"

@router.put("/courses")
def modify_course(data: dict = Body(...)):
    course_id = data.get('id')
    course = data.get('updatedData')
    return "OK"

@router.delete("/courses")
def delete_course(data: dict = Body(...)):
    course_id = data.get('id')
    return "OK"

@router.get("/courses")
def get_courses_tutee():
    ###TODO
    return "OK"

@router.post("/enrollments")
def enroll_course(data: dict = Body(...)):
    course_id = data.get('courseId')
    tutee_id = data.get('tuteeId')
    return {"course_id":course_id,"tutee_id":tutee_id}

@router.delete("/enrollments")
def unregister_course(data: dict = Body(...)):
    course_id = data.get('courseId')
    tutee_id = data.get('tuteeId')
    return "OK"