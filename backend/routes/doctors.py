from flask import Blueprint, request, jsonify
from utils.db import doctors_collection
from bson import ObjectId
import requests
from config import Config

doctors_bp = Blueprint('doctors', __name__)

@doctors_bp.route('/', methods=['GET'])
@doctors_bp.route('', methods=['GET'])
def get_doctors():
    """Get all doctors or filter by specialization"""
    try:
        specialization = request.args.get('specialization')
        
        query = {}
        if specialization:
            query['specialization'] = specialization
        
        doctors = list(doctors_collection.find(query).limit(50))
        
        for doctor in doctors:
            doctor['_id'] = str(doctor['_id'])
        
        return jsonify({'success': True, 'doctors': doctors}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@doctors_bp.route('/search', methods=['GET'])
def search_doctors():
    """Search doctors by specialization or other criteria"""
    try:
        specialization = request.args.get('specialization')
        city = request.args.get('city')
        
        query = {}
        if specialization:
            query['specialization'] = {'$regex': specialization, '$options': 'i'}
        if city:
            query['location.city'] = {'$regex': city, '$options': 'i'}
        
        doctors = list(doctors_collection.find(query).limit(50))
        
        for doctor in doctors:
            doctor['_id'] = str(doctor['_id'])
        
        return jsonify({'success': True, 'doctors': doctors}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@doctors_bp.route('/<doctor_id>', methods=['GET'])
def get_doctor(doctor_id):
    """Get specific doctor"""
    try:
        doctor = doctors_collection.find_one({'_id': ObjectId(doctor_id)})
        if doctor:
            doctor['_id'] = str(doctor['_id'])
            return jsonify({'success': True, 'doctor': doctor}), 200
        return jsonify({'success': False, 'error': 'Doctor not found'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@doctors_bp.route('/nearby', methods=['POST'])
def find_nearby_doctors():
    """Find doctors nearby using Google Maps API"""
    try:
        data = request.json
        lat = data.get('lat')
        lng = data.get('lng')
        radius = data.get('radius', 5000)  # 5km default
        specialization = data.get('specialization')
        
        # Query local database first
        doctors = list(doctors_collection.find())
        
        # Calculate distances and filter
        nearby_doctors = []
        for doctor in doctors:
            doc_coords = doctor.get('location', {}).get('coordinates', {})
            doc_lat = doc_coords.get('lat', 0)
            doc_lng = doc_coords.get('lng', 0)
            
            # Simple distance calculation (for demo)
            distance = ((lat - doc_lat)**2 + (lng - doc_lng)**2)**0.5 * 111  # Rough km
            
            if distance <= radius / 1000:
                doctor['distance'] = round(distance, 2)
                doctor['_id'] = str(doctor['_id'])
                
                if specialization:
                    if doctor.get('specialization') == specialization:
                        nearby_doctors.append(doctor)
                else:
                    nearby_doctors.append(doctor)
        
        nearby_doctors.sort(key=lambda x: x.get('distance', float('inf')))
        
        return jsonify({
            'success': True,
            'doctors': nearby_doctors[:10]
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500