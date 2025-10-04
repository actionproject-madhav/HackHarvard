import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { completeOnboarding } from '../services/api';
import AccessibilityMenu from '../components/AccessibilityMenu';
import '../styles/Onboarding.css';

const Onboarding = ({ user }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    phone: '',
    date_of_birth: '',
    gender: '',
    address: '',
    emergency_contact: {
      name: '',
      phone: '',
      relationship: ''
    },
    medical_history: [],
    allergies: [],
    current_medications: [],
    preferred_language: 'en',
    accessibility_preferences: {
      voice_input: false,
      high_contrast: false,
      screen_reader: false,
      font_size: 'medium'
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEmergencyContactChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      emergency_contact: {
        ...formData.emergency_contact,
        [name]: value
      }
    });
  };

  const handleArrayInput = (field, value) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData({ ...formData, [field]: items });
  };

  const handleAccessibilityUpdate = (preferences) => {
    setFormData({
      ...formData,
      accessibility_preferences: preferences
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await completeOnboarding(user._id, formData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Onboarding failed:', error);
      alert('Failed to complete onboarding. Please try again.');
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="onboarding-page">
      <div className="onboarding-container">
        <div className="onboarding-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
          <p className="progress-text">Step {step} of 3</p>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="onboarding-step">
              <h2>Basic Information</h2>
              <p className="step-description">Help us understand your needs better</p>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="(555) 123-4567"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date of Birth *</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="123 Main St, City, State, ZIP"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Preferred Language</label>
                <select
                  name="preferred_language"
                  value={formData.preferred_language}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="hi">Hindi</option>
                  <option value="zh">Chinese</option>
                  <option value="fr">French</option>
                </select>
              </div>

              <button type="button" onClick={nextStep} className="btn btn-primary btn-large">
                Next Step
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="onboarding-step">
              <h2>Medical Information</h2>
              <p className="step-description">This helps us provide better care</p>

              <div className="form-group">
                <label className="form-label">Medical History</label>
                <textarea
                  className="form-textarea"
                  placeholder="Enter conditions separated by commas (e.g., Diabetes, Hypertension)"
                  onChange={(e) => handleArrayInput('medical_history', e.target.value)}
                  rows="3"
                />
                <p className="form-helper">Separate multiple items with commas</p>
              </div>

              <div className="form-group">
                <label className="form-label">Allergies</label>
                <textarea
                  className="form-textarea"
                  placeholder="Enter allergies separated by commas (e.g., Penicillin, Peanuts)"
                  onChange={(e) => handleArrayInput('allergies', e.target.value)}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Current Medications</label>
                <textarea
                  className="form-textarea"
                  placeholder="Enter medications separated by commas"
                  onChange={(e) => handleArrayInput('current_medications', e.target.value)}
                  rows="3"
                />
              </div>

              <div className="button-group">
                <button type="button" onClick={prevStep} className="btn btn-ghost">
                  Back
                </button>
                <button type="button" onClick={nextStep} className="btn btn-primary btn-large">
                  Next Step
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="onboarding-step">
              <h2>Emergency Contact & Accessibility</h2>
              <p className="step-description">Who should we contact in case of emergency?</p>

              <div className="form-group">
                <label className="form-label">Emergency Contact Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.emergency_contact.name}
                  onChange={handleEmergencyContactChange}
                  className="form-input"
                  required
                  placeholder="John Doe"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Emergency Contact Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.emergency_contact.phone}
                  onChange={handleEmergencyContactChange}
                  className="form-input"
                  required
                  placeholder="(555) 123-4567"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Relationship *</label>
                <input
                  type="text"
                  name="relationship"
                  value={formData.emergency_contact.relationship}
                  onChange={handleEmergencyContactChange}
                  className="form-input"
                  required
                  placeholder="Spouse, Parent, Sibling, etc."
                />
              </div>

              <div className="accessibility-section">
                <h3>Accessibility Preferences</h3>
                <p>Customize how you interact with ClarityMD</p>
                
                <div className="accessibility-options">
                  <label className="checkbox-wrapper">
                    <input
                      type="checkbox"
                      checked={formData.accessibility_preferences.voice_input}
                      onChange={(e) => handleAccessibilityUpdate({
                        ...formData.accessibility_preferences,
                        voice_input: e.target.checked
                      })}
                      className="checkbox"
                    />
                    <span>Enable Voice Input</span>
                  </label>

                  <label className="checkbox-wrapper">
                    <input
                      type="checkbox"
                      checked={formData.accessibility_preferences.high_contrast}
                      onChange={(e) => handleAccessibilityUpdate({
                        ...formData.accessibility_preferences,
                        high_contrast: e.target.checked
                      })}
                      className="checkbox"
                    />
                    <span>High Contrast Mode</span>
                  </label>

                  <label className="checkbox-wrapper">
                    <input
                      type="checkbox"
                      checked={formData.accessibility_preferences.screen_reader}
                      onChange={(e) => handleAccessibilityUpdate({
                        ...formData.accessibility_preferences,
                        screen_reader: e.target.checked
                      })}
                      className="checkbox"
                    />
                    <span>Screen Reader Optimized</span>
                  </label>
                </div>
              </div>

              <div className="button-group">
                <button type="button" onClick={prevStep} className="btn btn-ghost">
                  Back
                </button>
                <button type="submit" className="btn btn-success btn-large">
                  Complete Setup
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      <AccessibilityMenu
        preferences={formData.accessibility_preferences}
        onUpdate={handleAccessibilityUpdate}
      />
    </div>
  );
};

export default Onboarding;