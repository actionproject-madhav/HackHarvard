from datetime import datetime
from utils.db import db
from bson import ObjectId

class StrokeIncident:
    """Model for stroke incident records"""
    
    collection = db['stroke_incidents']
    
    def __init__(self, user_id, timestamp, assessment_data, emergency_call_made, 
                 appointment_booked, status='active', _id=None):
        self._id = _id
        self.user_id = user_id
        self.timestamp = timestamp
        self.assessment_data = assessment_data
        self.emergency_call_made = emergency_call_made
        self.appointment_booked = appointment_booked
        self.status = status
        self.created_at = datetime.utcnow()
    
    def save(self):
        """Save stroke incident to database"""
        incident_data = {
            'user_id': self.user_id,
            'timestamp': self.timestamp,
            'assessment_data': self.assessment_data,
            'emergency_call_made': self.emergency_call_made,
            'appointment_booked': self.appointment_booked,
            'status': self.status,
            'created_at': self.created_at
        }
        
        if self._id:
            self.collection.update_one(
                {'_id': ObjectId(self._id)},
                {'$set': incident_data}
            )
            return str(self._id)
        else:
            result = self.collection.insert_one(incident_data)
            return str(result.inserted_id)
    
    @classmethod
    def get_by_user(cls, user_id):
        """Get all stroke incidents for a user"""
        incidents = cls.collection.find({'user_id': user_id}).sort('created_at', -1)
        
        result = []
        for incident in incidents:
            incident['_id'] = str(incident['_id'])
            result.append(incident)
        
        return result
    
    @classmethod
    def get_by_id(cls, incident_id):
        """Get stroke incident by ID"""
        incident = cls.collection.find_one({'_id': ObjectId(incident_id)})
        
        if incident:
            incident['_id'] = str(incident['_id'])
            return incident
        
        return None
    
    @classmethod
    def get_latest_by_user(cls, user_id):
        """Get the most recent stroke incident for a user"""
        incident = cls.collection.find_one(
            {'user_id': user_id},
            sort=[('created_at', -1)]
        )
        
        if incident:
            incident['_id'] = str(incident['_id'])
            return incident
        
        return None
    
    @classmethod
    def update_status(cls, incident_id, status):
        """Update the status of a stroke incident"""
        cls.collection.update_one(
            {'_id': ObjectId(incident_id)},
            {'$set': {'status': status, 'updated_at': datetime.utcnow()}}
        )
