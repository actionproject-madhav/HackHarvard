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
        token = request.json.get('token')
        
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
        
        return jsonify({
            'success': True,
            'user': user,
            'message': 'Login successful'
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 401

@auth_bp.route('/logout', methods=['POST'])
def logout():
    """Logout user"""
    return jsonify({
        'success': True,
        'message': 'Logged out successfully'
    }), 200