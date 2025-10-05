import cv2
import numpy as np
import base64
from io import BytesIO
from PIL import Image

class FaceDetector:
    def __init__(self):
        # Load pre-trained Haar Cascade for face detection
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        self.eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')
        self.smile_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_smile.xml')
    
    def detect_face_from_base64(self, base64_image):
        """
        Detect face and analyze symmetry from base64 encoded image
        Returns: dict with detection results
        """
        try:
            # Decode base64 image
            image_data = base64.b64decode(base64_image.split(',')[1] if ',' in base64_image else base64_image)
            image = Image.open(BytesIO(image_data))
            
            # Convert to numpy array and then to BGR for OpenCV
            img_array = np.array(image)
            if len(img_array.shape) == 2:  # Grayscale
                gray = img_array
                img_bgr = cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)
            else:  # RGB or RGBA
                if img_array.shape[2] == 4:  # RGBA
                    img_bgr = cv2.cvtColor(img_array, cv2.COLOR_RGBA2BGR)
                else:  # RGB
                    img_bgr = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
                gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
            
            # Detect faces
            faces = self.face_cascade.detectMultiScale(gray, 1.3, 5)
            
            if len(faces) == 0:
                return {
                    'success': False,
                    'faces_detected': 0,
                    'message': 'No face detected'
                }
            
            # Analyze the first detected face
            (x, y, w, h) = faces[0]
            face_roi_gray = gray[y:y+h, x:x+w]
            face_roi_color = img_bgr[y:y+h, x:x+w]
            
            # Detect eyes
            eyes = self.eye_cascade.detectMultiScale(face_roi_gray, 1.1, 10)
            
            # Detect smile
            smiles = self.smile_cascade.detectMultiScale(face_roi_gray, 1.8, 20)
            
            # Analyze facial symmetry
            symmetry_analysis = self._analyze_symmetry(face_roi_gray, eyes)
            
            return {
                'success': True,
                'faces_detected': int(len(faces)),
                'face_box': {'x': int(x), 'y': int(y), 'width': int(w), 'height': int(h)},
                'eyes_detected': int(len(eyes)),
                'smile_detected': bool(len(smiles) > 0),
                'symmetry': symmetry_analysis,
                'droop_detected': bool(symmetry_analysis['asymmetry_score'] > 15),
                'confidence': 'high' if len(eyes) == 2 else 'medium'
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def _analyze_symmetry(self, face_gray, eyes):
        """
        Analyze facial symmetry by comparing left and right halves
        """
        height, width = face_gray.shape
        
        # Split face into left and right halves
        mid = width // 2
        left_half = face_gray[:, :mid]
        right_half = face_gray[:, mid:]
        right_half_flipped = cv2.flip(right_half, 1)
        
        # Resize to match if needed
        if left_half.shape != right_half_flipped.shape:
            min_width = min(left_half.shape[1], right_half_flipped.shape[1])
            left_half = left_half[:, :min_width]
            right_half_flipped = right_half_flipped[:, :min_width]
        
        # Calculate difference
        diff = cv2.absdiff(left_half, right_half_flipped)
        asymmetry_score = np.mean(diff)
        
        # Analyze eye positions if detected
        eye_asymmetry = 0
        if len(eyes) >= 2:
            # Sort eyes by x position
            sorted_eyes = sorted(eyes, key=lambda e: e[0])
            left_eye = sorted_eyes[0]
            right_eye = sorted_eyes[1]
            
            # Calculate vertical difference (droop indicator)
            eye_asymmetry = abs(left_eye[1] - right_eye[1])
        
        return {
            'asymmetry_score': float(asymmetry_score),
            'eye_asymmetry': float(eye_asymmetry),
            'left_right_difference': float(asymmetry_score),
            'droop_indicator': bool(eye_asymmetry > 10)
        }

# Global instance
face_detector = FaceDetector()
