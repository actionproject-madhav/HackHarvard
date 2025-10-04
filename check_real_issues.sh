#!/bin/bash

echo "=== CHECKING REAL CSS ISSUES ==="
echo ""

# Check if frontend is compiling
echo "1. Frontend compilation status:"
if lsof -ti:3000 > /dev/null 2>&1; then
  echo "   ✅ Frontend is running on port 3000"
else
  echo "   ❌ Frontend is NOT running!"
fi

echo ""
echo "2. Check if DesignSystem.css exists and is imported:"
if [ -f "frontend/src/styles/DesignSystem.css" ]; then
  echo "   ✅ DesignSystem.css exists"
  echo "   Lines: $(wc -l < frontend/src/styles/DesignSystem.css)"
else
  echo "   ❌ DesignSystem.css missing!"
fi

if grep -q "DesignSystem.css" frontend/src/index.tsx; then
  echo "   ✅ DesignSystem.css imported in index.tsx"
else
  echo "   ❌ DesignSystem.css NOT imported!"
fi

echo ""
echo "3. Check CSS variable usage in components:"
grep -r "var(--" frontend/src/styles/*.css | head -5
echo "   (Showing first 5 uses of CSS variables)"

echo ""
echo "4. Check for CSS syntax errors:"
for file in frontend/src/styles/*.css; do
  # Check for unclosed braces
  opens=$(grep -o "{" "$file" | wc -l)
  closes=$(grep -o "}" "$file" | wc -l)
  if [ "$opens" != "$closes" ]; then
    echo "   ⚠️  $(basename $file): Mismatched braces (opens: $opens, closes: $closes)"
  fi
done

echo ""
echo "5. Frontend build errors (last 20 lines):"
if [ -f "/tmp/frontend.log" ]; then
  tail -20 /tmp/frontend.log
else
  echo "   No log file found at /tmp/frontend.log"
fi

