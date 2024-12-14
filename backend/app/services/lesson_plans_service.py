from asyncio import exceptions

from sqlalchemy.orm import Session
from app.db.models import LessonPlan


def create_lesson_plan(db: Session, teacher_id: int, datekey:str, plan: str, topic:str, grade:str):
    lesson_plan = None
    try:
        lesson_plan = LessonPlan(
            teacher_id=teacher_id, datekey=datekey, plan=plan, topic=topic, grade=grade
        )
        db.add(lesson_plan)
        db.commit()
        db.refresh(lesson_plan)
    except Exception as e:
        print(e)

    return lesson_plan


def get_lesson_plans_for_day(db: Session, teacher_id: int, datekey:str):
    topic_plans = []
    try:
        lesson_plans = db.query(LessonPlan).filter(
            LessonPlan.teacher_id == teacher_id,
            LessonPlan.datekey == datekey,
        ).all()
        if lesson_plans:
            for lesson_plan in lesson_plans:
                topic_plan = {
                    "topic": lesson_plan.topic,
                    "plan": lesson_plan.plan
                }
                topic_plans.append(topic_plan)
    except Exception as e:
        print(e)

    return topic_plans

def get_lesson_plan_by_topic(db: Session, teacher_id:int, topic: str , datekey:str):
    lesson_plan = None
    try:
        lesson_plan = db.query(LessonPlan).filter(LessonPlan.topic == topic, LessonPlan.teacher_id==teacher_id, LessonPlan.datekey==datekey).first()
    except Exception as e:
        print(e)
    return lesson_plan

def delete_lesson_plan(db: Session, teachers_id: int, datekey:str, topic:str):
    try:
        plan = db.query(LessonPlan).filter(
       LessonPlan.teacher_id==teachers_id,
                LessonPlan.datekey==datekey,
                LessonPlan.topic==topic,
            ).first()
        if plan:
            db.delete(plan)
            db.commit()
            return {"message": f"User with ID {teachers_id, datekey} deleted successfully"}
        else:
            return {"error": "User not found"}
    except Exception as e:
        db.rollback()
        raise e

def update_lesson_plan(db: Session, teacher_id: int, old_topic: str, new_topic:str, new_plan: str = None, datekey: str = None, new_grade: str = None):
    try:
        lesson_plan = db.query(LessonPlan).filter(
            LessonPlan.teacher_id == teacher_id,
            LessonPlan.topic == old_topic,
            LessonPlan.datekey == datekey,
        ).first()

        if not lesson_plan:
            return False, {"error": "Lesson plan not found"}

        # Update fields if new values are provided
        if new_topic is not None:
            lesson_plan.topic = new_topic
        if new_plan is not None:
            lesson_plan.plan = new_plan
        if datekey is not None:
            lesson_plan.datekey = datekey
        if new_grade is not None:
            lesson_plan.grade = new_grade

        # Commit changes
        db.commit()
        db.refresh(lesson_plan)

        return True, {"message": "Lesson plan updated successfully", "lesson_plan": {
            "teacher_id": lesson_plan.teacher_id,
            "topic": lesson_plan.topic,
            "plan": lesson_plan.plan,
            "datekey": lesson_plan.datekey,
            "grade": lesson_plan.grade
        }}

    except Exception as e:
        db.rollback()
        print(e)
        return False, {"error": f"Failed to update lesson plan: {e}"}