# 🚀 Quick Deploy to Vercel with Supabase Cloud

## ✅ Environment Variables yang Perlu Di-Set

Supabase Cloud credentials sudah ready. Sekarang perlu di-set di Vercel.

### Via Vercel Dashboard (RECOMMENDED - TERCEPAT)

1. **Buka Vercel Dashboard**: https://vercel.com/dashboard
2. **Pilih project**: `finance-app-nextjs`
3. **Settings → Environment Variables**
4. **Add 2 variables ini:**

```env
NEXT_PUBLIC_SUPABASE_URL
Value: https://otxperiyluhgmnnhvuqp.supabase.co
Environment: Production, Preview, Development (check all)

NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90eHBlcml5bHVoZ21ubmh2dXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNzMwNzIsImV4cCI6MjA5MDk0OTA3Mn0.Pd7Sw0WrTbObVPguJb1UltDI_q7Ft-ZuYNK-seRtvxk
Environment: Production, Preview, Development (check all)
```

5. **Click "Save"**
6. **Trigger new deployment** (Deployments tab → Click "..." → Redeploy)

### Via Vercel CLI (Alternative)

```bash
# Set URL
echo "https://otxperiyluhgmnnhvuqp.supabase.co" | vercel env add NEXT_PUBLIC_SUPABASE_URL production
echo "https://otxperiyluhgmnnhvuqp.supabase.co" | vercel env add NEXT_PUBLIC_SUPABASE_URL preview
echo "https://otxperiyluhgmnnhvuqp.supabase.co" | vercel env add NEXT_PUBLIC_SUPABASE_URL development

# Set Anon Key
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90eHBlcml5bHVoZ21ubmh2dXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNzMwNzIsImV4cCI6MjA5MDk0OTA3Mn0.Pd7Sw0WrTbObVPguJb1UltDI_q7Ft-ZuYNK-seRtvxk" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90eHBlcml5bHVoZ21ubmh2dXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNzMwNzIsImV4cCI6MjA5MDk0OTA3Mn0.Pd7Sw0WrTbObVPguJb1UltDI_q7Ft-ZuYNK-seRtvxk" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90eHBlcml5bHVoZ21ubmh2dXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNzMwNzIsImV4cCI6MjA5MDk0OTA3Mn0.Pd7Sw0WrTbObVPguJb1UltDI_q7Ft-ZuYNK-seRtvxk" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY development

# Deploy
vercel --prod
```

---

## ✅ Status Saat Ini

- ✅ .env.local sudah updated dengan Supabase Cloud credentials
- ✅ Build test berhasil (npm run build)
- ✅ Local development siap (npm run dev)
- ⏳ Environment variables perlu di-set di Vercel
- ⏳ Deploy to production pending

---

## 🧪 Test Local Dulu

```bash
npm run dev
```

App akan connect ke Supabase Cloud. Test:
1. Register akun baru
2. Login
3. Check session persistence
4. Logout

Jika semua OK, baru deploy to Vercel!

---

## 🎯 Quick Commands

```bash
# Test local
npm run dev

# Build test
npm run build

# Deploy (after env vars set)
vercel --prod
```

---

## 📊 Supabase Cloud Info

**Project URL:** https://otxperiyluhgmnnhvuqp.supabase.co
**Dashboard:** https://supabase.com/dashboard/project/otxperiyluhgmnnhvuqp

**Auth Setup Checklist:**
- [ ] Enable Email/Password provider (Settings → Auth → Providers)
- [ ] Enable Google OAuth (optional)
- [ ] Configure site URL (Settings → Auth → URL Configuration)
- [ ] Add redirect URLs untuk Vercel domain

---

## 🔧 Supabase Dashboard Setup

### 1. Site URL Configuration

**Settings → Authentication → URL Configuration:**

```
Site URL: https://your-app.vercel.app
```

### 2. Redirect URLs (for OAuth)

**Add these URLs:**
```
https://your-app.vercel.app/auth/callback
http://localhost:3000/auth/callback (for local dev)
```

### 3. Email Templates (optional)

Customize email templates untuk:
- Confirmation email
- Password reset
- Magic link

---

## ⚡ Next Steps

1. **Set env vars di Vercel**
2. **Deploy**: `vercel --prod`
3. **Test production app**
4. **Setup Google OAuth** (optional)
5. **Configure Supabase site URL**

---

Done! 🎉
