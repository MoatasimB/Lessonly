from sqlalchemy.orm import Session
from app.db.models import User

def create_user(db: Session, name, email, password, username):
    try:
        new_user = User(name=name, email=email, password=password, username=username)
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user
    except Exception as e:
        db.rollback()  # Rollback in case of error
        raise e

def get_all_users(db: Session):
    try:
        return db.query(User).all()
    except Exception as e:
        raise e

def validate_user(db: Session, email: str):
    user = db.query(User).filter(User.email == email).first()
    if user:
        return True, user.id
    return False, None

def validate_id(db: Session, id: int):
    user = db.query(User).filter(User.id == id).first()
    if user:
        return True, user.id
    return False, None
def validate_login(db: Session, email, password: str):
    user = db.query(User).filter(User.email == email).first()
    if user:
        if user.password == password:
            return True, user.id
    return False, None
# Delete a user by ID
def delete_user(db: Session, user_id: int):
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            db.delete(user)
            db.commit()
            return {"message": f"User with ID {user_id} deleted successfully"}
        else:
            return {"error": "User not found"}
    except Exception as e:
        db.rollback()
        raise e
