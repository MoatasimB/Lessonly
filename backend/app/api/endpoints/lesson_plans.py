from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db

from app.schemas.lesson_plan_schema import generateLesson

router = APIRouter()

@router.post("/generate")
def generate_lesson_plan(plan: generateLesson, db: Session = Depends(get_db)):
    response = {"code": 0, "message": "", "status": "fail", "user_id": None}

