from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services.lesson_plans_service import create_lesson_plan, delete_lesson_plan, get_lesson_plans_for_day
from app.schemas.lesson_plan_schema import GenerateLesson, GenerateAILesson
from app.services.chatgpt_service import generate_lesson_plan
from app.services.users_service import validate_id
import json

router = APIRouter()

@router.post("/generate")
def create_plan(plan: GenerateLesson, db: Session = Depends(get_db)):
    response = {"code": 0, "message": "", "status": "fail", "lesson_plan": None}
    try:
        if plan.datekey and plan.teachers_id and plan.topic and plan.plan:
            teacher_exists, t_id = validate_id(db,plan.teachers_id)
            if not teacher_exists:
                response["code"] = 0
                response["message"] = "Teacher id does not exist"
                response["status"] = "Fail"
                return response

            new_plan = create_lesson_plan(db, teacher_id=plan.teachers_id, plan=plan.plan, datekey=plan.datekey, topic=plan.topic, grade=plan.grade)
            if new_plan:
                response["code"] = 1
                response["message"] = "Plan created successfully"
                response["status"] = "success"
                response["lesson_plan"] = plan.plan

    except Exception as e:
        response["code"] = 0
        response["message"] = f"failed to create plan, error: {e}"
        response["status"] = "fail"

    return response

@router.delete("/delete")
def delete_plan(teacher_id: int = Query(..., description="The ID of the plan to delete"),
                datekey: str = Query(..., description="The date key of the lesson plan to delete"),
    db: Session = Depends(get_db)):
    response = {"code": 0, "message": "", "status": "fail"}

    try:
        if teacher_id and datekey:
            delete_lesson_plan(db, teacher_id, datekey)
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


@router.post("/generate/ai")
def generate_plan(plan: GenerateAILesson):
    response = {"code": 0, "message": "", "status": "fail", "lesson_plan": None}
    try:
        if plan.query and plan.grade:
            created, lesson_plan = generate_lesson_plan(topic=plan.query, grade_level=plan.grade)
            if created:
                response["code"] = 1
                response["message"] = "successfully generated lesson plan"
                response["status"] = "success"
                response["lesson_plan"] = lesson_plan
            else:
                response["code"] = 0
                response["message"] = lesson_plan
                response["status"] = "fail"

    except Exception as e:
        response["code"] = 0
        response["message"] = f"failed to create plan, error: {e}"
        response["status"] = "fail"

    return response

@router.get("/get")
def get_lesson_plans_by_day(teacher_id: int = Query(..., description="The ID of the teacher"),
                datekey: str = Query(..., description="The date key of the lesson plan"), db: Session = Depends(get_db)):
    response = {"code": 0, "message": "not all fields given", "status": "fail", "lesson_plans": []}
    try:
        if teacher_id and datekey:
            lesson_plans = get_lesson_plans_for_day(db=db, teacher_id=teacher_id, datekey=datekey)
            if lesson_plans:
                response["code"] = 1
                response["message"] = f"successfully retrieved lesson plans for {teacher_id}"
                response["status"] = "success"
                response["lesson_plans"] = lesson_plans
            else:
                response["code"] = 1
                response["message"] = f"No lesson plans found for id {teacher_id}"
                response["status"] = "success"
        else:
            response["code"] = 0
            response["message"] = f"missing teacher_id or datakey"
            response["status"] = "fail"
    except Exception as e:
        response["code"] = 0
        response["message"] = f"failed to retrieve lesson plans, error: {e}"
        response["status"] = "fail"

    return response

