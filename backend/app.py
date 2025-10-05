from flask import Flask, jsonify, render_template
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
from routes.places import places_bp
from routes.face_detection import face_detection_bp

app = Flask(
    __name__,
    static_url_path="",
    static_folder="../frontend/build",
    template_folder="../frontend/build",
)
app.config.from_object(Config)
app.url_map.strict_slashes = False

# Enable CORS for all routes
CORS(
    app,
    resources={
        r"/*": {
            "origins": Config.CORS_ORIGINS,
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True,
        }
    },
)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(users_bp, url_prefix="/api/users")
app.register_blueprint(doctors_bp, url_prefix="/api/doctors")
app.register_blueprint(appointments_bp, url_prefix="/api/appointments")
app.register_blueprint(symptoms_bp, url_prefix="/api/symptoms")
app.register_blueprint(emergency_bp, url_prefix="/api/emergency")
app.register_blueprint(gemini_bp, url_prefix="/api/gemini")
app.register_blueprint(places_bp, url_prefix="/api/places")
app.register_blueprint(face_detection_bp, url_prefix="/api/face-detection")


@app.route("/")
def index():
    return render_template('index.html')

@app.errorhandler(404)
def not_found(e):
    return render_template('index.html')


@app.route("/api/health")
def health_check():
    return jsonify({"status": "healthy", "database": "connected"})


if __name__ == "__main__":
    init_db()
    print(" CuraSyn+ Backend starting...")
    print(" API running on http://localhost:5000")
    app.run(debug=True, host="0.0.0.0", port=5000)
