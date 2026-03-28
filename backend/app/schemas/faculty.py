from pydantic import BaseModel
from typing import Optional
from datetime import date


class FacultyCreate(BaseModel):
    email: str
    password: str
    first_name: str
    last_name: str
    employee_id: str
    department_id: int
    designation: Optional[str] = None
    phone: Optional[str] = None
    qualification: Optional[str] = None


class FacultyUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    department_id: Optional[int] = None
    designation: Optional[str] = None
    phone: Optional[str] = None
    qualification: Optional[str] = None


class FacultyOut(BaseModel):
    id: int
    user_id: int
    first_name: str
    last_name: str
    employee_id: str
    department_id: int
    department_name: Optional[str] = None
    designation: Optional[str] = None
    phone: Optional[str] = None
    qualification: Optional[str] = None
    email: Optional[str] = None

    class Config:
        from_attributes = True


class FacultyCourseAssign(BaseModel):
    faculty_id: int
    course_id: int
    academic_year: str
