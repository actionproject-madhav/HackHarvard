# ClarityMD Testing Guide

## ✅ Current Status

### Backend Status: **WORKING** ✅
- ✅ Server running on http://localhost:5000
- ✅ Database connected (MongoDB)
- ✅ All API endpoints functional
- ✅ 5 mock doctors seeded in database

### Frontend Status: **READY TO TEST** 🧪
- ✅ Dependencies installed
- ✅ React/TypeScript setup complete
- ✅ API service configured correctly

---

## 🧪 Backend API Testing

### Running Backend
```bash
cd /Users/madhav/Documents/HackHarvard/backend
python3 test_server.py
```

### Tested Endpoints

| Endpoint | Method | Status | Description |
|----------|--------|--------|-------------|
| `/` | GET | ✅ WORKING | Root endpoint - API info |
| `/api/health` | GET | ✅ WORKING | Health check |
| `/api/doctors` | GET | ✅ WORKING | Get all doctors |
| `/api/doctors/search?specialization=X` | GET | ✅ WORKING | Search doctors |
| `/api/doctors/<id>` | GET | ✅ WORKING | Get specific doctor |
| `/api/emergency/detect` | POST | ✅ WORKING | Emergency detection |
| `/api/auth/google` | POST | ⏳ NEEDS AUTH | Google OAuth |
| `/api/symptoms/report` | POST | ⏳ NEEDS DATA | Create symptom report |
| `/api/appointments` | POST | ⏳ NEEDS DATA | Create appointment |

### Quick API Tests
```bash
# Health check
curl http://localhost:5000/api/health

# Get all doctors
curl http://localhost:5000/api/doctors

# Search for cardiologists
curl "http://localhost:5000/api/doctors/search?specialization=Cardiology"

# Emergency detection
curl -X POST http://localhost:5000/api/emergency/detect \
  -H "Content-Type: application/json" \
  -d '{"symptoms": ["chest pain", "shortness of breath"]}'
```

---

## 🎨 Frontend Testing

### Running Frontend
```bash
cd /Users/madhav/Documents/HackHarvard/frontend
npm start
```

### What to Test

#### 1. **Login Page** (`/`)
- [ ] Google OAuth button renders
- [ ] Login redirects to onboarding for new users
- [ ] Login redirects to dashboard for returning users

#### 2. **Onboarding** (`/onboarding`)
- [ ] Multi-step form for user information
- [ ] Medical history input
- [ ] Accessibility preferences
- [ ] Saves data to backend

#### 3. **Dashboard** (`/dashboard`)
- [ ] Displays user information
- [ ] Quick actions (symptom checker, appointments)
- [ ] Recent appointments
- [ ] Emergency banner if needed

#### 4. **Symptom Checker** (`/symptoms`)
- [ ] Text input for symptoms
- [ ] Voice input option
- [ ] AI analysis response
- [ ] Emergency detection
- [ ] Doctor matching

#### 5. **Doctor Match** (`/doctors`)
- [ ] Browse doctors by specialization
- [ ] View doctor profiles
- [ ] See availability
- [ ] Book appointment button

#### 6. **Appointments** (`/appointments`)
- [ ] Create new appointment
- [ ] View upcoming appointments
- [ ] View past appointments
- [ ] Cancel appointments

#### 7. **Profile** (`/profile`)
- [ ] Edit user information
- [ ] Update medical history
- [ ] Accessibility settings
- [ ] Logout functionality

---

## 🔧 Environment Variables

### Backend (`.env`)
```env
MONGO_URI=mongodb://localhost:27017/claritymd
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
SECRET_KEY=dev-secret-key-change-in-production
```

### Frontend (`.env`)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
REACT_APP_ENV=development
REACT_APP_DEBUG=true
```

---

## 🐛 Known Issues & Solutions

### Issue: ModuleNotFoundError in backend
**Solution**: Use `PYTHONPATH=.` when running Python files
```bash
cd backend
PYTHONPATH=. python3 app.py
```

### Issue: Empty model/route files
**Solution**: Files were restored. Check git status if it happens again.

### Issue: Doctor route conflicts
**Solution**: Added `/search` route before `/<doctor_id>` route

---

## 📊 Database Collections

### Users Collection
- Email, name, Google ID
- Medical history, allergies, medications
- Accessibility preferences
- Role (patient/doctor)

### Doctors Collection
- Name, specialization, qualifications
- Hospital, location with coordinates
- Availability schedule
- Rating, consultation fee
- **5 doctors currently seeded**

### Appointments Collection
- User ID, doctor ID
- Date, time, type (in-person/video)
- Status (scheduled/completed/cancelled)
- Symptoms, diagnosis, prescription
- AI-generated summary

### Symptom Reports Collection
- User ID, symptoms list
- Severity, duration
- Emergency detection flag
- AI analysis
- Matched doctor

---

## 🚀 Full System Test

### Step-by-Step
1. **Start Backend**: `cd backend && python3 test_server.py`
2. **Verify Backend**: `curl http://localhost:5000/api/health`
3. **Start Frontend**: `cd frontend && npm start`
4. **Open Browser**: http://localhost:3000
5. **Test Features**: Follow checklist above

---

## 📝 Notes
- MongoDB must be running locally
- Google OAuth requires valid credentials
- Some AI features need API keys
- Frontend runs on port 3000
- Backend runs on port 5000

