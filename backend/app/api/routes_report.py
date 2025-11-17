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

@router.get("/tutor/tracking/classes")
def track_tutor_class(
    current_user: MuSession = Depends(get_current_user_from_session)
):
    if current_user.role != UserRole('admin'):
        raise HTTPException(status_code=403, detail="Not authorized, requires ADMIN role")
    ###TODO
    return "OK"

# GET /api/tutor/tracking/classes/:id
@router.get("/tutor/tracking/classes/{id}")
def track_tutor_tutee(
    id: int,
    current_user: MuSession = Depends(get_current_user_from_session)
):
    if current_user.role != UserRole('admin'):
        raise HTTPException(status_code=403, detail="Not authorized, requires ADMIN role")
    
    if id is None:
        # return all classes
        return {"all": True}
    
    # return specific class
    return {"id": id}

@router.get("/tutor/tracking/tutees")
def track_tutor_tutee(
    current_user: MuSession = Depends(get_current_user_from_session)
):
    if current_user.role != UserRole('admin'):
        raise HTTPException(status_code=403, detail="Not authorized, requires ADMIN role")
    ###TODO
    return "OK"

# GET /api/tutor/tracking/tutees/:id
@router.get("/tutor/tracking/tutees/{id}")
def track_tutor_tutee(
    id: int,
    current_user: MuSession = Depends(get_current_user_from_session)
):
    if current_user.role != UserRole('admin'):
        raise HTTPException(status_code=403, detail="Not authorized, requires ADMIN role")
    
    if id is None:
        # return all tutees
        return {"all": True}
    
    # return specific tutee
    return {"id": id}

@router.post("/reports")
def create_report(
    data: dict = Body(...),
    current_user: MuSession = Depends(get_current_user_from_session)
):
    if current_user.role != UserRole('admin'):
        raise HTTPException(status_code=403, detail="Not authorized, requires ADMIN role")
    reportData = data.get('reportData')
    return "OK"
