#!/bin/bash

# VogueAI Platform - Run All Applications
# This script starts all services in the correct order

echo "🚀 Starting VogueAI Fashion Platform..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found. Please run setup.sh first."
    exit 1
fi

# Activate virtual environment
source venv/bin/activate

# Function to start a service in background
start_service() {
    local name=$1
    local command=$2
    local port=$3
    echo "🔧 Starting $name on port $port..."
    $command &
    local pid=$!
    echo "✅ $name started with PID: $pid"
    echo $pid > "logs/${name}.pid"
}

# Create logs directory
mkdir -p logs

# Start Django (Port 8000)
start_service "django" "cd django_project && python manage.py runserver 8000" "8000"

# Wait a moment for Django to start
sleep 2

# Start Flask (Port 5000)
start_service "flask" "cd flask_app && python app.py" "5000"

# Wait a moment for Flask to start
sleep 2

# Start FastAPI (Port 8001)
start_service "fastapi" "cd fastapi_app && uvicorn main:app --reload --port 8001" "8001"

# Wait a moment for FastAPI to start
sleep 2

# Start Frontend (Port 3000)
start_service "frontend" "cd frontend && python -m http.server 3000" "3000"

echo ""
echo "🎉 All services started successfully!"
echo ""
echo "📱 Access URLs:"
echo "🌐 Frontend:        http://127.0.0.1:3000"
echo "🐍 Django Blog:     http://127.0.0.1:8000/blog"
echo "🔧 Django Admin:    http://127.0.0.1:8000/admin"
echo "🌶️ Flask App:       http://127.0.0.1:5000"
echo "🤖 FastAPI:         http://127.0.0.1:8001"
echo "📚 FastAPI Docs:    http://127.0.0.1:8001/docs"
echo "📊 Dashboard:       http://127.0.0.1:3000/dashboard.html"
echo "🧠 Sentiment:       http://127.0.0.1:3000/sentiment.html"
echo ""
echo "🛑 To stop all services, run: ./stop_all.sh"
echo "📋 View logs: tail -f logs/*.log"

# Keep script running
wait
