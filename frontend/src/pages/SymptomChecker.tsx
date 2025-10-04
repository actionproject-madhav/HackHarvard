import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSymptomReport } from "../services/api";
import VoiceInput from "../components/VoiceInput";
import "../styles/SymptomChecker.css";

interface SymptomCheckerProps {
  user: any;
}

const SymptomChecker = ({ user }: SymptomCheckerProps) => {
  const navigate = useNavigate();
  const [inputMethod, setInputMethod] = useState("text"); // text, voice, visual
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [currentSymptom, setCurrentSymptom] = useState("");
  const [severity, setSeverity] = useState("moderate");
  const [duration, setDuration] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const commonSymptoms = [
    "Headache",
    "Fever",
    "Cough",
    "Sore Throat",
    "Fatigue",
    "Nausea",
    "Dizziness",
    "Chest Pain",
    "Shortness of Breath",
    "Abdominal Pain",
    "Back Pain",
    "Joint Pain",
  ];

  const handleAddSymptom = () => {
    if (currentSymptom.trim() && !symptoms.includes(currentSymptom.trim())) {
      setSymptoms([...symptoms, currentSymptom.trim()]);
      setCurrentSymptom("");
    }
  };

  const handleRemoveSymptom = (symptom: string) => {
    setSymptoms(symptoms.filter((s) => s !== symptom));
  };

  const handleQuickAdd = (symptom: string) => {
    if (!symptoms.includes(symptom)) {
      setSymptoms([...symptoms, symptom]);
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    setCurrentSymptom(transcript);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (symptoms.length === 0) {
      alert("Please add at least one symptom");
      return;
    }

    setLoading(true);

    try {
      // Get user location for doctor matching
      const location = await getCurrentLocation();

      const response = await createSymptomReport({
        user_id: user._id,
        input_method: inputMethod,
        symptoms,
        severity,
        duration,
        additional_notes: additionalNotes,
        location,
      });

      if (response.data.emergency.is_emergency) {
        // Emergency detected - show emergency alert
        alert("EMERGENCY DETECTED: " + response.data.emergency.recommendation);
      } else {
        // Navigate to doctor matching with results
        navigate("/doctors", {
          state: {
            matchedDoctors: response.data.matched_doctors,
            aiAnalysis: response.data.ai_analysis,
            reportId: response.data.report_id,
          },
        });
      }
    } catch (error) {
      console.error("Error submitting symptoms:", error);
      alert("Failed to submit symptoms. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    return new Promise((resolve) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => {
            // Default to Cambridge, MA if location denied
            resolve({ lat: 42.3736, lng: -71.1097 });
          }
        );
      } else {
        resolve({ lat: 42.3736, lng: -71.1097 });
      }
    });
  };

  return (
    <div className="symptom-checker-page">
      <div className="symptom-checker-container">
        <div className="symptom-header">
          <h1>How are you feeling?</h1>
          <p>
            Tell us about your symptoms and we'll help you find the right care
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Input Method Selection */}
          <div className="input-method-selector">
            <button
              type="button"
              className={`method-btn ${inputMethod === "text" ? "active" : ""}`}
              onClick={() => setInputMethod("text")}
            >
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Text Input
            </button>

            <button
              type="button"
              className={`method-btn ${
                inputMethod === "voice" ? "active" : ""
              }`}
              onClick={() => setInputMethod("voice")}
            >
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
              Voice Input
            </button>
          </div>

          {/* Symptom Input */}
          <div className="symptom-input-section">
            <label className="form-label">Describe your symptoms</label>

            {inputMethod === "text" ? (
              <div className="text-input-group">
                <input
                  type="text"
                  value={currentSymptom}
                  onChange={(e) => setCurrentSymptom(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(), handleAddSymptom())
                  }
                  className="form-input"
                  placeholder="Type a symptom (e.g., headache)"
                />
                <button
                  type="button"
                  onClick={handleAddSymptom}
                  className="btn btn-primary"
                >
                  Add
                </button>
              </div>
            ) : (
              <VoiceInput onTranscript={handleVoiceTranscript} />
            )}

            {/* Quick Add Symptoms */}
            <div className="quick-symptoms">
              <p className="quick-symptoms-label">Common symptoms:</p>
              <div className="symptom-chips">
                {commonSymptoms.map((symptom) => (
                  <button
                    key={symptom}
                    type="button"
                    onClick={() => handleQuickAdd(symptom)}
                    className={`symptom-chip ${
                      symptoms.includes(symptom) ? "selected" : ""
                    }`}
                  >
                    {symptom}
                    {symptoms.includes(symptom) && " ✓"}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Symptoms */}
            {symptoms.length > 0 && (
              <div className="selected-symptoms">
                <p className="selected-label">Your symptoms:</p>
                <div className="symptom-tags">
                  {symptoms.map((symptom, index) => (
                    <div key={index} className="symptom-tag">
                      {symptom}
                      <button
                        type="button"
                        onClick={() => handleRemoveSymptom(symptom)}
                        className="remove-btn"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Severity */}
          <div className="form-group">
            <label className="form-label">How severe are your symptoms?</label>
            <div className="severity-options">
              <label className="severity-option">
                <input
                  type="radio"
                  name="severity"
                  value="mild"
                  checked={severity === "mild"}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="radio"
                />
                <div className="severity-card">
                  <div className="severity-icon">😊</div>
                  <span>Mild</span>
                  <p>Manageable discomfort</p>
                </div>
              </label>

              <label className="severity-option">
                <input
                  type="radio"
                  name="severity"
                  value="moderate"
                  checked={severity === "moderate"}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="radio"
                />
                <div className="severity-card">
                  <div className="severity-icon">😐</div>
                  <span>Moderate</span>
                  <p>Noticeable impact</p>
                </div>
              </label>

              <label className="severity-option">
                <input
                  type="radio"
                  name="severity"
                  value="severe"
                  checked={severity === "severe"}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="radio"
                />
                <div className="severity-card">
                  <div className="severity-icon">😣</div>
                  <span>Severe</span>
                  <p>Significant pain</p>
                </div>
              </label>
            </div>
          </div>

          {/* Duration */}
          <div className="form-group">
            <label className="form-label">
              How long have you had these symptoms?
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="form-select"
              required
            >
              <option value="">Select duration</option>
              <option value="less-than-day">Less than a day</option>
              <option value="1-3-days">1-3 days</option>
              <option value="4-7-days">4-7 days</option>
              <option value="1-2-weeks">1-2 weeks</option>
              <option value="more-than-2-weeks">More than 2 weeks</option>
            </select>
          </div>

          {/* Additional Notes */}
          <div className="form-group">
            <label className="form-label">
              Additional information (optional)
            </label>
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              className="form-textarea"
              placeholder="Any other details that might help..."
              rows={4}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary btn-large"
            disabled={loading || symptoms.length === 0}
          >
            {loading ? (
              <>
                <div
                  className="spinner"
                  style={{ width: "20px", height: "20px" }}
                ></div>
                Analyzing...
              </>
            ) : (
              "Get Recommendations"
            )}
          </button>
        </form>

        {/* Emergency Info */}
        <div className="emergency-notice">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p>
            <strong>If you're experiencing a medical emergency,</strong> call
            911 immediately or go to your nearest emergency room.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;
