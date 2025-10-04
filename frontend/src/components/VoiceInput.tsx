import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import '../styles/VoiceInput.css';

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
  placeholder?: string;
}

const VoiceInput = ({ onTranscript, placeholder = "Click to speak..." }: VoiceInputProps) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript && onTranscript) {
      onTranscript(transcript);
    }
  }, [transcript, onTranscript]);

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="voice-input-error">
        <p>Your browser doesn't support speech recognition.</p>
      </div>
    );
  }

  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      setIsListening(false);
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
      setIsListening(true);
    }
  };

  return (
    <div className="voice-input-container">
      <button
        className={`voice-button ${listening ? 'listening' : ''}`}
        onClick={toggleListening}
        type="button"
      >
        {listening ? (
          <>
            <div className="voice-pulse"></div>
            <svg className="voice-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
            </svg>
            <span>Stop Recording</span>
          </>
        ) : (
          <>
            <svg className="voice-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            <span>Start Recording</span>
          </>
        )}
      </button>
      
      {transcript && (
        <div className="transcript-display">
          <p>{transcript}</p>
        </div>
      )}
    </div>
  );
};

export default VoiceInput;