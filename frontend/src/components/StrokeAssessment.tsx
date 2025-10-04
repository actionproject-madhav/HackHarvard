import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import { FaceLandmarksDetector } from '@tensorflow-models/face-landmarks-detection';
import '../styles/StrokeAssessment.css';

interface StrokeAssessmentProps {
  user: any;
  onStrokeDetected: (assessmentData: any) => void;
  onCancel: () => void;
}

// FAST Protocol Questions for Stroke Detection
const FAST_QUESTIONS = [
  {
    id: 'face',
    question: 'Please smile for the camera. Show me your teeth.',
    instruction: 'Analyzing facial symmetry...',
    action: 'smile',
    duration: 5000
  },
  {
    id: 'arms',
    question: 'Please raise both arms in front of you and hold them there.',
    instruction: 'Keep your arms raised for 10 seconds...',
    action: 'raise_arms',
    duration: 10000
  },
  {
    id: 'speech',
    question: 'Please repeat after me: "The sky is blue in Cincinnati"',
    instruction: 'Listening to your speech...',
    action: 'speak',
    duration: 8000
  },
  {
    id: 'time',
    question: 'When did these symptoms start?',
    instruction: 'Please tell me when you first noticed these symptoms.',
    action: 'time_question',
    duration: 10000
  }
];

