from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.services.users_service import create_user, validate_user, validate_login
from app.db.database import get_db
from app.schemas.user_schema import UserCreate, LoginCheck
router = APIRouter()

@router.post("/add")
def create_user_endpoint(user: UserCreate, db: Session = Depends(get_db)):
    response = {"code": 0, "message": "Not all fields given", "status": "fail", "user_id": None}
    try:
        if user.name and user.email and user.password and user.username:
            user_exist, user_id = validate_user(db, user.email)
            if user_exist:
                response["code"] = 0
                response["message"] = "User already exists"
                response["status"] = "success"
                response["user_id"] = user_id
            else:
                user_created = create_user(db, user.name, user.email, user.password, user.username)
                if user_created:
                    response["code"] = 1
                    response["message"] = "User created successfully"
                    response["status"] = "success"
                    response["user_id"] = user_created.id
    except Exception as e:
        response["code"] = 0
        response["message"] = f"failed to create user, error: {e}"
        response["status"] = "fail"

    return response

@router.post("/login")
def login_user_endpoint(user: LoginCheck, db: Session = Depends(get_db)):
    response = {"code": 0, "message": "", "status": "fail", "user_id": None}
    try:
        if user.email and user.password:
            user_exist, user_id = validate_login(db, user.email, user.password)
            if user_exist:
                response["code"] = 1
                response["message"] = "Logging in"
                response["status"] = "success"
                response["user_id"] = user_id
            else:
                response["code"] = 0
                response["message"] = "Wrong password or email"
                response["status"] = "fail"
                response["user_id"] = user_id
    except Exception as e:
        response["code"] = 0
        response["message"] = "cannot login"
        response["status"] = "failed"

    return response