export interface GoogleAuthResponse {
  token: string;
  user: User;
}

export interface User {
  _id: string;
  google_id?: string;
  email: string;
  name: string;
  profile_picture?: string;
  role?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  address?: string;
  emergency_contact?: EmergencyContact;
  medical_history?: string[];
  allergies?: string[];
  current_medications?: string[];
  preferred_language?: string;
  accessibility_preferences?: AccessibilityPreferences;
  created_at?: string;
  updated_at?: string;
  onboarding_completed?: boolean;
}

export interface EmergencyContact {
  name?: string;
  relationship?: string;
  phone?: string;
}

export interface AccessibilityPreferences {
  voice_input?: boolean;
  high_contrast?: boolean;
  screen_reader?: boolean;
  font_size?: string;
}

export interface OnboardingFormData {
  phone: string;
  date_of_birth: string;
  gender: string;
  address: string;
  emergency_contact: EmergencyContact;
  medical_history: string[];
  allergies: string[];
  current_medications: string[];
  preferred_language: string;
  accessibility_preferences: AccessibilityPreferences;
}

export interface ServiceWorkerConfig {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
}