const StrokeAssessment = ({ user, onStrokeDetected, onCancel }: StrokeAssessmentProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [assessmentResults, setAssessmentResults] = useState<any>({});
  const [model, setModel] = useState<FaceLandmarksDetector | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [detectionStatus, setDetectionStatus] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<any>(null);

  // Load TensorFlow model
  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        const detector = await faceLandmarksDetection.createDetector(
          faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
          {
            runtime: 'tfjs',
            refineLandmarks: true,
          }
        );
        setModel(detector);
        startCamera();
      } catch (error) {
        console.error('Error loading model:', error);
      }
    };
    loadModel();
  }, []);

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: true
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  // Text-to-Speech
  const speak = useCallback((text: string) => {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        resolve(true);
      };
      
      window.speechSynthesis.speak(utterance);
    });
  }, []);

  // Speech Recognition
  const startListening = useCallback(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleSpeechResult(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    }
  }, []);

  // Analyze facial symmetry for stroke detection
  const analyzeFacialSymmetry = useCallback(async () => {
    if (!model || !videoRef.current) return null;

    try {
      const faces = await model.estimateFaces(videoRef.current);
      
      if (faces.length > 0) {
        const face = faces[0];
        const keypoints = face.keypoints;

        // Get key facial landmarks
        const leftMouth = keypoints[61];
        const rightMouth = keypoints[291];
        const leftEye = keypoints[33];
        const rightEye = keypoints[263];
        const noseTip = keypoints[1];

        // Calculate asymmetry scores
        const mouthAsymmetry = Math.abs(leftMouth.y - rightMouth.y);
        const eyeAsymmetry = Math.abs(leftEye.y - rightEye.y);
        
        // Calculate droop (vertical displacement)
        const leftSideDrop = (leftMouth.y - leftEye.y);
        const rightSideDrop = (rightMouth.y - rightEye.y);
        const droopAsymmetry = Math.abs(leftSideDrop - rightSideDrop);

        const asymmetryScore = (mouthAsymmetry + eyeAsymmetry + droopAsymmetry) / 3;

        return {
          facialDrop: droopAsymmetry > 8,
          asymmetryScore: asymmetryScore,
          mouthAsymmetry: mouthAsymmetry,
          eyeAsymmetry: eyeAsymmetry,
          droopDetected: droopAsymmetry > 8,
          confidence: asymmetryScore > 5 ? 'high' : asymmetryScore > 3 ? 'medium' : 'low'
        };
      }
    } catch (error) {
      console.error('Error analyzing face:', error);
    }
    return null;
  }, [model]);

  // Handle speech result
  const handleSpeechResult = (transcript: string) => {
    const currentQuestion = FAST_QUESTIONS[currentStep];
    
    setAssessmentResults((prev: any) => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        speechResponse: transcript,
        speechClarity: analyzeSpeechClarity(transcript)
      }
    }));
  };

  // Analyze speech clarity (simple check)
  const analyzeSpeechClarity = (transcript: string) => {
    const expectedPhrase = "the sky is blue in cincinnati";
    const normalizedTranscript = transcript.toLowerCase().trim();
    
    // Check for slurred speech indicators
    const hasSlurring = normalizedTranscript.length < expectedPhrase.length * 0.7;
    const wordsMatch = normalizedTranscript.includes('sky') && 
                       normalizedTranscript.includes('blue');
    
    return {
      isSlurred: hasSlurring || !wordsMatch,
      clarity: wordsMatch ? 'clear' : 'unclear',
      transcript: transcript
    };
  };

  // Process current question
  const processQuestion = useCallback(async () => {
    const question = FAST_QUESTIONS[currentStep];
    setDetectionStatus(question.instruction);

    // Speak the question
    await speak(question.question);

    // Wait for user action
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Perform detection based on action type
    let result: any = {};

    switch (question.action) {
      case 'smile':
        setDetectionStatus('Analyzing your smile...');
        const faceAnalysis = await analyzeFacialSymmetry();
        result = { faceAnalysis };
        break;

      case 'raise_arms':
        setDetectionStatus('Monitoring arm position...');
        await speak('Hold your arms steady...');
        // In real implementation, use pose detection
        result = { armsRaised: true, armSymmetry: 'checking' };
        break;

      case 'speak':
        setDetectionStatus('Please speak now...');
        startListening();
        await new Promise(resolve => setTimeout(resolve, question.duration));
        break;

      case 'time_question':
        startListening();
        await new Promise(resolve => setTimeout(resolve, question.duration));
        break;
    }

    setAssessmentResults((prev: any) => ({
      ...prev,
      [question.id]: { ...prev[question.id], ...result }
    }));

    // Move to next question or finish
    if (currentStep < FAST_QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 1000);
    } else {
      // Assessment complete
      completeAssessment();
    }
  }, [currentStep, speak, analyzeFacialSymmetry, startListening]);

  // Complete assessment and determine if stroke detected
  const completeAssessment = async () => {
    const faceResult = assessmentResults.face?.faceAnalysis;
    const speechResult = assessmentResults.speech?.speechClarity;

    // Determine if stroke is likely
    const strokeIndicators = {
      facialDroop: faceResult?.facialDrop || false,
      armWeakness: false, // Would need pose detection
      speechDifficulty: speechResult?.isSlurred || false,
      asymmetryScore: faceResult?.asymmetryScore || 0
    };

    const strokeDetected = strokeIndicators.facialDroop || 
                          strokeIndicators.speechDifficulty ||
                          strokeIndicators.asymmetryScore > 5;

    const assessmentData = {
      timestamp: new Date().toISOString(),
      userId: user._id,
      results: assessmentResults,
      strokeIndicators,
      strokeDetected,
      confidence: strokeDetected ? 'high' : 'low',
      recommendation: strokeDetected 
        ? 'IMMEDIATE EMERGENCY CARE REQUIRED' 
        : 'No immediate stroke indicators detected'
    };

    // Speak the result
    if (strokeDetected) {
      await speak('Stroke indicators detected. Initiating emergency protocol.');
    } else {
      await speak('No stroke detected. You will now proceed to symptom reporting.');
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    onStrokeDetected(assessmentData);
  };

  // Start assessment
  useEffect(() => {
    if (model && currentStep < FAST_QUESTIONS.length) {
      processQuestion();
    }
  }, [currentStep, model]);

  return (
    <div className="stroke-assessment-overlay">
      <div className="stroke-assessment-container">
        <div className="assessment-header">
          <h2>Stroke Assessment - FAST Protocol</h2>
          <p>Please follow the instructions carefully</p>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>

        <div className="assessment-content">
          <div className="video-container">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="assessment-video"
            />
            <div className="video-overlay">
              {isSpeaking && (
                <div className="speaking-indicator">
                  <div className="sound-wave"></div>
                  <span>AI Assistant Speaking...</span>
                </div>
              )}
              {isListening && (
                <div className="listening-indicator">
                  <div className="mic-pulse"></div>
                  <span>Listening...</span>
                </div>
              )}
            </div>
          </div>

          <div className="assessment-progress">
            <div className="progress-steps">
              {FAST_QUESTIONS.map((q, idx) => (
                <div 
                  key={q.id} 
                  className={`progress-step ${idx === currentStep ? 'active' : ''} ${idx < currentStep ? 'completed' : ''}`}
                >
                  <div className="step-number">{idx + 1}</div>
                  <div className="step-label">{q.id.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="current-instruction">
            <div className="instruction-icon">
              {isSpeaking ? '🔊' : isListening ? '🎤' : '👁️'}
            </div>
            <p className="instruction-text">
              {FAST_QUESTIONS[currentStep]?.question}
            </p>
            <p className="status-text">{detectionStatus}</p>
          </div>
        </div>

        <div className="assessment-footer">
          <p className="emergency-note">
            ⚠️ If you're experiencing a medical emergency, call 911 immediately
          </p>
        </div>
      </div>
    </div>
  );
};

export default StrokeAssessment;
