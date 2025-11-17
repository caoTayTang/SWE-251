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

# GET /api/library?type={mode}&q={keyword}
@router.get("/library")
def get_resource(
    type: str | None = None,     # /library?type=video
    q: str | None = None,         # /library?q=python
    current_user: MuSession = Depends(get_current_user_from_session)
):
    return {"type": type, "q": q}

# GET /api/library/:id
@router.get("/library/{id}")
def get_resource_by_id(
    id: int,
    current_user: MuSession = Depends(get_current_user_from_session)
):
    return {"id": id}

# POST /api/library/:id/download
@router.post("/library")
def download_resource(
    data: dict = Body(...), #id in body
    current_user: MuSession = Depends(get_current_user_from_session)
):
    return data

# POST /api/library/attach
@router.post("/library/attach")
def attach_resource(
    data: dict = Body(...),
    current_user: MuSession = Depends(get_current_user_from_session)
):
    docId = data.get('docId')
    classId = data.get('classId')
    tutorId = data.get('tutorId')
    return "OK"

