# 🔧 Fix "Error 401: invalid_client" - Quick Guide

## The Problem

You're seeing this error because your app is using `YOUR_GOOGLE_CLIENT_ID` (the placeholder text) instead of a real Google OAuth Client ID.

**Error Message**: "The OAuth client was not found"  
**URL shows**: `client_id=YOUR_GOOGLE_CLIENT_ID`

---

## ✅ Solution - Get Real Google Credentials

### Step 1: Create Google OAuth Credentials (5 minutes)

1. **Go to Google Cloud Console**:
   - Visit: https://console.cloud.google.com/apis/credentials
   - Sign in with your Google account

2. **Create a Project** (if you don't have one):
   - Click "Select a Project" → "New Project"
   - Name: `ClarityMD` (or anything you like)
   - Click "Create"

3. **Set Up OAuth Consent Screen**:
   - Go to "APIs & Services" → "OAuth consent screen"
   - Choose "External" → Click "Create"
   - Fill in:
     - App name: `ClarityMD`
     - User support email: Your email
     - Developer contact: Your email
   - Click "Save and Continue" (skip the optional steps)

4. **Create OAuth Client ID**:
   - Go to "APIs & Services" → "Credentials"
   - Click "+ Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Name: `ClarityMD Web Client`
   - **Authorized JavaScript origins**:
     ```
     http://localhost:3000
     ```
   - **Authorized redirect URIs**:
     ```
     http://localhost:3000
     ```
   - Click "Create"

5. **Copy Your Credentials**:
   - You'll see a popup with your credentials
   - **Copy the Client ID** (looks like: `123456789-abc...xyz.apps.googleusercontent.com`)
   - **Copy the Client Secret** (looks like: `GOCSPX-abc...xyz`)

### Step 2: Update Your Environment Files

**Update `frontend/.env`**:
```bash
# Open the file
nano frontend/.env
# or
open frontend/.env

# Replace this line:
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here

# With your actual Client ID:
REACT_APP_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
```

**Update `backend/.env`**:
```bash
# Open the file
nano backend/.env
# or
open backend/.env

# Replace these lines:
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# With your actual credentials:
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-aBcDeFgHiJkLmNoPqRsTuV
```

### Step 3: Restart Your Servers

```bash
# Stop current servers
./stop.sh

# Start again
./start.sh
```

**OR manually:**
```bash
# Stop backend (Ctrl+C in the terminal running it)
# Stop frontend (Ctrl+C in the terminal running it)

# Restart backend
cd backend
python3 test_server.py

# In another terminal, restart frontend
cd frontend
npm start
```

### Step 4: Test Login

1. Open http://localhost:3000
2. Click "Sign in with Google"
3. You should now see the Google login popup
4. Select your account
5. ✅ Success! You're logged in!

---

## 🎯 Quick Test

After updating your `.env` files, run:

```bash
./test_google_auth.sh
```

You should see:
```
✅ GOOGLE_CLIENT_ID is configured
✅ GOOGLE_CLIENT_SECRET is configured
```

---

## 🔍 Verify Your Changes

**Check Frontend .env**:
```bash
grep REACT_APP_GOOGLE_CLIENT_ID frontend/.env
```

Should show your actual Client ID (not "your_google_client_id_here")

**Check Backend .env**:
```bash
grep GOOGLE_CLIENT_ID backend/.env
grep GOOGLE_CLIENT_SECRET backend/.env
```

Should show your actual credentials (not placeholders)

---

## ⚠️ Important Notes

1. **Don't commit your actual credentials to git**
   - The `.gitignore` is already set up to protect your `.env` files
   - Only the `.env.example` files should have placeholder values

2. **Authorized Origins Must Match**
   - Use `http://localhost:3000` for development
   - Don't use `https` for localhost
   - No trailing slashes

3. **Frontend Must Restart**
   - React needs to reload to pick up new environment variables
   - Stop (`Ctrl+C`) and restart (`npm start`)

4. **Add Test Users** (optional):
   - In Google Cloud Console → OAuth consent screen
   - Add your Gmail as a test user while in development

---

## 🐛 Still Having Issues?

### Error: "redirect_uri_mismatch"
**Fix**: Add `http://localhost:3000` to Authorized redirect URIs in Google Cloud Console

### Error: "invalid_client" still appears
**Fix**: 
1. Make sure you saved the `.env` files
2. Restart both frontend and backend
3. Clear browser cache/cookies
4. Try in incognito/private window

### Client ID shows as "YOUR_GOOGLE_CLIENT_ID"
**Fix**: Make sure you're editing the right `.env` file (not `.env.example`)

### Google popup doesn't appear
**Fix**: 
1. Check browser console for errors
2. Make sure popup blockers are disabled
3. Try a different browser

---

## 📋 Checklist

- [ ] Created Google Cloud project
- [ ] Set up OAuth consent screen
- [ ] Created OAuth client credentials
- [ ] Copied Client ID and Client Secret
- [ ] Updated `frontend/.env` with REACT_APP_GOOGLE_CLIENT_ID
- [ ] Updated `backend/.env` with GOOGLE_CLIENT_ID
- [ ] Updated `backend/.env` with GOOGLE_CLIENT_SECRET
- [ ] Restarted frontend server
- [ ] Restarted backend server
- [ ] Tested login at http://localhost:3000
- [ ] ✅ Login works!

---

## 🎉 Success!

Once you've completed these steps, the "Sign in with Google" button should work perfectly!

**Reference**: [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)

---

## 💡 Pro Tips

1. **Save Your Credentials**: Download the JSON file from Google Cloud Console for backup
2. **Different Environments**: Use separate OAuth clients for development and production
3. **Security**: Never share your Client Secret publicly
4. **Testing**: Add multiple test emails in the OAuth consent screen

---

**Need more help?** Check out `GOOGLE_AUTH_SETUP.md` for detailed instructions!

