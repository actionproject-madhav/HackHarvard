import React, { useState } from 'react';
import { updateUser } from '../services/api';
import AccessibilityMenu from '../components/AccessibilityMenu';
import { AccessibilityPreferences, User } from '../services/types';
import '../styles/Profile.css';

interface ProfileProps {
  user: User;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    date_of_birth: user.date_of_birth || '',
    gender: user.gender || '',
    address: user.address || '',
    emergency_contact: user.emergency_contact || { name: '', phone: '', relationship: '' },
    medical_history: user.medical_history || [],
    allergies: user.allergies || [],
    current_medications: user.current_medications || [],
    preferred_language: user.preferred_language || 'en',
    accessibility_preferences: user.accessibility_preferences || {}
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEmergencyContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      emergency_contact: {
        ...formData.emergency_contact,
        [name]: value
      }
    });
  };

  const handleArrayInput = (field: string, value: string) => {
    const items = value.split(',').map((item: string) => item.trim()).filter((item: string) => item);
    setFormData({ ...formData, [field]: items });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateUser(user._id, formData);
      alert('Profile updated successfully!');
      setIsEditing(false);
      setLoading(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar-section">
            <img 
              src={user.profile_picture || 'https://via.placeholder.com/120'} 
              alt={user.name}
              className="profile-avatar-large"
            />
            <div className="profile-basic-info">
              <h1>{user.name}</h1>
              <p>{user.email}</p>
            </div>
          </div>
          <button 
            className={`btn ${isEditing ? 'btn-ghost' : 'btn-primary'}`}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="profile-sections">
            {/* Personal Information */}
            <div className="profile-section">
              <h2>Personal Information</h2>
              <div className="profile-grid">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Date of Birth</label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    className="form-input"
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="form-select"
                    disabled={!isEditing}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Preferred Language</label>
                  <select
                    name="preferred_language"
                    value={formData.preferred_language}
                    onChange={handleChange}
                    className="form-select"
                    disabled={!isEditing}
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="hi">Hindi</option>
                    <option value="zh">Chinese</option>
                    <option value="fr">French</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="form-textarea"
                  rows={3}
                  disabled={!isEditing}
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="profile-section">
              <h2>Emergency Contact</h2>
              <div className="profile-grid">
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.emergency_contact.name}
                    onChange={handleEmergencyContactChange}
                    className="form-input"
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.emergency_contact.phone}
                    onChange={handleEmergencyContactChange}
                    className="form-input"
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Relationship</label>
                  <input
                    type="text"
                    name="relationship"
                    value={formData.emergency_contact.relationship}
                    onChange={handleEmergencyContactChange}
                    className="form-input"
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="profile-section">
              <h2>Medical Information</h2>
              
              <div className="form-group">
                <label className="form-label">Medical History</label>
                {isEditing ? (
                  <textarea
                    className="form-textarea"
                    placeholder="Enter conditions separated by commas"
                    defaultValue={formData.medical_history.join(', ')}
                    onChange={(e) => handleArrayInput('medical_history', e.target.value)}
                    rows={3}
                  />
                ) : (
                  <div className="tag-list">
                    {formData.medical_history.length > 0 ? (
                      formData.medical_history.map((item, i) => (
                        <span key={i} className="tag">{item}</span>
                      ))
                    ) : (
                      <p className="empty-text">No medical history recorded</p>
                    )}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Allergies</label>
                {isEditing ? (
                  <textarea
                    className="form-textarea"
                    placeholder="Enter allergies separated by commas"
                    defaultValue={formData.allergies.join(', ')}
                    onChange={(e) => handleArrayInput('allergies', e.target.value)}
                    rows={3}
                  />
                ) : (
                  <div className="tag-list">
                    {formData.allergies.length > 0 ? (
                      formData.allergies.map((item, i) => (
                        <span key={i} className="tag tag-warning">{item}</span>
                      ))
                    ) : (
                      <p className="empty-text">No allergies recorded</p>
                    )}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Current Medications</label>
                {isEditing ? (
                  <textarea
                    className="form-textarea"
                    placeholder="Enter medications separated by commas"
                    defaultValue={formData.current_medications.join(', ')}
                    onChange={(e) => handleArrayInput('current_medications', e.target.value)}
                    rows={3}
                  />
                ) : (
                  <div className="tag-list">
                    {formData.current_medications.length > 0 ? (
                      formData.current_medications.map((item, i) => (
                        <span key={i} className="tag tag-primary">{item}</span>
                      ))
                    ) : (
                      <p className="empty-text">No current medications</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Account Actions */}
            <div className="profile-section">
              <h2>Account</h2>
              <div className="account-actions">
                <button type="button" className="btn btn-ghost">
                  Change Password
                </button>
                <button type="button" className="btn btn-ghost">
                  Download My Data
                </button>
                <button type="button" className="btn btn-danger">
                  Delete Account
                </button>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="profile-actions">
              <button 
                type="submit" 
                className="btn btn-success btn-large"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </form>
      </div>

      <AccessibilityMenu
        preferences={formData.accessibility_preferences}
        onUpdate={(prefs: AccessibilityPreferences) => setFormData({ ...formData, accessibility_preferences: prefs })}
      />
    </div>
  );
};

export default Profile;