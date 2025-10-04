from flask import Blueprint, request, jsonify
from utils.db import symptom_reports_collection, users_collection
from models.symptom_report import SymptomReport
from services.gemini_service import GeminiService
from services.emergency_detector import EmergencyDetector
from services.doctor_matcher import DoctorMatcher
from bson import ObjectId
from datetime import datetime

symptoms_bp = Blueprint('symptoms', __name__)

@symptoms_bp.route('/report', methods=['POST'])
def create_symptom_report():
    """Create new symptom report and analyze"""
    try:
        data = request.json
        user_id = data.get('user_id')
        
        # Get user's medical history
        user = users_collection.find_one({'_id': ObjectId(user_id)})
        medical_history = user.get('medical_history', []) if user else []
        
        # Create symptom report
        report_data = SymptomReport.create(data)
        
        # Check for emergency
        emergency_check = EmergencyDetector.detect_emergency(data.get('symptoms', []))
        report_data['emergency_detected'] = emergency_check['is_emergency']
        report_data['emergency_type'] = emergency_check.get('emergencies', [{}])[0].get('type') if emergency_check['is_emergency'] else None
        
        # AI analysis of symptoms
        ai_result = GeminiService.analyze_symptoms(
            data.get('symptoms', []),
            medical_history
        )
        
        if ai_result['success']:
            report_data['ai_analysis'] = ai_result['analysis']
        
        # Insert report
        result = symptom_reports_collection.insert_one(report_data)
        report_id = str(result.inserted_id)
        
        # Match with doctor if not emergency
        matched_doctors = []
        if not emergency_check['is_emergency']:
            user_location = data.get('location')
            matched_doctors = DoctorMatcher.match_doctor(report_data, user_location)
            
            for doctor in matched_doctors:
                doctor['_id'] = str(doctor['_id'])
        
        return jsonify({
            'success': True,
            'report_id': report_id,
            'emergency': emergency_check,
            'ai_analysis': ai_result.get('analysis'),
            'matched_doctors': matched_doctors
        }), 201
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@symptoms_bp.route('/<user_id>/history', methods=['GET'])
def get_symptom_history(user_id):
    """Get user's symptom report history"""
    try:
        reports = list(symptom_reports_collection.find(
            {'user_id': user_id}
        ).sort('created_at', -1).limit(20))
        
        for report in reports:
            report['_id'] = str(report['_id'])
        
        return jsonify({'success': True, 'reports': reports}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500