import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StrokeAssessment from '../components/StrokeAssessment';

const StrokeCheck = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;
  const returnTo = location.state?.returnTo || '/symptoms';

  const handleAssessmentComplete = (assessmentData: any) => {
    if (assessmentData.strokeDetected) {
      // Emergency flow
      navigate('/emergency-response', { state: { assessmentData } });
    } else {
      // Normal flow - return to symptom reporting
      navigate(returnTo, { 
        state: { 
          fromAssessment: true,
          assessmentData: assessmentData 
        } 
      });
    }
  };

  const handleCancel = () => {
    // Skip assessment and go directly to symptom reporting
    navigate(returnTo, { 
      state: { 
        skipAssessment: true 
      } 
    });
  };

  if (!user) {
    navigate('/dashboard');
    return null;
  }

  return (
    <StrokeAssessment
      user={user}
      onStrokeDetected={handleAssessmentComplete}
      onCancel={handleCancel}
    />
  );
};

export default StrokeCheck;
