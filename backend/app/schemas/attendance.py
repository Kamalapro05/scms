from pydantic import BaseModel
from typing import Optional
from datetime import date


class AttendanceMark(BaseModel):
    enrollment_id: int
    date: date
    status: str
    remarks: Optional[str] = None


class BulkAttendanceMark(BaseModel):
    course_id: int
    date: date
    records: list[AttendanceMark]


class AttendanceOut(BaseModel):
    id: int
    enrollment_id: int
    student_name: Optional[str] = None
    roll_no: Optional[str] = None
    date: date
    status: str
    remarks: Optional[str] = None

    class Config:
        from_attributes = True


class AttendanceSummary(BaseModel):
    student_id: int
    student_name: str
    roll_no: str
    course_name: str
    total_classes: int
    present: int
    absent: int
    late: int
    excused: int
    percentage: float
