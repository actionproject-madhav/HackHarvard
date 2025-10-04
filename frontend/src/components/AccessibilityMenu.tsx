import React, { useState } from 'react';
import '../styles/AccessibilityMenu.css';

interface AccessibilityMenuProps {
    preferences: any;
    onUpdate: (preferences: any) => void;
}

const AccessibilityMenu = ({ preferences, onUpdate }: AccessibilityMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (option: string) => {
    onUpdate({
      ...preferences,
      [option]: !preferences[option]
    });
  };

  const changeFontSize = (size: string) => {
    onUpdate({
      ...preferences,
      font_size: size
    });
  };

  return (
    <div className="accessibility-menu">
      <button 
        className="accessibility-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Accessibility Options"
      >
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      </button>

      {isOpen && (
        <div className="accessibility-panel">
          <h3>Accessibility Options</h3>
          
          <div className="accessibility-option">
            <label className="checkbox-wrapper">
              <input
                type="checkbox"
                checked={preferences.voice_input || false}
                onChange={() => toggleOption('voice_input')}
                className="checkbox"
              />
              <span>Enable Voice Input</span>
            </label>
          </div>

          <div className="accessibility-option">
            <label className="checkbox-wrapper">
              <input
                type="checkbox"
                checked={preferences.high_contrast || false}
                onChange={() => toggleOption('high_contrast')}
                className="checkbox"
              />
              <span>High Contrast Mode</span>
            </label>
          </div>

          <div className="accessibility-option">
            <label className="checkbox-wrapper">
              <input
                type="checkbox"
                checked={preferences.screen_reader || false}
                onChange={() => toggleOption('screen_reader')}
                className="checkbox"
              />
              <span>Screen Reader Optimized</span>
            </label>
          </div>

          <div className="accessibility-option">
            <label>Font Size</label>
            <div className="font-size-buttons">
              <button
                className={`font-size-btn ${preferences.font_size === 'small' ? 'active' : ''}`}
                onClick={() => changeFontSize('small')}
              >
                A
              </button>
              <button
                className={`font-size-btn ${preferences.font_size === 'medium' ? 'active' : ''}`}
                onClick={() => changeFontSize('medium')}
              >
                A
              </button>
              <button
                className={`font-size-btn ${preferences.font_size === 'large' ? 'active' : ''}`}
                onClick={() => changeFontSize('large')}
              >
                A
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessibilityMenu;