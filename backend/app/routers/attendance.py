from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date
from app.database import get_db
from app.models import User, Faculty, Student, Attendance, Enrollment, Course
from app.schemas.attendance import (
    AttendanceMark, BulkAttendanceMark, AttendanceOut, AttendanceSummary
)
from app.security import allow_admin_faculty, get_current_user

router = APIRouter(prefix="/api/attendance", tags=["Attendance"])


@router.post("/mark", status_code=201)
def mark_attendance(
    req: BulkAttendanceMark,
    current_user: User = Depends(allow_admin_faculty),
    db: Session = Depends(get_db),
):
    faculty = db.query(Faculty).filter(Faculty.user_id == current_user.id).first()
    if not faculty and current_user.role != "admin":
        raise HTTPException(403, "Faculty profile not found")
    marked_by_id = faculty.id if faculty else 1
    created = 0
    updated = 0
    for record in req.records:
        existing = db.query(Attendance).filter(
            Attendance.enrollment_id == record.enrollment_id,
            Attendance.date == req.date,
        ).first()
        if existing:
            existing.status = record.status
            existing.remarks = record.remarks
            existing.marked_by = marked_by_id
            updated += 1
        else:
            att = Attendance(
                enrollment_id=record.enrollment_id, date=req.date,
                status=record.status, marked_by=marked_by_id, remarks=record.remarks,
            )
            db.add(att)
            created += 1
    db.commit()
    return {"message": f"Attendance saved: {created} new, {updated} updated"}


@router.get("/course/{course_id}", response_model=list[AttendanceOut])
def get_course_attendance(
    course_id: int,
    att_date: date = None,
    current_user: User = Depends(allow_admin_faculty),
    db: Session = Depends(get_db),
):
    query = db.query(Attendance).join(Enrollment).filter(Enrollment.course_id == course_id)
    if att_date:
        query = query.filter(Attendance.date == att_date)
    records = query.all()
    result = []
    for r in records:
        enrollment = db.query(Enrollment).get(r.enrollment_id)
        student = db.query(Student).get(enrollment.student_id) if enrollment else None
        result.append(AttendanceOut(
            id=r.id, enrollment_id=r.enrollment_id,
            student_name=f"{student.first_name} {student.last_name}" if student else None,
            roll_no=student.roll_no if student else None,
            date=r.date, status=r.status, remarks=r.remarks,
        ))
    return result


@router.get("/summary/{course_id}", response_model=list[AttendanceSummary])
def attendance_summary(
    course_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    enrollments = db.query(Enrollment).filter(Enrollment.course_id == course_id).all()
    course = db.query(Course).get(course_id)
    summaries = []
    for enrollment in enrollments:
        student = db.query(Student).get(enrollment.student_id)
        if current_user.role == "student":
            student_record = db.query(Student).filter(Student.user_id == current_user.id).first()
            if not student_record or student_record.id != enrollment.student_id:
                continue
        records = db.query(Attendance).filter(Attendance.enrollment_id == enrollment.id).all()
        total = len(records)
        present = sum(1 for r in records if r.status == "present")
        absent = sum(1 for r in records if r.status == "absent")
        late = sum(1 for r in records if r.status == "late")
        excused = sum(1 for r in records if r.status == "excused")
        percentage = round((present + late) / total * 100, 2) if total > 0 else 0.0
        summaries.append(AttendanceSummary(
            student_id=student.id,
            student_name=f"{student.first_name} {student.last_name}",
            roll_no=student.roll_no,
            course_name=course.name if course else "",
            total_classes=total, present=present, absent=absent,
            late=late, excused=excused, percentage=percentage,
        ))
    return summaries
