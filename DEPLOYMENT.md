# 🚀 Deployment Instructions

## ⚠️ IMPORTANT: Environment Variables Required

Deployment to Vercel failed karena environment variables belum di-set. Ini **NORMAL** dan **EXPECTED**.

## 📋 Steps untuk Deploy ke Vercel

### 1. Setup Environment Variables di Vercel

#### Option A: Via Vercel Dashboard

1. **Buka Vercel Dashboard**: https://vercel.com/dashboard
2. **Pilih Project**: `finance-app-nextjs`
3. **Settings → Environment Variables**
4. **Add variables berikut:**

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH
SUPABASE_SERVICE_ROLE_KEY=sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz
```

**Note:** Untuk production, gunakan Supabase Cloud credentials, bukan local!

#### Option B: Via Vercel CLI

```bash
# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY

# Deploy lagi setelah env vars set
vercel --prod
```

### 2. Setup Supabase Cloud (Recommended untuk Production)

#### A. Create Supabase Project

1. **Signup/Login**: https://supabase.com
2. **New Project**:
   - Organization: Your org
   - Name: `finance-app`
   - Database Password: [strong password]
   - Region: Closest to users

3. **Wait for Setup** (~2 minutes)

#### B. Get Credentials

1. **Settings → API**
2. **Copy:**
   - Project URL: `https://[project-id].supabase.co`
   - Anon (public) key: `eyJ...`
   - Service role key: `eyJ...`

3. **Update Vercel Environment Variables** dengan credentials di atas

#### C. Enable Google OAuth (Optional)

1. **Authentication → Providers → Google**
2. **Enable Google**
3. **Paste:**
   - Client ID: [from Google Cloud]
   - Client Secret: [from Google Cloud]
4. **Redirect URL:** `https://[project-id].supabase.co/auth/v1/callback`

### 3. Update Google OAuth Redirect URIs

Jika menggunakan Google OAuth, tambahkan production URIs:

**Google Cloud Console → Credentials → OAuth client ID:**

```
Authorized redirect URIs:
- http://127.0.0.1:54321/auth/v1/callback     (local)
- http://localhost:3000/auth/callback          (local)
- https://[vercel-domain].vercel.app/auth/callback  (production)
- https://[project-id].supabase.co/auth/v1/callback (production)
```

### 4. Deploy ke Vercel

```bash
# After env vars are set
git push
vercel --prod
```

Atau trigger deployment via Vercel Dashboard.

---

## 🔍 Troubleshooting

### Error: "URL and API key are required"

**Solution:** Environment variables belum di-set di Vercel.
1. Set env vars di Vercel Dashboard
2. Trigger new deployment

### Error: "Invalid API key"  

**Solution:** API key salah atau typo.
1. Double-check Supabase Dashboard → Settings → API
2. Copy paste lagi (jangan ketik manual)
3. Make sure no trailing spaces

### Google OAuth tidak jalan di production

**Solution:** Redirect URIs tidak match.
1. Check Google Cloud Console → Credentials
2. Add Vercel production URL
3. Add Supabase production URL
4. Wait ~5 minutes untuk propagate

---

## ✅ Verification Checklist

Setelah deploy, test semua features:

- [ ] Login page accessible
- [ ] Register page accessible
- [ ] Email/password registration works
- [ ] Email/password login works
- [ ] Google OAuth works (if configured)
- [ ] Dashboard shows after login
- [ ] Logout works
- [ ] Route protection works (redirect to login)
- [ ] PWA install works on mobile
- [ ] Dark mode works
- [ ] Session persists after close/reopen browser

---

## 📊 Current Status

**Local Development:** ✅ WORKING
- Supabase local running
- All auth flows working
- PWA working

**Production Deployment:** ⚠️ PENDING
- Needs environment variables in Vercel
- Needs Supabase Cloud setup (optional, bisa pakai local untuk testing)
- Needs Google OAuth setup (optional)

---

## 🎯 Quick Deploy (Using Current Local Setup)

Jika ingin cepat deploy untuk testing (tanpa setup Supabase Cloud):

```bash
# Set local Supabase credentials di Vercel
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Enter: http://127.0.0.1:54321

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production  
# Enter: sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH

vercel env add SUPABASE_SERVICE_ROLE_KEY production
# Enter: sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz

# Deploy
vercel --prod
```

**⚠️ WARNING:** Ini hanya untuk testing! Production app tidak bisa connect ke local Supabase di laptop Anda. Untuk production yang benar, setup Supabase Cloud.

---

## 🚀 Recommended Production Setup

1. **Create Supabase Cloud project** (gratis tier tersedia)
2. **Copy production credentials** ke Vercel
3. **Setup Google OAuth** dengan production URLs
4. **Deploy ke Vercel**
5. **Test semua features**
6. **Monitor errors** via Vercel logs

**Total time:** ~15-30 minutes untuk complete setup

---

## 📞 Need Help?

- **Supabase Issues:** https://supabase.com/docs
- **Vercel Issues:** https://vercel.com/docs
- **Google OAuth:** https://console.cloud.google.com

---

**Status:** ✅ Code ready, ⏳ Waiting for env vars
