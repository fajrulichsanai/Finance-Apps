# Finance App - Setup & Configuration Guide

## 📋 Ringkasan

Finance App adalah aplikasi web modern untuk tracking keuangan dengan:
- ✅ **Supabase Auth** (Email/Password + Google OAuth)
- ✅ **Session Management Efisien** (auto refresh, 7 hari login)
- ✅ **PWA** (installable ke HP)
- ✅ **Dark Mode**
- ✅ **Route Protection** (middleware)

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Supabase Local

```bash
# Install Supabase CLI (jika belum)
npm install -g supabase

# Jalankan Supabase local
npx supabase start
```

Setelah start, Anda akan mendapat:
- API URL: `http://127.0.0.1:54321`
- Anon key: `[your-anon-key]`
- Service role key: `[your-service-role-key]`

### 3. Update .env.local

File `.env.local` sudah ada, pastikan isinya sesuai dengan output `supabase start`:

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

### 4. Run Development Server

```bash
npm run dev
```

Buka: http://localhost:3000

---

## 🔐 Supabase Auth Configuration

### Email/Password Auth (Sudah Aktif)

Email/password auth sudah enabled by default di Supabase local.

### Google OAuth Setup

#### A. Setup Google Cloud Console

1. **Buka Google Cloud Console**: https://console.cloud.google.com

2. **Buat Project Baru** (atau pilih existing):
   - Nama: `Finance App`

3. **Enable Google+ API**:
   - Navigation Menu → APIs & Services → Library
   - Cari "Google+ API" → Enable

4. **Buat OAuth Credentials**:
   - APIs & Services → Credentials
   - Click "Create Credentials" → OAuth client ID
   - Application type: **Web application**
   - Name: `Finance App`
   
5. **Authorized redirect URIs**:
   ```
   http://127.0.0.1:54321/auth/v1/callback
   http://localhost:3000/auth/callback
   ```
   
   Untuk production tambahkan:
   ```
   https://[your-project-id].supabase.co/auth/v1/callback
   https://your-domain.vercel.app/auth/callback
   ```

6. **Copy Client ID & Client Secret**

#### B. Configure Supabase

1. **Buka Supabase Studio** (local): http://127.0.0.1:54323

2. **Authentication → Providers → Google**:
   - Enable Google provider
   - Paste **Client ID**
   - Paste **Client Secret** 
   - Save

3. **Or via CLI**, edit `supabase/config.toml`:

```toml
[auth.external.google]
enabled = true
client_id = "your-client-id.apps.googleusercontent.com"
secret = "your-client-secret"
redirect_uri = "http://127.0.0.1:54321/auth/v1/callback"
```

---

## 📂 Struktur Project

```
app/
├── auth/
│   └── callback/
│       └── route.ts          # OAuth callback handler
├── login/
│   └── page.tsx              # Login page
├── register/
│   └── page.tsx              # Register page
├── page.tsx                  # Main dashboard (protected)
├── layout.tsx                # Root layout with AuthProvider
└── globals.css

lib/
├── supabase/
│   ├── client.ts             # Browser Supabase client
│   ├── server.ts             # Server-side Supabase client
│   └── middleware.ts         # Middleware helper
└── utils.ts

providers/
└── AuthProvider.tsx          # Global auth state & session management

components/
└── PWARegister.tsx           # Service worker registration

middleware.ts                 # Route protection middleware
public/
└── sw.js                     # Service worker for PWA
```

---

## 🔄 Auth Flow

### Login/Register Flow

1. **User mengisi form** → email/password
2. **Click submit** → `signInWithEmail()` atau `signUpWithEmail()`
3. **Supabase Auth** → create session (auto saved in cookies)
4. **AuthProvider** → `onAuthStateChange` detect perubahan
5. **Auto redirect** → ke dashboard (`/`)
6. **Session persist** → ~7 hari (auto refresh token)

### Google OAuth Flow

1. **User click "Sign in with Google"** → `signInWithGoogle()`
2. **Redirect ke Google** → user authorize
3. **Google redirect back** → `/auth/callback?code=xxx`
4. **Callback route** → exchange code for session
5. **Redirect to dashboard** → user logged in
6. **Session persist** → ~7 hari

