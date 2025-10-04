import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Pages
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import SymptomChecker from './pages/SymptomChecker';
import DoctorMatch from './pages/DoctorMatch';
import Appointment from './pages/Appointment';
import AppointmentSummary from './pages/AppointmentSummary';
import MedicationTracker from './pages/MedicationTracker';
import Profile from './pages/Profile';
import EducationHub from './pages/EducationHub';

// Components
import Navbar from './components/Navbar';
import EmergencyBanner from './components/EmergencyBanner';
import StrokeDetector from './components/StrokeDetector';
import GeminiChatbot from './components/GeminiChatbot';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';

function App() {
  const [user, setUser] = useState(null);
  const [emergencyDetected, setEmergencyDetected] = useState(false);
  const [emergencyData, setEmergencyData] = useState(null);
  const [chatbotOpen, setChatbotOpen] = useState(false);

  useEffect(() => {
    // Check for stored user
    const storedUser = localStorage.getItem('claritymd_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem('claritymd_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('claritymd_user');
  };

  const handleEmergencyDetected = (data: any) => {
    setEmergencyDetected(true);
    setEmergencyData(data);
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <div className="app">
          {emergencyDetected && (
            <EmergencyBanner 
              data={emergencyData} 
              onClose={() => setEmergencyDetected(false)}
            />
          )}
          
          {user && <Navbar user={user} onLogout={handleLogout} />}
          
          {user && <StrokeDetector onEmergencyDetected={handleEmergencyDetected} />}
          
          {user && user.onboarding_completed && (
            <GeminiChatbot 
              user={user} 
              isOpen={chatbotOpen}
              onToggle={() => setChatbotOpen(!chatbotOpen)}
            />
          )}
          
          <Routes>
            <Route 
              path="/login" 
              element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} 
            />
            
            <Route 
              path="/onboarding" 
              element={user ? <Onboarding user={user} /> : <Navigate to="/login" />} 
            />
            
            <Route 
              path="/dashboard" 
              element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} 
            />
            
            <Route 
              path="/symptoms" 
              element={user ? <SymptomChecker user={user} /> : <Navigate to="/login" />} 
            />
            
            <Route 
              path="/doctors" 
              element={user ? <DoctorMatch user={user} /> : <Navigate to="/login" />} 
            />
            
            <Route 
              path="/appointments" 
              element={user ? <Appointment user={user} /> : <Navigate to="/login" />} 
            />
            
            <Route 
              path="/appointment/:id/summary" 
              element={user ? <AppointmentSummary user={user} /> : <Navigate to="/login" />} 
            />
            
            <Route 
              path="/medications" 
              element={user ? <MedicationTracker user={user} /> : <Navigate to="/login" />} 
            />
            
            <Route 
              path="/profile" 
              element={user ? <Profile user={user} /> : <Navigate to="/login" />} 
            />
            
            <Route 
              path="/education" 
              element={user ? <EducationHub user={user} /> : <Navigate to="/login" />} 
            />
            
            <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
          </Routes>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;