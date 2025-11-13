from fastapi import APIRouter, Body
from ..models import*
from ..services import*
from fastapi.responses import JSONResponse
from ..core import*

router = APIRouter()

@router.get("/feedback")
def get_feedback():
    ###TODO
    return "OK"

@router.get("/feedback/topics")
def get_feedback_topics():
    ###TODO
    return "OK"

@router.post("/feedback")
def create_feedback(data: dict = Body(...)):
    feedback = data.get('feedbackData')
    return "OK"