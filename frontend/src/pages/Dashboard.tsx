import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserAppointments, getSymptomHistory } from '../services/api';
import StrokeAssessment from '../components/StrokeAssessment';
import '../styles/Dashboard.css';

interface DashboardProps {
    user: any;
}

const Dashboard = ({ user }: DashboardProps) => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [recentSymptoms, setRecentSymptoms] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [showStrokeAssessment, setShowStrokeAssessment] = useState(false);

  const loadDashboardData = useCallback(async () => {
    try {
      const [appointmentsRes, symptomsRes] = await Promise.all([
        getUserAppointments(user._id, 'scheduled'),
        getSymptomHistory(user._id)
      ]);
      
      setAppointments(appointmentsRes.data.appointments.slice(0, 3));
      setRecentSymptoms(symptomsRes.data.reports.slice(0, 3));
      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user.onboarding_completed) {
      navigate('/onboarding');
    } else {
      loadDashboardData();
    }
  }, [navigate, loadDashboardData, user]);

  const handleStrokeDetected = async (assessmentData: any) => {
    setShowStrokeAssessment(false);
    
    // Save to database and trigger emergency flow
    console.log('Stroke detected:', assessmentData);
    
    // Navigate to emergency flow
    if (assessmentData.strokeDetected) {
      alert('STROKE DETECTED! Initiating emergency protocol...');
      // TODO: Implement emergency call simulation and auto-appointment
      navigate('/emergency-response', { state: { assessmentData } });
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      {showStrokeAssessment && (
        <StrokeAssessment
          user={user}
          onStrokeDetected={handleStrokeDetected}
          onCancel={() => setShowStrokeAssessment(false)}
        />
      )}
      
      <div className="dashboard-page">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <div>
              <h1>Welcome back, {user.name?.split(' ')[0]}!</h1>
              <p className="dashboard-subtitle">Here's your health overview</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={() => setShowStrokeAssessment(true)}
                className="btn btn-danger"
                style={{ background: '#DC2626' }}
              >
                🚨 Stroke Assessment
              </button>
              <Link to="/symptoms" className="btn btn-primary">
                Check Symptoms
              </Link>
            </div>
          </div>

        <div className="dashboard-grid">
          {/* Quick Actions */}
          <div className="quick-actions-section">
            <h2>Quick Actions</h2>
            <div className="action-cards">
              <Link 
                to="/symptoms" 
                className="action-card"
                style={{ '--card-bg-image': 'url(/images/symptom-checker-bg.jpg)' } as React.CSSProperties}
              >
                <div className="action-icon" style={{ background: 'rgba(165, 28, 48, 0.1)' }}>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3>Report Symptoms</h3>
                <p>Get AI-powered health guidance</p>
              </Link>

              <Link 
                to="/doctors" 
                className="action-card"
                style={{ '--card-bg-image': 'url(/images/doctor-match-bg.jpg)' } as React.CSSProperties}
              >
                <div className="action-icon" style={{ background: 'rgba(45, 119, 56, 0.1)' }}>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3>Find Doctor</h3>
                <p>Match with specialists nearby</p>
              </Link>

              <Link 
                to="/medications" 
                className="action-card"
                style={{ '--card-bg-image': 'url(/images/medication-bg.jpg)' } as React.CSSProperties}
              >
                <div className="action-icon" style={{ background: 'rgba(217, 119, 6, 0.1)' }}>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3>Medications</h3>
                <p>Track and manage prescriptions</p>
              </Link>

              <Link 
                to="/appointments" 
                className="action-card"
                style={{ '--card-bg-image': 'url(/images/calendar-bg.jpg)' } as React.CSSProperties}
              >
                <div className="action-icon" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3>Appointments</h3>
                <p>View and schedule visits</p>
              </Link>
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="appointments-section">
            <div className="section-header">
              <h2>Upcoming Appointments</h2>
              <Link to="/appointments" className="view-all-link">View All</Link>
            </div>
            
            {appointments.length > 0 ? (
              <div className="appointment-list">
                {appointments.map((apt: any) => (
                  <div key={apt._id} className="appointment-item">
                    <div className="appointment-date">
                      <div className="date-day">{new Date(apt.date).getDate()}</div>
                      <div className="date-month">
                        {new Date(apt.date).toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                    </div>
                    <div className="appointment-details">
                      <h4>Dr. {apt.doctor_id}</h4>
                      <p>{apt.type === 'video' ? 'Video Visit' : 'In-Person'} • {apt.time}</p>
                      <div className="appointment-symptoms">
                        {apt.symptoms?.slice(0, 2).map((symptom: any, i: any) => (
                          <span key={i} className="badge badge-primary">{symptom}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p>No upcoming appointments</p>
                <Link to="/doctors" className="btn btn-secondary btn-small">Find a Doctor</Link>
              </div>
            )}
          </div>

          {/* Health Insights */}
          <div className="insights-section">
            <h2>Health Insights</h2>
            <div className="insight-cards">
              <div className="insight-card">
                <div className="insight-icon">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <div className="insight-content">
                  <h4>Medication Adherence</h4>
                  <div className="insight-progress">
                    <div className="progress-bar-small">
                      <div className="progress-fill-small" style={{ width: '85%' }}></div>
                    </div>
                    <span>85%</span>
                  </div>
                  <p>Great job staying on track!</p>
                </div>
              </div>

              <div className="insight-card">
                <div className="insight-icon">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="insight-content">
                  <h4>Health Score</h4>
                  <div className="health-score">92/100</div>
                  <p>Your health is looking good</p>
                </div>
              </div>

              <div className="insight-card">
                <div className="insight-icon">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div className="insight-content">
                  <h4>Upcoming Reminders</h4>
                  <p className="reminder-text">Blood pressure check next week</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="activity-section">
            <div className="section-header">
              <h2>Recent Activity</h2>
              <Link to="/symptoms" className="view-all-link">View History</Link>
            </div>
            
            {recentSymptoms.length > 0 ? (
              <div className="activity-list">
                {recentSymptoms.map((report: any) => (
                  <div key={report._id} className="activity-item">
                    <div className="activity-icon">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="activity-content">
                      <h4>Symptom Report</h4>
                      <p>{report.symptoms?.join(', ')}</p>
                      <span className="activity-time">
                        {new Date(report.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {report.emergency_detected && (
                      <span className="badge badge-error">Emergency</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </div>

        {/* Emergency Info Banner */}
        <div className="emergency-info-banner">
          <div className="emergency-info-icon">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="emergency-info-text">
            <h3>In case of emergency</h3>
            <p>Call 911 immediately or go to the nearest emergency room</p>
          </div>
          <a href="tel:911" className="btn btn-danger">Call 911</a>
        </div>
      </div>
    </div>
    </>
  );
};

export default Dashboard;