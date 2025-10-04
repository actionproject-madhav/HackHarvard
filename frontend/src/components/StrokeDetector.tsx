import React, { useCallback, useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import { detectEmergency } from "../services/api";
import "../styles/StrokeDetector.css";
import { FaceLandmarksDetector } from "@tensorflow-models/face-landmarks-detection";

interface StrokeDetectorProps {
  onEmergencyDetected: (details: any) => void;
}

const StrokeDetector = ({ onEmergencyDetected }: StrokeDetectorProps) => {
  const videoRef = useRef<any>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [model, setModel] = useState<FaceLandmarksDetector | null>(null);
  const detectionIntervalRef = useRef<any>(null);

  const loadModel = useCallback(async () => {
    try {
      await tf.ready();
      const detector = await faceLandmarksDetection.createDetector(
        faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
        {
          runtime: "tfjs",
          refineLandmarks: true,
        }
      );
      setModel(detector);
      startCamera();
    } catch (error) {
      console.error("Error loading face detection model:", error);
    }
  }, []);

  useEffect(() => {
    loadModel();
    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, [loadModel]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsDetecting(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const detectStroke = useCallback(async () => {
    if (!model || !videoRef.current) return;

    try {
      const faces = await model.estimateFaces(videoRef.current);

      if (faces.length > 0) {
        const face = faces[0];
        const keypoints = face.keypoints;

        // Simple stroke detection based on facial asymmetry
        const strokeIndicators = analyzeFacialSymmetry(keypoints);

        if (strokeIndicators.asymmetry > 0.3) {
          // Potential stroke detected
          const response = await detectEmergency({
            facial_analysis: {
              stroke_indicators: strokeIndicators,
            },
          });

          if (response.data.emergency_detected) {
            onEmergencyDetected(response.data.details);
          }
        }
      }
    } catch (error) {
      console.error("Error during stroke detection:", error);
    }
  }, [model, onEmergencyDetected]);

  useEffect(() => {
    if (model && isDetecting) {
      detectionIntervalRef.current = setInterval(() => {
        detectStroke();
      }, 5000); // Check every 5 seconds
    }
  }, [model, isDetecting, detectStroke]);

  const analyzeFacialSymmetry = (keypoints: any) => {
    // Simplified stroke detection algorithm
    // In production, use more sophisticated medical algorithms

    // Get left and right side key points
    const leftMouth = keypoints[61]; // Left mouth corner
    const rightMouth = keypoints[291]; // Right mouth corner
    const leftEye = keypoints[33]; // Left eye
    const rightEye = keypoints[263]; // Right eye

    // Calculate asymmetry
    const mouthAsymmetry = Math.abs(leftMouth.y - rightMouth.y);
    const eyeAsymmetry = Math.abs(leftEye.y - rightEye.y);

    const totalAsymmetry = (mouthAsymmetry + eyeAsymmetry) / 2;

    return {
      asymmetry: totalAsymmetry,
      facialDrop: mouthAsymmetry > 5,
      eyeAsymmetry: eyeAsymmetry > 3,
      detected: totalAsymmetry > 0.3,
    };
  };

  return (
    <div className="stroke-detector-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ display: "none" }}
      />
    </div>
  );
};

export default StrokeDetector;
