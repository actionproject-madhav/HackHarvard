#!/bin/bash
# ClarityMD Full Stack Startup Script

echo "🏥 ClarityMD - Starting Full Stack Application"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Check if MongoDB is running
echo -e "${BLUE}Checking MongoDB...${NC}"
if pgrep -x "mongod" > /dev/null; then
    echo -e "${GREEN}✅ MongoDB is running${NC}"
else
    echo -e "${YELLOW}⚠️  MongoDB is not running. Please start MongoDB first:${NC}"
    echo "   brew services start mongodb-community"
    echo "   or"
    echo "   mongod --config /usr/local/etc/mongod.conf"
fi
echo ""

# Start Backend
echo -e "${BLUE}Starting Backend Server...${NC}"
cd "$SCRIPT_DIR/backend"
PYTHONPATH=. python3 test_server.py > /tmp/claritymd_backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID)${NC}"
echo "   Log: /tmp/claritymd_backend.log"
echo "   URL: http://localhost:5000"
echo ""

# Wait for backend to start
echo "Waiting for backend to be ready..."
for i in {1..10}; do
    if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend is ready!${NC}"
        break
    fi
    sleep 1
done
echo ""

# Start Frontend
echo -e "${BLUE}Starting Frontend Server...${NC}"
cd "$SCRIPT_DIR/frontend"
PORT=3000 npm start > /tmp/claritymd_frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}"
echo "   Log: /tmp/claritymd_frontend.log"
echo "   URL: http://localhost:3000"
echo ""

echo "=============================================="
echo -e "${GREEN}🎉 ClarityMD is now running!${NC}"
echo ""
echo "Access the application at: http://localhost:3000"
echo "API documentation at: http://localhost:5000"
echo ""
echo "To stop the servers:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "Or use: pkill -f 'python3.*test_server' && pkill -f 'node.*react-scripts'"
echo "=============================================="

# Save PIDs to file
echo "$BACKEND_PID" > /tmp/claritymd_backend.pid
echo "$FRONTEND_PID" > /tmp/claritymd_frontend.pid

