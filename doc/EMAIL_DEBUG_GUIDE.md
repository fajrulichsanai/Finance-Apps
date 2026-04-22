# Email Rate Limit Error - Debugging Guide

## What Just Changed

I've added **detailed console logging** at every step of the email flow. Now when you try to signup, you'll see exactly where the error is coming from.

## How to Debug

### Step 1: Open Browser Console
1. Open your app: `http://localhost:3000/register`
2. Open Developer Tools: `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
3. Click on the **Console** tab
4. Keep this open while testing

### Step 2: Try Signup
1. Fill in the registration form with test credentials
2. Click "Sign Up"
3. Look at the console - you'll see detailed logs

## What to Look For

### ✅ SUCCESS Flow (What Should Happen)
```
📝 [Auth] Signing up...
🔍 [Auth] Starting signup with email: test@example.com
📊 [Auth] Signup response: {hasError: false, hasUser: true, errorMsg: undefined}
✅ [Auth] User created, now sending confirmation email via Resend...
📧 [Resend] Calling /api/auth/send-confirmation-email with: {email: "test@example.com", name: "test"}
[Server logs]
📥 [API] POST /api/auth/send-confirmation-email - Request received
📊 [API] Request body: {email: "test@example.com", name: "test", linkProvided: true}
📧 [API] Calling sendConfirmationEmail...
📧 [Resend] Attempting to send confirmation email to: test@example.com
🔑 [Resend] API Key configured: true
📤 [Resend] Sender email: fajrulichsan0208@gmail.com
📤 [Resend] Calling resend.emails.send()...
📊 [Resend] Response received: {hasId: true, hasError: false}
✅ [Resend] Confirmation email sent successfully: {messageId: "...", to: "test@example.com"}
[Browser continues]
📊 [Resend] API Response Status: 200
✅ [Auth] Confirmation email sent via Resend successfully: {success: true, message: "Confirmation email sent successfully"}
```

### ❌ FAILURE Scenarios

#### Scenario 1: "email rate limit exceeded" at SIGNUP (Supabase error)
```
📝 [Auth] Signing up...
🔍 [Auth] Starting signup with email: test@example.com
❌ [Auth] Sign up error - DETAILED: {
  message: "email rate limit exceeded",
  code: "...",
  status: 429,
  fullError: {...}
}
```
**This means:** Supabase is still trying to send emails automatically. Check `enable_confirmations` in `supabase/config.toml`

#### Scenario 2: "Invalid API key" from Resend
```
❌ [Resend] Confirmation email error - DETAILED: {
  code: "invalid_api_key",
  message: "Invalid API key",
  fullError: {...}
}
```
**Fix:** Check `.env.local` - verify `RESEND_API_KEY` is correct

#### Scenario 3: API endpoint not reachable
```
❌ [Auth] Error sending confirmation email - DETAILED: {
  message: "fetch failed",
  type: "TypeError",
  stack: "..."
}
```
**Fix:** Make sure dev server is running with `npm run dev`

#### Scenario 4: No logs appear at all
```
(No console output)
```
**This means:** JavaScript isn't running. Check if there's a compile error or if page didn't load properly

## What to Check

### Check 1: Supabase Email Confirmation Setting
Open `/supabase/config.toml` and look for:
```toml
[auth.email]
enable_confirmations = false
```
Should be **false** (it is currently)

### Check 2: Environment Variables
Make sure `.env.local` has:
```env
RESEND_API_KEY=re_MDjLFQhk_86WSbfYwFs6AQLuiHJpRi2N3
NEXT_PUBLIC_SENDER_EMAIL=fajrulichsan0208@gmail.com
```

### Check 3: Server Logs
Open another terminal tab and run:
```bash
npm run dev
```
Keep this window open - you'll see server-side logs there too

### Check 4: Network Tab
1. In DevTools, click **Network** tab
2. Try signup
3. Look for requests to `/api/auth/send-confirmation-email`
4. Click on it to see:
   - Request payload
   - Response status (should be 200)
   - Response body

## Report Your Findings

After testing, look for:

1. **The exact error message** (copy from console)
2. **At which stage it fails:**
   - At signup? (Supabase error)
   - At email send? (Resend error)
   - At API call? (Network error)
3. **Environment variables** are correctly set

## Quick Fixes to Try

### If Still Getting "email rate limit exceeded":

**Option 1:** Disable Supabase auto-emails
```toml
# supabase/config.toml
[auth.email]
enable_confirmations = false  # Make sure this is false
```

**Option 2:** Check for duplicate signups
The `max_frequency = "1s"` rate limit might still apply. Try waiting 1 second between attempts.

**Option 3:** Reset by changing email
Try testing with a different test email address.

## Debug Command

Run this in browser console to check current setup:
```javascript
console.log('API Key:', process.env.RESEND_API_KEY ? 'Configured' : 'Missing');
console.log('Sender Email:', process.env.NEXT_PUBLIC_SENDER_EMAIL);
console.log('App URL:', window.location.origin);
```

---

**Send me these details and I'll fix it:**
1. Complete console output (copy all logs)
2. The exact error message
3. Screenshots of the Network tab (if applicable)
