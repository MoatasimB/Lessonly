from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.services.users_service import create_user

router = APIRouter()

router.post("/add")
def create_user_endpoint(db: Session, name, email, password, username):
    return create_user(db, name, email, password, username)