from pydantic import BaseModel, EmailStr, Field

class UserCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=50, description="Name is required and must be 1-50 characters.")
    email: EmailStr = Field(..., description="Must be a valid email address.")
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters long.")
    username: str = Field(..., min_length=3, max_length=20, description="Username must be 3-20 characters long.")

class LoginCheck(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
