from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.routers import auth, students, faculty, courses, attendance, marks, dashboard

settings = get_settings()

app = FastAPI(
    title="Smart College Management System",
    description="SCMS - Centralized academic and administrative management",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(students.router)
app.include_router(faculty.router)
app.include_router(courses.router)
app.include_router(attendance.router)
app.include_router(marks.router)
app.include_router(dashboard.router)


@app.get("/")
def root():
    return {"message": "SCMS API is running", "docs": "/docs"}


@app.get("/api/health")
def health_check():
    return {"status": "healthy"}
