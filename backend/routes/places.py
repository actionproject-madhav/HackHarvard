from flask import Blueprint, request, jsonify
from services.google_places_service import GooglePlacesService

places_bp = Blueprint('places', __name__)

@places_bp.route('/nearby-hospitals', methods=['POST'])
def find_nearby_hospitals():
    """Find nearby hospitals based on user location"""
    try:
        data = request.json
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        radius = data.get('radius', 5000)  # Default 5km
        keyword = data.get('keyword', 'hospital')
        
        if not latitude or not longitude:
            return jsonify({
                'success': False,
                'error': 'Latitude and longitude are required'
            }), 400
        
        facilities = GooglePlacesService.find_nearby_hospitals(
            latitude, longitude, radius, keyword
        )
        
        return jsonify({
            'success': True,
            'facilities': facilities,
            'count': len(facilities)
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@places_bp.route('/specialized-facilities', methods=['POST'])
def find_specialized_facilities():
    """Find medical facilities based on specialization"""
    try:
        data = request.json
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        specialization = data.get('specialization', 'General Practice')
        radius = data.get('radius', 10000)  # Default 10km
        
        if not latitude or not longitude:
            return jsonify({
                'success': False,
                'error': 'Latitude and longitude are required'
            }), 400
        
        facilities = GooglePlacesService.find_specialized_facilities(
            latitude, longitude, specialization, radius
        )
        
        return jsonify({
            'success': True,
            'facilities': facilities,
            'specialization': specialization,
            'count': len(facilities)
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@places_bp.route('/place-details/<place_id>', methods=['GET'])
def get_place_details(place_id):
    """Get detailed information about a specific place"""
    try:
        details = GooglePlacesService.get_place_details(place_id)
        
        if not details:
            return jsonify({
                'success': False,
                'error': 'Place not found'
            }), 404
        
        return jsonify({
            'success': True,
            'details': details
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
