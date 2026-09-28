@echo off
echo ======================================================================
echo Starting Ministry of Tribal Affairs (MoTA) Unified Platform - Backend
echo ======================================================================
cd /d "%~dp0backend"
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
pause
