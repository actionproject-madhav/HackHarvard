import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/EducationHub.css';

interface EducationHubProps {
  user: any;
}

const EducationHub = ({ user }: EducationHubProps) => {
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Personalized learning based on medical history
  const getPersonalizedTopics = () => {
    const conditions = user.medical_conditions || [];
    const topics = [];
    
    if (conditions.includes('Diabetes') || conditions.includes('diabetes')) {
      topics.push({
        title: 'Understanding Diabetes',
        videoId: 'wZAjVQWbMlE',
        category: 'chronic',
        description: 'Learn about managing diabetes effectively'
      });
    }
    
    if (conditions.includes('Hypertension') || conditions.includes('hypertension')) {
      topics.push({
        title: 'Managing High Blood Pressure',
        videoId: 'rKqhN1H5xZE',
        category: 'chronic',
        description: 'Tips for controlling hypertension'
      });
    }
    
    return topics;
  };

  const categories = [
    { id: 'all', name: 'All Topics', icon: '📚' },
    { id: 'chronic', name: 'Chronic Conditions', icon: '💊' },
    { id: 'mental', name: 'Mental Health', icon: '🧠' },
    { id: 'nutrition', name: 'Nutrition', icon: '🥗' },
    { id: 'fitness', name: 'Fitness', icon: '💪' },
    { id: 'prevention', name: 'Prevention', icon: '🛡️' }
  ];

  const educationalVideos = [
    ...getPersonalizedTopics(),
    {
      title: 'Mental Health Basics',
      videoId: 'DxIDKZHW3-E',
      category: 'mental',
      description: 'Understanding mental health and wellness'
    },
    {
      title: 'Healthy Eating Habits',
      videoId: 'ZdPdi8Qkp9c',
      category: 'nutrition',
      description: 'Build sustainable healthy eating habits'
    },
    {
      title: 'Exercise for Beginners',
      videoId: 'gC_L9qAHVJ8',
      category: 'fitness',
      description: 'Start your fitness journey safely'
    },
    {
      title: 'Disease Prevention',
      videoId: 'D9qwQPsJ_MA',
      category: 'prevention',
      description: 'Preventive health measures everyone should know'
    },
    {
      title: 'Understanding Symptoms',
      videoId: 'rKqhN1H5xZE',
      category: 'all',
      description: 'When to seek medical attention'
    }
  ];

  const filteredVideos = activeCategory === 'all' 
    ? educationalVideos 
    : educationalVideos.filter(v => v.category === activeCategory);

  return (
    <div className="education-hub-page">
      <div className="education-container">
        <div className="education-header">
          <div>
            <h1>Health Education Hub</h1>
            <p className="education-subtitle">
              Learn about health topics tailored to your medical profile
            </p>
          </div>
          <Link to="/dashboard" className="btn btn-ghost">
            Back to Dashboard
          </Link>
        </div>

        {/* Personalized Banner */}
        {getPersonalizedTopics().length > 0 && (
          <div className="personalized-banner">
            <div className="banner-icon">✨</div>
            <div className="banner-content">
              <h3>Personalized for You</h3>
              <p>Based on your medical history: {user.medical_conditions?.join(', ')}</p>
            </div>
          </div>
        )}

        {/* Category Filters */}
        <div className="category-filters">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span className="category-icon">{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Video Grid */}
        <div className="videos-grid">
          {filteredVideos.map((video, idx) => (
            <div key={idx} className="video-card">
              <div className="video-thumbnail">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${video.videoId}`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="video-info">
                <h3>{video.title}</h3>
                <p>{video.description}</p>
                {idx < getPersonalizedTopics().length && (
                  <span className="personalized-tag">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    Recommended for you
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="empty-state">
            <p>No videos found in this category. Try a different filter!</p>
          </div>
        )}

        {/* Past Visits Summary */}
        <div className="past-visits-section">
          <h2>Your Health Journey</h2>
          <div className="visits-timeline">
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h4>Recent Symptom Check</h4>
                <p className="timeline-date">Last checked: Today</p>
                <p>Continue learning about symptom management</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h4>Doctor Appointments</h4>
                <p className="timeline-date">Track your appointments</p>
                <Link to="/appointments" className="timeline-link">View Appointments →</Link>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h4>Medication Tracking</h4>
                <p className="timeline-date">Stay on schedule</p>
                <Link to="/medications" className="timeline-link">View Medications →</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Health Tips */}
        <div className="health-tips-section">
          <h2>Quick Health Tips</h2>
          <div className="tips-grid">
            <div 
              className="tip-card"
              style={{ backgroundImage: 'url(/images/hydration.jpg)' }}
            >
              <div className="tip-icon">💧</div>
              <h4>Stay Hydrated</h4>
              <p>Drink 8 glasses of water daily</p>
            </div>
            <div 
              className="tip-card"
              style={{ backgroundImage: 'url(/images/exercise.jpg)' }}
            >
              <div className="tip-icon">🚶</div>
              <h4>Move More</h4>
              <p>30 minutes of activity per day</p>
            </div>
            <div 
              className="tip-card"
              style={{ backgroundImage: 'url(/images/sleep.jpg)' }}
            >
              <div className="tip-icon">😴</div>
              <h4>Sleep Well</h4>
              <p>7-9 hours every night</p>
            </div>
            <div 
              className="tip-card"
              style={{ backgroundImage: 'url(/images/meditation.jpg)' }}
            >
              <div className="tip-icon">🧘</div>
              <h4>Reduce Stress</h4>
              <p>Practice mindfulness daily</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationHub;

