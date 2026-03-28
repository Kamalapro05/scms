from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.models import User, Faculty, Department, FacultyCourse
from app.schemas.faculty import FacultyCreate, FacultyUpdate, FacultyOut, FacultyCourseAssign
from app.security import hash_password, allow_admin, get_current_user

router = APIRouter(prefix="/api/faculty", tags=["Faculty"])


@router.get("/", response_model=list[FacultyOut])
def list_faculty(
    department_id: Optional[int] = None,
    search: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(Faculty)
    if department_id:
        query = query.filter(Faculty.department_id == department_id)
    if search:
        query = query.filter(
            (Faculty.first_name.ilike(f"%{search}%"))
            | (Faculty.last_name.ilike(f"%{search}%"))
            | (Faculty.employee_id.ilike(f"%{search}%"))
        )
    faculties = query.offset(skip).limit(limit).all()
    result = []
    for f in faculties:
        dept = db.query(Department).get(f.department_id)
        user = db.query(User).get(f.user_id)
        result.append(FacultyOut(
            id=f.id, user_id=f.user_id, first_name=f.first_name,
            last_name=f.last_name, employee_id=f.employee_id,
            department_id=f.department_id,
            department_name=dept.name if dept else None,
            designation=f.designation, phone=f.phone,
            qualification=f.qualification, email=user.email if user else None,
        ))
    return result


@router.post("/", response_model=FacultyOut, status_code=201)
def create_faculty(
    req: FacultyCreate,
    current_user: User = Depends(allow_admin),
    db: Session = Depends(get_db),
):
    if db.query(User).filter(User.email == req.email).first():
        raise HTTPException(409, "Email already registered")
    if db.query(Faculty).filter(Faculty.employee_id == req.employee_id).first():
        raise HTTPException(409, "Employee ID already exists")
    user = User(email=req.email, password_hash=hash_password(req.password), role="faculty")
    db.add(user)
    db.flush()
    faculty = Faculty(
        user_id=user.id, first_name=req.first_name, last_name=req.last_name,
        employee_id=req.employee_id, department_id=req.department_id,
        designation=req.designation, phone=req.phone, qualification=req.qualification,
    )
    db.add(faculty)
    db.commit()
    db.refresh(faculty)
    dept = db.query(Department).get(faculty.department_id)
    return FacultyOut(
        id=faculty.id, user_id=faculty.user_id,
        first_name=faculty.first_name, last_name=faculty.last_name,
        employee_id=faculty.employee_id, department_id=faculty.department_id,
        department_name=dept.name if dept else None,
        designation=faculty.designation, phone=faculty.phone,
        qualification=faculty.qualification, email=user.email,
    )


@router.put("/{faculty_id}", response_model=FacultyOut)
def update_faculty(
    faculty_id: int,
    req: FacultyUpdate,
    current_user: User = Depends(allow_admin),
    db: Session = Depends(get_db),
):
    faculty = db.query(Faculty).filter(Faculty.id == faculty_id).first()
    if not faculty:
        raise HTTPException(404, "Faculty not found")
    for field, value in req.model_dump(exclude_unset=True).items():
        setattr(faculty, field, value)
    db.commit()
    db.refresh(faculty)
    dept = db.query(Department).get(faculty.department_id)
    user = db.query(User).get(faculty.user_id)
    return FacultyOut(
        id=faculty.id, user_id=faculty.user_id,
        first_name=faculty.first_name, last_name=faculty.last_name,
        employee_id=faculty.employee_id, department_id=faculty.department_id,
        department_name=dept.name if dept else None,
        designation=faculty.designation, phone=faculty.phone,
        qualification=faculty.qualification, email=user.email if user else None,
    )


@router.delete("/{faculty_id}", status_code=204)
def delete_faculty(
    faculty_id: int,
    current_user: User = Depends(allow_admin),
    db: Session = Depends(get_db),
):
    faculty = db.query(Faculty).filter(Faculty.id == faculty_id).first()
    if not faculty:
        raise HTTPException(404, "Faculty not found")
    user = db.query(User).filter(User.id == faculty.user_id).first()
    if user:
        db.delete(user)
    db.commit()


@router.post("/assign-course", status_code=201)
def assign_course(
    req: FacultyCourseAssign,
    current_user: User = Depends(allow_admin),
    db: Session = Depends(get_db),
):
    existing = db.query(FacultyCourse).filter(
        FacultyCourse.faculty_id == req.faculty_id,
        FacultyCourse.course_id == req.course_id,
        FacultyCourse.academic_year == req.academic_year,
    ).first()
    if existing:
        raise HTTPException(409, "Assignment already exists")
    fc = FacultyCourse(
        faculty_id=req.faculty_id, course_id=req.course_id,
        academic_year=req.academic_year,
    )
    db.add(fc)
    db.commit()
    return {"message": "Course assigned successfully"}
