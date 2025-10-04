from datetime import datetime
from bson import ObjectId

class User:
    @staticmethod
    def create(data):
        """Create new user"""
        user = {
            'google_id': data.get('google_id'),
            'email': data['email'],
            'name': data['name'],
            'profile_picture': data.get('profile_picture'),
            'role': data.get('role', 'patient'),  # patient or doctor
            'phone': data.get('phone'),
            'date_of_birth': data.get('date_of_birth'),
            'gender': data.get('gender'),
            'address': data.get('address'),
            'emergency_contact': data.get('emergency_contact'),
            'medical_history': data.get('medical_history', []),
            'allergies': data.get('allergies', []),
            'current_medications': data.get('current_medications', []),
            'preferred_language': data.get('preferred_language', 'en'),
            'accessibility_preferences': data.get('accessibility_preferences', {
                'voice_input': False,
                'high_contrast': False,
                'screen_reader': False,
                'font_size': 'medium'
            }),
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
            'onboarding_completed': False
        }
        return user
    
    @staticmethod
    def update(user_id, data):
        """Update user data"""
        data['updated_at'] = datetime.utcnow()
        return data
