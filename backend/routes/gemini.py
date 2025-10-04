from flask import Blueprint, request, jsonify
from services.gemini_service import GeminiService

gemini_bp = Blueprint('gemini', __name__)

@gemini_bp.route('/chat', methods=['POST'])
def chat():
    """Chat with Gemini AI assistant"""
    try:
        data = request.json
        message = data.get('message')
        
        if not message:
            return jsonify({'success': False, 'error': 'Message is required'}), 400
        
        # Get user context
        user_context = {
            'medical_history': data.get('medicalHistory', []),
            'medications': data.get('medications', [])
        }
        
        result = GeminiService.chat(message, user_context)
        
        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 500
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

