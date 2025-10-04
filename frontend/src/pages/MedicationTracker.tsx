import React, { useState, useEffect, useCallback } from 'react';
import { getUser } from '../services/api';
import '../styles/MedicationTracker.css';

interface MedicationTrackerProps {
    user: any;
}

const MedicationTracker = ({ user }: MedicationTrackerProps) => {
  const [medications, setMedications] = useState<any>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: '',
    time: '',
    instructions: ''
  });

  const loadMedications = useCallback(async () => {
    try {
      const response = await getUser(user._id);
      // Mock medications for demo
      setMedications([
        {
          id: 1,
          name: 'Lisinopril',
          dosage: '10mg',
          frequency: 'Once daily',
          time: '09:00 AM',
          instructions: 'Take with food',
          nextRefill: '2025-11-15',
          adherence: 92
        },
        {
          id: 2,
          name: 'Metformin',
          dosage: '500mg',
          frequency: 'Twice daily',
          time: '08:00 AM, 08:00 PM',
          instructions: 'Take with meals',
          nextRefill: '2025-11-20',
          adherence: 87
        }
      ]);
    } catch (error) {
      console.error('Error loading medications:', error);
    }
  }, [user._id]);

  
  useEffect(() => {
    loadMedications();
  }, [loadMedications]);

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    const medication = {
      id: Date.now(),
      ...newMedication,
      adherence: 100
    };
    setMedications([...medications, medication]);
    setNewMedication({
      name: '',
      dosage: '',
      frequency: '',
      time: '',
      instructions: ''
    });
    setShowAddForm(false);
  };

  const handleMarkTaken = (id: number) => {
    alert('Medication marked as taken!');
  };

  const getAdherenceColor = (adherence: number) => {
    if (adherence >= 90) return 'var(--success)';
    if (adherence >= 70) return 'var(--warning)';
    return 'var(--error)';
  };

  return (
    <div className="medication-tracker-page">
      <div className="medication-container">
        <div className="medication-header">
          <div>
            <h1>Medication Tracker</h1>
            <p>Manage your medications and stay on track</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Cancel' : '+ Add Medication'}
          </button>
        </div>

        {/* Add Medication Form */}
        {showAddForm && (
          <div className="add-medication-form">
            <h3>Add New Medication</h3>
            <form onSubmit={handleAddMedication}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Medication Name *</label>
                  <input
                    type="text"
                    value={newMedication.name}
                    onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
                    className="form-input"
                    placeholder="e.g., Lisinopril"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Dosage *</label>
                  <input
                    type="text"
                    value={newMedication.dosage}
                    onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                    className="form-input"
                    placeholder="e.g., 10mg"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Frequency *</label>
                  <select
                    value={newMedication.frequency}
                    onChange={(e) => setNewMedication({...newMedication, frequency: e.target.value})}
                    className="form-select"
                    required
                  >
                    <option value="">Select frequency</option>
                    <option value="Once daily">Once daily</option>
                    <option value="Twice daily">Twice daily</option>
                    <option value="Three times daily">Three times daily</option>
                    <option value="As needed">As needed</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Time *</label>
                  <input
                    type="text"
                    value={newMedication.time}
                    onChange={(e) => setNewMedication({...newMedication, time: e.target.value})}
                    className="form-input"
                    placeholder="e.g., 09:00 AM"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Instructions</label>
                <textarea
                  value={newMedication.instructions}
                  onChange={(e) => setNewMedication({...newMedication, instructions: e.target.value})}
                  className="form-textarea"
                  placeholder="Special instructions..."
                  rows={3}
                />
              </div>

              <button type="submit" className="btn btn-success btn-large">
                Add Medication
              </button>
            </form>
          </div>
        )}

        {/* Today's Schedule */}
        <div className="today-schedule">
          <h2>Today's Schedule</h2>
          <div className="schedule-timeline">
            {medications.map((med: any) => (
              <div key={med.id} className="schedule-item">
                <div className="schedule-time">{med.time.split(',')[0]}</div>
                <div className="schedule-details">
                  <h4>{med.name}</h4>
                  <p>{med.dosage} - {med.instructions}</p>
                </div>
                <button 
                  className="btn btn-success btn-small"
                  onClick={() => handleMarkTaken(med.id)}
                >
                  Mark Taken
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* All Medications */}
        <div className="all-medications">
          <h2>All Medications</h2>
          <div className="medications-grid">
            {medications.map((med: any) => (
              <div key={med.id} className="medication-card">
                <div className="medication-card-header">
                  <div>
                    <h3>{med.name}</h3>
                    <p className="medication-dosage">{med.dosage}</p>
                  </div>
                  <div className="medication-icon">💊</div>
                </div>

                <div className="medication-info">
                  <div className="info-row">
                    <span className="info-label">Frequency:</span>
                    <span className="info-value">{med.frequency}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Time:</span>
                    <span className="info-value">{med.time}</span>
                  </div>
                  {med.instructions && (
                    <div className="info-row">
                      <span className="info-label">Instructions:</span>
                      <span className="info-value">{med.instructions}</span>
                    </div>
                  )}
                  {med.nextRefill && (
                    <div className="info-row">
                      <span className="info-label">Next Refill:</span>
                      <span className="info-value">{new Date(med.nextRefill).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <div className="medication-adherence">
                  <div className="adherence-header">
                    <span>Adherence</span>
                    <span style={{ color: getAdherenceColor(med.adherence), fontWeight: 700 }}>
                      {med.adherence}%
                    </span>
                  </div>
                  <div className="adherence-bar">
                    <div 
                      className="adherence-fill" 
                      style={{ 
                        width: `${med.adherence}%`,
                        background: getAdherenceColor(med.adherence)
                      }}
                    ></div>
                  </div>
                </div>

                <div className="medication-actions">
                  <button className="btn btn-ghost btn-small">Edit</button>
                  <button className="btn btn-ghost btn-small">Refill</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Medication Reminders */}
        <div className="reminders-section">
          <div className="reminders-card">
            <div className="reminders-icon">🔔</div>
            <div className="reminders-content">
              <h3>Set Up Reminders</h3>
              <p>Never miss a dose with SMS and push notifications</p>
              <button className="btn btn-primary btn-small">Enable Reminders</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationTracker;