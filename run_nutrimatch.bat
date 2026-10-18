@echo off
title NutriMatch AI Platform Launcher
color 0A
echo ======================================================================
echo             NUTRIMATCH AI - PRECISION NUTRITION PLATFORM
echo               College Faculty, Hackathon & Recruiter Showcase
echo ======================================================================
echo.
echo [1/2] Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "NutriMatch Backend API" cmd /k "cd /d C:\Users\yashk\Downloads\ml.mainproject\backend && python -m uvicorn main:app --reload --port 8000"

echo [2/2] Starting Vite React Frontend on http://localhost:5173 ...
start "NutriMatch React Frontend" cmd /k "cd /d C:\Users\yashk\Downloads\ml.mainproject\frontend && npm run dev"

echo.
echo ======================================================================
echo System successfully started!
echo.
echo  - Frontend Web App:     http://localhost:5173
echo  - Backend API Docs:     http://127.0.0.1:8000/docs
echo  - Automated Test Suite: python test_e2e.py (in backend folder)
echo ======================================================================
echo Press any key to exit this launcher window...
pause > nul
