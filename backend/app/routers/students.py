from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.models import User, Student, Department
from app.schemas.student import StudentCreate, StudentUpdate, StudentOut
from app.security import hash_password, allow_admin, allow_admin_faculty, get_current_user

router = APIRouter(prefix="/api/students", tags=["Students"])


@router.get("/", response_model=list[StudentOut])
def list_students(
    department_id: Optional[int] = None,
    year: Optional[int] = None,
    search: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    current_user: User = Depends(allow_admin_faculty),
    db: Session = Depends(get_db),
):
    query = db.query(Student).join(Department)
    if department_id:
        query = query.filter(Student.department_id == department_id)
    if year:
        query = query.filter(Student.year == year)
    if search:
        query = query.filter(
            (Student.first_name.ilike(f"%{search}%"))
            | (Student.last_name.ilike(f"%{search}%"))
            | (Student.roll_no.ilike(f"%{search}%"))
        )
    students = query.offset(skip).limit(limit).all()
    result = []
    for s in students:
        dept = db.query(Department).get(s.department_id)
        user = db.query(User).get(s.user_id)
        result.append(StudentOut(
            id=s.id, user_id=s.user_id, first_name=s.first_name,
            last_name=s.last_name, roll_no=s.roll_no,
            department_id=s.department_id,
            department_name=dept.name if dept else None,
            year=s.year, semester=s.semester, date_of_birth=s.date_of_birth,
            phone=s.phone, email=user.email if user else None,
        ))
    return result


@router.get("/{student_id}", response_model=StudentOut)
def get_student(
    student_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    s = db.query(Student).filter(Student.id == student_id).first()
    if not s:
        raise HTTPException(404, "Student not found")
    if current_user.role == "student" and s.user_id != current_user.id:
        raise HTTPException(403, "Access denied")
    dept = db.query(Department).get(s.department_id)
    user = db.query(User).get(s.user_id)
    return StudentOut(
        id=s.id, user_id=s.user_id, first_name=s.first_name,
        last_name=s.last_name, roll_no=s.roll_no,
        department_id=s.department_id,
        department_name=dept.name if dept else None,
        year=s.year, semester=s.semester, date_of_birth=s.date_of_birth,
        phone=s.phone, email=user.email if user else None,
    )


@router.post("/", response_model=StudentOut, status_code=201)
def create_student(
    req: StudentCreate,
    current_user: User = Depends(allow_admin),
    db: Session = Depends(get_db),
):
    if db.query(User).filter(User.email == req.email).first():
        raise HTTPException(409, "Email already registered")
    if db.query(Student).filter(Student.roll_no == req.roll_no).first():
        raise HTTPException(409, "Roll number already exists")
    user = User(email=req.email, password_hash=hash_password(req.password), role="student")
    db.add(user)
    db.flush()
    student = Student(
        user_id=user.id, first_name=req.first_name, last_name=req.last_name,
        roll_no=req.roll_no, department_id=req.department_id,
        year=req.year, semester=req.semester,
        date_of_birth=req.date_of_birth, phone=req.phone, address=req.address,
    )
    db.add(student)
    db.commit()
    db.refresh(student)
    dept = db.query(Department).get(student.department_id)
    return StudentOut(
        id=student.id, user_id=student.user_id,
        first_name=student.first_name, last_name=student.last_name,
        roll_no=student.roll_no, department_id=student.department_id,
        department_name=dept.name if dept else None,
        year=student.year, semester=student.semester,
        date_of_birth=student.date_of_birth, phone=student.phone, email=user.email,
    )


@router.put("/{student_id}", response_model=StudentOut)
def update_student(
    student_id: int,
    req: StudentUpdate,
    current_user: User = Depends(allow_admin),
    db: Session = Depends(get_db),
):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(404, "Student not found")
    for field, value in req.model_dump(exclude_unset=True).items():
        setattr(student, field, value)
    db.commit()
    db.refresh(student)
    dept = db.query(Department).get(student.department_id)
    user = db.query(User).get(student.user_id)
    return StudentOut(
        id=student.id, user_id=student.user_id,
        first_name=student.first_name, last_name=student.last_name,
        roll_no=student.roll_no, department_id=student.department_id,
        department_name=dept.name if dept else None,
        year=student.year, semester=student.semester,
        date_of_birth=student.date_of_birth, phone=student.phone,
        email=user.email if user else None,
    )


@router.delete("/{student_id}", status_code=204)
def delete_student(
    student_id: int,
    current_user: User = Depends(allow_admin),
    db: Session = Depends(get_db),
):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(404, "Student not found")
    user = db.query(User).filter(User.id == student.user_id).first()
    if user:
        db.delete(user)
    db.commit()
