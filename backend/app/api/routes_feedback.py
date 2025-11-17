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

feedback_service = FeedbackService(mututor_session)
notification_service = NotificationService(mututor_session)

@router.get("/feedback")
def get_feedback(
   current_user: MuSession = Depends(get_current_user_from_session)
):
    if current_user.role != UserRole('tutor') or current_user.role != UserRole('admin'):
        raise HTTPException(status_code=403, detail="Not authorized, requires TUTOR or ADMIN role")
    ###TODO
    return "OK"

@router.get("/feedback/topics")
def get_feedback_topics(
   current_user: MuSession = Depends(get_current_user_from_session)
):
    if current_user.role != UserRole('tutor') or current_user.role != UserRole('admin'):
        raise HTTPException(status_code=403, detail="Not authorized, requires TUTOR or ADMIN role")
    ###TODO
    return "OK"

@router.post("/feedback")
def create_feedback(
    data: dict = Body(...),
    current_user: MuSession = Depends(get_current_user_from_session)
):
    if current_user.role != UserRole('tutor') or current_user.role != UserRole('admin'):
        raise HTTPException(status_code=403, detail="Not authorized, requires TUTOR or ADMIN role")
    
    feedback = data.get('feedbackData')
    
    return "OK"