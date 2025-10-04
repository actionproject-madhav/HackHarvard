#!/bin/bash
# ClarityMD Stop Script

echo "🛑 Stopping ClarityMD Application..."
echo "===================================="

# Stop backend
if [ -f /tmp/claritymd_backend.pid ]; then
    BACKEND_PID=$(cat /tmp/claritymd_backend.pid)
    if kill -0 $BACKEND_PID 2>/dev/null; then
        kill $BACKEND_PID
        echo "✅ Backend stopped (PID: $BACKEND_PID)"
    fi
    rm /tmp/claritymd_backend.pid
fi

# Stop frontend
if [ -f /tmp/claritymd_frontend.pid ]; then
    FRONTEND_PID=$(cat /tmp/claritymd_frontend.pid)
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        kill $FRONTEND_PID
        echo "✅ Frontend stopped (PID: $FRONTEND_PID)"
    fi
    rm /tmp/claritymd_frontend.pid
fi

# Fallback - kill by process name
pkill -f "python3.*test_server" 2>/dev/null && echo "✅ Killed remaining backend processes"
pkill -f "node.*react-scripts" 2>/dev/null && echo "✅ Killed remaining frontend processes"

echo "===================================="
echo "✅ ClarityMD stopped"

