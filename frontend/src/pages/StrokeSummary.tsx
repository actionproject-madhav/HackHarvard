import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/StrokeSummary.css';

interface StrokeSummaryProps {
  user: any;
}

const StrokeSummary = ({ user }: StrokeSummaryProps) => {
   // Hardcoded stroke appointment summary (for demo)
  const summary = {
    appointmentDate: new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    appointmentTime: '2:30 PM',
    doctor: {
      name: 'Dr. Sarah Chen',
      specialization: 'Neurologist',
      hospital: 'Harvard Medical Center'
    },
    diagnosis: {
      primary: 'Transient Ischemic Attack (TIA) - Mini Stroke',
      severity: 'Moderate',
      details: 'Patient experienced temporary neurological symptoms consistent with TIA. Facial asymmetry detected via AI screening. Prompt medical intervention prevented progression to full stroke.'
    },
    prescription: [
      {
        medication: 'Aspirin',
        dosage: '81mg',
        frequency: 'Once daily',
        duration: 'Ongoing',
        instructions: 'Take with food in the morning'
      },
      {
        medication: 'Atorvastatin (Lipitor)',
        dosage: '40mg',
        frequency: 'Once daily',
        duration: 'Ongoing',
        instructions: 'Take at bedtime'
      },
      {
        medication: 'Clopidogrel (Plavix)',
        dosage: '75mg',
        frequency: 'Once daily',
        duration: '90 days',
        instructions: 'Take with or without food'
      }
    ],
    labResults: [
      { test: 'Blood Pressure', result: '145/92 mmHg', status: 'elevated' },
      { test: 'Cholesterol (Total)', result: '245 mg/dL', status: 'high' },
      { test: 'Blood Sugar', result: '110 mg/dL', status: 'normal' },
      { test: 'CT Scan', result: 'No acute bleeding', status: 'normal' }
    ],
    followUp: {
      nextAppointment: 'In 2 weeks',
      instructions: [
        'Monitor blood pressure daily',
        'Take all medications as prescribed',
        'Avoid smoking and limit alcohol',
        'Maintain a low-sodium, heart-healthy diet',
        'Light exercise as tolerated (walking 20-30 minutes daily)',
        'Return immediately if symptoms recur'
      ],
      warningSign: [
        'Sudden numbness or weakness',
        'Confusion or trouble speaking',
        'Vision problems',
        'Severe headache',
        'Difficulty walking or loss of balance'
      ]
    },
    videoPlaceholder: {
      title: 'Understanding Your TIA: What You Need to Know',
      description: 'Dr. Chen has recorded a personalized video explaining your condition, treatment plan, and recovery steps.',
      thumbnailText: '▶ Video Explanation (8:45)'
    },
    receipt: {
      consultationFee: 250.00,
      diagnosticTests: 450.00,
      medications: 85.00,
      total: 785.00,
      insuranceCovered: 685.00,
      patientResponsibility: 100.00
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="stroke-summary-page">
      <div className="summary-container">
        {/* Header */}
        <div className="summary-header">
          <div className="header-content">
            <h1>Appointment Summary</h1>
            <p className="appointment-date">{summary.appointmentDate} at {summary.appointmentTime}</p>
          </div>
          <button onClick={handlePrint} className="print-btn">
            🖨️ Print Summary
          </button>
        </div>

        {/* Doctor Info */}
        <div className="info-card">
          <h2>Your Doctor</h2>
          <div className="doctor-info">
            <div className="doctor-avatar">{summary.doctor.name.split(' ')[1][0]}</div>
            <div>
              <h3>{summary.doctor.name}</h3>
              <p>{summary.doctor.specialization}</p>
              <p className="hospital">{summary.doctor.hospital}</p>
            </div>
          </div>
        </div>

        {/* Video Explanation */}
        <div className="info-card video-card">
          <h2>📹 Doctor's Video Explanation</h2>
          <div className="video-placeholder">
            <div className="video-thumbnail">
              <div className="play-icon">▶</div>
              <p className="video-title">{summary.videoPlaceholder.title}</p>
            </div>
            <p className="video-description">{summary.videoPlaceholder.description}</p>
            <p className="video-duration">{summary.videoPlaceholder.thumbnailText}</p>
          </div>
        </div>

        {/* Diagnosis */}
        <div className="info-card diagnosis-card">
          <h2>Diagnosis</h2>
          <div className="diagnosis-content">
            <div className="diagnosis-primary">
              <strong>{summary.diagnosis.primary}</strong>
              <span className={`severity-badge ${summary.diagnosis.severity.toLowerCase()}`}>
                {summary.diagnosis.severity}
              </span>
            </div>
            <p>{summary.diagnosis.details}</p>
          </div>
        </div>

        {/* Lab Results */}
        <div className="info-card">
          <h2>Test Results</h2>
          <div className="lab-results">
            {summary.labResults.map((lab, idx) => (
              <div key={idx} className="lab-item">
                <span className="lab-name">{lab.test}</span>
                <span className="lab-result">{lab.result}</span>
                <span className={`lab-status ${lab.status}`}>
                  {lab.status === 'normal' ? '✓' : lab.status === 'elevated' ? '⚠' : '!'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Prescription */}
        <div className="info-card prescription-card">
          <h2>💊 Prescription</h2>
          <div className="prescription-list">
            {summary.prescription.map((med, idx) => (
              <div key={idx} className="prescription-item">
                <div className="med-header">
                  <h3>{med.medication}</h3>
                  <span className="med-dosage">{med.dosage}</span>
                </div>
                <div className="med-details">
                  <p><strong>Frequency:</strong> {med.frequency}</p>
                  <p><strong>Duration:</strong> {med.duration}</p>
                  <p><strong>Instructions:</strong> {med.instructions}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Follow-up Instructions */}
        <div className="info-card">
          <h2>Follow-Up Care</h2>
          <p className="next-appointment">
            <strong>Next Appointment:</strong> {summary.followUp.nextAppointment}
          </p>
          <div className="instructions-section">
            <h3>Daily Care Instructions:</h3>
            <ul>
              {summary.followUp.instructions.map((instruction, idx) => (
                <li key={idx}>{instruction}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Warning Signs */}
        <div className="info-card warning-card">
          <h2>⚠️ Warning Signs - Seek Immediate Help</h2>
          <p>Call 911 immediately if you experience any of these:</p>
          <ul className="warning-list">
            {summary.followUp.warningSign.map((sign, idx) => (
              <li key={idx}>{sign}</li>
            ))}
          </ul>
        </div>

        {/* Receipt */}
        <div className="info-card receipt-card">
          <h2>Receipt</h2>
          <div className="receipt-content">
            <div className="receipt-line">
              <span>Consultation Fee</span>
              <span>${summary.receipt.consultationFee.toFixed(2)}</span>
            </div>
            <div className="receipt-line">
              <span>Diagnostic Tests</span>
              <span>${summary.receipt.diagnosticTests.toFixed(2)}</span>
            </div>
            <div className="receipt-line">
              <span>Medications</span>
              <span>${summary.receipt.medications.toFixed(2)}</span>
            </div>
            <div className="receipt-line total">
              <span>Total</span>
              <span>${summary.receipt.total.toFixed(2)}</span>
            </div>
            <div className="receipt-line insurance">
              <span>Insurance Covered</span>
              <span>-${summary.receipt.insuranceCovered.toFixed(2)}</span>
            </div>
            <div className="receipt-line patient-pay">
              <span><strong>Your Responsibility</strong></span>
              <span><strong>${summary.receipt.patientResponsibility.toFixed(2)}</strong></span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="summary-actions">
          <Link to="/dashboard" className="btn btn-secondary">
            Back to Dashboard
          </Link>
          <Link to="/education" className="btn btn-primary">
            Learn More About Stroke Prevention
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StrokeSummary;