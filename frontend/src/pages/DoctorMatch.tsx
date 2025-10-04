import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getDoctors, findNearbyDoctors } from "../services/api";
import "../styles/DoctorMatch.css";

interface DoctorMatchProps {
  user: any;
}

const DoctorMatch = ({ user }: DoctorMatchProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<any>([]);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialization, setSelectedSpecialization] = useState("");

  const specializations = [
    "All Specializations",
    "General Practice",
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Dermatology",
    "ENT",
    "Ophthalmology",
  ];

  const loadDoctors = useCallback(async () => {
    try {
      const response = await getDoctors();
      setDoctors(response.data.doctors);
      setLoading(false);
    } catch (error) {
      console.error("Error loading doctors:", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (location.state?.matchedDoctors) {
      setDoctors(location.state.matchedDoctors);
      setAiAnalysis(location.state.aiAnalysis);
      setLoading(false);
    } else {
      loadDoctors();
    }
  }, [loadDoctors, location]);

  const handleSpecializationFilter = async (spec: any) => {
    setSelectedSpecialization(spec);
    setLoading(true);

    try {
      if (spec === "All Specializations" || !spec) {
        const response = await getDoctors();
        setDoctors(response.data.doctors);
      } else {
        const response = await getDoctors(spec);
        setDoctors(response.data.doctors);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error filtering doctors:", error);
      setLoading(false);
    }
  };

  const handleBookAppointment = (doctor: any) => {
    navigate("/appointments", { state: { selectedDoctor: doctor } });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="doctor-match-page">
      <div className="doctor-match-container">
        <div className="doctor-match-header">
          <h1>Find Your Doctor</h1>
          <p>Based on your symptoms and location</p>
        </div>

        {aiAnalysis && (
          <div className="ai-analysis-card">
            <div className="ai-analysis-header">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              <h3>AI Analysis</h3>
            </div>
            <div className="ai-analysis-content">
              <p>{aiAnalysis}</p>
            </div>
          </div>
        )}

        <div className="filters-section">
          <div className="specialization-filters">
            {specializations.map((spec) => (
              <button
                key={spec}
                onClick={() => handleSpecializationFilter(spec)}
                className={`filter-btn ${
                  selectedSpecialization === spec ? "active" : ""
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>

        <div className="doctors-grid">
          {doctors.length > 0 ? (
            doctors.map((doctor: any) => (
              <div key={doctor._id} className="doctor-card">
                <div className="doctor-card-header">
                  <img
                    src={
                      doctor.profile_picture || "https://via.placeholder.com/80"
                    }
                    alt={doctor.name}
                    className="doctor-avatar"
                  />
                  <div className="doctor-badge">
                    {doctor.distance && (
                      <span className="distance-badge">
                        📍 {doctor.distance.toFixed(1)} km away
                      </span>
                    )}
                  </div>
                </div>

                <div className="doctor-info">
                  <h3>{doctor.name}</h3>
                  <p className="doctor-specialization">
                    {doctor.specialization}
                  </p>

                  <div className="doctor-meta">
                    <div className="meta-item">
                      <svg
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span>{doctor.experience_years} years exp.</span>
                    </div>

                    <div className="meta-item">
                      <svg
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                      <span>{doctor.rating || "4.8"} rating</span>
                    </div>
                  </div>

                  <div className="doctor-languages">
                    {doctor.languages?.slice(0, 3).map((lang: any, i: any) => (
                      <span key={i} className="language-tag">
                        {lang}
                      </span>
                    ))}
                  </div>

                  <p className="doctor-bio">{doctor.bio}</p>

                  <div className="doctor-location">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <div>
                      <p className="hospital-name">{doctor.hospital}</p>
                      <p className="hospital-address">
                        {doctor.location?.address}
                      </p>
                    </div>
                  </div>

                  <div className="doctor-fee">
                    <span className="fee-label">Consultation Fee:</span>
                    <span className="fee-amount">
                      ${doctor.consultation_fee}
                    </span>
                  </div>
                </div>

                <div className="doctor-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => window.open(`tel:${doctor.phone}`, "_self")}
                  >
                    Call
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleBookAppointment(doctor)}
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-doctors">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3>No doctors found</h3>
              <p>Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorMatch;
