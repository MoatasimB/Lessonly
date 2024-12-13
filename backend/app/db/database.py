from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Set up database URL and engine
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, 'models.db')}"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency to get a database session
def get_db():
    """Provides a new database session for each request and ensures it is closed afterward."""
    db = SessionLocal()
    try:
        yield db  # Provide the session
    finally:
        db.close()  # Ensure the session is closed
