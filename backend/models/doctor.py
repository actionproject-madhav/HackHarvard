from datetime import datetime

class Doctor:
    @staticmethod
    def create(data):
        """Create doctor profile"""
        doctor = {
            'user_id': data['user_id'],
            'name': data['name'],
            'specialization': data['specialization'],
            'qualifications': data.get('qualifications', []),
            'experience_years': data.get('experience_years', 0),
            'languages': data.get('languages', ['English']),
            'hospital': data.get('hospital'),
            'location': {
                'address': data.get('address'),
                'city': data.get('city'),
                'state': data.get('state'),
                'coordinates': data.get('coordinates', {'lat': 0, 'lng': 0})
            },
            'availability': data.get('availability', {}),
            'rating': data.get('rating', 0),
            'profile_picture': data.get('profile_picture'),
            'bio': data.get('bio'),
            'consultation_fee': data.get('consultation_fee', 0),
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        return doctor