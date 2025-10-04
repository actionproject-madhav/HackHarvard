import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/StrokeSummary.css';

interface StrokeSummaryProps {
  user: any;
}

const StrokeSummary = ({ user }: StrokeSummaryProps) => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api'}/emergency/stroke-summary/${user._id}?user_name=${encodeURIComponent(user.name)}`
        );
        const data = await response.json();
        
        if (data.success) {
          setSummary(data.summary);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stroke summary:', error);
        setLoading(false);
      }
    };

    fetchSummary();
  }, [user._id, user.name]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Generating your appointment summary...</p>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="stroke-summary-page">
        <div className="error-container">
          <h2>Summary Not Available</h2>
          <p>No stroke incident found. Please complete an assessment first.</p>
          <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="stroke-summary-page">
      <div className="stroke-summary-container">
        {/* Header */}
        <div className="summary-header">
          <div className="header-content">
            <div className="hospital-logo">
              <div className="logo-icon">H</div>
              <div>
                <h3>Harvard Medical Center</h3>
                <p>Stroke & Neurology Department</p>
              </div>
            </div>
            <div className="header-actions">
              <button onClick={handlePrint} className="btn btn-ghost">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
              </button>
              <Link to="/dashboard" className="btn btn-primary">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Summary Content */}
        <div className="summary-content">
          {/* Title Section */}
          <div className="summary-title-section">
            <h1>Emergency Stroke Consultation Summary</h1>
            <div className="summary-meta">
              <span><strong>Patient:</strong> {summary.patient_name}</span>
              <span><strong>Date:</strong> {new Date(summary.date).toLocaleDateString()}</span>
              <span><strong>Doctor:</strong> {summary.doctor.name}, {summary.doctor.credentials}</span>
            </div>
          </div>

          {/* Chief Complaint */}
          <div className="summary-section">
            <h2>Chief Complaint</h2>
            <p className="complaint-text">{summary.chief_complaint}</p>
          </div>

          {/* Assessment */}
          <div className="summary-section">
            <h2>Clinical Assessment</h2>
            
            <div className="assessment-grid">
              <div className="assessment-card">
                <h3>FAST Protocol Results</h3>
                <div className="fast-results">
                  <div className="fast-item">
                    <span className="fast-label">Face:</span>
                    <span className={`fast-value ${summary.assessment.fast_protocol_results.face === 'Positive' ? 'positive' : 'negative'}`}>
                      {summary.assessment.fast_protocol_results.face}
                    </span>
                  </div>
                  <div className="fast-item">
                    <span className="fast-label">Arms:</span>
                    <span className="fast-value">{summary.assessment.fast_protocol_results.arms}</span>
                  </div>
                  <div className="fast-item">
                    <span className="fast-label">Speech:</span>
                    <span className={`fast-value ${summary.assessment.fast_protocol_results.speech === 'Positive' ? 'positive' : 'negative'}`}>
                      {summary.assessment.fast_protocol_results.speech}
                    </span>
                  </div>
                  <div className="fast-item">
                    <span className="fast-label">Time:</span>
                    <span className="fast-value">{summary.assessment.fast_protocol_results.time}</span>
                  </div>
                </div>
              </div>

              <div className="assessment-card">
                <h3>Vital Signs</h3>
                <div className="vitals-grid">
                  <div className="vital-item">
                    <span className="vital-label">BP:</span>
                    <span className="vital-value">{summary.assessment.vital_signs.blood_pressure}</span>
                  </div>
                  <div className="vital-item">
                    <span className="vital-label">HR:</span>
                    <span className="vital-value">{summary.assessment.vital_signs.heart_rate}</span>
                  </div>
                  <div className="vital-item">
                    <span className="vital-label">Temp:</span>
                    <span className="vital-value">{summary.assessment.vital_signs.temperature}</span>
                  </div>
                  <div className="vital-item">
                    <span className="vital-label">O2:</span>
                    <span className="vital-value">{summary.assessment.vital_signs.oxygen_saturation}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Diagnosis */}
          <div className="summary-section diagnosis-section">
            <h2>Diagnosis</h2>
            <div className="diagnosis-box">
              <div className="diagnosis-main">
                <strong>{summary.diagnosis.primary}</strong>
                <span className="icd-code">ICD-10: {summary.diagnosis.icd_code}</span>
              </div>
              <p className="diagnosis-notes">{summary.diagnosis.notes}</p>
            </div>
          </div>

          {/* Treatment Plan */}
          <div className="summary-section">
            <h2>Treatment Plan</h2>
            
            <div className="treatment-subsection">
              <h3>Immediate Actions Taken</h3>
              <ul className="treatment-list">
                {summary.treatment_plan.immediate.map((action: string, idx: number) => (
                  <li key={idx}>{action}</li>
                ))}
              </ul>
            </div>

            <div className="treatment-subsection">
              <h3>Prescribed Medications</h3>
              <div className="medications-grid">
                {summary.treatment_plan.medications.map((med: any, idx: number) => (
                  <div key={idx} className="medication-card">
                    <div className="med-header">
                      <h4>{med.name}</h4>
                      <span className="med-dosage">{med.dosage}</span>
                    </div>
                    <p className="med-frequency">{med.frequency}</p>
                    <p className="med-purpose">{med.purpose}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="treatment-subsection">
              <h3>Lifestyle Modifications</h3>
              <ul className="lifestyle-list">
                {summary.treatment_plan.lifestyle_modifications.map((mod: string, idx: number) => (
                  <li key={idx}>{mod}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Follow-up */}
          <div className="summary-section">
            <h2>Follow-up Care</h2>
            
            <div className="appointments-grid">
              {summary.follow_up.appointments.map((apt: any, idx: number) => (
                <div key={idx} className="appointment-card">
                  <div className="apt-icon">📅</div>
                  <div className="apt-details">
                    <h4>{apt.type}</h4>
                    <p><strong>Date:</strong> {apt.date}</p>
                    <p><strong>Time:</strong> {apt.time}</p>
                    <p><strong>Location:</strong> {apt.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Warning Signs */}
          <div className="summary-section warning-section">
            <h2>{summary.warning_signs.title}</h2>
            <div className="warning-box">
              <div className="warning-icon">⚠️</div>
              <ul className="warning-list">
                {summary.warning_signs.signs.map((sign: string, idx: number) => (
                  <li key={idx}>{sign}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Doctor's Notes */}
          <div className="summary-section">
            <h2>Doctor's Notes</h2>
            <div className="doctor-notes">
              <pre>{summary.doctor_notes}</pre>
            </div>
          </div>

          {/* Next Steps */}
          <div className="summary-section next-steps-section">
            <h2>Your Next Steps</h2>
            <div className="next-steps-grid">
              {summary.next_steps.map((step: string, idx: number) => (
                <div key={idx} className="next-step-item">
                  <div className="step-number">{idx + 1}</div>
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Education Resources */}
          <div className="summary-section">
            <h2>Education Resources</h2>
            <div className="resources-grid">
              {summary.education_resources.map((resource: any, idx: number) => (
                <Link key={idx} to={resource.link} className="resource-card">
                  <h4>{resource.title}</h4>
                  <p>{resource.description}</p>
                  <span className="resource-link">Learn More →</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="summary-footer">
          <p>This summary was generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
          <p>For questions or concerns, please contact your healthcare provider immediately.</p>
        </div>
      </div>
    </div>
  );
};

export default StrokeSummary;
