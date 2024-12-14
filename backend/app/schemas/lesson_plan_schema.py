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