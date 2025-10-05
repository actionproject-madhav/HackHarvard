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
  const [debugInfo, setDebugInfo] = useState<any>({ modelStatus: 'Loading...' });
  const [showDebug, setShowDebug] = useState(true);
  const [modelLoading, setModelLoading] = useState(true);
  const [cameraReady, setCameraReady] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const recognitionRef = useRef<any>(null);

  // Load TensorFlow model
  useEffect(() => {
    const loadModel = async () => {
      try {
        console.log('🔄 Loading TensorFlow.js...');
        setDebugInfo((prev: any) => ({ ...prev, modelStatus: 'Loading TensorFlow...' }));
        
        await tf.ready();
        console.log('✅ TensorFlow.js ready');
        setDebugInfo((prev: any) => ({ ...prev, modelStatus: 'Loading FaceMesh model...' }));
        
        console.log('🔄 Creating FaceMesh detector...');
        const detector = await faceLandmarksDetection.createDetector(
          faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
          {
            runtime: 'tfjs',
            refineLandmarks: true,
          }
        );
        
        console.log('✅ FaceMesh detector created successfully');
        setModel(detector);
        setModelLoading(false);
        setDebugInfo((prev: any) => ({ ...prev, modelStatus: '✅ Model Loaded' }));
        
        startCamera();
      } catch (error) {
        console.error('❌ Error loading model:', error);
        setDebugInfo((prev: any) => ({ ...prev, modelStatus: `❌ Error: ${error}`, error: String(error) }));
        setModelLoading(false);
      }
    };
    loadModel();
  }, []);

  // Start camera
  const startCamera = async () => {
    try {
      console.log('🎥 Requesting camera access...');
      setDebugInfo((prev: any) => ({ ...prev, cameraStatus: 'Requesting access...' }));
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: true
      });
      
      console.log('✅ Camera access granted');
      setDebugInfo((prev: any) => ({ ...prev, cameraStatus: '✅ Camera Active' }));
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          console.log('✅ Video metadata loaded');
          setCameraReady(true);
          setDebugInfo((prev: any) => ({ ...prev, videoReady: true }));
        };
      }
    } catch (error) {
      console.error('❌ Error accessing camera:', error);
      setDebugInfo((prev: any) => ({ 
        ...prev, 
        cameraStatus: `❌ Camera Error: ${error}`,
        error: String(error) 
      }));
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

  // Analyze facial symmetry for stroke detection (BACKEND VERSION)
  const analyzeFacialSymmetry = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) {
      setDebugInfo((prev: any) => ({ ...prev, error: 'Video or canvas not ready' }));
      return null;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Check video state
    const videoState = {
      readyState: video.readyState,
      videoWidth: video.videoWidth,
      videoHeight: video.videoHeight,
      paused: video.paused,
      currentTime: video.currentTime
    };
    
    console.log('📹 Video state:', videoState);
    
    if (video.readyState < 2 || video.videoWidth === 0) {
      console.warn('⚠️ Video not ready for detection');
      setDebugInfo((prev: any) => ({ 
        ...prev, 
        error: 'Video not ready',
        videoState 
      }));
      return null;
    }

    try {
      // Capture frame from video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      
      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      
      console.log('🔍 Sending frame to backend for face detection...');
      
      // Send to backend
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'api'}/face-detection/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData }),
      });
      
      const result = await response.json();
      console.log('✅ Backend result:', result);
      
      if (!result.success) {
        setDebugInfo((prev: any) => ({ 
          ...prev, 
          facesDetected: 0,
          error: result.message || result.error,
          timestamp: new Date().toISOString(),
          videoState
        }));
        return null;
      }
      
      setDebugInfo((prev: any) => ({ 
        ...prev, 
        facesDetected: result.faces_detected,
        timestamp: new Date().toISOString(),
        videoState
      }));
      
      if (result.faces_detected > 0) {
        const symmetry = result.symmetry;
        
        const analysisResult = {
          facialDrop: result.droop_detected,
          asymmetryScore: symmetry.asymmetry_score.toFixed(2),
          eyeAsymmetry: symmetry.eye_asymmetry.toFixed(2),
          leftRightDifference: symmetry.left_right_difference.toFixed(2),
          droopDetected: result.droop_detected,
          confidence: result.confidence,
          smileDetected: result.smile_detected,
          eyesDetected: result.eyes_detected
        };

        setDebugInfo((prev: any) => ({ ...prev, faceAnalysis: analysisResult }));
        console.log('🔍 Face Analysis:', analysisResult);
        
        // Draw face box on canvas overlay
        if (canvasRef.current && result.face_box) {
          const overlayCanvas = canvasRef.current;
          const ctx = overlayCanvas.getContext('2d');
          if (ctx) {
            // Make sure canvas matches video size
            overlayCanvas.width = canvas.width;
            overlayCanvas.height = canvas.height;
            ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
            
            // Draw bounding box
            const box = result.face_box;
            ctx.strokeStyle = result.droop_detected ? '#FF0000' : '#00FF00';
            ctx.lineWidth = 4;
            ctx.strokeRect(box.x, box.y, box.width, box.height);
            
            // Draw status text with background
            ctx.fillStyle = result.droop_detected ? 'rgba(255, 0, 0, 0.8)' : 'rgba(0, 255, 0, 0.8)';
            ctx.fillRect(box.x, box.y - 35, 250, 30);
            
            ctx.fillStyle = 'white';
            ctx.font = 'bold 18px Arial';
            ctx.fillText(
              result.droop_detected ? '⚠️ DROOP DETECTED' : '✅ FACE DETECTED',
              box.x + 5,
              box.y - 12
            );
            
            console.log('✅ Drew box on canvas:', box);
          }
        }

        return analysisResult;
      }
    } catch (error) {
      console.error('❌ Error analyzing face:', error);
      setDebugInfo((prev: any) => ({ ...prev, error: String(error) }));
    }
    return null;
  }, []);

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
        await speak('Please smile now and hold it for 5 seconds.');
        
        // Wait for video to be ready and run multiple detections
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const detections = [];
        for (let i = 0; i < 5; i++) {
          const detection = await analyzeFacialSymmetry();
          if (detection) {
            detections.push(detection);
            console.log(`Face detection ${i + 1}/5:`, detection);
          }
          await new Promise(resolve => setTimeout(resolve, 800));
        }
        
        // Use the best detection (highest asymmetry score)
        const faceAnalysis = detections.length > 0 
          ? detections.reduce((best, current) => 
              parseFloat(current.asymmetryScore) > parseFloat(best.asymmetryScore) ? current : best
            )
          : null;
        
        console.log('✅ Final face analysis:', faceAnalysis);
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

    console.log('📊 COMPLETING ASSESSMENT');
    console.log('Assessment Results:', assessmentResults);
    console.log('Face Result:', faceResult);
    console.log('Speech Result:', speechResult);

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

    console.log('🎯 FINAL ASSESSMENT DATA:', assessmentData);
    console.log('⚠️ STROKE DETECTED:', strokeDetected);

    // ALWAYS save to database (stroke or not)
    try {
      console.log('💾 Saving assessment to database...');
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'api'}/emergency/stroke-incident`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user._id,
          timestamp: new Date().toISOString(),
          assessment_data: assessmentData,
          emergency_call_made: strokeDetected,
          appointment_booked: false,
          status: strokeDetected ? 'active' : 'completed'
        }),
      });
      const saveResult = await response.json();
      console.log('✅ Assessment saved to database:', saveResult);
    } catch (error) {
      console.error('❌ Failed to save assessment:', error);
    }

    // Speak the result
    if (strokeDetected) {
      await speak('Stroke indicators detected. Initiating emergency protocol.');
    } else {
      await speak('No stroke detected. You will now proceed to symptom reporting.');
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('🚀 Calling onStrokeDetected callback with data:', assessmentData);
    onStrokeDetected(assessmentData);
  };

  // Continuous face detection loop (for debug visualization)
  useEffect(() => {
    if (!model || !cameraReady) return;

    const detectLoop = setInterval(async () => {
      const result = await analyzeFacialSymmetry();
      if (result) {
        console.log('🔄 Live detection:', result);
      }
    }, 1000); // Run every second

    return () => clearInterval(detectLoop);
  }, [model, cameraReady, analyzeFacialSymmetry]);

  // Start assessment
  useEffect(() => {
    if (model && cameraReady && currentStep < FAST_QUESTIONS.length) {
      console.log(`🎬 Starting question ${currentStep + 1}/${FAST_QUESTIONS.length}`);
      processQuestion();
    } else if (!model) {
      console.log('⏳ Waiting for model to load...');
    } else if (!cameraReady) {
      console.log('⏳ Waiting for camera to be ready...');
    }
  }, [currentStep, model, cameraReady, processQuestion]);

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
            <canvas
              ref={canvasRef}
              className="landmark-canvas"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none'
              }}
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
          
          {/* Debug Panel */}
          {showDebug && (
            <div className="debug-panel" style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'rgba(0,0,0,0.8)',
              color: '#00ff00',
              padding: '15px',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '12px',
              maxWidth: '300px',
              zIndex: 1000
            }}>
              <div style={{ marginBottom: '10px', fontWeight: 'bold', color: '#fff' }}>
                🔍 LIVE DETECTION DEBUG
              </div>
              <div style={{ marginBottom: '5px', borderBottom: '1px solid #333', paddingBottom: '5px' }}>
                <strong>System Status:</strong>
              </div>
              <div>Model: {debugInfo.modelStatus || 'Loading...'}</div>
              <div>Camera: {debugInfo.cameraStatus || 'Not started'}</div>
              <div>Video Ready: {debugInfo.videoReady ? '✅ YES' : '❌ NO'}</div>
              <div>Model Loaded: {model ? '✅ YES' : '❌ NO'}</div>
              <div>Camera Ready: {cameraReady ? '✅ YES' : '❌ NO'}</div>
              {debugInfo.videoState && (
                <>
                  <div style={{ marginTop: '5px', fontSize: '11px', color: '#888' }}>
                    Video: {debugInfo.videoState.videoWidth}x{debugInfo.videoState.videoHeight}
                  </div>
                  <div style={{ fontSize: '11px', color: '#888' }}>
                    Ready State: {debugInfo.videoState.readyState}/4
                  </div>
                </>
              )}
              <div style={{ marginTop: '5px', borderTop: '1px solid #333', paddingTop: '5px' }}>
                <strong>Detection:</strong>
              </div>
              <div>Faces Detected: {debugInfo.facesDetected || 0}</div>
              <div>Current Step: {currentStep + 1}/{FAST_QUESTIONS.length}</div>
              {debugInfo.faceAnalysis && (
                <>
                  <div style={{ marginTop: '10px', borderTop: '1px solid #333', paddingTop: '10px' }}>
                    <strong>Face Analysis:</strong>
                  </div>
                  <div>Asymmetry Score: {debugInfo.faceAnalysis.asymmetryScore}</div>
                  <div>Mouth Asymmetry: {debugInfo.faceAnalysis.mouthAsymmetry}</div>
                  <div>Eye Asymmetry: {debugInfo.faceAnalysis.eyeAsymmetry}</div>
                  <div>Droop Asymmetry: {debugInfo.faceAnalysis.droopAsymmetry}</div>
                  <div style={{ color: debugInfo.faceAnalysis.droopDetected ? '#ff0000' : '#00ff00' }}>
                    Droop Detected: {debugInfo.faceAnalysis.droopDetected ? '⚠️ YES' : '✅ NO'}
                  </div>
                  <div>Confidence: {debugInfo.faceAnalysis.confidence}</div>
                </>
              )}
              {debugInfo.error && (
                <div style={{ color: '#ff0000', marginTop: '10px' }}>
                  Error: {debugInfo.error}
                </div>
              )}
              <button 
                onClick={() => setShowDebug(false)}
                style={{
                  marginTop: '10px',
                  padding: '5px 10px',
                  background: '#333',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Hide Debug
              </button>
            </div>
          )}
          {!showDebug && (
            <button 
              onClick={() => setShowDebug(true)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                padding: '8px 12px',
                background: 'rgba(0,0,0,0.7)',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                zIndex: 1000
              }}
            >
              Show Debug
            </button>
          )}

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
