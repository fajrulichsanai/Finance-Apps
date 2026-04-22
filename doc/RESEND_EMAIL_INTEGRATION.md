# Resend Email Integration Guide

## Overview

This document explains how Resend has replaced Supabase's built-in email functionality for the Finance App. All transactional emails (confirmation, password reset, etc.) are now sent through Resend instead of Supabase.

## Why Resend?

**Benefits:**
- ✅ **Free Tier Optimization**: Resend offers generous free tier (100 emails/day) 
- ✅ **Better Email Deliverability**: Professional email sending infrastructure
- ✅ **No Rate Limiting**: Eliminates "email rate limit exceeded" errors
- ✅ **Custom Branding**: Full control over email templates
- ✅ **Detailed Analytics**: Track email opens, clicks, bounces
- ✅ **Better Support**: Dedicated support for transactional emails

## Architecture

### Components

1. **Email Service** (`lib/services/email.ts`)
   - Core email sending logic using Resend SDK
   - Pre-built templates for confirmation and password reset emails
   - Centralized email configuration

2. **API Endpoints**
   - `POST /api/auth/send-confirmation-email` - Sends signup confirmation
   - `POST /api/auth/send-password-reset-email` - Sends password reset link

3. **Auth Provider** (`providers/AuthProvider.tsx`)
   - Modified `signUpWithEmail()` to call Resend after signup
   - Automatically sends confirmation email with styled template

## Setup Instructions

### 1. Install Dependencies

```bash
npm install resend
```

### 2. Get Resend API Key

1. Sign up at [resend.com](https://resend.com)
2. Go to API Keys section
3. Create a new API key
4. Copy the key to your environment

### 3. Configure Environment Variables

Create/update `.env.local`:

```env
# Resend Configuration
RESEND_API_KEY=re_your_api_key_here
NEXT_PUBLIC_SENDER_EMAIL=noreply@financeapp.com
```

### 4. Verify Sender Domain (Production)

For production, verify your domain in Resend:
1. Add your domain in Resend dashboard
2. Add DNS records (MX, SPF, DKIM)
3. Update `NEXT_PUBLIC_SENDER_EMAIL` to your domain email

For development, use the default `noreply@resend.dev` (provided by Resend).

## Email Types

### 1. Confirmation Email

**When sent:** After user signs up
**Template:** Professional HTML with:
- Welcome message
- Confirmation button
- 24-hour expiry notice
- Call-to-action styling

**API:** `POST /api/auth/send-confirmation-email`

```typescript
const response = await fetch('/api/auth/send-confirmation-email', {
  method: 'POST',
  body: JSON.stringify({
    email: 'user@example.com',
    confirmationLink: 'https://app.com/auth/callback?token=xxx',
    name: 'John Doe'
  })
});
```

### 2. Password Reset Email

**When sent:** When user requests password reset
**Template:** Professional HTML with:
- Reset button
- 1-hour expiry notice
- Security notice

**API:** `POST /api/auth/send-password-reset-email`

```typescript
const response = await fetch('/api/auth/send-password-reset-email', {
  method: 'POST',
  body: JSON.stringify({
    email: 'user@example.com',
    resetLink: 'https://app.com/auth/reset?token=xxx',
    name: 'John Doe'
  })
});
```

## Email Templates

All email templates are defined in `lib/services/email.ts`:

- **Confirmation Email**: Modern design with gradient header, clear CTA
- **Password Reset Email**: Warning-style design for security context
- **Generic Email**: Base template for custom emails

### Customizing Templates

Edit the HTML in `lib/services/email.ts`:

```typescript
const html = `
  <!-- Your custom HTML here -->
`;
```

Resend supports:
- ✅ HTML/CSS styling
- ✅ Responsive design
- ✅ Images and links
- ✅ Dynamic content

## Monitoring & Debugging

### View Sent Emails

```bash
# Development - Check Supabase logs
supabase functions list

# Production - Check Resend dashboard
# https://resend.com/emails
```

### Debugging

Check server logs for:
```
✅ [Resend] Confirmation email sent to: user@example.com
❌ [Resend] Confirmation email error: Invalid API key
```

## Migration from Supabase Email

### What Changed

| Feature | Before (Supabase) | After (Resend) |
|---------|------------------|----------------|
| Email Sending | Built-in auth | Resend SDK + API routes |
| Rate Limits | Supabase free tier (limited) | Resend generous free tier |
| Templates | Limited customization | Full HTML control |
| Monitoring | Supabase dashboard | Resend dashboard + API |
| Cost | Included in Supabase | Free up to 100/day |

### How It Works

1. **User Signs Up** → Supabase creates user account
2. **Confirmation Trigger** → `signUpWithEmail()` calls Resend endpoint
3. **Email Sent** → Resend delivers via professional infrastructure
4. **User Confirms** → Clicks link in email to confirm account

## Cost Analysis

### Resend Pricing (Free Tier)
- 100 emails/day
- Unlimited contacts
- Basic analytics
- Standard support

### Expected Usage
- ~50 signups/month = ~1.67/day ✅ Well within limits
- Emergency password resets = ~1-2/day ✅ 
- Future notifications = ~10-20/day ✅

**Cost: $0/month** (Free tier sufficient for MVP)

## Troubleshooting

### "Missing required fields" Error
```
❌ Solution: Ensure email, confirmationLink, and name are provided in request
```

### "Invalid API key" Error
```
❌ Solution: Check RESEND_API_KEY is correctly set in environment
```

### "Invalid email format" Error
```
❌ Solution: Validate email before sending - must be valid RFC 5322 format
```

### Email Not Sent
1. Check API key in `.env.local`
2. Verify sender domain is verified (production)
3. Check Resend dashboard for bounces
4. Check browser console for fetch errors

## Future Enhancements

- [ ] Add email verification tokens in database
- [ ] Implement email templates as reusable React components
- [ ] Add email preview endpoint
- [ ] Implement bulk email sending for notifications
- [ ] Add email preference center
- [ ] Track email engagement metrics

## References

- [Resend Documentation](https://resend.com/docs)
- [Resend API Reference](https://resend.com/docs/api-reference)
- [Email Best Practices](https://resend.com/guide)
