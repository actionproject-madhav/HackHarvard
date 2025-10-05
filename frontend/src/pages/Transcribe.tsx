import React, { useState, useEffect, useRef } from 'react';
import '../styles/Transcribe.css';

interface TranscribeProps {
  user: any;
}

type Mode = 'simplify' | 'translate';
type Language = 'en' | 'es' | 'zh' | 'hi' | 'ar' | 'fr';

const Transcribe = ({ user }: TranscribeProps) => {
  const [isListening, setIsListening] = useState(false);
  const [mode, setMode] = useState<Mode>('simplify');
  const [targetLanguage, setTargetLanguage] = useState<Language>('es');
  const [originalText, setOriginalText] = useState('');
  const [processedText, setProcessedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{
    original: string;
    processed: string;
    timestamp: Date;
  }>>([]);

  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'fr', name: 'French', flag: '🇫🇷' }
  ];

  // Initialize Speech Recognition (once on mount)
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setOriginalText(prev => prev + finalTranscript);
          processText(finalTranscript.trim());
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
          console.log('No speech detected, continuing to listen...');
        } else {
          alert(`Speech recognition error: ${event.error}`);
          setIsListening(false);
        }
      };
    } else {
      console.error('Speech recognition not supported');
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error('Error stopping recognition:', error);
        }
      }
    };
  }, []);

  // Handle continuous listening
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        if (isListening) {
          console.log('Restarting speech recognition...');
          try {
            recognitionRef.current.start();
          } catch (error) {
            console.error('Error restarting recognition:', error);
          }
        }
      };
    }
  }, [isListening]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      console.log('Stopping speech recognition...');
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      console.log('Starting speech recognition...');
      setOriginalText('');
      setProcessedText('');
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting recognition:', error);
        alert('Failed to start speech recognition. Please try again.');
      }
    }
  };

  const processText = async (text: string) => {
    if (!text.trim()) return;

    setIsProcessing(true);

    try {
      // Build prompt based on mode
      let prompt = '';
      if (mode === 'simplify') {
        prompt = `You are a medical interpreter helping patients understand their doctor's instructions. 
Simplify the following medical text into easy-to-understand language that a patient with no medical background can comprehend. 
Use simple words, short sentences, and everyday examples. Remove medical jargon and explain any necessary medical terms in plain language.

Medical text: "${text}"

Provide only the simplified version, nothing else.`;
      } else {
        const langNames: { [key: string]: string } = {
          'es': 'Spanish',
          'zh': 'Chinese (Simplified)',
          'hi': 'Hindi',
          'ar': 'Arabic',
          'fr': 'French',
          'en': 'English'
        };
        prompt = `You are a medical translator. Translate the following medical text to ${langNames[targetLanguage]}. 
Maintain medical accuracy while making it understandable for patients.

Medical text: "${text}"

Provide only the ${langNames[targetLanguage]} translation, nothing else.`;
      }

      // Call Gemini API
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api'}/gemini/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: prompt,
          user_context: {
            user_id: user._id,
            name: user.name,
            medical_conditions: user.medical_conditions || []
          }
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        const processed = data.response;
        setProcessedText(processed);
        
        // Add to conversation history
        setConversationHistory(prev => [...prev, {
          original: text,
          processed: processed,
          timestamp: new Date()
        }]);

        // Convert to speech using Eleven Labs
        await textToSpeech(processed);
      } else {
        console.error('Gemini API error:', data.error);
        setProcessedText('Error processing text. Please try again.');
      }
    } catch (error) {
      console.error('Error processing text:', error);
      setProcessedText('Error processing text. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const textToSpeech = async (text: string) => {
    try {
      setIsSpeaking(true);

      // Call Eleven Labs API
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': process.env.REACT_APP_ELEVEN_LABS_API_KEY || ''
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.play();
          
          audioRef.current.onended = () => {
            setIsSpeaking(false);
            URL.revokeObjectURL(audioUrl);
          };
        }
      } else {
        const errorText = await response.text();
        console.error('Eleven Labs API error:', errorText);
        
        // Check if it's a quota exceeded error
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.detail?.status === 'quota_exceeded') {
            console.log('Eleven Labs quota exceeded, using browser speech synthesis');
            fallbackTextToSpeech(text);
            return;
          }
        } catch (e) {
          // Not JSON, use fallback anyway
        }
        
        fallbackTextToSpeech(text);
      }
    } catch (error) {
      console.error('Error with text-to-speech:', error);
      fallbackTextToSpeech(text);
    }
  };

  const fallbackTextToSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      speechSynthesis.speak(utterance);
    } else {
      console.error('Speech synthesis not supported');
      setIsSpeaking(false);
    }
  };

  const clearConversation = () => {
    setOriginalText('');
    setProcessedText('');
    setConversationHistory([]);
  };

  return (
    <div className="transcribe-page">
      <div className="transcribe-container">
        {/* Header */}
        <div className="transcribe-header">
          <div className="header-content">
            <h1>Doctor-Patient Communication Bridge</h1>
            <p className="subtitle">Real-time medical translation and simplification</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={clearConversation}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear
            </button>
          </div>
        </div>

        {/* Control Panel */}
        <div className="control-panel">
          <div className="mode-selector">
            <h3>Select Mode</h3>
            <div className="mode-buttons">
              <button
                className={`mode-btn ${mode === 'simplify' ? 'active' : ''}`}
                onClick={() => setMode('simplify')}
              >
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <strong>Simplify</strong>
                  <span>Convert medical jargon to simple language</span>
                </div>
              </button>
              <button
                className={`mode-btn ${mode === 'translate' ? 'active' : ''}`}
                onClick={() => setMode('translate')}
              >
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <div>
                  <strong>Translate</strong>
                  <span>Translate to patient's language</span>
                </div>
              </button>
            </div>
          </div>

          {mode === 'translate' && (
            <div className="language-selector">
              <h3>Target Language</h3>
              <div className="language-grid">
                {languages.filter(l => l.code !== 'en').map(lang => (
                  <button
                    key={lang.code}
                    className={`lang-btn ${targetLanguage === lang.code ? 'active' : ''}`}
                    onClick={() => setTargetLanguage(lang.code as Language)}
                  >
                    <span className="flag">{lang.flag}</span>
                    <span className="lang-name">{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Video Call Interface */}
        <div className="video-interface">
          <div className="video-placeholder">
            {/* Audio Visualizer */}
            {isListening && (
              <div className="audio-visualizer">
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
              </div>
            )}

            {/* Status Indicators */}
            <div className="status-indicators">
              {isListening && (
                <div className="status-badge listening">
                  <div className="pulse-dot"></div>
                  Listening to Doctor...
                </div>
              )}
              {isProcessing && (
                <div className="status-badge processing">
                  <div className="spinner-small"></div>
                  Processing...
                </div>
              )}
              {isSpeaking && (
                <div className="status-badge speaking">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                  Speaking...
                </div>
              )}
            </div>

            {/* Text Overlay */}
            {processedText && (
              <div className="text-overlay">
                <div className="overlay-content">
                  <div className="overlay-header">
                    <span className="overlay-label">
                      {mode === 'simplify' ? '📝 Simplified' : '🌍 Translated'}
                    </span>
                  </div>
                  <p className="overlay-text">{processedText}</p>
                </div>
              </div>
            )}
          </div>

          {/* Control Button */}
          <button
            className={`listen-btn ${isListening ? 'active' : ''}`}
            onClick={toggleListening}
          >
            {isListening ? (
              <>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h6v4H9z" />
                </svg>
                Stop Listening
              </>
            ) : (
              <>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                Start Listening
              </>
            )}
          </button>
        </div>

        {/* Conversation History */}
        {conversationHistory.length > 0 && (
          <div className="conversation-history">
            <h2>Conversation History</h2>
            <div className="history-list">
              {conversationHistory.map((item, index) => (
                <div key={index} className="history-item">
                  <div className="history-timestamp">
                    {item.timestamp.toLocaleTimeString()}
                  </div>
                  <div className="history-original">
                    <strong>Doctor:</strong> {item.original}
                  </div>
                  <div className="history-processed">
                    <strong>{mode === 'simplify' ? 'Simplified:' : 'Translated:'}</strong> {item.processed}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hidden audio element */}
        <audio ref={audioRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
};

export default Transcribe;
