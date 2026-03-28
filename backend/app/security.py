from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_db
from app.models.user import User

settings = get_settings()

# FIX: Using 'bcrypt_sha256' bypasses the Passlib/Bcrypt version bug
# and removes the 72-character password length limit.
pwd_context = CryptContext(schemes=["bcrypt_sha256"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def hash_password(password: str) -> str:
    """Hashes a plain text password."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a password against a hash; returns False if hash is invalid/incompatible."""
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        # Prevents 500 errors if an old 'bcrypt' hash exists in the DB
        return False

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Generates a JWT access token."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def decode_token(token: str) -> dict:
    """Decodes and validates a JWT token."""
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_current_user(
    token: str = Depends(oauth2_scheme), 
    db: Session = Depends(get_db)
) -> User:
    payload = decode_token(token)
    user_id = payload.get("sub")
    print("DECODED USER ID:", user_id)  # ← add this
    
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    
    user = db.query(User).filter(User.id == int(user_id), User.is_active == True).first()  # ← add int()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found or inactive")
    return user

class RoleChecker:
    """Utility class to enforce role-based access control (RBAC)."""
    def __init__(self, allowed_roles: list[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions",
            )
        return current_user

# Pre-defined Role Checkers
allow_admin = RoleChecker(["admin"])
allow_faculty = RoleChecker(["faculty"])
allow_admin_faculty = RoleChecker(["admin", "faculty"])
allow_student = RoleChecker(["student"])
allow_all = RoleChecker(["admin", "faculty", "student"])