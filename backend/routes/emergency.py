from flask import Blueprint, request, jsonify
from services.emergency_detector import EmergencyDetector

emergency_bp = Blueprint('emergency', __name__)

@emergency_bp.route('/detect', methods=['POST'])
def detect_emergency():
    """Detect emergency from symptoms or facial analysis"""
    try:
        data = request.json
        
        # Check symptoms
        symptoms = data.get('symptoms', [])
        if symptoms:
            result = EmergencyDetector.detect_emergency(symptoms)
            return jsonify({
                'success': True,
                'emergency_detected': result['is_emergency'],
                'details': result
            }), 200
        
        # Check facial analysis data (from frontend ML model)
        facial_data = data.get('facial_analysis')
        if facial_data:
            # Process facial analysis for stroke detection
            stroke_indicators = facial_data.get('stroke_indicators', {})
            
            if any(stroke_indicators.values()):
                return jsonify({
                    'success': True,
                    'emergency_detected': True,
                    'details': {
                        'is_emergency': True,
                        'emergencies': [{
                            'type': 'stroke',
                            'severity': 'critical',
                            'action': 'Call 911 immediately. Note time symptoms started.'
                        }],
                        'facial_indicators': stroke_indicators
                    }
                }), 200
        
        return jsonify({
            'success': True,
            'emergency_detected': False,
            'details': {'is_emergency': False}
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@emergency_bp.route('/contacts', methods=['GET'])
def get_emergency_contacts():
    """Get emergency contacts and numbers"""
    return jsonify({
        'success': True,
        'contacts': {
            'emergency': '911',
            'poison_control': '1-800-222-1222',
            'suicide_prevention': '988',
            'crisis_text_line': 'Text HOME to 741741'
        }
    }), 200