#!/bin/bash
# Quick database check script

cd "$(dirname "$0")/backend"

echo "🔍 Checking ClarityMD Database..."
echo "=================================="
echo ""

PYTHONPATH=. python3 << 'EOF'
from utils.db import db, doctors_collection, users_collection, appointments_collection, symptom_reports_collection
from bson import json_util
import json

# Database stats
stats = db.command("dbstats")
print(f"✅ Database: {db.name}")
print(f"   Size: {stats['dataSize']} bytes")
print("")

# Collection counts
print("📊 Collections:")
print(f"   👨‍⚕️  Doctors:         {doctors_collection.count_documents({})}")
print(f"   👤 Users:           {users_collection.count_documents({})}")
print(f"   📅 Appointments:    {appointments_collection.count_documents({})}")
print(f"   🩺 Symptom Reports: {symptom_reports_collection.count_documents({})}")
print("")

# Sample data
print("👨‍⚕️ Sample Doctor:")
doctor = doctors_collection.find_one()
if doctor:
    print(f"   {doctor.get('name')} - {doctor.get('specialization')}")
    print(f"   {doctor.get('hospital')}")
else:
    print("   No doctors found!")
print("")

print("👤 Registered Users:")
users = list(users_collection.find())
for user in users:
    print(f"   {user.get('name')} ({user.get('email')})")
    
if not users:
    print("   No users yet - sign in with Google to create one!")
print("")

print("=================================="")
print("✅ Database is working!")
print("=================================="")
EOF

