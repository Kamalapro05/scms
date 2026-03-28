from app.models.user import User
from app.models.student import Department, Student
from app.models.faculty import Faculty
from app.models.course import Course, FacultyCourse, Enrollment
from app.models.attendance import Attendance
from app.models.marks import Exam, Mark

__all__ = [
    "User", "Department", "Student", "Faculty",
    "Course", "FacultyCourse", "Enrollment",
    "Attendance", "Exam", "Mark",
]
