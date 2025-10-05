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
        {/* Left Side - Login Form */}
        <div className="login-left">
          <div className="login-card">
            <div className="login-logo">
              <div className="logo-circle">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M20 5C11.716 5 5 11.716 5 20C5 28.284 11.716 35 20 35C28.284 35 35 28.284 35 20C35 11.716 28.284 5 20 5Z" fill="#A51C30"/>
                  <path d="M20 12V20L26 23" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h1>CuraSyn+</h1>
            </div>

            <div className="login-welcome">
              <h2>Welcome back</h2>
              <p>Sign in to access your personalized health dashboard</p>
            </div>

            <div className="login-button-container">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                theme="outline"
                size="large"
                text="signin_with"
                shape="rectangular"
                width="100%"
              />
            </div>

            <div className="login-divider">
              <span>or</span>
            </div>

            <div className="login-features-compact">
              <div className="feature-badge">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>HIPAA Compliant</span>
              </div>
              <div className="feature-badge">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                <span>Secure & Private</span>
              </div>
            </div>

            <p className="login-terms">
              By signing in, you agree to our Terms and Privacy Policy
            </p>
          </div>
        </div>

        {/* Right Side - Visual */}
        <div className="login-right">
          <div className="login-visual-content">
            <div className="visual-badge">Trusted by 50,000+ patients</div>
            
            <h2>Your health, simplified</h2>
            <p>Get instant AI-powered health insights, connect with specialists, and manage your care—all in one place.</p>

            <div className="visual-features">
              <div className="visual-feature">
                <div className="feature-icon-small">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4>AI Symptom Checker</h4>
                  <p>Understand your symptoms instantly</p>
                </div>
              </div>

              <div className="visual-feature">
                <div className="feature-icon-small">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h4>Smart Doctor Matching</h4>
                  <p>Find the right specialist for you</p>
                </div>
              </div>

              <div className="visual-feature">
                <div className="feature-icon-small">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4>24/7 Support</h4>
                  <p>Get help whenever you need it</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;