from sqlalchemy import (
    Column, Integer, String, ForeignKey, Date, Enum as SAEnum,
    Numeric, DateTime
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Exam(Base):
    __tablename__ = "exams"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(150), nullable=False)
    exam_type = Column(
        SAEnum("midterm", "final", "quiz", "assignment", "practical"),
        nullable=False,
    )
    total_marks = Column(Numeric(5, 2), nullable=False)
    exam_date = Column(Date)
    academic_year = Column(String(9), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    course = relationship("Course", back_populates="exams")
    marks = relationship("Mark", back_populates="exam")


class Mark(Base):
    __tablename__ = "marks"

    id = Column(Integer, primary_key=True, index=True)
    enrollment_id = Column(Integer, ForeignKey("enrollments.id", ondelete="CASCADE"), nullable=False)
    exam_id = Column(Integer, ForeignKey("exams.id", ondelete="CASCADE"), nullable=False)
    marks_obtained = Column(Numeric(5, 2), nullable=False)
    grade = Column(String(5))
    uploaded_by = Column(Integer, ForeignKey("faculty.id"), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    enrollment = relationship("Enrollment", back_populates="marks")
    exam = relationship("Exam", back_populates="marks")
    faculty = relationship("Faculty")
