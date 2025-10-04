class EmergencyDetector:
    @staticmethod
    def detect_emergency(symptoms):
        """Detect if symptoms indicate emergency"""
        
        emergency_keywords = {
            'stroke': ['facial droop', 'arm weakness', 'speech difficulty', 'sudden numbness', 
                      'confusion', 'trouble seeing', 'severe headache', 'loss of balance'],
            'heart_attack': ['chest pain', 'shortness of breath', 'pain in arm', 'jaw pain',
                           'cold sweat', 'nausea', 'lightheaded'],
            'severe_allergic_reaction': ['difficulty breathing', 'swelling', 'hives', 'throat closing'],
            'severe_bleeding': ['heavy bleeding', 'blood loss', 'deep cut'],
            'unconscious': ['unconscious', 'unresponsive', 'passed out']
        }
        
        symptoms_text = ' '.join([s.lower() for s in symptoms])
        
        detected_emergencies = []
        for emergency_type, keywords in emergency_keywords.items():
            if any(keyword in symptoms_text for keyword in keywords):
                detected_emergencies.append({
                    'type': emergency_type,
                    'severity': 'critical',
                    'action': EmergencyDetector._get_emergency_action(emergency_type)
                })
        
        if detected_emergencies:
            return {
                'is_emergency': True,
                'emergencies': detected_emergencies,
                'recommendation': 'Call 911 immediately'
            }
        
        return {
            'is_emergency': False,
            'emergencies': [],
            'recommendation': 'Schedule appointment with doctor'
        }
    
    @staticmethod
    def _get_emergency_action(emergency_type):
        """Get recommended action for emergency type"""
        actions = {
            'stroke': 'Call 911 immediately. Note time symptoms started. DO NOT drive yourself.',
            'heart_attack': 'Call 911. Chew aspirin if available. Sit down and stay calm.',
            'severe_allergic_reaction': 'Call 911. Use EpiPen if available.',
            'severe_bleeding': 'Call 911. Apply pressure to wound. Elevate if possible.',
            'unconscious': 'Call 911 immediately. Check breathing. Begin CPR if trained.'
        }
        return actions.get(emergency_type, 'Call 911 immediately')