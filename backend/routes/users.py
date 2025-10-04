from flask import Blueprint, request, jsonify
from utils.db import users_collection
from models.user import User
from bson import ObjectId

users_bp = Blueprint('users', __name__)

@users_bp.route('/<user_id>', methods=['GET'])
def get_user(user_id):
    """Get user profile"""
    try:
        user = users_collection.find_one({'_id': ObjectId(user_id)})
        if user:
            user['_id'] = str(user['_id'])
            return jsonify({'success': True, 'user': user}), 200
        return jsonify({'success': False, 'error': 'User not found'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@users_bp.route('/<user_id>', methods=['PUT'])
def update_user(user_id):
    """Update user profile"""
    try:
        data = request.json
        update_data = User.update(user_id, data)
        
        users_collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': update_data}
        )
        
        return jsonify({'success': True, 'message': 'Profile updated'}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@users_bp.route('/<user_id>/onboarding', methods=['POST'])
def complete_onboarding(user_id):
    """Complete user onboarding"""
    try:
        data = request.json
        
        users_collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': {
                'phone': data.get('phone'),
                'date_of_birth': data.get('date_of_birth'),
                'gender': data.get('gender'),
                'address': data.get('address'),
                'emergency_contact': data.get('emergency_contact'),
                'medical_history': data.get('medical_history', []),
                'allergies': data.get('allergies', []),
                'current_medications': data.get('current_medications', []),
                'preferred_language': data.get('preferred_language', 'en'),
                'accessibility_preferences': data.get('accessibility_preferences', {}),
                'onboarding_completed': True
            }}
        )
        
        return jsonify({'success': True, 'message': 'Onboarding completed'}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
