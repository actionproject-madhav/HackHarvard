#!/usr/bin/env python3
"""Test script to verify all imports and start the server"""

import sys
import os

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

print("Testing imports...")

try:
    print("1. Testing config...")
    from config import Config
    print("   ✅ Config OK")
    
    print("2. Testing database utils...")
    from utils.db import init_db
    print("   ✅ Database utils OK")
    
    print("3. Testing models...")
    from models.user import User
    from models.doctor import Doctor
    from models.appointment import Appointment
    from models.symptom_report import SymptomReport
    print("   ✅ All models OK")
    
    print("4. Testing routes...")
    from routes.auth import auth_bp
    from routes.users import users_bp
    from routes.doctors import doctors_bp
    from routes.appointments import appointments_bp
    from routes.symptoms import symptoms_bp
    from routes.emergency import emergency_bp
    print("   ✅ All routes OK")
    
    print("5. Starting Flask app...")
    from app import app
    print("   ✅ App imported successfully")
    
    print("\n🚀 Starting server...")
    init_db()
    app.run(debug=True, host='0.0.0.0', port=5000)
    
except ImportError as e:
    print(f"   ❌ Import Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
except Exception as e:
    print(f"   ❌ Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

