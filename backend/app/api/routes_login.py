from fastapi import APIRouter, Body, Cookie
from ..models import *
from ..services import *
from fastapi.responses import JSONResponse
from ..core import*
from fastapi import Depends, HTTPException, status, Cookie, Response
from datetime import datetime, timezone, timedelta
import uuid
from ..hcmut_database import*
from typing import Optional

logger = get_logger("LOGIN")
router = APIRouter()
user_service = UserService(mututor_session)
session_service = SessionService(mututor_session)

@router.get("/roles")
def get_role():
    return [
            { 'id': 'TUTOR', 'label': 'Tutor', 'description': 'Dành cho sinh viên muốn dạy kèm' },
            { 'id': 'TUTEE', 'label': 'Tutee', 'description': 'Dành cho sinh viên cần học thêm' },
            { 'id': 'ADMIN', 'label': 'Admin', 'description': 'Quản trị hệ thống' },
         ]

@router.get("/me")
def me(session_id: Optional[str] = Cookie(None)): 
    print(f"DEBUG COOKIE: {session_id}")
    if not session_id:
        raise HTTPException(
            status_code=401, 
            detail="Not authenticated (No Cookie found)"
        )

    current_user = session_service.get_by_session_id(session_id)
    if not current_user:
        raise HTTPException(
        status_code=401,
        detail=f"Invalid session id",
    )

    return {
        'user_id': current_user.user_id,
        'role': current_user.role,
    }
    

    

@router.post("/login")
def login(
    response: Response, 
    data: dict = Body(...), 
):
    username = data.get("username")
    password = data.get("password")
    role = data.get("role")
    
    # logger.info(role.__len__())
    if not hcmut_api.check_password(username, password) :
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
        )

    user = hcmut_api.get_user_by_username(username)
    user_id = user.id
    if role.lower() == 'tutor' or role.lower() == 'admin':
        mu_user = user_service.get_by_id(user_id)
        print("LOG ROLE: ", mu_user, role)
        if not mu_user or mu_user.role.lower() != role.lower():
            raise HTTPException(
            status_code=403,
            detail=f"You don't have permission to login as {role}",
        )

    session = MuSession(
        session_id=str(uuid.uuid4()),
        user_id=user.id,
        role= UserRole(role.lower()),
        expires_at= datetime.now(timezone.utc) + timedelta(hours=1)
    )
    db = mututor_session()

    old_session = db.query(MuSession).filter(MuSession.user_id == user_id).first()
    if old_session:
        db.delete(old_session)
        db.commit()

    db.add(session)
    db.commit()
    db.close()

    response.set_cookie(
        key="session_id",
        value=session.session_id,
        httponly=True,  
        secure=True,    
        samesite="none",
    )
    
    return {"username": user.username, "role": role, "status": "Login successful"}

@router.post("/logout")
def logout(
    response: Response,
    session_id: str | None = Cookie(None), 
):
    db = mututor_session()
    if session_id:
        session = db.query(MuSession).filter(MuSession.session_id == session_id).first()
        if session:
            db.delete(session)
            db.commit()

    db.close()
    response.delete_cookie(key="session_id")
    return {"status": "Logout successful"}

