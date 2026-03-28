from sqlalchemy import (
    Column, Integer, String, ForeignKey, Date, Text, SmallInteger, DateTime
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), unique=True, nullable=False)
    code = Column(String(20), unique=True, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    students = relationship("Student", back_populates="department")
    faculty = relationship("Faculty", back_populates="department")
    courses = relationship("Course", back_populates="department")


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    roll_no = Column(String(50), unique=True, nullable=False, index=True)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    year = Column(SmallInteger, nullable=False)
    semester = Column(SmallInteger, nullable=False)
    date_of_birth = Column(Date)
    phone = Column(String(20))
    address = Column(Text)
    enrollment_date = Column(Date)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    user = relationship("User")
    department = relationship("Department", back_populates="students")
    enrollments = relationship("Enrollment", back_populates="student")
