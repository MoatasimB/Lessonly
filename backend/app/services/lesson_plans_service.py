from sqlalchemy.orm import Session
from app.db.models import LessonPlan


def create_lesson_plan(db: Session, teacher_id: int, datekey:str, plan: str, topic:str, grade:str):
    lesson_plan = LessonPlan(
        teacher_id=teacher_id, datekey=datekey, plan=plan, topic=topic, grade=grade
    )
    db.add(lesson_plan)
    db.commit()
    db.refresh(lesson_plan)
    return lesson_plan


def get_lesson_plans_for_day(db: Session, teacher_id: int, datekey:str):
    lesson_plans = db.query(LessonPlan).filter(
        LessonPlan.teacher_id == teacher_id,
        LessonPlan.datekey == datekey,
    ).all()
    topic_plans = []
    if lesson_plans:
        for lesson_plan in lesson_plans:
            topic_plan = {
                "topic": lesson_plan.topic,
                "plan": lesson_plan.plan
            }
            topic_plans.append(topic_plan)

    return topic_plans

def delete_lesson_plan(db: Session, teachers_id: int, datekey:str):
    try:
        plan = db.query(LessonPlan).filter(
       LessonPlan.teacher_id==teachers_id,
                LessonPlan.datekey==datekey,
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