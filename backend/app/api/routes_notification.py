from fastapi import APIRouter, Body
from ..models import*
from ..services import*
from fastapi.responses import JSONResponse
from ..core import*

router = APIRouter()

@router.get("/notifications")
def get_notifications():
    ###TODO
    return "OK"

@router.post("/notifications/read")
def read_notification(data: dict = Body(...)):
    course = data.get('courseData')
    return "OK"