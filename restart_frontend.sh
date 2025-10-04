#!/bin/bash
# Script to restart frontend and clear cache

echo "🔄 Restarting Frontend with Cache Clear..."
echo "=========================================="

cd "$(dirname "$0")/frontend"

# Kill any running frontend processes
echo "1. Stopping frontend..."
pkill -f "react-scripts start" 2>/dev/null && echo "   ✅ Stopped" || echo "   ℹ️  Not running"

# Clear cache
echo "2. Clearing cache..."
rm -rf node_modules/.cache 2>/dev/null && echo "   ✅ Cache cleared" || echo "   ℹ️  No cache to clear"

# Clear build folder
rm -rf build 2>/dev/null && echo "   ✅ Build folder cleared" || echo "   ℹ️  No build folder"

echo ""
echo "3. Starting frontend..."
echo "=========================================="
echo ""
echo "After it starts:"
echo "1. Open http://localhost:3000"
echo "2. Press Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)"
echo "3. Your CSS changes should now be visible!"
echo ""
echo "=========================================="
echo "Starting..."
echo ""

npm start

