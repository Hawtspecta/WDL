#!/bin/bash

# VogueAI Platform - Stop All Applications
# This script stops all running services

echo "🛑 Stopping VogueAI Fashion Platform..."

# Function to stop a service
stop_service() {
    local name=$1
    local pid_file="logs/${name}.pid"
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p $pid > /dev/null 2>&1; then
            echo "🔧 Stopping $name (PID: $pid)..."
            kill $pid
            rm "$pid_file"
            echo "✅ $name stopped"
        else
            echo "⚠️ $name is not running"
            rm "$pid_file"
        fi
    else
        echo "⚠️ $name PID file not found"
    fi
}

# Stop all services
stop_service "django"
stop_service "flask"
stop_service "fastapi"
stop_service "frontend"

# Kill any remaining processes on the ports
echo "🧹 Cleaning up any remaining processes..."
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
lsof -ti:5000 | xargs kill -9 2>/dev/null || true
lsof -ti:8001 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

echo "✅ All services stopped successfully!"
