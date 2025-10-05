from flask import Blueprint, request, jsonify
from services.face_detector import face_detector

face_detection_bp = Blueprint('face_detection', __name__)

@face_detection_bp.route('/analyze', methods=['POST'])
def analyze_face():
    """
    Analyze face from base64 image
    Expects: { "image": "data:image/jpeg;base64,..." }
    """
    try:
        data = request.json
        if not data or 'image' not in data:
            return jsonify({
                'success': False,
                'error': 'No image provided'
            }), 400
        
        result = face_detector.detect_face_from_base64(data['image'])
        
        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 200  # Still return 200 but with success: false
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@face_detection_bp.route('/test', methods=['GET'])
def test():
    """Test endpoint"""
    return jsonify({
        'status': 'Face detection service is running',
        'backend': 'OpenCV'
    }), 200