### Auto Session Management (EFISIEN!)

```typescript
// AuthProvider.tsx - HANYA PANGGIL SEKALI
useEffect(() => {
  // Get initial session (1x saat mount)
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session)
    setUser(session?.user ?? null)
  })

  // Listen for changes (auto refresh token)
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
    }
  )

  return () => subscription.unsubscribe()
}, [])
```

**Benefits:**
- ❌ Tidak perlu manual refresh token
- ❌ Tidak perlu cek session tiap page load
- ✅ Supabase auto refresh sebelum expired
- ✅ Session shared across tabs
- ✅ User login 1x → stay logged in ~7 hari

---

## 🛡️ Route Protection

### Middleware (middleware.ts)

```typescript
// Auto protect semua routes kecuali:
// - /login
// - /register  
// - /auth/* (callback)
// - static files

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

**Flow:**
1. User akses protected route
2. Middleware check session via `getUser()`
3. Jika tidak login → redirect `/login`
4. Jika sudah login → allow access

---

## 📱 PWA Setup

### Manifest (sudah ada di public/manifest.json)

App sudah punya manifest untuk install ke HP.

### Service Worker

1. **File**: `public/sw.js`
2. **Auto register**: via `PWARegister` component di layout
3. **Features**:
   - Offline caching
   - Install prompt
   - Cache static assets

### Install ke HP

**Android:**
1. Buka app di Chrome
2. Menu → "Add to Home screen"

**iOS:**
1. Buka app di Safari
2. Share button → "Add to Home Screen"

---

## 🧪 Testing Auth

### Test Email/Password

1. Register akun baru:
   - Email: `test@example.com`
   - Password: `password123`
   - Name: `Test User`

2. Logout → Login lagi

3. Check session persist → close browser, buka lagi

### Test Google OAuth

1. Click "Sign in with Google"
2. Pilih Google account
3. Auto redirect ke dashboard
4. Check user info di header

### Test Route Protection

1. Logout
2. Coba akses `/` → auto redirect `/login`
3. Login → bisa akses semua pages

---

## 🚢 Deployment

### Vercel Deployment

1. **Push to Git**:
```bash
git add .
git commit -m "Add Supabase auth"
git push
```

2. **Deploy**:
```bash
vercel --prod
```

3. **Update Environment Variables** di Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

4. **Update Google OAuth Redirect URIs**:
   - Add: `https://your-app.vercel.app/auth/callback`
   - Add: `https://[supabase-project].supabase.co/auth/v1/callback`

---

## 🔧 Troubleshooting

### "Invalid login credentials"
- Check email/password benar
- Check Supabase running: `npx supabase status`

### Google OAuth tidak jalan
- Check Client ID & Secret di Supabase Studio
- Check Redirect URI match exactly
- Check Google+ API enabled

### Session tidak persist
- Check browser cookies enabled
- Check `.env.local` variables loaded
- Clear cookies & login lagi

### Middleware loop redirect
- Check matcher config
- Check `/login` dan `/register` excluded
- Check `updateSession()` return response properly

---

## 📚 Best Practices

### ✅ DO

- Gunakan `getSession()` hanya 1x saat app mount
- Gunakan `onAuthStateChange` untuk listen changes
- Let Supabase handle token refresh (automatic)
- Protect routes via middleware
- Store sensitive data di server components

### ❌ DON'T

- Jangan call `getSession()` di tiap component
- Jangan manual refresh token
- Jangan simpan password di state
- Jangan skip middleware untuk sensitive routes
- Jangan hardcode credentials

---

## 🎯 Next Steps

1. **Setup Production Supabase**:
   - Buat project di https://supabase.com
   - Copy production credentials
   - Update env variables

2. **Add Features**:
   - Password reset
   - Email verification
   - User profile update
   - Multi-factor auth

3. **Database Setup**:
   - Create tables (transactions, categories, etc.)
   - Row Level Security (RLS)
   - Database migrations

4. **Analytics**:
   - Track user login/logout
   - Monitor auth errors
   - Session duration metrics

---

## 📞 Support

- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- Google OAuth Guide: https://developers.google.com/identity/protocols/oauth2

---

**Happy Coding! 🚀**
