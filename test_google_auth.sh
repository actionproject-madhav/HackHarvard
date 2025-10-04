#!/bin/bash
# Test Google OAuth Configuration

echo "🔐 Testing Google OAuth Configuration"
echo "======================================"
echo ""

# Check backend .env
echo "1. Checking Backend Configuration..."
if [ -f "backend/.env" ]; then
    if grep -q "GOOGLE_CLIENT_ID=" backend/.env; then
        CLIENT_ID=$(grep "GOOGLE_CLIENT_ID=" backend/.env | cut -d'=' -f2)
        if [ "$CLIENT_ID" != "your_google_client_id_here" ]; then
            echo "   ✅ GOOGLE_CLIENT_ID is configured"
        else
            echo "   ⚠️  GOOGLE_CLIENT_ID needs to be updated with real value"
        fi
    else
        echo "   ❌ GOOGLE_CLIENT_ID not found"
    fi
    
    if grep -q "GOOGLE_CLIENT_SECRET=" backend/.env; then
        CLIENT_SECRET=$(grep "GOOGLE_CLIENT_SECRET=" backend/.env | cut -d'=' -f2)
        if [ "$CLIENT_SECRET" != "your_google_client_secret_here" ]; then
            echo "   ✅ GOOGLE_CLIENT_SECRET is configured"
        else
            echo "   ⚠️  GOOGLE_CLIENT_SECRET needs to be updated with real value"
        fi
    else
        echo "   ❌ GOOGLE_CLIENT_SECRET not found"
    fi
else
    echo "   ❌ backend/.env file not found"
fi
echo ""

# Check frontend .env
echo "2. Checking Frontend Configuration..."
if [ -f "frontend/.env" ]; then
    if grep -q "REACT_APP_GOOGLE_CLIENT_ID=" frontend/.env; then
        echo "   ✅ REACT_APP_GOOGLE_CLIENT_ID is configured"
    else
        echo "   ⚠️  REACT_APP_GOOGLE_CLIENT_ID not found (optional for frontend)"
    fi
else
    echo "   ❌ frontend/.env file not found"
fi
echo ""

echo "======================================"
echo "📝 Next Steps:"
echo "1. Get credentials from: https://console.cloud.google.com/"
echo "2. Update backend/.env with your GOOGLE_CLIENT_ID"
echo "3. Update backend/.env with your GOOGLE_CLIENT_SECRET"
echo "4. Optionally update frontend/.env with REACT_APP_GOOGLE_CLIENT_ID"
echo "5. Restart your servers"
echo "======================================"

