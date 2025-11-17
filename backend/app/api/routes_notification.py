from fastapi import APIRouter, Body
from ..models import *
from ..services import *
from fastapi.responses import JSONResponse
from ..core import *
from fastapi import Depends, HTTPException, status, Cookie, Response
from sqlalchemy.orm import Session
from datetime import datetime, timezone, timedelta
from .auth import get_current_user_from_session

router = APIRouter()

@router.get("/notifications")
def get_notifications(
    current_user: MuSession = Depends(get_current_user_from_session)
):
    ###TODO
    return "OK"

@router.post("/notifications/read")
def read_notification(
    data: dict = Body(...),
    current_user: MuSession = Depends(get_current_user_from_session)
):
    course = data.get('courseData')
    return "OK"