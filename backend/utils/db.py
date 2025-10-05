from pymongo import MongoClient
from config import Config

client = MongoClient(Config.MONGO_URI)
db = client.CuraSyn+

# Collections
users_collection = db.users
doctors_collection = db.doctors
appointments_collection = db.appointments
symptom_reports_collection = db.symptom_reports
medications_collection = db.medications

def init_db():
    """Initialize database with indexes"""
    # User indexes
    users_collection.create_index('email', unique=True)
    users_collection.create_index('google_id', unique=True)
    
    # Doctor indexes
    doctors_collection.create_index('specialization')
    doctors_collection.create_index('location')
    
    # Appointment indexes
    appointments_collection.create_index('user_id')
    appointments_collection.create_index('doctor_id')
    appointments_collection.create_index('date')
    
    # Symptom report indexes
    symptom_reports_collection.create_index('user_id')
    symptom_reports_collection.create_index('created_at')
    
    print("✅ Database initialized with indexes")