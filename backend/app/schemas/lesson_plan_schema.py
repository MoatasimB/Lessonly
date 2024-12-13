from pydantic import BaseModel

class generateLesson(BaseModel):
    month: str
    day: str
    year: str
    teachers_id : int

    plan: str