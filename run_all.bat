@echo off
echo ======================================================================
echo Launching Ministry of Tribal Affairs (MoTA) Unified Platform Prototype
echo ======================================================================
start "MoTA Backend (FastAPI)" cmd /c "%~dp0run_backend.bat"
timeout /t 3 /nobreak >nul
start "MoTA Frontend (Mobile-First Web)" cmd /c "%~dp0run_frontend.bat"
echo.
echo Backend running on: http://localhost:8000
echo Frontend running on: http://localhost:5173
echo.
pause
