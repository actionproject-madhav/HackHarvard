#!/bin/bash

echo "=== Checking for missing CSS classes ==="
echo ""

# Function to check a component against its CSS
check_component() {
    local component=$1
    local css=$2
    local component_name=$(basename $component .tsx)
    
    echo "Checking $component_name..."
    
    # Extract classes from component
    classes=$(grep -o 'className="[^"]*"' "$component" | sed 's/className="//g' | sed 's/"//g' | tr ' ' '\n' | sort -u)
    
    # Check each class
    missing=0
    for class in $classes; do
        if [ ! -z "$class" ]; then
            if ! grep -q "^\.$class " "$css" 2>/dev/null && ! grep -q "^\.$class{" "$css" 2>/dev/null; then
                echo "  ❌ Missing: .$class"
                missing=$((missing + 1))
            fi
        fi
    done
    
    if [ $missing -eq 0 ]; then
        echo "  ✅ All classes found"
    fi
    echo ""
}

# Check Login
check_component "frontend/src/pages/Login.tsx" "frontend/src/styles/Login.css"

# Check Dashboard
check_component "frontend/src/pages/Dashboard.tsx" "frontend/src/styles/Dashboard.css"

