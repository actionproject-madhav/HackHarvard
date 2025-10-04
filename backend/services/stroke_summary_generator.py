"""
Stroke Appointment Summary Generator
Generates hardcoded appointment summaries for stroke demo
"""

from datetime import datetime, timedelta

class StrokeSummaryGenerator:
    """Generate stroke-specific appointment summaries"""
    
    @staticmethod
    def generate_stroke_summary(user_name, assessment_data):
        """Generate a comprehensive stroke appointment summary"""
        
        # Extract stroke indicators
        stroke_indicators = assessment_data.get('strokeIndicators', {})
        facial_droop = stroke_indicators.get('facialDroop', False)
        speech_difficulty = stroke_indicators.get('speechDifficulty', False)
        asymmetry_score = stroke_indicators.get('asymmetryScore', 0)
        
        # Generate summary
        summary = {
            'appointment_type': 'Emergency Stroke Consultation',
            'date': datetime.utcnow().isoformat(),
            'doctor': {
                'name': 'Dr. Sarah Chen',
                'specialty': 'Neurology - Stroke Specialist',
                'credentials': 'MD, PhD, FAAN',
                'hospital': 'Harvard Medical Center'
            },
            'patient_name': user_name,
            'chief_complaint': 'Suspected stroke symptoms detected via AI assessment',
            
            'assessment': {
                'presenting_symptoms': [
                    'Facial asymmetry detected' if facial_droop else 'No facial droop',
                    'Speech difficulty noted' if speech_difficulty else 'Speech clear',
                    f'Asymmetry score: {asymmetry_score:.2f}'
                ],
                'fast_protocol_results': {
                    'face': 'Positive' if facial_droop else 'Negative',
                    'arms': 'Assessment completed',
                    'speech': 'Positive' if speech_difficulty else 'Negative',
                    'time': 'Symptoms onset < 1 hour'
                },
                'vital_signs': {
                    'blood_pressure': '145/92 mmHg',
                    'heart_rate': '88 bpm',
                    'temperature': '98.6°F',
                    'oxygen_saturation': '97%'
                }
            },
            
            'diagnosis': {
                'primary': 'Transient Ischemic Attack (TIA) - Suspected',
                'icd_code': 'G45.9',
                'severity': 'Moderate',
                'notes': 'Patient presented with acute onset facial asymmetry and speech changes. FAST protocol positive. Immediate neurological evaluation recommended.'
            },
            
            'treatment_plan': {
                'immediate': [
                    'CT scan of brain completed - No acute hemorrhage',
                    'MRI scheduled within 24 hours',
                    'Continuous cardiac monitoring',
                    'IV access established'
                ],
                'medications': [
                    {
                        'name': 'Aspirin',
                        'dosage': '325 mg',
                        'frequency': 'Once daily',
                        'duration': 'Ongoing',
                        'purpose': 'Antiplatelet therapy to prevent blood clots'
                    },
                    {
                        'name': 'Atorvastatin',
                        'dosage': '80 mg',
                        'frequency': 'Once daily at bedtime',
                        'duration': 'Ongoing',
                        'purpose': 'Cholesterol management and stroke prevention'
                    },
                    {
                        'name': 'Lisinopril',
                        'dosage': '10 mg',
                        'frequency': 'Once daily',
                        'duration': 'Ongoing',
                        'purpose': 'Blood pressure control'
                    }
                ],
                'lifestyle_modifications': [
                    'Low-sodium diet (< 2000mg/day)',
                    'Regular exercise (30 min, 5x/week)',
                    'Smoking cessation if applicable',
                    'Limit alcohol consumption',
                    'Stress management techniques'
                ]
            },
            
            'follow_up': {
                'next_appointment': (datetime.utcnow() + timedelta(days=7)).strftime('%Y-%m-%d'),
                'appointments': [
                    {
                        'type': 'Neurology Follow-up',
                        'date': (datetime.utcnow() + timedelta(days=7)).strftime('%Y-%m-%d'),
                        'time': '10:00 AM',
                        'location': 'Harvard Medical Center, Neurology Dept'
                    },
                    {
                        'type': 'MRI Scan',
                        'date': (datetime.utcnow() + timedelta(days=1)).strftime('%Y-%m-%d'),
                        'time': '2:00 PM',
                        'location': 'Harvard Medical Center, Radiology'
                    },
                    {
                        'type': 'Physical Therapy Evaluation',
                        'date': (datetime.utcnow() + timedelta(days=3)).strftime('%Y-%m-%d'),
                        'time': '9:00 AM',
                        'location': 'Harvard Medical Center, Rehab Services'
                    }
                ],
                'monitoring': [
                    'Daily blood pressure checks',
                    'Watch for new or worsening symptoms',
                    'Keep symptom diary'
                ]
            },
            
            'warning_signs': {
                'title': 'When to Call 911 Immediately',
                'signs': [
                    'Sudden numbness or weakness in face, arm, or leg',
                    'Sudden confusion or trouble speaking',
                    'Sudden trouble seeing in one or both eyes',
                    'Sudden trouble walking or loss of balance',
                    'Sudden severe headache with no known cause'
                ]
            },
            
            'education_resources': [
                {
                    'title': 'Understanding TIA and Stroke',
                    'description': 'Learn about the differences and prevention',
                    'link': '/education?topic=stroke'
                },
                {
                    'title': 'Stroke Recovery Guide',
                    'description': 'What to expect during recovery',
                    'link': '/education?topic=stroke-recovery'
                },
                {
                    'title': 'Medication Management',
                    'description': 'How to take your medications properly',
                    'link': '/medications'
                }
            ],
            
            'doctor_notes': """
Patient presented with acute neurological symptoms detected by AI screening. 
FAST protocol assessment showed positive findings for facial asymmetry and speech changes.
Immediate evaluation performed. CT scan negative for hemorrhage. Patient is hemodynamically stable.

Diagnosis: Likely TIA (Transient Ischemic Attack)
Plan: Initiate antiplatelet therapy, statin, and blood pressure management. 
MRI brain scheduled for tomorrow. Close follow-up in 1 week.

Patient educated on stroke warning signs and when to seek emergency care.
Lifestyle modifications discussed. Patient verbalized understanding of treatment plan.

- Dr. Sarah Chen, MD, PhD, FAAN
  Stroke Neurology
  Harvard Medical Center
            """.strip(),
            
            'next_steps': [
                'Take all prescribed medications as directed',
                'Attend all follow-up appointments',
                'Monitor blood pressure daily',
                'Review stroke warning signs with family',
                'Make lifestyle changes as discussed',
                'Complete MRI scan tomorrow'
            ]
        }
        
        return summary
    
    @staticmethod
    def generate_prescription(medications):
        """Generate a formatted prescription"""
        prescription = {
            'date': datetime.utcnow().strftime('%Y-%m-%d'),
            'prescriber': 'Dr. Sarah Chen, MD, PhD',
            'license': 'MA-123456',
            'medications': medications,
            'pharmacy_instructions': 'Please fill all medications. Patient education provided on proper use.',
            'refills': 'As indicated per medication',
            'valid_until': (datetime.utcnow() + timedelta(days=365)).strftime('%Y-%m-%d')
        }
        
        return prescription
