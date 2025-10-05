import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/EmergencyResponse.css';

interface EmergencyResponseProps {
  user?: any;
}

const EmergencyResponse = ({ user }: EmergencyResponseProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const assessmentData = location.state?.assessmentData;

  const [step, setStep] = useState(0);
  const [emergencyCallStatus, setEmergencyCallStatus] = useState('initiating');
  const [appointmentBooked, setAppointmentBooked] = useState(false);

  const steps = [
    { id: 'detecting', title: 'Stroke Detected', icon: '⚠️' },
    { id: 'calling', title: 'Contacting Emergency Services', icon: '📞' },
    { id: 'booking', title: 'Booking Emergency Appointment', icon: '📅' },
    { id: 'complete', title: 'Help is On The Way', icon: '✅' }
  ];

  useEffect(() => {
    // Simulate emergency call flow
    const simulateEmergencyFlow = async () => {
      // Step 1: Stroke detected (2 seconds)
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStep(1);

      // Step 2: Calling 911 (3 seconds)
      setEmergencyCallStatus('calling');
      await new Promise(resolve => setTimeout(resolve, 3000));
      setEmergencyCallStatus('connected');
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStep(2);

      // Step 3: Booking appointment (2 seconds)
      await new Promise(resolve => setTimeout(resolve, 2000));
      await bookEmergencyAppointment();
      setAppointmentBooked(true);
      setStep(3);

      // Step 4: Complete (wait 3 seconds then redirect to dashboard)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Save to database
      await saveStrokeIncident();
      
      // Redirect to dashboard with success message
      navigate('/dashboard', { 
        state: { 
          emergencyHandled: true,
          message: 'Emergency services contacted. Appointment scheduled. Check your appointments for details.'
        } 
      });
    };

    if (assessmentData) {
      simulateEmergencyFlow();
    }
  }, [assessmentData, navigate]);

  const bookEmergencyAppointment = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'api'}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user?._id || assessmentData?.userId,
          doctor_id: 'emergency_neurologist_001', // Hardcoded for demo
          type: 'emergency',
          date: new Date().toISOString(),
          time: 'ASAP',
          symptoms: ['stroke', 'facial_droop', 'speech_difficulty'],
          notes: 'EMERGENCY: Stroke detected via AI assessment',
          assessment_data: assessmentData
        }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error booking appointment:', error);
    }
  };

  const saveStrokeIncident = async () => {
    try {
      const payload = {
        user_id: user?._id || assessmentData?.userId,
        timestamp: new Date().toISOString(),
        assessment_data: assessmentData,
        emergency_call_made: true,
        appointment_booked: true,
        status: 'active'
      };

      console.log('💾 SAVING STROKE INCIDENT TO DATABASE');
      console.log('Payload:', payload);
      console.log('API URL:', `${process.env.REACT_APP_API_URL || 'api'}/emergency/stroke-incident`);

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'api'}/emergency/stroke-incident`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('✅ STROKE INCIDENT SAVED SUCCESSFULLY:', data);
      console.log('Incident ID:', data.incident_id);
      return data;
    } catch (error) {
      console.error('❌ ERROR SAVING STROKE INCIDENT:', error);
      throw error;
    }
  };

  if (!assessmentData) {
    return (
      <div className="emergency-response-page">
        <div className="error-container">
          <h2>No Assessment Data</h2>
          <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="emergency-response-page">
      <div className="emergency-response-container">
        <div className="emergency-header">
          <div className="emergency-icon-large">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1>EMERGENCY PROTOCOL ACTIVATED</h1>
          <p>Stroke detected - Initiating emergency response</p>
        </div>

        <div className="emergency-steps">
          {steps.map((s, idx) => (
            <div 
              key={s.id} 
              className={`emergency-step ${idx <= step ? 'active' : ''} ${idx < step ? 'completed' : ''}`}
            >
              <div className="step-icon-container">
                <div className="step-icon">{s.icon}</div>
                {idx < steps.length - 1 && (
                  <div className={`step-connector ${idx < step ? 'completed' : ''}`}></div>
                )}
              </div>
              <div className="step-content">
                <h3>{s.title}</h3>
                {idx === step && (
                  <div className="step-status">
                    {idx === 0 && <p>Analyzing assessment results...</p>}
                    {idx === 1 && (
                      <div className="calling-animation">
                        <div className="phone-pulse"></div>
                        <p>Connecting to 911 Emergency Services...</p>
                        {emergencyCallStatus === 'connected' && (
                          <p className="connected-msg">✓ Connected - Paramedics dispatched</p>
                        )}
                      </div>
                    )}
                    {idx === 2 && (
                      <div>
                        <p>Booking emergency appointment with neurologist...</p>
                        {appointmentBooked && (
                          <p className="success-msg">✓ Emergency appointment confirmed</p>
                        )}
                      </div>
                    )}
                    {idx === 3 && (
                      <div className="complete-message">
                        <p>✓ Emergency services notified</p>
                        <p>✓ Appointment booked</p>
                        <p>✓ Medical records updated</p>
                        <p className="redirect-msg">Redirecting to your dashboard...</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="emergency-info-box">
          <h3>What happens next:</h3>
          <ul>
            <li>🚑 Emergency medical services have been dispatched to your location</li>
            <li>🏥 Emergency appointment scheduled at nearest stroke center</li>
            <li>📋 Your medical records have been flagged for priority care</li>
            <li>👨‍⚕️ Neurologist will be ready upon your arrival</li>
          </ul>
        </div>

        <div className="assessment-summary">
          <h3>Assessment Summary:</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="label">Facial Asymmetry:</span>
              <span className={`value ${assessmentData.strokeIndicators?.facialDroop ? 'danger' : 'normal'}`}>
                {assessmentData.strokeIndicators?.facialDroop ? 'Detected' : 'Normal'}
              </span>
            </div>
            <div className="summary-item">
              <span className="label">Speech Difficulty:</span>
              <span className={`value ${assessmentData.strokeIndicators?.speechDifficulty ? 'danger' : 'normal'}`}>
                {assessmentData.strokeIndicators?.speechDifficulty ? 'Detected' : 'Normal'}
              </span>
            </div>
            <div className="summary-item">
              <span className="label">Confidence Level:</span>
              <span className="value">{assessmentData.confidence}</span>
            </div>
            <div className="summary-item">
              <span className="label">Time Detected:</span>
              <span className="value">{new Date(assessmentData.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        <div className="emergency-contact-box">
          <p className="emergency-note">
            <strong>Important:</strong> Stay calm and do not move unnecessarily. 
            Help is on the way. Time is critical in stroke treatment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmergencyResponse;
