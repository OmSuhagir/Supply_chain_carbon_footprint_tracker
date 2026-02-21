#!/bin/bash

# ========================================
# Python Engine - Quick Start Script
# For Linux/macOS
# ========================================

echo ""
echo "========================================"
echo "Python Emission Engine - Quick Start"
echo "========================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "[ERROR] Python 3 is not installed"
    echo "Please install Python 3.7+ from https://www.python.org/"
    exit 1
fi

echo "[OK] Python is installed"
python3 --version
echo ""

# Check if we're in the right directory
if [ ! -f "main.py" ]; then
    echo "[ERROR] main.py not found"
    echo "Please run this script from the emission_engine directory"
    exit 1
fi

echo "[OK] Found main.py"
echo ""

# Install dependencies
echo "[1/3] Installing dependencies..."
pip3 install -q -r requirements.txt
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to install dependencies"
    exit 1
fi
echo "[OK] Dependencies installed"
echo ""

# Display next steps
echo "[2/3] Python Engine Ready!"
echo ""
echo "Quick Start Options:"
echo ""
echo "A) Start the server:"
echo "   python3 main.py"
echo ""
echo "B) Run interactive tests:"
echo "   python3 manual_test.py"
echo ""
echo "C) Run automated tests:"
echo "   pip3 install pytest requests"
echo "   pytest test_all_endpoints.py -v"
echo ""
echo "D) Stress testing:"
echo "   python3 stress_test.py"
echo ""
echo "E) Open Postman Collection:"
echo "   Import: CarbonChain_Pro_API.postman_collection.json"
echo ""

# Try to start server
echo "[3/3] Starting Python Engine..."
echo ""
echo "Server will run on: http://localhost:8000"
echo "Swagger UI: http://localhost:8000/docs"
echo "ReDoc: http://localhost:8000/redoc"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""
echo "========================================"
echo ""

python3 main.py

if [ $? -ne 0 ]; then
    echo ""
    echo "[ERROR] Server failed to start"
    echo "Check the error message above"
    echo ""
fi
