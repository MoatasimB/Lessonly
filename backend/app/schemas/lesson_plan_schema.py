from pydantic import BaseModel

class generateLesson(BaseModel):
    month: int
    day: int
    year: int
    teachers_id : int
    topic: str
    grade: str

