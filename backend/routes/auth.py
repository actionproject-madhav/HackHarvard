from flask import Blueprint, request, jsonify
from google.oauth2 import id_token
from google.auth.transport import requests
from config import Config
from utils.db import users_collection
from models.user import User
from bson import ObjectId
import json

auth_bp = Blueprint('auth', __name__)

class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return json.JSONEncoder.default(self, obj)

@auth_bp.route('/google', methods=['POST'])
def google_auth():
    """Authenticate user with Google OAuth"""
    try:
        print("🔍 Google Auth Request Received")
        print(f"Request data: {request.json}")
        print(f"Google Client ID: {Config.GOOGLE_CLIENT_ID}")
        
        if not request.json:
            return jsonify({'success': False, 'error': 'No JSON data provided'}), 400
            
        token = request.json.get('token')
        if not token:
            return jsonify({'success': False, 'error': 'No token provided'}), 400
        
        # Verify Google token
        idinfo = id_token.verify_oauth2_token(
            token, 
            requests.Request(), 
            Config.GOOGLE_CLIENT_ID
        )
        
        google_id = idinfo['sub']
        email = idinfo['email']
        name = idinfo.get('name')
        picture = idinfo.get('picture')
        
        # Check if user exists
        user = users_collection.find_one({'google_id': google_id})
        
        if not user:
            # Create new user
            user_data = User.create({
                'google_id': google_id,
                'email': email,
                'name': name,
                'profile_picture': picture
            })
            result = users_collection.insert_one(user_data)
            user = users_collection.find_one({'_id': result.inserted_id})
        
        # Convert ObjectId to string
        user['_id'] = str(user['_id'])
        
        print(f"✅ Login successful for user: {email}")
        return jsonify({
            'success': True,
            'user': user,
            'message': 'Login successful'
        }), 200
        
    except Exception as e:
        print(f"❌ Google Auth Error: {str(e)}")
        print(f"Error type: {type(e)}")
        return jsonify({
            'success': False,
            'error': str(e),
            'error_type': str(type(e).__name__)
        }), 401

@auth_bp.route('/logout', methods=['POST'])
def logout():
    """Logout user"""
    return jsonify({
        'success': True,
        'message': 'Logged out successfully'
    }), 200