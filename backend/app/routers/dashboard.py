from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import User, Student, Faculty, Course, Enrollment, Attendance, Department, Mark
from app.security import get_current_user, allow_admin

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/admin/stats")
def admin_stats(
    current_user: User = Depends(allow_admin),
    db: Session = Depends(get_db),
):
    total_students = db.query(func.count(Student.id)).scalar()
    total_faculty = db.query(func.count(Faculty.id)).scalar()
    total_courses = db.query(func.count(Course.id)).scalar()
    total_departments = db.query(func.count(Department.id)).scalar()
    total_enrollments = db.query(func.count(Enrollment.id)).scalar()
    dept_stats = (
        db.query(Department.name, func.count(Student.id))
        .outerjoin(Student, Student.department_id == Department.id)
        .group_by(Department.id).all()
    )
    total_att = db.query(func.count(Attendance.id)).scalar() or 0
    present_att = (
        db.query(func.count(Attendance.id))
        .filter(Attendance.status.in_(["present", "late"])).scalar() or 0
    )
    att_rate = round(present_att / total_att * 100, 2) if total_att > 0 else 0.0
    return {
        "total_students": total_students,
        "total_faculty": total_faculty,
        "total_courses": total_courses,
        "total_departments": total_departments,
        "total_enrollments": total_enrollments,
        "attendance_rate": att_rate,
        "students_per_department": [
            {"department": name, "count": count} for name, count in dept_stats
        ],
    }


@router.get("/faculty/stats")
def faculty_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    faculty = db.query(Faculty).filter(Faculty.user_id == current_user.id).first()
    if not faculty:
        return {"error": "Faculty profile not found"}
    from app.models import FacultyCourse
    assigned_courses = db.query(FacultyCourse).filter(FacultyCourse.faculty_id == faculty.id).all()
    course_ids = [fc.course_id for fc in assigned_courses]
    total_students = (
        db.query(func.count(func.distinct(Enrollment.student_id)))
        .filter(Enrollment.course_id.in_(course_ids)).scalar() if course_ids else 0
    )
    return {
        "assigned_courses": len(course_ids),
        "total_students": total_students,
        "faculty_name": f"{faculty.first_name} {faculty.last_name}",
    }


@router.get("/student/stats")
def student_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        return {"error": "Student profile not found"}
    enrollments = db.query(Enrollment).filter(Enrollment.student_id == student.id).all()
    courses_enrolled = len(enrollments)
    total_classes = 0
    total_present = 0
    for e in enrollments:
        records = db.query(Attendance).filter(Attendance.enrollment_id == e.id).all()
        total_classes += len(records)
        total_present += sum(1 for r in records if r.status in ("present", "late"))
    att_pct = round(total_present / total_classes * 100, 2) if total_classes > 0 else 0.0
    return {
        "student_name": f"{student.first_name} {student.last_name}",
        "roll_no": student.roll_no,
        "courses_enrolled": courses_enrolled,
        "overall_attendance": att_pct,
        "year": student.year,
        "semester": student.semester,
    }
