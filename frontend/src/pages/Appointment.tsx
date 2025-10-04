import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createAppointment, getUserAppointments } from '../services/api';
import '../styles/Appointment.css';

interface AppointmentProps {
    user: any;
}

const Appointment = ({ user }: AppointmentProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('schedule');
  const [appointments, setAppointments] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  // Booking form state
  const [selectedDoctor, setSelectedDoctor] = useState(location.state?.selectedDoctor || null);
  const [appointmentType, setAppointmentType] = useState('in-person');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [notes, setNotes] = useState('');

  const availableTimes = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  useEffect(() => {
    if (activeTab === 'upcoming' || activeTab === 'past') {
      loadAppointments();
    }
  }, [activeTab]);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const status = activeTab === 'upcoming' ? 'scheduled' : 'completed';
      const response = await getUserAppointments(user._id, status);
      setAppointments(response.data.appointments);
      setLoading(false);
    } catch (error) {
      console.error('Error loading appointments:', error);
      setLoading(false);
    }
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDoctor) {
      alert('Please select a doctor');
      return;
    }

    setLoading(true);

    try {
      const appointmentData = {
        user_id: user._id,
        doctor_id: selectedDoctor._id,
        date: selectedDate,
        time: selectedTime,
        type: appointmentType,
        symptoms: symptoms.split(',').map(s => s.trim()),
        notes
      };

      await createAppointment(appointmentData);
      alert('Appointment booked successfully!');
      setActiveTab('upcoming');
      
      // Reset form
      setSelectedDate('');
      setSelectedTime('');
      setSymptoms('');
      setNotes('');
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="appointment-page">
      <div className="appointment-container">
        <div className="appointment-header">
          <h1>Appointments</h1>
          <p>Manage your healthcare visits</p>
        </div>

        <div className="appointment-tabs">
          <button
            className={`tab-btn ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            Schedule New
          </button>
          <button
            className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming
          </button>
          <button
            className={`tab-btn ${activeTab === 'past' ? 'active' : ''}`}
            onClick={() => setActiveTab('past')}
          >
            Past
          </button>
        </div>

        {activeTab === 'schedule' && (
          <div className="schedule-section">
            {!selectedDoctor ? (
              <div className="select-doctor-prompt">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <h3>Select a Doctor First</h3>
                <p>Please go to the doctor matching page to select a doctor</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/doctors')}
                >
                  Find Doctor
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitBooking} className="booking-form">
                <div className="selected-doctor-card">
                  <img 
                    src={selectedDoctor.profile_picture} 
                    alt={selectedDoctor.name}
                    className="doctor-avatar-small"
                  />
                  <div>
                    <h3>{selectedDoctor.name}</h3>
                    <p>{selectedDoctor.specialization}</p>
                  </div>
                  <button 
                    type="button"
                    className="btn btn-ghost btn-small"
                    onClick={() => navigate('/doctors')}
                  >
                    Change
                  </button>
                </div>

                <div className="form-group">
                  <label className="form-label">Appointment Type</label>
                  <div className="appointment-type-options">
                    <label className="type-option">
                      <input
                        type="radio"
                        name="type"
                        value="in-person"
                        checked={appointmentType === 'in-person'}
                        onChange={(e) => setAppointmentType(e.target.value)}
                      />
                      <div className="type-card">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span>In-Person Visit</span>
                      </div>
                    </label>

                    <label className="type-option">
                      <input
                        type="radio"
                        name="type"
                        value="video"
                        checked={appointmentType === 'video'}
                        onChange={(e) => setAppointmentType(e.target.value)}
                      />
                      <div className="type-card">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>Video Visit</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Date *</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={getMinDate()}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Time *</label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="form-select"
                      required
                    >
                      <option value="">Select time</option>
                      {availableTimes.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Symptoms (comma-separated)</label>
                  <input
                    type="text"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="form-input"
                    placeholder="e.g., Headache, Fever, Fatigue"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Additional Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="form-textarea"
                    rows={4}
                    placeholder="Any additional information for the doctor..."
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary btn-large"
                  disabled={loading}
                >
                  {loading ? 'Booking...' : 'Book Appointment'}
                </button>
              </form>
            )}
          </div>
        )}

        {(activeTab === 'upcoming' || activeTab === 'past') && (
          <div className="appointments-list">
            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
              </div>
            ) : appointments.length > 0 ? (
              appointments.map((apt: any) => (
                <div key={apt._id} className="appointment-card-large">
                  <div className="appointment-card-header">
                    <div className="appointment-date-large">
                      <div className="date-day-large">
                        {new Date(apt.date).getDate()}
                      </div>
                      <div className="date-month-large">
                        {new Date(apt.date).toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                      <div className="date-year-large">
                        {new Date(apt.date).getFullYear()}
                      </div>
                    </div>

                    <div className="appointment-details-large">
                      <h3>Dr. {apt.doctor_id}</h3>
                      <p className="appointment-time">{apt.time}</p>
                      <div className="appointment-type-badge">
                        {apt.type === 'video' ? '📹 Video Visit' : '🏥 In-Person'}
                      </div>
                      
                      {apt.symptoms && apt.symptoms.length > 0 && (
                        <div className="appointment-symptoms-list">
                          <p className="symptoms-label">Symptoms:</p>
                          <div className="symptoms-tags">
                            {apt.symptoms.map((symptom: any, i: number) => (
                              <span key={i} className="symptom-badge">{symptom}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {apt.notes && (
                        <p className="appointment-notes">
                          <strong>Notes:</strong> {apt.notes}
                        </p>
                      )}
                    </div>

                    <div className="appointment-actions-large">
                      {apt.status === 'scheduled' && (
                        <>
                          <button className="btn btn-ghost btn-small">
                            Reschedule
                          </button>
                          <button className="btn btn-danger btn-small">
                            Cancel
                          </button>
                        </>
                      )}
                      {apt.status === 'completed' && apt.ai_summary && (
                        <button 
                          className="btn btn-primary btn-small"
                          onClick={() => navigate(`/appointment/${apt._id}/summary`)}
                        >
                          View Summary
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3>No {activeTab} appointments</h3>
                <p>You don't have any {activeTab} appointments</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointment;