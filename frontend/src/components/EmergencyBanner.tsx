import React from 'react';
import '../styles/EmergencyBanner.css';

interface EmergencyBannerProps {
    data: any;
    onClose: () => void;
}

const EmergencyBanner = ({ data, onClose }: EmergencyBannerProps) => {
  const callEmergency = () => {
    window.location.href = 'tel:911';
  };

  return (
    <div className="emergency-banner">
      <div className="emergency-content">
        <div className="emergency-icon">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <div className="emergency-text">
          <h3>🚨 EMERGENCY DETECTED</h3>
          <p>{data?.emergencies?.[0]?.action || 'Please seek immediate medical attention'}</p>
        </div>

        <div className="emergency-actions">
          <button className="btn-emergency" onClick={callEmergency}>
            Call 911
          </button>
          <button className="btn-close" onClick={onClose}>
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyBanner;