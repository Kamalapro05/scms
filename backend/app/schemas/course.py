from pydantic import BaseModel
from typing import Optional


class CourseCreate(BaseModel):
    name: str
    code: str
    credits: int
    department_id: int
    semester: int
    description: Optional[str] = None


class CourseUpdate(BaseModel):
    name: Optional[str] = None
    credits: Optional[int] = None
    department_id: Optional[int] = None
    semester: Optional[int] = None
    description: Optional[str] = None


class CourseOut(BaseModel):
    id: int
    name: str
    code: str
    credits: int
    department_id: int
    department_name: Optional[str] = None
    semester: int
    description: Optional[str] = None

    class Config:
        from_attributes = True


class EnrollmentCreate(BaseModel):
    student_id: int
    course_id: int
    academic_year: str
