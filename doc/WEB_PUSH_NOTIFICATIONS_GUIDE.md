# Web Push Notifications Implementation Guide

## 📋 Overview

Panduan lengkap implementasi Web Push Notifications untuk PWA Next.js (App Router) dengan Supabase yang **kompatibel dengan iOS 16.4+ dan Android**.

### ✅ Fitur
- ✅ Push notifications untuk iOS (16.4+) dan Android
- ✅ VAPID authentication
- ✅ Service Worker dengan event handler
- ✅ Subscription management via Supabase
- ✅ API Route untuk trigger notifikasi ke User ID
- ✅ TypeScript full support
- ✅ Cost-efficient (optimized untuk Free Tier)

---

## 🏗️ Arsitektur

```
┌─────────────┐
│   Client    │ 
│  Component  │──[1]──> Register Service Worker
└─────────────┘         Request Permission
      │                 Subscribe to Push
      ▼
┌─────────────┐
│  Service    │──[2]──> Handle Push Events
│   Worker    │         Show Notifications
└─────────────┘         Handle Clicks
      │
      ▼
┌─────────────┐
│  Supabase   │──[3]──> Store Subscription
│   Database  │         (push_subscriptions table)
└─────────────┘
      │
      ▼
┌─────────────┐
│ API Route   │──[4]──> Send Push via web-push
│ /api/push   │         Target specific user_id
└─────────────┘
```

---

## 📦 Dependencies

Install required packages:

```bash
npm install web-push
npm install --save-dev @types/web-push
```

---

## 🔧 Setup

### 1. Generate VAPID Keys

```bash
npx web-push generate-vapid-keys
```

Output:
```
Public Key: BK...xyz (87 characters)
Private Key: abc...123 (43 characters)
```

### 2. Environment Variables

Tambahkan ke `.env.local`:

```env
# Web Push VAPID Keys
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BK...xyz
VAPID_PRIVATE_KEY=abc...123
VAPID_EMAIL=mailto:your-email@example.com
```

⚠️ **PENTING:**
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY` = accessible di client (publik)
- `VAPID_PRIVATE_KEY` = server-only (rahasia)
- `VAPID_EMAIL` = email admin untuk kontak

---

## 🗄️ Database Schema

File: `/supabase/migrations/006_add_push_notifications.sql`

### Cost Efficiency Analysis

✅ **APPROVED**
- **Query Count**: 1-2 queries (insert subscription, fetch by user_id)
- **Payload Size**: ~1KB per subscription (minimal)
- **Real-Time**: None (push API only, no subscriptions)
- **Indexing**: Indexed on `user_id` and `endpoint` for fast lookups

### Migration SQL

```sql
-- ============================================================
-- FILE: 006_add_push_notifications.sql
-- PURPOSE: Store Web Push notification subscriptions
-- CHANGES:
--   * Create push_subscriptions table
--   * Add indexes for user_id and endpoint
--   * Enable RLS for user-specific access
-- ============================================================

-- 1. CREATE TABLE
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Push subscription data
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,      -- Encryption key
  auth TEXT NOT NULL,         -- Authentication secret
  
  -- Device metadata
  user_agent TEXT,
  device_type TEXT,           -- 'ios' | 'android' | 'desktop'
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Prevent duplicate subscriptions
  UNIQUE(user_id, endpoint)
);

-- 2. CREATE INDEXES
CREATE INDEX idx_push_subscriptions_user_id ON push_subscriptions(user_id);
CREATE INDEX idx_push_subscriptions_endpoint ON push_subscriptions(endpoint);

-- 3. ENABLE RLS
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- 4. CREATE RLS POLICIES
CREATE POLICY "users_access_own_subscriptions" 
  ON push_subscriptions 
  FOR ALL 
  USING (auth.uid() = user_id);

-- 5. ADD COMMENTS
COMMENT ON TABLE push_subscriptions IS 'Web Push notification subscriptions per user device';
COMMENT ON COLUMN push_subscriptions.endpoint IS 'Unique push service endpoint URL';
COMMENT ON COLUMN push_subscriptions.p256dh IS 'Client public key for encryption';
COMMENT ON COLUMN push_subscriptions.auth IS 'Authentication secret';
```

### Apply Migration

```bash
supabase db push
```

---

## 🔔 Service Worker

File: `/public/sw.js`

### Features
- ✅ Handle push events
- ✅ Display notifications dengan badge dan icon
- ✅ Handle notification clicks (open app)
- ✅ iOS 16.4+ compatible

```javascript
// ============================================================
// FILE: /public/sw.js
// Service Worker untuk Web Push Notifications
// Compatible: iOS 16.4+, Android, Desktop
// ============================================================

