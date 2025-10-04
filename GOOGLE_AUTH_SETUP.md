# Google OAuth Setup Guide for ClarityMD

## 🔐 Complete Setup Instructions

### About the Browser Console Error

**The error you're seeing (`contentFairAds.js`) is NOT from your app!** 

This is a browser extension or ad-blocker error and can be safely ignored. It doesn't affect your Google Auth implementation.

---

## Step-by-Step Google OAuth Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a Project"** → **"New Project"**
3. Enter project name: `ClarityMD` (or your choice)
4. Click **"Create"**

### 2. Enable OAuth Consent Screen

1. In the left sidebar, go to **"APIs & Services"** → **"OAuth consent screen"**
2. Select **"External"** user type (for testing)
3. Click **"Create"**
4. Fill in the required fields:
   - App name: `ClarityMD`
   - User support email: your email
   - Developer contact: your email
5. Click **"Save and Continue"**
6. Skip "Scopes" for now (click **"Save and Continue"**)
7. Add test users if needed
8. Click **"Back to Dashboard"**

### 3. Create OAuth Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ Create Credentials"** → **"OAuth client ID"**
3. Application type: **"Web application"**
4. Name: `ClarityMD Web Client`
5. **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   http://localhost:5000
   ```
6. **Authorized redirect URIs**:
   ```
   http://localhost:3000
   http://localhost:3000/auth/callback
   ```
7. Click **"Create"**
8. **IMPORTANT**: Copy your credentials:
   - Client ID: `xxxxx-xxxxxx.apps.googleusercontent.com`
   - Client Secret: `GOCSPX-xxxxxxxxxx`

### 4. Update Backend Environment

Open `backend/.env` and update these lines:

```bash
# Replace with your actual credentials
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-aBcDeFgHiJkLmNoPqRsTuV
```

### 5. Update Frontend Environment (Optional)

Open `frontend/.env` and add:

```bash
# Same Client ID as backend
REACT_APP_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
```

### 6. Restart Your Servers

```bash
# Stop current servers
./stop.sh

# Start again with new credentials
./start.sh
```

---

## Testing Google Auth

### Quick Test Script

Run this to verify your setup:
```bash
./test_google_auth.sh
```

### Test in Browser

1. Start your application: `./start.sh`
2. Open http://localhost:3000
3. Click "Sign in with Google"
4. You should see Google's login popup
5. After login, you'll be redirected to your app

---

## Troubleshooting

### Error: "redirect_uri_mismatch"
**Solution**: Make sure `http://localhost:3000` is in your Authorized redirect URIs in Google Cloud Console

### Error: "invalid_client"
**Solution**: Double-check your Client ID and Client Secret in `.env` files

### Error: "access_denied"
**Solution**: Make sure your Google account is added as a test user in OAuth consent screen

### Browser Console Warning about "Self-XSS"
**Solution**: This is a standard Chrome warning. Ignore it - it's not related to your app.

### Error: "contentFairAds.js" 
**Solution**: This is from a browser extension. Disable ad-blockers or ignore the error.

---

## Security Best Practices

### For Development:
- ✅ Use placeholder values in `.env.example`
- ✅ Keep actual credentials in `.env` (not committed to git)
- ✅ Use `http://localhost` for testing
- ✅ Add your email as a test user

### For Production:
- ✅ Create separate OAuth credentials for production
- ✅ Use your actual domain (https://yourdomain.com)
- ✅ Remove test users, set to "In production"
- ✅ Use environment variables on your server
- ✅ Enable all necessary scopes
- ✅ Set up proper CORS policies

---

## What Your App Does with Google Auth

### Backend (`routes/auth.py`):
```python
@auth_bp.route('/google', methods=['POST'])
def google_auth():
    # Receives Google token from frontend
    # Verifies token with Google
    # Creates or finds user in database
    # Returns user data to frontend
```

### User Flow:
1. User clicks "Sign in with Google" button
2. Google OAuth popup appears
3. User authorizes your app
4. Google sends token to your frontend
5. Frontend sends token to backend `/api/auth/google`
6. Backend verifies token and creates/updates user
7. User is logged in and redirected to dashboard

---

## Required Google API Scopes

Your app currently requests these scopes:
- **email**: To get user's email address
- **profile**: To get user's name and photo
- **openid**: For OAuth 2.0 authentication

These are the minimum required scopes and are automatically included.

---

## Testing Without Real Credentials

Your app will work fine without Google OAuth! The authentication is optional. You can:

1. **Skip OAuth for now** and develop other features
2. **Mock the login** by directly accessing protected routes
3. **Use test data** from your seeded database

The app is fully functional for testing all other features without OAuth credentials.

---

## Quick Reference

### Get Credentials:
https://console.cloud.google.com/apis/credentials

### Test Your Setup:
```bash
./test_google_auth.sh
```

### Backend Auth Endpoint:
```
POST http://localhost:5000/api/auth/google
Body: { "token": "google_oauth_token_here" }
```

### Files to Update:
- `backend/.env` → GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
- `frontend/.env` → REACT_APP_GOOGLE_CLIENT_ID (optional)

---

## Need Help?

If you're still seeing errors:

1. Check browser console (F12) for actual errors
2. Check backend logs: `cat /tmp/claritymd_backend.log`
3. Verify credentials with: `./test_google_auth.sh`
4. Make sure servers are restarted after updating `.env`

The `contentFairAds.js` error you saw is **NOT** from your application - it's from a browser extension and can be ignored!

---

**Your app is ready for Google OAuth! Just add your credentials and restart.** 🚀

