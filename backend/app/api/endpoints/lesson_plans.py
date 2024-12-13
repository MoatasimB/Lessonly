from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services.lesson_plans_service import create_lesson_plan, delete_lesson_plan
from app.schemas.lesson_plan_schema import generateLesson
from app.services.chatgpt_service import generate_lesson_plan
from app.services.users_service import validate_id
import json

router = APIRouter()

@router.post("/generate")
def create_plan(plan: generateLesson, db: Session = Depends(get_db)):
    response = {"code": 0, "message": "not all fields given", "status": "fail", "lesson_plan": None}
    try:
        if plan.month and plan.day and plan.year and plan.teachers_id and plan.topic and plan.grade:
            teacher_exists, t_id = validate_id(db,plan.teachers_id)
            if not teacher_exists:
                response["code"] = 0
                response["message"] = "Teacher id does not exist"
                response["status"] = "Fail"
                return response

            created, lesson_plan = generate_lesson_plan(topic=plan.topic, grade_level=plan.grade)
            if not created:
                response["code"] = 0
                response["message"] = lesson_plan
                response["status"] = "Fail"
                return response
            string_lesson_plan = json.dumps(lesson_plan)
            new_plan = create_lesson_plan(db, teacher_id=plan.teachers_id, plan=string_lesson_plan, month=plan.month, day=plan.day, year=plan.year, topic=plan.topic, grade=plan.grade)
            if new_plan:
                response["code"] = 1
                response["message"] = "Plan created successfully"
                response["status"] = "success"
                response["lesson_plan"] = lesson_plan

    except Exception as e:
        response["code"] = 0
        response["message"] = f"failed to create plan, error: {e}"
        response["status"] = "fail"

    return response

@router.delete("/delete")
def delete_plan(teacher_id: int = Query(..., description="The ID of the plan to delete"),
                month: int = Query(..., description="The month of the lesson plan"),
    day: int = Query(..., description="The day of the lesson plan"),
    year: int =Query(..., description="The year of the lesson plan"),
    db: Session = Depends(get_db)):
    response = {"code": 0, "message": "not all fields given", "status": "fail"}

    try:
        if teacher_id and month and day and year:
            delete_lesson_plan(db, teacher_id, month, day, year)
            response["code"] = 1
            response["message"] = "Deleted successfully"
            response["status"] = "success"
        else:
            return response
    except Exception as e:
        response["code"] = 0
        response["message"] = f"failed to delete plan, error: {e}"
        response["status"] = "fail"
    return response