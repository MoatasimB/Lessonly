from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.db.database import Base, engine

# User Model
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)

    # Relationship with LessonPlan
    lessonplans = relationship("LessonPlan", back_populates="teacher")

# LessonPlan Model
class LessonPlan(Base):
    __tablename__ = "lessonplans"

    id = Column(Integer, primary_key=True, index=True)
    teacher_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # Foreign Key to User
    datekey = Column(String, nullable=False)
    plan = Column(String, nullable=False)
    topic = Column(String, nullable=False)
    grade = Column(String, nullable=True)
    # Relationship with User
    teacher = relationship("User", back_populates="lessonplans")

    __table_args__ = (UniqueConstraint("teacher_id", "topic", name="uix_teacher_topic"),)

# Initialize the database and create tables
def init_db():
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    init_db()
    print("Tables created successfully!")
