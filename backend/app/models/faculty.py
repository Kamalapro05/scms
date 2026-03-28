from sqlalchemy import (
    Column, Integer, String, ForeignKey, Date, DateTime
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Faculty(Base):
    __tablename__ = "faculty"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    employee_id = Column(String(50), unique=True, nullable=False, index=True)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    designation = Column(String(100))
    phone = Column(String(20))
    qualification = Column(String(255))
    date_of_joining = Column(Date)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    user = relationship("User")
    department = relationship("Department", back_populates="faculty")
    faculty_courses = relationship("FacultyCourse", back_populates="faculty")
