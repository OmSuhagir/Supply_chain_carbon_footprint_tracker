@echo off
REM ========================================
REM Python Engine - Quick Start Script
REM For Windows Command Prompt
REM ========================================

echo.
echo ===============================================
echo Python Emission Engine - Quick Start
echo ===============================================
echo.

REM Check if Python is installed
python --version > nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python 3.7+ from https://www.python.org/
    echo Make sure to check "Add Python to PATH" during installation
    pause
    exit /b 1
)

echo [OK] Python is installed
python --version
echo.

REM Check if we're in the right directory
if not exist "main.py" (
    echo [ERROR] main.py not found
    echo Please run this script from the emission_engine directory
    pause
    exit /b 1
)

echo [OK] Found main.py
echo.

REM Install dependencies
echo [1/3] Installing dependencies...
pip install -q -r requirements.txt
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)
echo [OK] Dependencies installed
echo.

REM Display next steps
echo [2/3] Python Engine Ready!
echo.
echo Quick Start Options:
echo.
echo A) Start the server:
echo    python main.py
echo.
echo B) Run interactive tests:
echo    python manual_test.py
echo.
echo C) Run automated tests:
echo    pip install pytest requests
echo    pytest test_all_endpoints.py -v
echo.
echo D) Stress testing:
echo    python stress_test.py
echo.
echo E) Open Postman Collection:
echo    Import: CarbonChain_Pro_API.postman_collection.json
echo.

REM Try to start server
echo [3/3] Starting Python Engine...
echo.
echo Server will run on: http://localhost:8000
echo Swagger UI: http://localhost:8000/docs
echo ReDoc: http://localhost:8000/redoc
echo.
echo Press Ctrl+C to stop the server
echo.
echo ===============================================
echo.

python main.py

if errorlevel 1 (
    echo.
    echo [ERROR] Server failed to start
    echo Check the error message above
    echo.
)

pause
