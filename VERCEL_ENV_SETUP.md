# Vercel Environment Variables Setup

## Required Environment Variables untuk Push Notifications

Tambahkan environment variables berikut di Vercel Dashboard:

### 1. Buka Vercel Project Settings
https://vercel.com/fajrul-ichsan-kamils-projects/finance-app-nextjs/settings/environment-variables

### 2. Tambahkan Variables Berikut:

**VAPID Keys (sudah ada di `.env.local`):**

```bash
# Public Key
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BL5DAn49PgD7apq0dMp7bOCFUxczdnjAHr1zpWHiTMTYFdk5Xb13njyv812kzqK3dg0ciKaTcWpnW1ESOzWyDr0

# Private Key
VAPID_PRIVATE_KEY=LbXyzYJx4SBOSjmkNpeSj79zsV2r8mdKilj-pxDcyZE

# Email
VAPID_EMAIL=mailto:admin@financeapp.com

# Service Role Key (untuk API routes)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90eHBlcml5bHVoZ21ubmh2dXFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM3MzA3MiwiZXhwIjoyMDkwOTQ5MDcyfQ.d5Vc4xWJRsCbPVTFeJyNGMvkp0o5K4nLYIwbqgYnqc8
```

### 3. Environment Scope

Untuk masing-masing variable, pilih scope:
- ✅ Production
- ✅ Preview  
- ✅ Development

### 4. Redeploy

Setelah semua variable ditambahkan, klik **"Redeploy"** pada latest deployment.

---

## Quick Add (Copy-Paste ke Vercel CLI)

Atau jalankan command ini untuk add semua sekaligus:

```bash
vercel env add NEXT_PUBLIC_VAPID_PUBLIC_KEY production
# Paste: BL5DAn49PgD7apq0dMp7bOCFUxczdnjAHr1zpWHiTMTYFdk5Xb13njyv812kzqK3dg0ciKaTcWpnW1ESOzWyDr0

vercel env add VAPID_PRIVATE_KEY production
# Paste: LbXyzYJx4SBOSjmkNpeSj79zsV2r8mdKilj-pxDcyZE

vercel env add VAPID_EMAIL production
# Paste: mailto:admin@financeapp.com

vercel env add SUPABASE_SERVICE_ROLE_KEY production
# Paste: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90eHBlcml5bHVoZ21ubmh2dXFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM3MzA3MiwiZXhwIjoyMDkwOTQ5MDcyfQ.d5Vc4xWJRsCbPVTFeJyNGMvkp0o5K4nLYIwbqgYnqc8
```

Kemudian redeploy:
```bash
vercel deploy --prod
```
