#!/bin/bash
# Quick check if you have real Google credentials

echo "🔍 Checking Your Google OAuth Credentials..."
echo "============================================="
echo ""

BACKEND_CLIENT_ID=$(grep "GOOGLE_CLIENT_ID=" backend/.env | cut -d'=' -f2)
FRONTEND_CLIENT_ID=$(grep "REACT_APP_GOOGLE_CLIENT_ID=" frontend/.env | cut -d'=' -f2)

echo "Backend Client ID: $BACKEND_CLIENT_ID"
echo "Frontend Client ID: $FRONTEND_CLIENT_ID"
echo ""

# Check if they're still placeholders
if [[ "$BACKEND_CLIENT_ID" == "your_google_client_id_here" ]] || [[ "$BACKEND_CLIENT_ID" == "" ]]; then
    echo "❌ Backend Client ID is still a placeholder!"
    echo "   You need to replace it with a real Client ID from Google Cloud Console"
    echo ""
    echo "   Real Client IDs look like:"
    echo "   123456789-abcdefghijklmnop.apps.googleusercontent.com"
    echo ""
else
    echo "✅ Backend Client ID looks valid!"
fi

if [[ "$FRONTEND_CLIENT_ID" == "your_google_client_id_here" ]] || [[ "$FRONTEND_CLIENT_ID" == "" ]]; then
    echo "❌ Frontend Client ID is still a placeholder!"
    echo "   You need to replace it with a real Client ID from Google Cloud Console"
    echo ""
else
    echo "✅ Frontend Client ID looks valid!"
fi

echo ""
echo "============================================="
echo "To get real credentials:"
echo "1. Visit: https://console.cloud.google.com/apis/credentials"
echo "2. Create OAuth client ID"
echo "3. Copy your Client ID"
echo "4. Update backend/.env and frontend/.env"
echo "5. Restart your servers: ./stop.sh && ./start.sh"
echo "============================================="

