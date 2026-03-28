from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.auth import SignupRequest, LoginRequest, TokenResponse, UserOut
from app.security import (
    hash_password, verify_password, create_access_token, get_current_user
)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/signup", response_model=UserOut, status_code=201)
def signup(req: SignupRequest, db: Session = Depends(get_db)):
    if req.role not in ("student", "faculty"):
        raise HTTPException(400, "Role must be 'student' or 'faculty'")
    existing = db.query(User).filter(User.email == req.email).first()
    if existing:
        raise HTTPException(409, "Email already registered")
    if len(req.password) < 8:
        raise HTTPException(400, "Password must be at least 8 characters")
    user = User(
        email=req.email,
        password_hash=hash_password(req.password),
        role=req.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(401, "Invalid email or password")
    if not user.is_active:
        raise HTTPException(403, "Account is deactivated")
    token = create_access_token(data={"sub": str(user.id), "role": user.role})  # ← add str()
    print("TOKEN GENERATED:", token)  # ← add this line
    return TokenResponse(access_token=token, role=user.role, user_id=user.id)

@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
