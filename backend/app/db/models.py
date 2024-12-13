from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base, engine

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)

    lessonplans = relationship("LessonPlan", back_populates="teacher")

class LessonPlan(Base):
    __tablename__ = "lessonplans"

    id = Column(Integer, primary_key=True, index=True)
    teacher_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    month = Column(Integer, nullable=False)
    day = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)
    plan = Column(String, nullable=False)

    teacher_id = relationship("users", back_populates="lessonplans")

# Initialize the database and create tables
def init_db():
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    init_db()
    print("Tables created successfully!")
