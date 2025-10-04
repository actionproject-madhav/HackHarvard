import React, { useState, useEffect, useCallback } from 'react';
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

// Components
import Navbar from './components/Navbar';
import EmergencyBanner from './components/EmergencyBanner';
import StrokeDetector from './components/StrokeDetector';
import { User } from './services/types';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [emergencyDetected, setEmergencyDetected] = useState(false);
  const [emergencyData, setEmergencyData] = useState(null);

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

  const handleOnboardingComplete = useCallback(() => {
    if (user) {
      const updatedUser: User = { ...user, onboarding_completed: true };
      setUser(updatedUser);
      localStorage.setItem('claritymd_user', JSON.stringify(updatedUser));
    }
  }, [user])

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
          
          <Routes>
            <Route 
              path="/login" 
              element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} 
            />
            
            <Route 
              path="/onboarding" 
              element={(user && !user.onboarding_completed) ? <Onboarding user={user} onComplete={handleOnboardingComplete} /> : <Navigate to="/dashboard" />} 
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
            
            <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
          </Routes>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;