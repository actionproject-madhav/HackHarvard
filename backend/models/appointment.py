from datetime import datetime

class Appointment:
    @staticmethod
    def create(data):
        """Create appointment"""
        appointment = {
            'user_id': data['user_id'],
            'doctor_id': data['doctor_id'],
            'date': data['date'],
            'time': data['time'],
            'type': data.get('type', 'in-person'),  # in-person or video
            'status': 'scheduled',  # scheduled, completed, cancelled
            'symptoms': data.get('symptoms', []),
            'notes': data.get('notes', ''),
            'diagnosis': None,
            'prescription': None,
            'ai_summary': None,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        return appointment
    
    @staticmethod
    def complete(appointment_id, completion_data):
        """Mark appointment as complete with medical data"""
        return {
            'status': 'completed',
            'diagnosis': completion_data.get('diagnosis'),
            'prescription': completion_data.get('prescription'),
            'doctor_notes': completion_data.get('doctor_notes'),
            'follow_up_date': completion_data.get('follow_up_date'),
            'updated_at': datetime.utcnow()
        }