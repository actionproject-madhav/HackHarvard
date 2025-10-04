from datetime import datetime

class SymptomReport:
    @staticmethod
    def create(data):
        """Create symptom report"""
        report = {
            'user_id': data['user_id'],
            'input_method': data.get('input_method', 'text'),  # text, voice, visual
            'symptoms': data['symptoms'],  # list of symptoms
            'severity': data.get('severity', 'moderate'),  # mild, moderate, severe
            'duration': data.get('duration'),
            'additional_notes': data.get('additional_notes'),
            'emergency_detected': data.get('emergency_detected', False),
            'emergency_type': data.get('emergency_type'),
            'matched_doctor_id': None,
            'ai_analysis': None,
            'created_at': datetime.utcnow()
        }
        return report