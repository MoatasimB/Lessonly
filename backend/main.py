from typing import Union

from fastapi import FastAPI, HTTPException, Depends
from models.database import engine, SessionLocal, Base
from models.models import User, LessonPlan
app = FastAPI()

Base.metadata.create_all(bind=engine)



@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

