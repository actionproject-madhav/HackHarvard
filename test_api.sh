#!/bin/bash
# API Testing Script for ClarityMD Backend

echo "=================================="
echo "🧪 ClarityMD API Test Suite"
echo "=================================="
echo ""

BASE_URL="http://localhost:5000"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

test_endpoint() {
    local name=$1
    local method=$2
    local endpoint=$3
    local data=$4
    
    echo -e "${BLUE}Testing: $name${NC}"
    echo "  Endpoint: $method $endpoint"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X $method -H "Content-Type: application/json" -d "$data" "$BASE_URL$endpoint")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "  ${GREEN}✅ Status: $http_code${NC}"
    else
        echo -e "  ${RED}❌ Status: $http_code${NC}"
    fi
    
    if command -v jq &> /dev/null; then
        echo "$body" | jq '.' 2>/dev/null | head -10
    else
        echo "$body" | head -10
    fi
    echo ""
}

# Test 1: Health Check
test_endpoint "Health Check" "GET" "/api/health" ""

# Test 2: Root Endpoint
test_endpoint "Root Endpoint" "GET" "/" ""

# Test 3: Get All Doctors
test_endpoint "Get All Doctors" "GET" "/api/doctors" ""

# Test 4: Search Doctors by Specialization
test_endpoint "Search Doctors (Cardiology)" "GET" "/api/doctors/search?specialization=Cardiology" ""

# Test 5: Get Doctor by ID (using first doctor from database)
DOCTOR_ID=$(curl -s "$BASE_URL/api/doctors" | python3 -c "import sys, json; doctors = json.load(sys.stdin).get('doctors', []); print(doctors[0]['_id'] if doctors else '')" 2>/dev/null)
if [ -n "$DOCTOR_ID" ]; then
    test_endpoint "Get Doctor by ID" "GET" "/api/doctors/$DOCTOR_ID" ""
fi

# Test 6: Emergency Detection
test_endpoint "Emergency Detection" "POST" "/api/emergency/detect" '{"symptoms": ["chest pain", "shortness of breath"]}'

echo "=================================="
echo "✅ API Testing Complete"
echo "=================================="

