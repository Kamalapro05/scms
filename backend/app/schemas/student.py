from pydantic import BaseModel
from typing import Optional
from datetime import date


class StudentCreate(BaseModel):
    email: str
    password: str
    first_name: str
    last_name: str
    roll_no: str
    department_id: int
    year: int
    semester: int
    date_of_birth: Optional[date] = None
    phone: Optional[str] = None
    address: Optional[str] = None


class StudentUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    department_id: Optional[int] = None
    year: Optional[int] = None
    semester: Optional[int] = None
    phone: Optional[str] = None
    address: Optional[str] = None


class StudentOut(BaseModel):
    id: int
    user_id: int
    first_name: str
    last_name: str
    roll_no: str
    department_id: int
    department_name: Optional[str] = None
    year: int
    semester: int
    date_of_birth: Optional[date] = None
    phone: Optional[str] = None
    email: Optional[str] = None

    class Config:
        from_attributes = True
