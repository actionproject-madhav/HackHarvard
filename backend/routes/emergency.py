from flask import Blueprint, request, jsonify
from services.emergency_detector import EmergencyDetector
from models.stroke_incident import StrokeIncident
from datetime import datetime

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

@emergency_bp.route('/stroke-incident', methods=['POST'])
def save_stroke_incident():
    """Save stroke incident to database"""
    try:
        data = request.json
        
        incident = StrokeIncident(
            user_id=data.get('user_id'),
            timestamp=data.get('timestamp', datetime.utcnow().isoformat()),
            assessment_data=data.get('assessment_data', {}),
            emergency_call_made=data.get('emergency_call_made', False),
            appointment_booked=data.get('appointment_booked', False),
            status=data.get('status', 'active')
        )
        
        incident_id = incident.save()
        
        return jsonify({
            'success': True,
            'incident_id': incident_id,
            'message': 'Stroke incident saved successfully'
        }), 201
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@emergency_bp.route('/stroke-incidents/<user_id>', methods=['GET'])
def get_stroke_incidents(user_id):
    """Get all stroke incidents for a user"""
    try:
        incidents = StrokeIncident.get_by_user(user_id)
        
        return jsonify({
            'success': True,
            'incidents': incidents
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500