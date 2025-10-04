from flask import Blueprint, request, jsonify
from utils.db import appointments_collection
from models.appointment import Appointment
from services.gemini_service import GeminiService
from bson import ObjectId
from datetime import datetime

appointments_bp = Blueprint('appointments', __name__)

@appointments_bp.route('/', methods=['POST'])
def create_appointment():
    """Create new appointment"""
    try:
        data = request.json
        appointment_data = Appointment.create(data)
        
        result = appointments_collection.insert_one(appointment_data)
        
        return jsonify({
            'success': True,
            'appointment_id': str(result.inserted_id),
            'message': 'Appointment scheduled successfully'
        }), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@appointments_bp.route('/<appointment_id>/complete', methods=['POST'])
def complete_appointment(appointment_id):
    """Complete appointment and generate AI summary"""
    try:
        data = request.json
        
        # Generate AI summary from doctor's notes
        ai_summary_result = GeminiService.generate_appointment_summary(data)
        
        completion_data = Appointment.complete(appointment_id, data)
        
        if ai_summary_result['success']:
            completion_data['ai_summary'] = ai_summary_result['summary']
        
        appointments_collection.update_one(
            {'_id': ObjectId(appointment_id)},
            {'$set': completion_data}
        )
        
        return jsonify({
            'success': True,
            'ai_summary': ai_summary_result.get('summary'),
            'message': 'Appointment completed'
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@appointments_bp.route('/user/<user_id>', methods=['GET'])
def get_user_appointments(user_id):
    """Get user's appointments"""
    try:
        status = request.args.get('status')  # scheduled, completed, cancelled
        
        query = {'user_id': user_id}
        if status:
            query['status'] = status
        
        appointments = list(appointments_collection.find(query).sort('date', -1))
        
        for apt in appointments:
            apt['_id'] = str(apt['_id'])
        
        return jsonify({'success': True, 'appointments': appointments}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@appointments_bp.route('/<appointment_id>/summary', methods=['GET'])
def get_appointment_summary(appointment_id):
    """Get AI-generated appointment summary"""
    try:
        appointment = appointments_collection.find_one({'_id': ObjectId(appointment_id)})
        
        if not appointment:
            return jsonify({'success': False, 'error': 'Appointment not found'}), 404
        
        if not appointment.get('ai_summary'):
            return jsonify({
                'success': False,
                'error': 'Summary not available yet'
            }), 404
        
        return jsonify({
            'success': True,
            'summary': appointment['ai_summary'],
            'diagnosis': appointment.get('diagnosis'),
            'prescription': appointment.get('prescription')
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500