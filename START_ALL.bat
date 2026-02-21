@echo off
REM Start all services for CarbonChain Pro

echo.
echo ========================================
echo Starting CarbonChain Pro Services
echo ========================================
echo.

REM Terminal 1: Python Engine
echo [1/3] Starting Python Emission Engine on port 8000...
start cmd /k "cd backend\emission_engine && python main.py"

REM Wait 3 seconds for Python to start
timeout /t 3 /nobreak

REM Terminal 2: Node.js Backend
echo [2/3] Starting Node.js Backend on port 5000...
start cmd /k "cd backend && npm start"

REM Wait 2 seconds for Backend to start
timeout /t 2 /nobreak

REM Terminal 3: React Frontend
echo [3/3] Starting React Frontend on port 5173...
start cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo All services started!
echo ========================================
echo.
echo Frontend:  http://localhost:5173
echo Backend:   http://localhost:5000/api/health
echo Python:    http://localhost:8000/docs
echo.
pause
