@echo off
echo ============================================
echo   SCMS - Starting Application
echo ============================================
echo.

:: Start Backend
echo Starting Backend Server...
start "SCMS Backend" cmd /k "cd backend && venv\Scripts\activate && python run.py"

:: Wait 3 seconds for backend to start
timeout /t 3 /nobreak > nul

:: Start Frontend
echo Starting Frontend Server...
start "SCMS Frontend" cmd /k "cd frontend && npm run dev"

:: Wait 3 seconds for frontend to start
timeout /t 3 /nobreak > nul

:: Open Browser
echo Opening Browser...
start http://localhost:3000

echo.
echo ============================================
echo   App is running!
echo   Open: http://localhost:3000
echo   Email: admin@scms.edu
echo   Password: Admin@123
echo ============================================
echo.
pause