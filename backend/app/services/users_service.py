from sqlalchemy.orm import Session
from app.db.models import User

def create_user(db: Session, name, email, password, username):
    new_user = User(name=name, email=email, password=password, username=username)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


def get_all_users(db: Session):
    return db.query(User).all()

# Delete a user by ID
def delete_user(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        db.delete(user)
        db.commit()
        return {"message": f"User with ID {user_id} deleted successfully"}
    else:
        return {"error": "User not found"}