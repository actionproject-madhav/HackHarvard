from utils.db import doctors_collection
import math

class DoctorMatcher:
    @staticmethod
    def match_doctor(symptom_report, user_location):
        """Match patient with appropriate doctor based on symptoms and location"""
        
        # Extract key information
        symptoms = symptom_report.get('symptoms', [])
        severity = symptom_report.get('severity', 'moderate')
        ai_analysis = symptom_report.get('ai_analysis', '')
        
        # Determine specialization needed
        specialization = DoctorMatcher._determine_specialization(symptoms, ai_analysis)
        
        # Find nearby doctors with that specialization
        doctors = list(doctors_collection.find({
            'specialization': {'$in': specialization}
        }))
        
        if not doctors:
            # Fallback to general practitioners
            doctors = list(doctors_collection.find({
                'specialization': 'General Practice'
            }))
        
        # Calculate distance and sort
        if user_location:
            for doctor in doctors:
                doctor_loc = doctor.get('location', {}).get('coordinates', {})
                distance = DoctorMatcher._calculate_distance(
                    user_location.get('lat'), 
                    user_location.get('lng'),
                    doctor_loc.get('lat', 0),
                    doctor_loc.get('lng', 0)
                )
                doctor['distance'] = distance
            
            doctors.sort(key=lambda x: x.get('distance', float('inf')))
        
        # Return top 5 matches
        return doctors[:5]
    
    @staticmethod
    def _determine_specialization(symptoms, ai_analysis):
        """Determine medical specialization based on symptoms"""
        symptom_text = ' '.join(symptoms).lower() + ' ' + ai_analysis.lower()
        
        specializations = {
            'Cardiology': ['heart', 'chest pain', 'palpitation', 'blood pressure'],
            'Neurology': ['headache', 'dizziness', 'numbness', 'stroke', 'seizure'],
            'Orthopedics': ['bone', 'joint', 'fracture', 'sprain', 'back pain'],
            'Dermatology': ['skin', 'rash', 'acne', 'itch'],
            'Pulmonology': ['breathing', 'cough', 'asthma', 'chest'],
            'Gastroenterology': ['stomach', 'abdominal', 'nausea', 'diarrhea'],
            'ENT': ['ear', 'nose', 'throat', 'hearing', 'sinus'],
            'Ophthalmology': ['eye', 'vision', 'sight'],
            'Pediatrics': ['child', 'infant', 'baby']
        }
        
        matches = []
        for spec, keywords in specializations.items():
            if any(keyword in symptom_text for keyword in keywords):
                matches.append(spec)
        
        return matches if matches else ['General Practice']
    
    @staticmethod
    def _calculate_distance(lat1, lon1, lat2, lon2):
        """Calculate distance between two coordinates (Haversine formula)"""
        if not all([lat1, lon1, lat2, lon2]):
            return float('inf')
        
        R = 6371  # Earth's radius in km
        
        lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        
        a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
        c = 2 * math.asin(math.sqrt(a))
        
        return R * c  # Distance in km