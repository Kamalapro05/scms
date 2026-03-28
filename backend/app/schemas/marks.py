from pydantic import BaseModel
from typing import Optional
from datetime import date
from decimal import Decimal


class ExamCreate(BaseModel):
    course_id: int
    name: str
    exam_type: str
    total_marks: float
    exam_date: Optional[date] = None
    academic_year: str


class MarkUpload(BaseModel):
    enrollment_id: int
    exam_id: int
    marks_obtained: float


class BulkMarkUpload(BaseModel):
    exam_id: int
    records: list[MarkUpload]


class MarkOut(BaseModel):
    id: int
    enrollment_id: int
    exam_id: int
    exam_name: Optional[str] = None
    marks_obtained: float
    total_marks: Optional[float] = None
    grade: Optional[str] = None
    student_name: Optional[str] = None
    roll_no: Optional[str] = None

    class Config:
        from_attributes = True


class GradeSheet(BaseModel):
    student_name: str
    roll_no: str
    department: str
    semester: int
    courses: list[dict]
    overall_percentage: float
    overall_grade: str
