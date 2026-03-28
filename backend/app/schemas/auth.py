from pydantic import BaseModel, EmailStr
from typing import Optional


class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    role: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_id: int


class UserOut(BaseModel):
    id: int
    email: str
    role: str
    is_active: bool

    class Config:
        from_attributes = True
