from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from utils.db import init_db

# Import blueprints
from routes.auth import auth_bp
from routes.users import users_bp
from routes.doctors import doctors_bp
from routes.appointments import appointments_bp
from routes.symptoms import symptoms_bp
from routes.emergency import emergency_bp
from routes.gemini import gemini_bp

app = Flask(__name__)
app.config.from_object(Config)

# Enable CORS for all routes
CORS(app, resources={
    r"/*": {
        "origins": Config.CORS_ORIGINS,
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(users_bp, url_prefix='/api/users')
app.register_blueprint(doctors_bp, url_prefix='/api/doctors')
app.register_blueprint(appointments_bp, url_prefix='/api/appointments')
app.register_blueprint(symptoms_bp, url_prefix='/api/symptoms')
app.register_blueprint(emergency_bp, url_prefix='/api/emergency')
app.register_blueprint(gemini_bp, url_prefix='/api/gemini')

@app.route('/')
def index():
    return jsonify({
        'message': 'ClarityMD API',
        'version': '1.0.0',
        'status': 'running'
    })

@app.route('/api/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'database': 'connected'
    })

if __name__ == '__main__':
    init_db()
    print(" ClarityMD Backend starting...")
    print(" API running on http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)