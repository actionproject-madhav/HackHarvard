import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { googleAuth } from '../services/api';
import '../styles/Login.css';

interface LoginProps {
    onLogin: (user: any) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const response = await googleAuth(credentialResponse.credential);
      onLogin(response.data.user);
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    }
  };

  const handleGoogleError = () => {
    console.error('Google login failed');
    alert('Login failed. Please try again.');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-content">
          <div className="login-header">
            <div className="login-logo">
              <div className="logo-icon-large">C</div>
              <h1>ClarityMD</h1>
            </div>
            <p className="login-tagline">Medical Care, Crystal Clear</p>
          </div>

          <div className="login-features">
            <div className="feature-item">
              <div className="feature-icon">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="feature-text">
                <h3>Understand Your Health</h3>
                <p>AI-powered explanations in simple language</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="feature-text">
                <h3>Smart Doctor Matching</h3>
                <p>Find the right specialist based on your symptoms</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="feature-text">
                <h3>Emergency Detection</h3>
                <p>Automatic stroke detection and instant alerts</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <div className="feature-text">
                <h3>Works Offline</h3>
                <p>Essential features available without internet</p>
              </div>
            </div>
          </div>

          <div className="login-action">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              theme="filled_black"
              size="large"
              text="continue_with"
              shape="rectangular"
            />
            
            <p className="login-terms">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>

        <div className="login-visual">
          <div className="visual-content">
            <div className="stat-card">
              <div className="stat-number">98%</div>
              <div className="stat-label">Patient Satisfaction</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Available Support</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">15+</div>
              <div className="stat-label">Languages Supported</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;