const APP_NAME = 'Finance App';
const APP_URL = self.location.origin;

// Install event
self.addEventListener('install', (event) => {
  console.log('[SW] Service Worker installing...');
  self.skipWaiting(); // Activate immediately
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('[SW] Service Worker activated');
  event.waitUntil(self.clients.claim()); // Take control immediately
});

// Push event - Terima notifikasi dari server
self.addEventListener('push', (event) => {
  console.log('[SW] Push received:', event);

  let data = {
    title: 'New Notification',
    body: 'You have a new update',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-72.png',
    tag: 'default',
    data: { url: '/dashboard' }
  };

  // Parse payload dari server
  if (event.data) {
    try {
      const payload = event.data.json();
      data = { ...data, ...payload };
    } catch (e) {
      console.error('[SW] Error parsing push data:', e);
      data.body = event.data.text();
    }
  }

  // Show notification
  const options = {
    body: data.body,
    icon: data.icon || '/icons/icon-192.png',
    badge: data.badge || '/icons/icon-72.png',
    tag: data.tag || 'notification',
    data: data.data || { url: '/dashboard' },
    vibrate: [200, 100, 200], // Vibration pattern
    requireInteraction: false, // Auto-dismiss
    
    // iOS 16.4+ support
    actions: data.actions || [],
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click event - User tap notifikasi
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event);

  event.notification.close(); // Close notification

  // Get URL from notification data
  const urlToOpen = event.notification.data?.url || '/dashboard';
  const fullUrl = new URL(urlToOpen, APP_URL).href;

  // Open app atau focus existing tab
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Cari tab yang sudah buka
        for (const client of clientList) {
          if (client.url === fullUrl && 'focus' in client) {
            return client.focus();
          }
        }
        // Buka tab baru jika tidak ada
        if (self.clients.openWindow) {
          return self.clients.openWindow(fullUrl);
        }
      })
  );
});
```

---

## 🎨 Client Component

File: `/components/features/notification/PushNotificationManager.tsx`

### Features
- ✅ Request permission
- ✅ Register Service Worker
- ✅ Subscribe ke Push Service
- ✅ Save subscription ke Supabase
- ✅ Detect device type (iOS/Android)
- ✅ Error handling

```typescript
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface PushSubscriptionData {
  endpoint: string;
  p256dh: string;
  auth: string;
}

export default function PushNotificationManager({ userId }: { userId: string }) {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // Check browser support
    const supported = 
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window;
    
    setIsSupported(supported);
    
    if (supported) {
      setPermission(Notification.permission);
      checkSubscription();
    }
  }, []);

  // Check jika user sudah subscribe
  async function checkSubscription() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  }

  // Subscribe to push notifications
  async function subscribeToPush() {
    if (!isSupported || permission !== 'granted') {
      console.error('Push not supported or permission not granted');
      return;
    }

    setLoading(true);

    try {
      // 1. Register Service Worker
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      });

      await navigator.serviceWorker.ready;

      // 2. Subscribe to Push Manager
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        )
      });

      // 3. Save subscription to Supabase
      const subscriptionJson = subscription.toJSON();
      
      const pushData: PushSubscriptionData = {
        endpoint: subscription.endpoint,
        p256dh: subscriptionJson.keys!.p256dh,
        auth: subscriptionJson.keys!.auth,
      };

      const { error } = await supabase
        .from('push_subscriptions')
        .upsert({
          user_id: userId,
          ...pushData,
          user_agent: navigator.userAgent,
          device_type: getDeviceType(),
          last_used_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,endpoint'
        });

      if (error) throw error;

      setIsSubscribed(true);
      console.log('✅ Push subscription saved');
    } catch (error) {
      console.error('❌ Error subscribing to push:', error);
    } finally {
      setLoading(false);
    }
  }

  // Request notification permission
  async function requestPermission() {
    if (!isSupported) return;

    setLoading(true);

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        await subscribeToPush();
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
    } finally {
      setLoading(false);
    }
  }

  // Unsubscribe from push
  async function unsubscribe() {
    setLoading(true);

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();

        // Delete from database
        await supabase
          .from('push_subscriptions')
          .delete()
          .eq('user_id', userId)
          .eq('endpoint', subscription.endpoint);

        setIsSubscribed(false);
        console.log('✅ Unsubscribed from push');
      }
    } catch (error) {
      console.error('❌ Error unsubscribing:', error);
    } finally {
      setLoading(false);
    }
  }

  if (!isSupported) {
    return (
      <div className="text-sm text-gray-500">
        Push notifications tidak didukung di browser ini
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold mb-2">Push Notifications</h3>
        <p className="text-sm text-gray-600">
          Status: <span className="font-medium">{permission}</span>
        </p>
      </div>

      {permission === 'default' && (
        <button
          onClick={requestPermission}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Aktifkan Notifikasi'}
        </button>
      )}

      {permission === 'granted' && !isSubscribed && (
        <button
          onClick={subscribeToPush}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Subscribe to Push'}
        </button>
      )}

      {isSubscribed && (
        <div className="space-y-2">
          <p className="text-sm text-green-600">✅ Notifikasi aktif</p>
          <button
            onClick={unsubscribe}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Nonaktifkan'}
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

// Convert VAPID key dari base64 ke Uint8Array
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Detect device type
function getDeviceType(): string {
  const ua = navigator.userAgent.toLowerCase();
  
  if (/iphone|ipad|ipod/.test(ua)) {
    return 'ios';
  } else if (/android/.test(ua)) {
    return 'android';
  } else {
    return 'desktop';
  }
}
```

---

## 🚀 API Route

File: `/app/api/push/send/route.ts`

### Features
- ✅ Send push notification ke specific user
- ✅ Support multiple devices per user
- ✅ Error handling
- ✅ TypeScript

```typescript
import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';
import { createClient } from '@/lib/supabase/server';

// Configure web-push
webpush.setVapidDetails(
  process.env.VAPID_EMAIL!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: {
    url?: string;
    [key: string]: any;
  };
}

interface RequestBody {
  userId: string;
  payload: PushPayload;
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { userId, payload } = body;

    if (!userId || !payload) {
      return NextResponse.json(
        { error: 'userId and payload required' },
        { status: 400 }
      );
    }

    // Fetch user's push subscriptions from database
    const supabase = createClient();
    const { data: subscriptions, error: fetchError } = await supabase
      .from('push_subscriptions')
      .select('id, endpoint, p256dh, auth')
      .eq('user_id', userId);

    if (fetchError) {
      console.error('Database error:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch subscriptions' },
        { status: 500 }
      );
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json(
        { error: 'No subscriptions found for user' },
        { status: 404 }
      );
    }

    // Send push to all user devices
    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        };

        try {
          await webpush.sendNotification(
            pushSubscription,
            JSON.stringify(payload)
          );

          // Update last_used_at
          await supabase
            .from('push_subscriptions')
            .update({ last_used_at: new Date().toISOString() })
            .eq('id', sub.id);

          return { success: true, endpoint: sub.endpoint };
        } catch (error: any) {
          console.error('Push send error:', error);

          // Delete invalid subscriptions (410 Gone)
          if (error.statusCode === 410) {
            await supabase
              .from('push_subscriptions')
              .delete()
              .eq('id', sub.id);
          }

          return { success: false, endpoint: sub.endpoint, error: error.message };
        }
      })
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    return NextResponse.json({
      success: true,
      message: `Push sent to ${successful} device(s), ${failed} failed`,
      details: results,
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## 📱 Update Manifest

File: `/public/manifest.json`

Tambahkan scope dan gcm_sender_id untuk Android:

```json
{
  "name": "Finance App - Track Your Money",
  "short_name": "Finance App",
  "start_url": "/dashboard",
  "display": "standalone",
  "scope": "/",
  "gcm_sender_id": "103953800507",
  
  // ... existing config
}
```

**Note**: `gcm_sender_id` adalah ID universal untuk Chrome/Android Push.

---

## 🎯 Usage Example

### 1. Add Component ke Profile Page

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
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      
      {/* Push Notification Settings */}
      <div className="bg-white rounded-lg p-6 shadow">
        <PushNotificationManager userId={user.id} />
      </div>
    </div>
  );
}
```

### 2. Send Notification (Server-side)

```typescript
// Example: Send notification saat ada transaksi baru
async function notifyUser(userId: string, amount: number) {
  await fetch('/api/push/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      payload: {
        title: '💰 Transaksi Baru',
        body: `Pengeluaran Rp ${amount.toLocaleString('id-ID')}`,
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-72.png',
        tag: 'transaction',
        data: {
          url: '/dashboard'
        }
      }
    })
  });
}
```

---

## 🧪 Testing

### **1. Local Development**

```bash
# Start dev server
npm run dev

# Open di browser
https://localhost:3000
```

### **2. Test Push Permission**

1. Buka `/profile`
2. Klik "Aktifkan Notifikasi"
3. Browser akan minta permission
4. Klik "Allow"
5. Cek console: "✅ Push subscription saved"

### **3. Test API (Postman/cURL)**

```bash
curl -X POST http://localhost:3000/api/push/send \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-uuid-here",
    "payload": {
      "title": "Test Notification",
      "body": "Hello from API!",
      "data": { "url": "/dashboard" }
    }
  }'
```

### **4. Test pada iOS (16.4+)**

**Requirements:**
- iOS 16.4 atau lebih baru
- Safari 16.4+
- PWA harus sudah di-install ke Home Screen

**Steps:**
1. Deploy ke production (HTTPS required)
2. Buka di Safari iOS
3. Install PWA (Add to Home Screen)
4. Buka dari Home Screen
5. Aktifkan notifikasi di `/profile`
6. Send test push via API
7. ✅ Notifikasi akan muncul di iOS

### **5. Test pada Android**

**Steps:**
1. Buka di Chrome Android
2. Install PWA via banner
3. Aktifkan notifikasi
4. Send test push
5. ✅ Notifikasi muncul

---

## ⚠️ Troubleshooting

### ❌ "Push not supported"

**Solusi:**
- Pastikan HTTPS (localhost atau production)
- iOS: Harus install PWA dulu
- Check browser compatibility

### ❌ Permission denied

**Solusi:**
- Reset permission di browser settings
- Clear cache dan cookies
- Restart browser

### ❌ Service Worker not registering

**Solusi:**
```javascript
// Check registration
navigator.serviceWorker.getRegistration().then(reg => {
  console.log('SW registration:', reg);
});
```

### ❌ 410 Gone error

**Kasus:** Subscription sudah expired/invalid

**Auto-handled:** API route otomatis delete subscription yang invalid

---

## 📊 Cost Analysis (Free Tier)

### Database Operations
- **Insert subscription**: 1 query per device
- **Fetch subscriptions**: 1 query per push send
- **Delete invalid**: 1 query per failed push

**Estimate:** ~10-50 queries/day per active user ✅

### Storage
- **Per subscription**: ~500 bytes
- **1000 users**: ~0.5MB ✅

### Recommendations
- ✅ Auto-cleanup subscriptions > 90 days inactive
- ✅ Limit 3 devices per user
- ✅ Batch notifications (jangan send per event)

---

## 🔒 Security Best Practices

1. **VAPID Keys:**
   - ✅ Never commit private key to Git
   - ✅ Use environment variables
   - ✅ Rotate keys annually

2. **API Protection:**
   - ✅ Add authentication middleware
   - ✅ Rate limiting (max 100 req/hour per user)
   - ✅ Validate user_id ownership

3. **RLS Policies:**
   - ✅ Users can only access own subscriptions
   - ✅ Server uses service role for push sending

---

## 📚 Resources

- [Web Push Protocol](https://datatracker.ietf.org/doc/html/rfc8030)
- [iOS 16.4 Push Support](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [web-push Library](https://github.com/web-push-libs/web-push)

---

## ✅ Checklist

- [ ] Install `web-push` package
- [ ] Generate VAPID keys
- [ ] Add environment variables
- [ ] Run database migration
- [ ] Create `/public/sw.js`
- [ ] Create `PushNotificationManager` component
- [ ] Create `/api/push/send` route
- [ ] Update `manifest.json` dengan `gcm_sender_id`
- [ ] Test di localhost
- [ ] Test di iOS (production)
- [ ] Test di Android

---

**Status**: Ready for implementation
**Estimated Time**: 2-3 hours
**Compatibility**: iOS 16.4+, Android (all), Desktop (Chrome/Edge/Firefox)
