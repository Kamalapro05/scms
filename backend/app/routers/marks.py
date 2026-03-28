from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Faculty, Student, Mark, Exam, Enrollment, Course, Department
from app.schemas.marks import ExamCreate, MarkUpload, BulkMarkUpload, MarkOut, GradeSheet
from app.security import allow_admin_faculty, get_current_user
from app.utils.grade_calculator import calculate_grade, calculate_percentage

router = APIRouter(prefix="/api/marks", tags=["Marks & Results"])


@router.post("/exams", status_code=201)
def create_exam(
    req: ExamCreate,
    current_user: User = Depends(allow_admin_faculty),
    db: Session = Depends(get_db),
):
    exam = Exam(**req.model_dump())
    db.add(exam)
    db.commit()
    db.refresh(exam)
    return {"message": "Exam created", "exam_id": exam.id}


@router.get("/exams/{course_id}")
def list_exams(
    course_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    exams = db.query(Exam).filter(Exam.course_id == course_id).all()
    return [{"id": e.id, "name": e.name, "exam_type": e.exam_type,
             "total_marks": float(e.total_marks),
             "exam_date": str(e.exam_date) if e.exam_date else None,
             "academic_year": e.academic_year} for e in exams]


@router.post("/upload", status_code=201)
def upload_marks(
    req: BulkMarkUpload,
    current_user: User = Depends(allow_admin_faculty),
    db: Session = Depends(get_db),
):
    faculty = db.query(Faculty).filter(Faculty.user_id == current_user.id).first()
    if not faculty and current_user.role != "admin":
        raise HTTPException(403, "Faculty profile not found")
    uploaded_by_id = faculty.id if faculty else 1
    exam = db.query(Exam).get(req.exam_id)
    if not exam:
        raise HTTPException(404, "Exam not found")
    for record in req.records:
        percentage = calculate_percentage(record.marks_obtained, float(exam.total_marks))
        grade = calculate_grade(percentage)
        existing = db.query(Mark).filter(
            Mark.enrollment_id == record.enrollment_id, Mark.exam_id == req.exam_id,
        ).first()
        if existing:
            existing.marks_obtained = record.marks_obtained
            existing.grade = grade
            existing.uploaded_by = uploaded_by_id
        else:
            mark = Mark(
                enrollment_id=record.enrollment_id, exam_id=req.exam_id,
                marks_obtained=record.marks_obtained, grade=grade,
                uploaded_by=uploaded_by_id,
            )
            db.add(mark)
    db.commit()
    return {"message": "Marks uploaded successfully"}


@router.get("/course/{course_id}", response_model=list[MarkOut])
def get_course_marks(
    course_id: int,
    exam_id: int = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = (
        db.query(Mark)
        .join(Enrollment, Mark.enrollment_id == Enrollment.id)
        .join(Exam, Mark.exam_id == Exam.id)
        .filter(Enrollment.course_id == course_id)
    )
    if exam_id:
        query = query.filter(Mark.exam_id == exam_id)
    marks = query.all()
    result = []
    for m in marks:
        enrollment = db.query(Enrollment).get(m.enrollment_id)
        student = db.query(Student).get(enrollment.student_id) if enrollment else None
        exam = db.query(Exam).get(m.exam_id)
        if current_user.role == "student":
            s = db.query(Student).filter(Student.user_id == current_user.id).first()
            if not s or (enrollment and enrollment.student_id != s.id):
                continue
        result.append(MarkOut(
            id=m.id, enrollment_id=m.enrollment_id, exam_id=m.exam_id,
            exam_name=exam.name if exam else None,
            marks_obtained=float(m.marks_obtained),
            total_marks=float(exam.total_marks) if exam else None,
            grade=m.grade,
            student_name=f"{student.first_name} {student.last_name}" if student else None,
            roll_no=student.roll_no if student else None,
        ))
    return result


@router.get("/gradesheet/{student_id}", response_model=GradeSheet)
def get_grade_sheet(
    student_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    student = db.query(Student).get(student_id)
    if not student:
        raise HTTPException(404, "Student not found")
    if current_user.role == "student" and student.user_id != current_user.id:
        raise HTTPException(403, "Access denied")
    dept = db.query(Department).get(student.department_id)
    enrollments = db.query(Enrollment).filter(Enrollment.student_id == student_id).all()
    courses_data = []
    total_obtained = 0.0
    total_possible = 0.0
    for enrollment in enrollments:
        course = db.query(Course).get(enrollment.course_id)
        marks = db.query(Mark).filter(Mark.enrollment_id == enrollment.id).all()
        course_obtained = sum(float(m.marks_obtained) for m in marks)
        course_total = 0.0
        for m in marks:
            exam = db.query(Exam).get(m.exam_id)
            if exam:
                course_total += float(exam.total_marks)
        course_pct = calculate_percentage(course_obtained, course_total)
        course_grade = calculate_grade(course_pct)
        courses_data.append({
            "course_name": course.name if course else "Unknown",
            "course_code": course.code if course else "",
            "credits": course.credits if course else 0,
            "marks_obtained": course_obtained,
            "total_marks": course_total,
            "percentage": course_pct,
            "grade": course_grade,
        })
        total_obtained += course_obtained
        total_possible += course_total
    overall_pct = calculate_percentage(total_obtained, total_possible)
    overall_grade = calculate_grade(overall_pct)
    return GradeSheet(
        student_name=f"{student.first_name} {student.last_name}",
        roll_no=student.roll_no, department=dept.name if dept else "",
        semester=student.semester, courses=courses_data,
        overall_percentage=overall_pct, overall_grade=overall_grade,
    )
