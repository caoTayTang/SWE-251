from fastapi import APIRouter, Body
from ..models import*
from ..services import*
from fastapi.responses import JSONResponse
from ..core import*


router = APIRouter()
#logger = get_logger('BDD API2')

@router.get("/roles")
def get_role():
    return [
            { 'id': 'TUTOR', 'label': 'Tutor', 'description': 'Dành cho sinh viên muốn dạy kèm' },
            { 'id': 'TUTEE', 'label': 'Tutee', 'description': 'Dành cho sinh viên cần học thêm' },
            { 'id': 'ADMIN', 'label': 'Admin', 'description': 'Quản trị hệ thống' },
         ]

@router.post("/login")
def login(data: dict = Body(...)):
    usename = data.get("username")
    password = data.get("password")
    role = data.get("role")

    #TODO

    return [
            { 'id': 'TUTOR', 'label': 'Tutor', 'description': 'Dành cho sinh viên muốn dạy kèm' },
            { 'id': 'TUTEE', 'label': 'Tutee', 'description': 'Dành cho sinh viên cần học thêm' },
            { 'id': 'ADMIN', 'label': 'Admin', 'description': 'Quản trị hệ thống' },
         ]


