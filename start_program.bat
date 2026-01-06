@echo off
echo ==========================================
echo      CLINIC QUEUE SYSTEM - AUTO START
echo ==========================================

echo [1/2] Building Frontend...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo Frontend Build Failed!
    pause
    exit /b %errorlevel%
)

echo.
echo [2/2] Starting Backend Server...
cd ..\backend
npm start