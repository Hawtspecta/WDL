@echo off
REM VogueAI Platform - Run All Applications (Windows)
REM This script starts all services in the correct order

echo 🚀 Starting VogueAI Fashion Platform...

REM Check if virtual environment exists
if not exist "venv" (
    echo ❌ Virtual environment not found. Please run setup.bat first.
    pause
    exit /b 1
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Create logs directory
if not exist "logs" mkdir logs

echo.
echo 🔧 Starting all services...
echo.

REM Start Django (Port 8000)
echo 🐍 Starting Django Blog on port 8000...
start "Django Blog" /D django_project python manage.py runserver 8000

REM Wait a moment for Django to start
timeout /t 3 /nobreak >nul

REM Start Flask (Port 5000)
echo 🌶️ Starting Flask App on port 5000...
start "Flask App" /D flask_app python app.py

REM Wait a moment for Flask to start
timeout /t 3 /nobreak >nul

REM Start FastAPI (Port 8001)
echo 🤖 Starting FastAPI on port 8001...
start "FastAPI" /D fastapi_app uvicorn main:app --reload --port 8001

REM Wait a moment for FastAPI to start
timeout /t 3 /nobreak >nul

REM Start Frontend (Port 3000)
echo 🌐 Starting Frontend on port 3000...
start "Frontend" /D frontend python -m http.server 3000

echo.
echo 🎉 All services started successfully!
echo.
echo 📱 Access URLs:
echo 🌐 Frontend:        http://127.0.0.1:3000
echo 🐍 Django Blog:     http://127.0.0.1:8000/blog
echo 🔧 Django Admin:    http://127.0.0.1:8000/admin
echo 🌶️ Flask App:       http://127.0.0.1:5000
echo 🤖 FastAPI:         http://127.0.0.1:8001
echo 📚 FastAPI Docs:    http://127.0.0.1:8001/docs
echo 📊 Dashboard:       http://127.0.0.1:3000/dashboard.html
echo 🧠 Sentiment:       http://127.0.0.1:3000/sentiment.html
echo.
echo 💡 Tips:
echo - Each service runs in its own window
echo - Close windows to stop individual services
echo - Use Ctrl+C in each window to stop gracefully
echo.
pause
