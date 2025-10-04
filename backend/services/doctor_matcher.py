from utils.db import doctors_collection
import math

class DoctorMatcher:
    @staticmethod
    def match_doctor(symptom_report, user_location):
        """
        Match patient with appropriate doctor based on symptoms and location
        Uses a scoring algorithm that considers:
        - Specialization match (40%)
        - Distance (30%)
        - Rating (20%)
        - Availability (10%)
        """
        
        # Extract key information
        symptoms = symptom_report.get('symptoms', [])
        severity = symptom_report.get('severity', 'moderate')
        ai_analysis = symptom_report.get('ai_analysis', '')
        
        # Determine specialization needed
        specializations = DoctorMatcher._determine_specialization(symptoms, ai_analysis)
        
        # Find doctors with matching specializations
        doctors = list(doctors_collection.find({
            'specialization': {'$in': specializations}
        }))
        
        if not doctors:
            # Fallback to general practitioners
            doctors = list(doctors_collection.find({
                'specialization': 'General Practice'
            }))
        
        # Calculate match scores
        for doctor in doctors:
            score = DoctorMatcher._calculate_match_score(
                doctor, 
                specializations, 
                user_location, 
                severity
            )
            doctor['match_score'] = score
            
            # Calculate distance
            if user_location:
                doctor_loc = doctor.get('location', {}).get('coordinates', {})
                distance = DoctorMatcher._calculate_distance(
                    user_location.get('lat'), 
                    user_location.get('lng'),
                    doctor_loc.get('lat', 0),
                    doctor_loc.get('lng', 0)
                )
                doctor['distance'] = distance
            else:
                doctor['distance'] = None
        
        # Sort by match score (highest first)
        doctors.sort(key=lambda x: x.get('match_score', 0), reverse=True)
        
        # Return top 10 matches
        return doctors[:10]
    
    @staticmethod
    def _calculate_match_score(doctor, needed_specializations, user_location, severity):
        """
        Calculate match score for a doctor
        Score range: 0-100
        """
        score = 0
        
        # 1. Specialization Match (40 points)
        doctor_spec = doctor.get('specialization', '')
        if doctor_spec in needed_specializations:
            score += 40
        elif doctor_spec == 'General Practice':
            score += 20  # General practitioners get half points
        
        # 2. Distance Score (30 points)
        if user_location:
            doctor_loc = doctor.get('location', {}).get('coordinates', {})
            distance = DoctorMatcher._calculate_distance(
                user_location.get('lat'), 
                user_location.get('lng'),
                doctor_loc.get('lat', 0),
                doctor_loc.get('lng', 0)
            )
            
            # Closer is better: 30 points for <5km, decreasing to 0 at 50km
            if distance < 5:
                score += 30
            elif distance < 10:
                score += 25
            elif distance < 20:
                score += 15
            elif distance < 50:
                score += 5
        else:
            score += 15  # Default if no location
        
        # 3. Rating Score (20 points)
        rating = doctor.get('rating', 0)
        if rating >= 4.5:
            score += 20
        elif rating >= 4.0:
            score += 15
        elif rating >= 3.5:
            score += 10
        elif rating >= 3.0:
            score += 5
        
        # 4. Availability Score (10 points)
        availability = doctor.get('availability', {})
        if availability.get('accepting_new_patients', True):
            score += 10
        
        return round(score, 2)
    
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