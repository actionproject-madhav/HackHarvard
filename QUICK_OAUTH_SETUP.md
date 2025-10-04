# 🚀 Quick Google OAuth Setup (5 Minutes)

## Error You're Seeing:
```
[GSI_LOGGER]: The given client ID is not found.
403 error when retrieving token
```

**This means**: Your Client ID is not valid/doesn't exist in Google's system.

---

## ✅ Fix It in 5 Steps:

### Step 1: Go to Google Cloud Console
👉 **https://console.cloud.google.com/apis/credentials**

### Step 2: Create a New Project (if needed)
- Click "Select a Project" at the top
- Click "NEW PROJECT"
- Name it: `ClarityMD`
- Click "CREATE"

### Step 3: Configure OAuth Consent Screen
- Click "OAuth consent screen" on the left
- Choose "External"
- Click "CREATE"
- Fill in:
  - App name: `ClarityMD`
  - User support email: Your email
  - Developer contact: Your email
- Click "SAVE AND CONTINUE" (skip other steps)

### Step 4: Create OAuth Client ID
- Click "Credentials" on the left
- Click "+ CREATE CREDENTIALS"
- Select "OAuth client ID"
- Application type: "Web application"
- Name: `ClarityMD Web Client`
- **Authorized JavaScript origins**: Add these exactly:
  ```
  http://localhost:3000
  http://localhost:5000
  ```
- **Authorized redirect URIs**: Add this:
  ```
  http://localhost:3000
  ```
- Click "CREATE"

### Step 5: Copy Your Credentials
You'll see a popup with:
- **Client ID**: `123456789-abc...xyz.apps.googleusercontent.com`
- **Client Secret**: `GOCSPX-abc...xyz`

**COPY THESE!** You'll need them in the next step.

---

## 📝 Update Your .env Files

### Backend (.env):
```bash
cd /Users/madhav/Documents/HackHarvard
nano backend/.env
```

Replace these lines:
```bash
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

With your actual credentials:
```bash
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-aBcDeFgHiJkLmNoPqRsT
```

### Frontend (.env):
```bash
nano frontend/.env
```

Replace this line:
```bash
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
```

With your actual Client ID:
```bash
REACT_APP_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
```

---

## 🔄 Restart Your Servers

```bash
./stop.sh
./start.sh
```

---

## ✅ Test It

1. Open http://localhost:3000
2. Click "Sign in with Google"
3. You should see Google's real login screen!
4. ✅ Success!

---

## 🐛 Troubleshooting

### Still getting 403?
- Make sure you saved the .env files
- Make sure you restarted BOTH frontend and backend
- Check that Client ID has no extra spaces
- Try in an incognito/private window

### "redirect_uri_mismatch"?
- Add `http://localhost:3000` to Authorized redirect URIs in Google Console

### Can't find credentials?
- Go to: https://console.cloud.google.com/apis/credentials
- Click on your OAuth client name
- You'll see the Client ID and can reset the Secret if needed

---

## 📌 Quick Reference

**Google Cloud Console**: https://console.cloud.google.com/apis/credentials

**Files to Edit**:
- `backend/.env` → GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
- `frontend/.env` → REACT_APP_GOOGLE_CLIENT_ID

**Restart Command**: `./stop.sh && ./start.sh`

---

**You MUST use real credentials from Google Cloud Console - placeholders won't work!**

