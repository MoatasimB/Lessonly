from typing import Union
from fastapi import FastAPI, Depends
from app.api.endpoints import users, lesson_plans
from backend.app.api.endpoints import lesson_plans, users
from backend.app.db.database import engine, Base

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(lesson_plans.router, prefix="/lesson-plans", tags=["Lesson Plans"])


