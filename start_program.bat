@echo off

:start
cls
echo ==========================================
echo      CLINIC QUEUE SYSTEM - AUTO START
echo ==========================================

:: 1. BUILD FRONTEND
echo.
echo [1/2] Building Frontend...
cd frontend
call npm run build

:: Check for build errors
if %errorlevel% neq 0 (
    echo.
    echo Frontend Build Failed.
    echo.
    echo Press any key to try again...
    pause >nul
    cd ..
    goto start
)

:: 2. START BACKEND
echo.
echo [2/2] Starting Backend Server...
cd ..\backend

echo.
echo ---------------------------------------------------
echo  Server is RUNNING. 
echo  To Restart: Press Ctrl+C, then type 'N' for "Terminate batch job?"
echo ---------------------------------------------------
echo.

:: This runs the server. The script pauses here until the server stops.
call npm start

:: 3. RESTART LOOP
:: When you stop the server (Ctrl+C) and say 'N', code resumes here.
echo.
echo ==========================================
echo      Server Stopped. Restarting...
echo ==========================================
timeout /t 2 >nul
cd ..
goto start