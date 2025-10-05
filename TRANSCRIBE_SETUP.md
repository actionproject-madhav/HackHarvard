#  Transcribe Page - Setup Guide

## Overview
The Transcribe page bridges the communication gap between doctors and patients using:
- **Speech Recognition** (Web Speech API)
- **Gemini AI** (for simplification/translation)
- **Eleven Labs** (for natural voice output)

---

## 🔧 Setup Instructions

### 1. **Get Eleven Labs API Key**

1. Go to [Eleven Labs](https://elevenlabs.io/)
2. Sign up for a free account
3. Navigate to **Profile Settings** → **API Keys**
4. Copy your API key

### 2. **Add to Environment Variables**

Add to `frontend/.env`:
```bash
REACT_APP_ELEVEN_LABS_API_KEY=your_eleven_labs_api_key_here
```

### 3. **Verify Gemini API is Working**

The Transcribe page uses the existing Gemini chatbot endpoint:
- Endpoint: `/api/gemini/chat`
- Already configured in `backend/routes/gemini.py`
- No additional setup needed!

---

## 🎯 How It Works

### **Flow Diagram:**
```
Doctor speaks (English) 
    ↓
Web Speech API (records audio → converts to text)
    ↓
Original text displayed
    ↓
User selects mode: [Simplify] or [Translate]
    ↓
Text sent to Gemini API with appropriate prompt
    ↓
Gemini processes and returns simplified/translated text
    ↓
Processed text displayed on screen overlay
    ↓
Eleven Labs converts text to natural speech
    ↓
Audio plays automatically
```

---

## 📋 Features

### **1. Simplify Mode**
- Converts complex medical jargon to simple language
- Uses everyday examples
- Removes technical terms
- Perfect for patients with no medical background

**Example:**
- **Doctor**: "You have hypertension with a systolic reading of 160"
- **Simplified**: "Your blood pressure is high. The top number is 160, which is higher than the healthy range of 120."

### **2. Translate Mode**
- Translates medical instructions to 5 languages:
  - 🇪🇸 Spanish
  - 🇨🇳 Chinese
  - 🇮🇳 Hindi
  - 🇸🇦 Arabic
  - 🇫🇷 French
- Maintains medical accuracy
- Patient-friendly language

---

## 🎨 UI Features

### **Video Interface**
- Doctor avatar placeholder
- Real-time audio visualizer (animated waves)
- Status indicators:
  - 🔴 **Listening** - Recording doctor's voice
  - 🟡 **Processing** - Sending to Gemini AI
  - 🟢 **Speaking** - Playing Eleven Labs audio

### **Text Overlay**
- Appears at bottom of video interface
- Shows both original and processed text
- Large, readable font
- Dark overlay for contrast

### **Conversation History**
- Saves all doctor-patient exchanges
- Timestamps for each interaction
- Shows both original and processed versions
- Can be cleared anytime

---

## 🔐 Browser Compatibility

### **Speech Recognition:**
- ✅ Chrome (Desktop & Mobile)
- ✅ Edge
- ✅ Safari (iOS 14.5+)
- ❌ Firefox (not supported)

**Note**: If browser doesn't support speech recognition, user will see an alert.

---

## 🚀 Usage Instructions

### **For Patients:**

1. **Navigate to Transcribe Page**
   - Go to `/transcribe` route
   - Or add a link in the navbar

2. **Select Mode**
   - Click **Simplify** to convert medical jargon
   - Click **Translate** to translate to another language

3. **If Translating, Select Language**
   - Choose from 5 languages
   - Language buttons appear when Translate mode is selected

4. **Start Listening**
   - Click the big **"Start Listening"** button
   - Allow microphone access when prompted

5. **Doctor Speaks**
   - Doctor gives instructions/prescription
   - Text appears in real-time
   - Gemini processes automatically
   - Simplified/translated version appears on screen
   - Eleven Labs reads it aloud

6. **Review History**
   - Scroll down to see all previous exchanges
   - Each entry shows timestamp, original, and processed text

---

## 🎤 Eleven Labs Voice Settings

Current configuration:
```javascript
{
  voice_id: '21m00Tcm4TlvDq8ikWAM', // Rachel (default female voice)
  model_id: 'eleven_monolingual_v1',
  voice_settings: {
    stability: 0.5,      // Natural variation
    similarity_boost: 0.5 // Voice consistency
  }
}
```

### **Change Voice:**
1. Go to [Eleven Labs Voice Library](https://elevenlabs.io/voice-library)
2. Choose a voice
3. Copy the Voice ID
4. Replace `21m00Tcm4TlvDq8ikWAM` in `Transcribe.tsx` line 181

---

## 🐛 Troubleshooting

### **"Speech recognition not supported"**
- Use Chrome or Edge browser
- Update to latest browser version

### **No audio playing**
- Check Eleven Labs API key in `.env`
- Verify API key is valid
- Check browser console for errors

### **Gemini not processing**
- Verify backend is running
- Check `/api/gemini/chat` endpoint is working
- Test with the chatbot first

### **Microphone not working**
- Allow microphone permissions in browser
- Check system microphone settings
- Try refreshing the page

---

## 💡 Customization

### **Change Prompts:**

Edit prompts in `Transcribe.tsx` around line 115:

**Simplify Prompt:**
```typescript
prompt = `You are a medical interpreter...
Simplify the following medical text...`;
```

**Translate Prompt:**
```typescript
prompt = `You are a medical translator...
Translate to ${language}...`;
```

### **Add More Languages:**

1. Add to `languages` array (line 31):
```typescript
{ code: 'de', name: 'German', flag: '🇩🇪' }
```

2. Update Gemini prompt to support new language

---

## 📊 API Costs

### **Eleven Labs:**
- Free tier: 10,000 characters/month
- Paid: $5/month for 30,000 characters
- Each sentence ≈ 50-100 characters

### **Gemini:**
- Already configured in your backend
- No additional cost

---

## 🎯 Next Steps

1. **Add to Navbar:**
   - Add "Transcribe" link to main navigation
   - Icon: 🎙️ or microphone SVG

2. **Test Flow:**
   - Test with real medical phrases
   - Verify all languages work
   - Check audio quality

3. **Optimize:**
   - Add loading states
   - Improve error handling
   - Add retry logic

---

## 📝 Files Created

1. **Frontend:**
   - `/frontend/src/pages/Transcribe.tsx` (524 lines)
   - `/frontend/src/styles/Transcribe.css` (658 lines)
   - Route added to `App.tsx`

2. **Backend:**
   - Uses existing `/api/gemini/chat` endpoint
   - No new backend files needed!

---

**Status**: ✅ COMPLETE
**Access**: Navigate to `/transcribe` after login
**Dependencies**: Eleven Labs API key required

---

## 🌟 Key Benefits

1. **Breaks Language Barriers** - Translates to 5 languages
2. **Simplifies Medical Jargon** - Makes complex terms understandable
3. **Audio + Visual** - Both text overlay and voice output
4. **Conversation History** - Review past exchanges
5. **Real-time Processing** - Instant feedback
6. **Professional UI** - Clean, medical-grade interface

**Perfect for bridging the doctor-patient communication gap! 🏥**
