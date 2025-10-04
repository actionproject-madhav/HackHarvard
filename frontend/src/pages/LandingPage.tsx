import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LandingPage.css';

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="logo">HealthConnect</div>
        <ul className="nav-links">
          <li><a href="#journey">Our Approach</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#demo">See It in Action</a></li>
        </ul>
        <Link to="/login" className="cta-button">Login</Link>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Stay <span>Informed</span>. Stay <span>Connected</span>.</h1>
            <p>AI-powered healthcare communication that bridges the gap between patients and doctors—from detection to reflection, we keep you in the loop every step of the way.</p>
            <div className="hero-buttons">
              <Link to="/login" className="primary-btn">Login to Dashboard</Link>
              <button className="secondary-btn">Learn More</button>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-img">
              <div className="dashboard-preview">
                <div className="dashboard-header">Your Health Dashboard</div>
                <div className="dashboard-item">
                  <h3>🩺 AI Health Detection</h3>
                  <p>Symptom analysis complete</p>
                </div>
                <div className="dashboard-item">
                  <h3>📋 Appointment Confirmed</h3>
                  <p>Dr. Smith - Tomorrow at 2:00 PM</p>
                </div>
                <div className="dashboard-item">
                  <h3>🎥 Post-Visit Education</h3>
                  <p>Watch: Your procedure explained</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="journey" className="journey-section">
        <h2 className="section-title">Your <span>Care Journey</span>, Simplified</h2>
        <p className="section-subtitle">Five intelligent stages powered by AI to keep you informed and empowered</p>
        <div className="journey-flow">
          <div className="journey-step">
            <div className="journey-icon">🔍</div>
            <h3>Detect</h3>
            <p>AI symptom checker analyzes your concerns. Emergency detection for strokes and heart attacks.</p>
          </div>
          <div className="journey-step">
            <div className="journey-icon">📊</div>
            <h3>Report</h3>
            <p>Get clear insights about your symptoms. Simplified medical terms you can actually understand.</p>
          </div>
          <div className="journey-step">
            <div className="journey-icon">🤝</div>
            <h3>Connect</h3>
            <p>Smart matching with the right healthcare provider. Seamless appointment booking on your schedule.</p>
          </div>
          <div className="journey-step">
            <div className="journey-icon">💬</div>
            <h3>Consult</h3>
            <p>Real-time AI translation. Medical scribe auto-generates notes so doctors focus on you.</p>
          </div>
          <div className="journey-step">
            <div className="journey-icon">💡</div>
            <h3>Understand</h3>
            <p>AI-generated videos explain your procedure. Personalized health articles in your language.</p>
          </div>
        </div>
      </section>

      <section id="features" className="features-section">
        <div className="features-wrapper">
          <h2 className="section-title">Built for <span>Everyone</span></h2>
          <p className="section-subtitle">Comprehensive AI solutions designed to transform healthcare communication</p>
          <div className="features-columns">
            <div className="feature-column">
              <h3>For Patients</h3>
              <ul className="feature-list">
                <li className="feature-item">
                  <span className="check">✓</span>
                  <span>Easy appointment booking</span>
                </li>
                <li className="feature-item">
                  <span className="check">✓</span>
                  <span>AI symptom detection</span>
                </li>
                <li className="feature-item">
                  <span className="check">✓</span>
                  <span>Emergency stroke & heart attack detection</span>
                </li>
                <li className="feature-item">
                  <span className="check">✓</span>
                  <span>Smart medication reminders</span>
                </li>
                <li className="feature-item">
                  <span className="check">✓</span>
                  <span>Educational videos in any language</span>
                </li>
                <li className="feature-item">
                  <span className="check">✓</span>
                  <span>Keyword simplification in transcriptions</span>
                </li>
                <li className="feature-item">
                  <span className="check">✓</span>
                  <span>Direct prescription refills</span>
                </li>
              </ul>
            </div>
            <div className="feature-column">
              <h3>For Doctors</h3>
              <ul className="feature-list">
                <li className="feature-item">
                  <span className="check">✓</span>
                  <span>AI real-time translator</span>
                </li>
                <li className="feature-item">
                  <span className="check">✓</span>
                  <span>AI medical scribe (auto-notes)</span>
                </li>
                <li className="feature-item">
                  <span className="check">✓</span>
                  <span>Direct pharmacy integration</span>
                </li>
                <li className="feature-item">
                  <span className="check">✓</span>
                  <span>Patient monitoring dashboard</span>
                </li>
                <li className="feature-item">
                  <span className="check">✓</span>
                  <span>Efficient workflow tools</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="demo" className="demo-section">
        <h2 className="section-title">See Our <span>AI in Action</span></h2>
        <p className="section-subtitle">Experience how our emergency detection technology could save lives</p>
        <div className="demo-box">
          <h3>🚨 Stroke Detection Demo</h3>
          <p>Watch how our AI can detect early warning signs of strokes in real-time, helping patients get care when every second counts.</p>
          <a href="#" className="demo-link">View Stroke Detection Demo →</a>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Stay in the Loop?</h2>
          <p>Join patients and doctors who experience healthcare communication that actually works. Clear. Connected. Intelligent.</p>
          <Link to="/login" className="cta-white-btn">Login Now</Link>
        </div>
      </section>

      <footer>
        <p>© 2025 HealthConnect. Founded by Anni Rawal. Empowering patients through AI-powered education and seamless communication.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
