import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/SymptomReporting.css';

interface SymptomReportingProps {
  user: any;
}

// Brilliant.org-style interactive questionnaire
const SYMPTOM_QUESTIONS = [
  {
    id: 'input_preference',
    question: 'How would you like to describe your symptoms?',
    type: 'choice',
    options: [
      { value: 'text', label: 'Type it out', icon: '⌨️', description: 'Write your symptoms' },
      { value: 'voice', label: 'Speak', icon: '🎤', description: 'Use voice input' },
      { value: 'guided', label: 'Guided questions', icon: '❓', description: 'Answer step-by-step' },
      { value: 'visual', label: 'Point on body', icon: '🫁', description: 'Show where it hurts' }
    ]
  },
  {
    id: 'main_concern',
    question: 'What brings you here today?',
    type: 'text',
    placeholder: 'Describe your main health concern...'
  },
  {
    id: 'symptoms',
    question: 'What symptoms are you experiencing?',
    type: 'multi_select',
    options: [
      'Headache', 'Fever', 'Cough', 'Sore Throat', 'Fatigue',
      'Nausea', 'Dizziness', 'Chest Pain', 'Shortness of Breath',
      'Abdominal Pain', 'Back Pain', 'Joint Pain', 'Muscle Aches',
      'Loss of Appetite', 'Difficulty Sleeping'
    ]
  },
  {
    id: 'duration',
    question: 'How long have you had these symptoms?',
    type: 'choice',
    options: [
      { value: 'hours', label: 'A few hours', icon: '⏰' },
      { value: 'days', label: '1-3 days', icon: '📅' },
      { value: 'week', label: 'About a week', icon: '📆' },
      { value: 'weeks', label: 'Several weeks', icon: '🗓️' },
      { value: 'chronic', label: 'Ongoing/Chronic', icon: '♾️' }
    ]
  },
  {
    id: 'severity',
    question: 'How would you rate the severity?',
    type: 'scale',
    min: 1,
    max: 10,
    labels: ['Mild', 'Moderate', 'Severe']
  },
  {
    id: 'triggers',
    question: 'Does anything make it better or worse?',
    type: 'text',
    placeholder: 'e.g., worse when standing, better after eating...'
  }
];

const SymptomReporting = ({ user }: SymptomReportingProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<any>(null);

  // Get user location on mount
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        console.error('Error getting location:', error);
      }
    );
  }, []);

  // Check if coming from stroke assessment
  useEffect(() => {
    if (location.state?.fromAssessment) {
      // Pre-fill some data from assessment if needed
      console.log('Came from stroke assessment:', location.state.assessmentData);
    }
  }, [location]);

  const currentQ = SYMPTOM_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / SYMPTOM_QUESTIONS.length) * 100;

  const handleAnswer = (value: any) => {
    setAnswers({ ...answers, [currentQ.id]: value });
  };

  const handleNext = () => {
    if (currentQuestion < SYMPTOM_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Check if we should run stroke assessment first
  const shouldRunStrokeCheck = currentQuestion === 0 && !location.state?.fromAssessment;

  // Trigger stroke assessment automatically on first load
  useEffect(() => {
    if (shouldRunStrokeCheck && !location.state?.skipAssessment) {
      // Navigate to a hidden stroke assessment
      navigate('/stroke-check', { 
        state: { 
          returnTo: '/symptoms',
          user: user 
        } 
      });
    }
  }, [shouldRunStrokeCheck, navigate, location.state, user]);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      // Prepare symptom report
      const reportData = {
        user_id: user._id,
        input_method: answers.input_preference || 'guided',
        symptoms: answers.symptoms || [],
        severity: answers.severity || 5,
        duration: answers.duration || 'unknown',
        additional_notes: `${answers.main_concern || ''}\n${answers.triggers || ''}`,
        location: userLocation
      };

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL || 'api'}/symptoms/report`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reportData),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Navigate to doctor matching with results
        navigate('/doctors', {
          state: {
            matchedDoctors: data.matched_doctors,
            aiAnalysis: data.ai_analysis,
            reportId: data.report_id,
            userLocation: userLocation
          },
        });
      }
    } catch (error) {
      console.error('Error submitting symptoms:', error);
      alert('Failed to submit symptoms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Analyzing your symptoms...</p>
      </div>
    );
  }

  return (
    <div className="symptom-reporting-page">
      <div className="reporting-container">
        {/* Progress Bar */}
        <div className="progress-header">
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="progress-text">
            Question {currentQuestion + 1} of {SYMPTOM_QUESTIONS.length}
          </span>
        </div>

        {/* Question Card */}
        <div className="question-card">
          <h2 className="question-title">{currentQ.question}</h2>

          <div className="answer-section">
            {/* Choice Type */}
            {currentQ.type === 'choice' && (
              <div className="choice-grid">
                {currentQ.options?.map((option: any) => (
                  <button
                    key={option.value}
                    className={`choice-option ${answers[currentQ.id] === option.value ? 'selected' : ''}`}
                    onClick={() => handleAnswer(option.value)}
                  >
                    <div className="choice-icon">{option.icon}</div>
                    <div className="choice-label">{option.label}</div>
                    {option.description && (
                      <div className="choice-description">{option.description}</div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Multi-Select Type */}
            {currentQ.type === 'multi_select' && (
              <div className="multi-select-grid">
                {(currentQ.options as string[])?.map((option: string) => (
                  <button
                    key={option}
                    className={`multi-select-option ${
                      answers[currentQ.id]?.includes(option) ? 'selected' : ''
                    }`}
                    onClick={() => {
                      const current = answers[currentQ.id] || [];
                      const updated = current.includes(option)
                        ? current.filter((s: string) => s !== option)
                        : [...current, option];
                      handleAnswer(updated);
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {/* Text Type */}
            {currentQ.type === 'text' && (
              <textarea
                className="text-input"
                placeholder={currentQ.placeholder}
                value={answers[currentQ.id] || ''}
                onChange={(e) => handleAnswer(e.target.value)}
                rows={4}
              />
            )}

            {/* Scale Type */}
            {currentQ.type === 'scale' && (
              <div className="scale-container">
                <div className="scale-labels">
                  {currentQ.labels?.map((label, idx) => (
                    <span key={idx}>{label}</span>
                  ))}
                </div>
                <input
                  type="range"
                  className="scale-slider"
                  min={currentQ.min}
                  max={currentQ.max}
                  value={answers[currentQ.id] || 5}
                  onChange={(e) => handleAnswer(parseInt(e.target.value))}
                />
                <div className="scale-value">{answers[currentQ.id] || 5}/10</div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="navigation-buttons">
          <button
            className="btn btn-ghost"
            onClick={handleBack}
            disabled={currentQuestion === 0}
          >
            ← Back
          </button>
          <button
            className="btn btn-primary"
            onClick={handleNext}
            disabled={!answers[currentQ.id]}
          >
            {currentQuestion === SYMPTOM_QUESTIONS.length - 1 ? 'Submit' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SymptomReporting;
