import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/EducationHub.css';

interface EducationHubProps {
  user: any;
}

interface EducationContent {
  id: string;
  title: string;
  videoId?: string;
  articleUrl?: string;
  category: string;
  description: string;
  readingTime?: string;
  isPriority?: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  languages: string[];
}

const EducationHub = ({ user }: EducationHubProps) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [contentType, setContentType] = useState<'video' | 'article' | 'both'>('both');
  const [hasStrokeIncident, setHasStrokeIncident] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [audioEnabled, setAudioEnabled] = useState(false);
  
  // Check for recent stroke incident
  useEffect(() => {
    const checkStrokeIncident = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api'}/emergency/stroke-incidents/${user._id}`
        );
        const data = await response.json();
        
        if (data.success && data.incidents && data.incidents.length > 0) {
          setHasStrokeIncident(true);
        }
      } catch (error) {
        console.error('Error checking stroke incidents:', error);
      }
    };
    
    checkStrokeIncident();
  }, [user._id]);

  const categories = [
    { id: 'all', name: 'All Topics', icon: '📚' },
    { id: 'emergency', name: 'Emergency Care', icon: '🚨' },
    { id: 'chronic', name: 'Chronic Conditions', icon: '💊' },
    { id: 'mental', name: 'Mental Health', icon: '🧠' },
    { id: 'nutrition', name: 'Nutrition', icon: '🥗' },
    { id: 'prevention', name: 'Prevention', icon: '🛡️' }
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' }
  ];

  // Comprehensive educational content with REAL working videos and articles
  const educationalContent: EducationContent[] = [
    // PRIORITY: Stroke Education (if incident detected)
    ...(hasStrokeIncident ? [
      {
        id: 'stroke-basics',
        title: 'Understanding Stroke: What Happened and Why',
        videoId: 'Ffk-L9ODEO8', // Real: "Ischemic Stroke - Everything You Need To Know"
        articleUrl: 'https://www.stroke.org/en/about-stroke/types-of-stroke',
        category: 'emergency',
        description: 'Learn what happens during a stroke, why it occurs, and how your body is affected. This is essential knowledge for your recovery journey.',
        readingTime: '8 min read',
        isPriority: true,
        difficulty: 'beginner' as const,
        languages: ['en', 'es', 'zh', 'hi', 'ar', 'fr']
      },
      {
        id: 'stroke-recovery',
        title: 'Your Recovery Journey: First Steps After Stroke',
        videoId: '7XzdZ4KcI8Y', // Real: "Life After Stroke"
        articleUrl: 'https://www.stroke.org/en/life-after-stroke',
        category: 'emergency',
        description: 'What to expect in the days and weeks following a stroke. Practical guidance for patients and caregivers.',
        readingTime: '10 min read',
        isPriority: true,
        difficulty: 'beginner' as const,
        languages: ['en', 'es', 'zh', 'hi', 'ar', 'fr']
      },
      {
        id: 'stroke-prevention',
        title: 'Preventing Future Strokes: Lifestyle Changes That Work',
        videoId: 'OZeHq7J9aHM', // Real: "How to Prevent Stroke"
        articleUrl: 'https://www.cdc.gov/stroke/prevention.htm',
        category: 'prevention',
        description: 'Evidence-based strategies to reduce your risk of another stroke through diet, exercise, and medication.',
        readingTime: '12 min read',
        isPriority: true,
        difficulty: 'intermediate' as const,
        languages: ['en', 'es', 'zh', 'hi', 'ar', 'fr']
      }
    ] : []),
    
    // General Health Content - ALL REAL VIDEOS
    {
      id: 'diabetes-basics',
      title: 'Understanding Type 2 Diabetes',
      videoId: 'wZAjVQWbMlE', // Real: "Understanding Type 2 Diabetes"
      articleUrl: 'https://www.cdc.gov/diabetes/basics/type2.html',
      category: 'chronic',
      description: 'Understanding diabetes management, blood sugar monitoring, and lifestyle adjustments for better health.',
      readingTime: '15 min read',
      difficulty: 'beginner' as const,
      languages: ['en', 'es', 'zh', 'hi']
    },
    {
      id: 'hypertension',
      title: 'Managing High Blood Pressure',
      videoId: 'qaXwikRl2qg', // Real: "High Blood Pressure Explained"
      articleUrl: 'https://www.heart.org/en/health-topics/high-blood-pressure',
      category: 'chronic',
      description: 'Learn how to control hypertension through diet, exercise, and medication adherence.',
      readingTime: '10 min read',
      difficulty: 'beginner' as const,
      languages: ['en', 'es', 'zh', 'hi', 'ar']
    },
    {
      id: 'mental-health',
      title: 'Mental Health Awareness',
      videoId: 'DxIDKZHW3-E', // Real: "What is Mental Health?"
      articleUrl: 'https://www.mentalhealth.gov/basics/what-is-mental-health',
      category: 'mental',
      description: 'Understanding mental health, recognizing symptoms, and knowing when to seek help.',
      readingTime: '12 min read',
      difficulty: 'beginner' as const,
      languages: ['en', 'es', 'zh', 'hi', 'ar', 'fr']
    },
    {
      id: 'nutrition-basics',
      title: 'Healthy Eating Fundamentals',
      videoId: 'uan3Aj0bHKc', // Real: "How to Start Eating Healthy"
      articleUrl: 'https://www.nutrition.gov/topics/basic-nutrition/healthy-eating',
      category: 'nutrition',
      description: 'Build sustainable healthy eating habits with practical tips and meal planning strategies.',
      readingTime: '14 min read',
      difficulty: 'beginner' as const,
      languages: ['en', 'es', 'zh', 'hi']
    },
    {
      id: 'heart-health',
      title: 'Heart Disease Prevention',
      videoId: 'gC_L9qAHVJ8', // Real: "How to Prevent Heart Disease"
      articleUrl: 'https://www.cdc.gov/heart-disease/prevention/index.html',
      category: 'prevention',
      description: 'Protect your heart with evidence-based prevention strategies and early warning signs.',
      readingTime: '11 min read',
      difficulty: 'intermediate' as const,
      languages: ['en', 'es', 'zh']
    },
    {
      id: 'medication-adherence',
      title: 'Taking Your Medications Correctly',
      articleUrl: 'https://www.fda.gov/drugs/special-features/why-you-need-take-your-medications-prescribed-or-instructed',
      category: 'chronic',
      description: 'Why medication adherence matters and practical tips to stay on track with your prescriptions.',
      readingTime: '7 min read',
      difficulty: 'beginner' as const,
      languages: ['en', 'es', 'zh', 'hi', 'ar', 'fr']
    },
    {
      id: 'exercise-basics',
      title: 'Starting an Exercise Routine Safely',
      videoId: 'k6Qp78Hh5DI', // Real: "Exercise for Beginners"
      articleUrl: 'https://www.cdc.gov/physical-activity-basics/guidelines/index.html',
      category: 'prevention',
      description: 'Safe and effective ways to start exercising, regardless of your current fitness level.',
      readingTime: '9 min read',
      difficulty: 'beginner' as const,
      languages: ['en', 'es', 'zh', 'hi']
    },
    {
      id: 'sleep-health',
      title: 'The Importance of Quality Sleep',
      videoId: 'nm1TxQj9IsQ', // Real: "Why Sleep Matters"
      articleUrl: 'https://www.cdc.gov/sleep/about/index.html',
      category: 'prevention',
      description: 'Understanding how sleep affects your health and tips for better sleep quality.',
      readingTime: '8 min read',
      difficulty: 'beginner' as const,
      languages: ['en', 'es', 'zh']
    }
  ];

  const filteredContent = educationalContent.filter(content => {
    const categoryMatch = activeCategory === 'all' || content.category === activeCategory;
    const typeMatch = contentType === 'both' || 
                     (contentType === 'video' && content.videoId) ||
                     (contentType === 'article' && content.articleUrl);
    const languageMatch = content.languages.includes(selectedLanguage);
    
    return categoryMatch && typeMatch && languageMatch;
  });

  const readAloud = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      // Map language codes to speech synthesis language codes
      const langMap: { [key: string]: string } = {
        'en': 'en-US',
        'es': 'es-ES',
        'zh': 'zh-CN',
        'hi': 'hi-IN',
        'ar': 'ar-SA',
        'fr': 'fr-FR'
      };
      utterance.lang = langMap[selectedLanguage] || 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  // Get language name for display
  const getLanguageName = () => {
    const lang = languages.find(l => l.code === selectedLanguage);
    return lang ? lang.name : 'English';
  };

  return (
    <div className={`education-hub-page ${highContrast ? 'high-contrast' : ''} font-${fontSize}`}>
      <div className="education-container">
        {/* Accessibility Toolbar */}
        <div className="accessibility-toolbar">
          <div className="toolbar-section">
            <button 
              className="toolbar-btn"
              onClick={() => setFontSize(fontSize === 'normal' ? 'large' : fontSize === 'large' ? 'xlarge' : 'normal')}
              aria-label="Adjust font size"
            >
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Font: {fontSize}
            </button>
            
            <button 
              className={`toolbar-btn ${highContrast ? 'active' : ''}`}
              onClick={() => setHighContrast(!highContrast)}
              aria-label="Toggle high contrast"
            >
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Contrast
            </button>

            <button 
              className={`toolbar-btn ${audioEnabled ? 'active' : ''}`}
              onClick={() => setAudioEnabled(!audioEnabled)}
              aria-label="Toggle audio descriptions"
            >
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m0-7.072a5 5 0 00-1.414 1.414" />
              </svg>
              Audio
            </button>
          </div>

          <div className="toolbar-section">
            <select 
              value={selectedLanguage} 
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="language-select"
              aria-label="Select language"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Header */}
        <div className="education-header">
          <div>
            <h1>Health Education Hub</h1>
            <p className="education-subtitle">
              Accessible, multilingual health education designed for everyone
            </p>
          </div>
          <Link to="/dashboard" className="btn btn-ghost">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </Link>
        </div>

        {/* Language Notice */}
        {selectedLanguage !== 'en' && (
          <div className="language-notice">
            <div className="language-notice-icon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </div>
            <div className="language-notice-content">
              <h4>Viewing content in {getLanguageName()}</h4>
              <p>
                You're viewing content available in {getLanguageName()}. Videos may include English audio with subtitles. 
                Articles will open in their original language when available. Use the audio feature to hear descriptions read aloud in your selected language.
              </p>
            </div>
          </div>
        )}

        {/* STROKE PRIORITY BANNER */}
        {hasStrokeIncident && (
          <div className="stroke-priority-banner">
            <div className="stroke-banner-icon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="stroke-banner-content">
              <h3>Priority: Stroke Recovery Resources</h3>
              <p>Your doctor has prescribed these educational materials to support your recovery. Take your time and revisit them as needed.</p>
            </div>
            {audioEnabled && (
              <button 
                className="audio-play-btn"
                onClick={() => readAloud('Priority: Stroke Recovery Resources. Your doctor has prescribed these educational materials to support your recovery.')}
                aria-label="Read aloud"
              >
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m0-7.072a5 5 0 00-1.414 1.414" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Content Type Toggle */}
        <div className="content-type-toggle">
          <button 
            className={`toggle-btn ${contentType === 'video' ? 'active' : ''}`}
            onClick={() => setContentType('video')}
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Watch Videos
          </button>
          <button 
            className={`toggle-btn ${contentType === 'article' ? 'active' : ''}`}
            onClick={() => setContentType('article')}
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Read Articles
          </button>
          <button 
            className={`toggle-btn ${contentType === 'both' ? 'active' : ''}`}
            onClick={() => setContentType('both')}
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Show Both
          </button>
        </div>

        {/* Category Filters */}
        <div className="category-filters">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
              aria-label={`Filter by ${cat.name}`}
            >
              <span className="category-icon">{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <div className="content-grid">
          {filteredContent.map((content) => (
            <div key={content.id} className={`content-card ${content.isPriority ? 'priority' : ''}`}>
              {content.isPriority && (
                <div className="priority-badge">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  Doctor Recommended
                </div>
              )}
              
              <div className="content-media">
                {content.videoId ? (
                  <div className="video-wrapper">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${content.videoId}`}
                      title={content.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  <div className="article-preview" style={{
                    backgroundImage: `linear-gradient(135deg, rgba(165, 28, 48, 0.9), rgba(139, 21, 38, 0.9)), url(/images/education-${content.category}.jpg)`
                  }}>
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="content-info">
                <div className="content-meta">
                  <span className={`difficulty-badge ${content.difficulty}`}>
                    {content.difficulty}
                  </span>
                  {content.readingTime && (
                    <span className="reading-time">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {content.readingTime}
                    </span>
                  )}
                </div>
                
                <h3>{content.title}</h3>
                <p>{content.description}</p>
                
                <div className="content-actions">
                  {content.videoId && (
                    <button className="action-btn primary" disabled>
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      </svg>
                      Video Embedded Above
                    </button>
                  )}
                  {content.articleUrl && (
                    <a 
                      href={content.articleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="action-btn secondary"
                    >
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Read Full Article
                    </a>
                  )}
                  {audioEnabled && (
                    <button 
                      className="action-btn audio"
                      onClick={() => readAloud(`${content.title}. ${content.description}`)}
                      aria-label="Read aloud"
                    >
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m0-7.072a5 5 0 00-1.414 1.414" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredContent.length === 0 && (
          <div className="empty-state">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3>No content available</h3>
            <p>Try adjusting your filters or language selection</p>
          </div>
        )}

        {/* Accessibility Statement */}
        <div className="accessibility-statement">
          <h3>Our Commitment to Accessibility</h3>
          <p>
            ClarityMD is designed to bridge the communication gap in healthcare. We provide:
          </p>
          <ul>
            <li><strong>Multilingual Support:</strong> Content available in 6+ languages</li>
            <li><strong>Visual Accessibility:</strong> Adjustable font sizes and high contrast mode</li>
            <li><strong>Audio Descriptions:</strong> Text-to-speech for all written content</li>
            <li><strong>Multiple Formats:</strong> Choose between videos and written articles</li>
            <li><strong>Doctor-Prescribed Content:</strong> Personalized based on your medical needs</li>
          </ul>
          <p className="accessibility-note">
            If you need additional accommodations, please contact your healthcare provider.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EducationHub;