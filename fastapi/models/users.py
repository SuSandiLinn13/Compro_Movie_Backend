from pydantic import BaseModel, Field, EmailStr
from typing import Optional


class UserCreate(BaseModel):
    username: str = Field(..., example="john_doe")
    email: EmailStr = Field(..., example="user@example.com")
    password: str = Field(..., example="strong_password123")


class UserLogin(BaseModel):
    username: str = Field(..., example="john_doe")
    password: str = Field(..., example="strong_password123")
    remember_me: Optional[bool] = Field(False, example=True)


class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None


# Responses
class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr