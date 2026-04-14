# Web Push Notifications - Quick Setup Guide

## 🚀 Quick Start (5 Menit)

### 1. Install Dependencies

```bash
npm install web-push
npm install --save-dev @types/web-push
```

### 2. Generate VAPID Keys

```bash
npx web-push generate-vapid-keys
```

Copy output dan simpan di `.env.local`:

```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BK...xyz
VAPID_PRIVATE_KEY=abc...123
VAPID_EMAIL=mailto:admin@financeapp.com
```

### 3. Apply Database Migration

```bash
supabase db push
```

Atau manual:
```bash
psql -U postgres -d your_db -f supabase/migrations/006_add_push_notifications.sql
```

### 4. Test di Browser

1. Start dev server:
   ```bash
   npm run dev
   ```

2. Open browser ke `http://localhost:3000`

3. Buka DevTools Console

4. Test Service Worker registration:
   ```javascript
   navigator.serviceWorker.register('/sw.js')
     .then(reg => console.log('SW registered:', reg))
     .catch(err => console.error('SW error:', err));
   ```

### 5. Add Component ke Page

File: `/app/profile/page.tsx`

```typescript
import PushNotificationManager from '@/components/features/notification/PushNotificationManager';
import { createClient } from '@/lib/supabase/server';

export default async function ProfilePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  return (
    <div className="p-6">
      <PushNotificationManager userId={user.id} />
    </div>
  );
}
```

### 6. Test Send Notification

Open terminal dan test API:

```bash
curl -X POST http://localhost:3000/api/push/send \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "your-user-id-here",
    "payload": {
      "title": "Test Push",
      "body": "Hello World!",
      "data": { "url": "/dashboard" }
    }
  }'
```

---

## ✅ Checklist

- [ ] ✅ Dependencies installed
- [ ] ✅ VAPID keys generated & added to `.env.local`
- [ ] ✅ Database migration applied
- [ ] ✅ Service Worker file created (`/public/sw.js`)
- [ ] ✅ Component created (`PushNotificationManager.tsx`)
- [ ] ✅ API route created (`/app/api/push/send/route.ts`)
- [ ] ✅ Manifest updated dengan `gcm_sender_id`
- [ ] ✅ Test di localhost
- [ ] ✅ Test di iOS (production only)
- [ ] ✅ Test di Android

---

## 🧪 Testing

### Local Testing (Desktop)

1. Buka http://localhost:3000
2. Klik "Aktifkan Notifikasi"
3. Allow permission
4. Open terminal:
   ```bash
   curl -X POST http://localhost:3000/api/push/send \
     -H "Content-Type: application/json" \
     -d '{
       "userId": "user-uuid",
       "payload": {
         "title": "Test",
         "body": "Success!"
       }
     }'
   ```
5. ✅ Notification should appear

### iOS Testing (Production Only)

⚠️ **IMPORTANT**: Push notifications di iOS **hanya berfungsi di production** (HTTPS) dan **PWA harus sudah di-install**.

1. Deploy ke Vercel/production
2. Buka di Safari iOS
3. Install PWA (Add to Home Screen)
4. Buka dari Home Screen
5. Enable notifications
6. Send test push via API
7. ✅ Notification muncul

### Android Testing

1. Open di Chrome Android
2. Install PWA via banner
3. Enable notifications
4. Send test push
5. ✅ Notification muncul

---

## 🔧 Troubleshooting

### ❌ "Service Worker registration failed"

**Solusi:**
```javascript
// Check if already registered
navigator.serviceWorker.getRegistrations().then(regs => {
  console.log('Registrations:', regs);
  // Unregister all
  regs.forEach(reg => reg.unregister());
});
```

### ❌ "Push not supported"

**Check:**
- HTTPS required (atau localhost)
- Browser compatibility
- iOS: PWA must be installed

### ❌ "Missing VAPID keys"

**Check `.env.local`:**
```bash
cat .env.local | grep VAPID
```

### ❌ Database error saat save subscription

**Check RLS:**
```sql
SELECT * FROM pg_policies WHERE tablename = 'push_subscriptions';
```

---

## 📱 Platform Compatibility

| Platform | Support | Notes |
|----------|---------|-------|
| Chrome Desktop | ✅ Full | All features work |
| Edge Desktop | ✅ Full | All features work |
| Firefox Desktop | ✅ Full | All features work |
| Safari Desktop | ✅ Full | macOS 13+ |
| Chrome Android | ✅ Full | All features work |
| Safari iOS | ✅ Limited | iOS 16.4+, **PWA install required** |
| Samsung Browser | ✅ Full | v14+ |

---

## 🎯 Next Steps

1. **Add to Landing Page**: Promosikan fitur push di dashboard
2. **Budget Alerts**: Auto-send saat budget > 80%
3. **Daily Summary**: Cron job untuk daily recap
4. **Transaction Created**: Auto-notify setelah transaksi
5. **Reminder**: Weekly financial review reminder

---

## 📚 Documentation

- Full guide: `/doc/WEB_PUSH_NOTIFICATIONS_GUIDE.md`
- Usage examples: `/lib/services/pushNotifications.ts`
- Types: `/types/index.ts`
