from sqlalchemy import (
    Column, Integer, String, ForeignKey, Date, Enum, DateTime
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    enrollment_id = Column(Integer, ForeignKey("enrollments.id", ondelete="CASCADE"), nullable=False)
    date = Column(Date, nullable=False)
    status = Column(
        Enum("present", "absent", "late", "excused"),
        nullable=False,
        default="absent",
    )
    marked_by = Column(Integer, ForeignKey("faculty.id"), nullable=False)
    remarks = Column(String(255))
    created_at = Column(DateTime, server_default=func.now())

    enrollment = relationship("Enrollment", back_populates="attendance_records")
    faculty = relationship("Faculty")
