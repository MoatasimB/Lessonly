from sqlalchemy.orm import Session
from app.db.models import LessonPlan


def create_lesson_plan(db: Session, teacher_id: int, month: int, day: int, year: int, plan: str, topic:str, grade:str):
    lesson_plan = LessonPlan(
        teacher_id=teacher_id, month=month, day=day, year=year, plan=plan, topic=topic, grade=grade
    )
    db.add(lesson_plan)
    db.commit()
    db.refresh(lesson_plan)
    return lesson_plan


def get_lesson_plan_for_day(db: Session, teacher_id: int, month: int, day: int, year: int):
    lesson_plan = db.query(LessonPlan).filter(
        LessonPlan.teacher_id == teacher_id,
        LessonPlan.month == month,
        LessonPlan.day == day,
        LessonPlan.year == year,
    ).first()
    if not lesson_plan:
        return {"error": "No lesson plan found for the specified day"}
    return lesson_plan

def delete_lesson_plan(db: Session, plan_id: int):
    try:
        plan = db.query(LessonPlan).filter(LessonPlan.id==plan_id).first()
        if plan:
            db.delete(plan)
            db.commit()
            return {"message": f"User with ID {plan_id} deleted successfully"}
        else:
            return {"error": "User not found"}
    except Exception as e:
        db.rollback()
        raise e