import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

interface NavbarProps {
    user: any;
    onLogout: () => void;
}

const Navbar = ({ user, onLogout }: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-logo">
          <div className="logo-icon">C</div>
          <span className="logo-text">ClarityMD</span>
        </Link>

        <div className="navbar-links">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/symptoms" className="nav-link">Symptoms</Link>
          <Link to="/appointments" className="nav-link">Appointments</Link>
          <Link to="/medications" className="nav-link">Medications</Link>
        </div>

        <div className="navbar-user">
          <button 
            className="user-menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <img 
              src={user.profile_picture || 'https://via.placeholder.com/40'} 
              alt={user.name}
              className="user-avatar"
            />
            <span className="user-name">{user.name}</span>
            <svg className="chevron-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {menuOpen && (
            <div className="user-dropdown">
              <Link to="/profile" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                <svg className="dropdown-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </Link>
              <button className="dropdown-item" onClick={handleLogout}>
                <svg className="dropdown-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;