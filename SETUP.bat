@echo off
echo ============================================
echo   SCMS - Smart College Management System
echo   Auto Setup Script
echo ============================================
echo.

:: ── Step 1: Ask for MySQL password ──
set /p MYSQL_PASS=Enter your MySQL root password: 

:: ── Step 2: Setup Database ──
echo.
echo [1/4] Setting up database...
mysql -u root -p%MYSQL_PASS% < backend\schema.sql
if %errorlevel% neq 0 (
    echo ERROR: Database setup failed! Check your MySQL password.
    pause
    exit /b 1
)
echo Database setup SUCCESS!

:: ── Step 3: Create .env file ──
echo.
echo [2/4] Creating .env file...
(
echo DATABASE_URL=mysql+pymysql://root:%MYSQL_PASS%@localhost:3306/scms_db
echo SECRET_KEY=your-ultra-secret-key-change-in-production-abc123xyz
echo ALGORITHM=HS256
echo ACCESS_TOKEN_EXPIRE_MINUTES=480
echo CORS_ORIGINS=http://localhost:3000,http://localhost:5173
) > backend\.env
echo .env file created SUCCESS!

:: ── Step 4: Setup Python Backend ──
echo.
echo [3/4] Setting up Python backend...
cd backend
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
cd ..
echo Backend setup SUCCESS!

:: ── Step 5: Setup Frontend ──
echo.
echo [4/4] Setting up frontend...
cd frontend
npm install
cd ..
echo Frontend setup SUCCESS!

:: ── Done ──
echo.
echo ============================================
echo   Setup Complete!
echo ============================================
echo.
echo Now run START.bat to launch the app!
echo.
pause