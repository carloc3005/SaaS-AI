## Debug Steps for Agent Not Joining

### 1. Check Stream Video Webhook Configuration
1. Go to [Stream Video Dashboard](https://dashboard.getstream.io/)
2. Select your project
3. Navigate to **Webhooks** section
4. Ensure webhook URL is set to: `https://illustrious-moonbeam-62b25d.netlify.app/api/webhook`
5. Ensure these events are enabled:
   - `call.session_started`
   - `call.ended`
   - `call.session_participant_left`

### 2. Test Manual Agent Join
1. Create a meeting in your app
2. Join the meeting
3. In the call interface, click the "Add Agent" button
4. Check browser console for any errors

### 3. Test API Directly
Use this PowerShell command to test the agent join API:

```powershell
$body = @{
    meetingId = "YOUR_MEETING_ID_HERE"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://illustrious-moonbeam-62b25d.netlify.app/api/force-agent-join" -Method POST -Body $body -ContentType "application/json"
```

### 4. Check Netlify Function Logs
```bash
npx netlify logs:functions
```

### 5. Common Issues:
- **No agents created**: Make sure you've created an agent first
- **Webhook not configured**: Stream Video dashboard webhook URL
- **Meeting not active**: Agent only joins when session starts
- **OpenAI API limits**: Check if API key has credits/usage limits

### 6. Verify Environment Variables
All these should be set in Netlify:
- ✅ `OPENAI_API_KEY`
- ✅ `STREAM_VIDEO_SECRET_KEY`
- ✅ `NEXT_PUBLIC_STREAM_VIDEO_API_KEY`

### 7. Test Locally First
```bash
npm run dev
# Test locally at http://localhost:3000
```
