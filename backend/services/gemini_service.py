import google.generativeai as genai
from config import Config

genai.configure(api_key=Config.GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-2.5-flash')

class GeminiService:
    @staticmethod
    def generate_appointment_summary(appointment_data):
        """Generate patient-friendly summary from doctor's notes"""
        prompt = f"""
You are a medical translator. Convert the following doctor's notes into simple, patient-friendly language that a 5th grader can understand.

Doctor's Diagnosis: {appointment_data.get('diagnosis', 'N/A')}
Prescription: {appointment_data.get('prescription', 'N/A')}
Doctor's Notes: {appointment_data.get('doctor_notes', 'N/A')}

Provide:
1. What's wrong (in simple terms)
2. What medicine to take and when
3. What to do at home
4. Warning signs to watch for
5. When to come back

Use simple, reassuring language. No medical jargon.
"""
        
        try:
            response = model.generate_content(prompt)
            return {
                'success': True,
                'summary': response.text
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    @staticmethod
    def analyze_symptoms(symptoms, medical_history):
        """Analyze patient symptoms and provide guidance"""
        prompt = f"""
You are a medical AI assistant. Analyze these symptoms and provide helpful guidance.

Symptoms: {', '.join(symptoms)}
Medical History: {', '.join(medical_history) if medical_history else 'None'}

Provide:
1. Possible conditions (list 2-3, most to least likely)
2. Urgency level (emergency, urgent, routine)
3. Recommended specialist type
4. Home care suggestions
5. Warning signs that require immediate attention

Be helpful but cautious. Always recommend seeing a doctor.
"""
        
        try:
            response = model.generate_content(prompt)
            return {
                'success': True,
                'analysis': response.text
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    @staticmethod
    def translate_medical_terms(medical_text, target_language='simple_english'):
        """Translate medical jargon to simple language"""
        prompt = f"""
Translate this medical text into very simple language that anyone can understand:

{medical_text}

Use everyday words. Explain like talking to a friend.
"""
        
        try:
            response = model.generate_content(prompt)
            return {
                'success': True,
                'translation': response.text
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    @staticmethod
    def chat(message, user_context=None):
        """Interactive chat with personalized health context"""
        medical_history = user_context.get('medical_history', []) if user_context else []
        medications = user_context.get('medications', []) if user_context else []
        
        context_str = ""
        if medical_history:
            context_str += f"\nPatient Medical History: {', '.join(medical_history)}"
        if medications:
            context_str += f"\nCurrent Medications: {', '.join(medications)}"
        
        prompt = f"""
You are CuraSyn+ Assistant, a friendly and knowledgeable health AI. You help patients understand their health better.

{context_str}

Patient Question: {message}

Provide a helpful, empathetic response. Use simple language. If it's serious, recommend seeing a doctor. Be conversational but professional.
"""
        
        try:
            response = model.generate_content(prompt)
            return {
                'success': True,
                'response': response.text
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }