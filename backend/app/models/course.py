from sqlalchemy import (
    Column, Integer, String, SmallInteger, ForeignKey, Text, DateTime
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    code = Column(String(30), unique=True, nullable=False, index=True)
    credits = Column(SmallInteger, nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    semester = Column(SmallInteger, nullable=False)
    description = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    department = relationship("Department", back_populates="courses")
    enrollments = relationship("Enrollment", back_populates="course")
    faculty_courses = relationship("FacultyCourse", back_populates="course")
    exams = relationship("Exam", back_populates="course")


class FacultyCourse(Base):
    __tablename__ = "faculty_courses"

    id = Column(Integer, primary_key=True, index=True)
    faculty_id = Column(Integer, ForeignKey("faculty.id", ondelete="CASCADE"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    academic_year = Column(String(9), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    faculty = relationship("Faculty", back_populates="faculty_courses")
    course = relationship("Course", back_populates="faculty_courses")


class Enrollment(Base):
    __tablename__ = "enrollments"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    academic_year = Column(String(9), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    student = relationship("Student", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")
    attendance_records = relationship("Attendance", back_populates="enrollment")
    marks = relationship("Mark", back_populates="enrollment")
