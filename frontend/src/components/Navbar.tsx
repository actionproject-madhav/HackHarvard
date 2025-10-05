import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import NavbarLogo from './NavbarLogo';

interface NavbarProps {
    user: any;
    onLogout: () => void;
}

const Navbar = ({ user, onLogout }: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavbarLogo to="/dashboard"/>

        <div className="navbar-links">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/symptoms" className="nav-link">Symptoms</Link>
          <Link to="/doctors" className="nav-link">Doctors</Link>
          <Link to="/education" className="nav-link">Education</Link>
          <Link to="/transcribe" className="nav-link">Transcribe</Link>
          <Link to="/medications" className="nav-link">Medications</Link>
        </div>

        <div className="navbar-user">
          <div className="user-menu" ref={menuRef}>
            <button 
              className="user-menu-button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="User menu"
            >
              <img 
                src={user.profile_picture || 'https://via.placeholder.com/40'} 
                alt={user.name}
                className="user-avatar"
              />
              <div className="user-info">
                <div className="user-name">{user.name}</div>
                <div className="user-role">Patient</div>
              </div>
              <svg className={`dropdown-icon ${menuOpen ? 'open' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {menuOpen && (
              <div className={`user-dropdown ${menuOpen ? "open" : ""}`}>
                <div className="dropdown-header">
                  <div className="dropdown-user-name">{user.name}</div>
                  <div className="dropdown-user-email">{user.email}</div>
                </div>
                <ul className="dropdown-menu">
                  <li className="dropdown-item">
                    <Link to="/profile" className="dropdown-link" onClick={() => setMenuOpen(false)}>
                      <div className="dropdown-icon-wrapper">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      Profile
                    </Link>
                  </li>
                  <div className="dropdown-divider"></div>
                  <li className="dropdown-item">
                    <button className="logout-button" onClick={handleLogout}>
                      <div className="dropdown-icon-wrapper">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      </div>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;