from pydantic import BaseModel
from typing import Optional

class GenerateLesson(BaseModel):
    datekey: str
    teachers_id : int
    topic: str
    grade: Optional[str] = None
    plan: str

class GenerateAILesson(BaseModel):
    query: str
    grade: str

class UpdateLessonPlan(BaseModel):
    datekey: str
    teacher_id: int
    new_topic: str
    old_topic: str
    new_plan: str