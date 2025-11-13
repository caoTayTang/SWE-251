from fastapi import APIRouter, Body
from ..models import*
from ..services import*
from fastapi.responses import JSONResponse
from ..core import*

router = APIRouter()
# GET /api/tutor/tracking/classes/:id
@router.get("/tutor/tracking/classes")
def track_tutor_class():
    ###TODO
    return "OK"

# GET /api/tutor/tracking/tutees/:id
@router.get("/tutor/tracking/tutees")
def track_tutor_tutee():
    ###TODO
    return "OK"

@router.post("/reports")
def create_report(data: dict = Body(...)):
    reportData = data.get('reportData')
    return "OK"
