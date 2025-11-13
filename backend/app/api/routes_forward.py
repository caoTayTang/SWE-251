from fastapi import APIRouter, Body
from ..models import*
from ..services import*
from fastapi.responses import JSONResponse
from ..core import*

router = APIRouter()

# GET /api/library?type={mode}&q={keyword}
# GET /api/library/:id
@router.get("/library")
def get_resource():
    ###TODO
    return "OK"

# POST /api/library/:id/download
@router.post("/library")
def download_resource(data: dict = Body(...)):
    #course = data.get('courseData')
    return "OK"

# POST /api/library/:id/download
@router.post("/library/attach")
def attach_resource(data: dict = Body(...)):
    docId = data.get('docId')
    classId = data.get('classId')
    tutorId = data.get('tutorId')
    return "OK"

