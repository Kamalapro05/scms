from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.models import User, Course, Department, Enrollment
from app.schemas.course import CourseCreate, CourseUpdate, CourseOut, EnrollmentCreate
from app.security import allow_admin, get_current_user

router = APIRouter(prefix="/api/courses", tags=["Courses"])


@router.get("/", response_model=list[CourseOut])
def list_courses(
    department_id: Optional[int] = None,
    semester: Optional[int] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(Course)
    if department_id:
        query = query.filter(Course.department_id == department_id)
    if semester:
        query = query.filter(Course.semester == semester)
    courses = query.offset(skip).limit(limit).all()
    result = []
    for c in courses:
        dept = db.query(Department).get(c.department_id)
        result.append(CourseOut(
            id=c.id, name=c.name, code=c.code, credits=c.credits,
            department_id=c.department_id,
            department_name=dept.name if dept else None,
            semester=c.semester, description=c.description,
        ))
    return result


@router.post("/", response_model=CourseOut, status_code=201)
def create_course(
    req: CourseCreate,
    current_user: User = Depends(allow_admin),
    db: Session = Depends(get_db),
):
    if db.query(Course).filter(Course.code == req.code).first():
        raise HTTPException(409, "Course code already exists")
    course = Course(**req.model_dump())
    db.add(course)
    db.commit()
    db.refresh(course)
    dept = db.query(Department).get(course.department_id)
    return CourseOut(
        id=course.id, name=course.name, code=course.code, credits=course.credits,
        department_id=course.department_id,
        department_name=dept.name if dept else None,
        semester=course.semester, description=course.description,
    )


@router.put("/{course_id}", response_model=CourseOut)
def update_course(
    course_id: int,
    req: CourseUpdate,
    current_user: User = Depends(allow_admin),
    db: Session = Depends(get_db),
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(404, "Course not found")
    for field, value in req.model_dump(exclude_unset=True).items():
        setattr(course, field, value)
    db.commit()
    db.refresh(course)
    dept = db.query(Department).get(course.department_id)
    return CourseOut(
        id=course.id, name=course.name, code=course.code, credits=course.credits,
        department_id=course.department_id,
        department_name=dept.name if dept else None,
        semester=course.semester, description=course.description,
    )


@router.delete("/{course_id}", status_code=204)
def delete_course(
    course_id: int,
    current_user: User = Depends(allow_admin),
    db: Session = Depends(get_db),
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(404, "Course not found")
    db.delete(course)
    db.commit()


@router.post("/enroll", status_code=201)
def enroll_student(
    req: EnrollmentCreate,
    current_user: User = Depends(allow_admin),
    db: Session = Depends(get_db),
):
    existing = db.query(Enrollment).filter(
        Enrollment.student_id == req.student_id,
        Enrollment.course_id == req.course_id,
        Enrollment.academic_year == req.academic_year,
    ).first()
    if existing:
        raise HTTPException(409, "Already enrolled")
    enrollment = Enrollment(**req.model_dump())
    db.add(enrollment)
    db.commit()
    return {"message": "Student enrolled successfully"}
