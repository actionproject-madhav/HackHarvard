import json
from utils.db import doctors_collection, init_db
from datetime import datetime

def seed_database():
    """Seed database with mock data"""
    
    # Initialize database
    init_db()
    
    # Clear existing data
    doctors_collection.delete_many({})
    
    # Load mock doctors
    with open('mock_data/doctors.json', 'r') as f:
        doctors = json.load(f)
    
    # Add timestamps
    for doctor in doctors:
        doctor['created_at'] = datetime.utcnow()
        doctor['updated_at'] = datetime.utcnow()
        doctor['user_id'] = None  # Not linked to actual user accounts
        doctor['availability'] = {
            'monday': ['09:00-17:00'],
            'tuesday': ['09:00-17:00'],
            'wednesday': ['09:00-17:00'],
            'thursday': ['09:00-17:00'],
            'friday': ['09:00-17:00']
        }
    
    # Insert into database
    result = doctors_collection.insert_many(doctors)
    
    print(f"✅ Seeded {len(result.inserted_ids)} doctors into database")

if __name__ == '__main__':
    seed_database()