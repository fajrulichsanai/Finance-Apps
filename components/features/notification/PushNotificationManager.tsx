'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface PushSubscriptionData {
  endpoint: string;
  p256dh: string;
  auth: string;
}

interface Props {
  userId: string;
}

export default function PushNotificationManager({ userId }: Props) {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  // Check browser support & existing permission
  useEffect(() => {
    const checkSupport = () => {
      const supported = 
        'serviceWorker' in navigator &&
        'PushManager' in window &&
        'Notification' in window;
      
      setIsSupported(supported);
      
      if (supported) {
        setPermission(Notification.permission);
        checkSubscription();
      }
    };

    checkSupport();
  }, []);

  // Check if user already has active subscription
  async function checkSubscription() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
      
      if (subscription) {
        console.log('✅ Existing subscription found');
      }
    } catch (err) {
      console.error('Error checking subscription:', err);
    }
  }

  // Subscribe to push notifications
  async function subscribeToPush() {
    if (!isSupported || permission !== 'granted') {
      setError('Permission belum diberikan');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Register Service Worker
      console.log('📝 Registering Service Worker...');
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      });

      // Wait for SW to be ready
      await navigator.serviceWorker.ready;
      console.log('✅ Service Worker ready');

      // 2. Subscribe to Push Manager
      console.log('🔔 Subscribing to Push Manager...');
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true, // Required by spec
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ) as BufferSource
      });

      console.log('✅ Push subscription created');

      // 3. Convert subscription to JSON
      const subscriptionJson = subscription.toJSON();
      
      if (!subscriptionJson.keys) {
        throw new Error('Invalid subscription: missing keys');
      }

      const pushData: PushSubscriptionData = {
        endpoint: subscription.endpoint,
        p256dh: subscriptionJson.keys.p256dh,
        auth: subscriptionJson.keys.auth,
      };

      // 4. Save subscription to Supabase
      console.log('💾 Saving subscription to database...');
      const { error: dbError } = await supabase
        .from('push_subscriptions')
        .upsert({
          user_id: userId,
          ...pushData,
          user_agent: navigator.userAgent,
          device_type: getDeviceType(),
          last_used_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,endpoint',
          ignoreDuplicates: false
        });

      if (dbError) throw dbError;

      setIsSubscribed(true);
      console.log('✅ Push subscription saved successfully');
      
    } catch (err: any) {
      console.error('❌ Error subscribing to push:', err);
      setError(err.message || 'Gagal mengaktifkan notifikasi');
    } finally {
      setLoading(false);
    }
  }

  // Request notification permission
  async function requestPermission() {
    if (!isSupported) {
      setError('Browser tidak mendukung push notifications');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔐 Requesting notification permission...');
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        console.log('✅ Permission granted');
        await subscribeToPush();
      } else if (result === 'denied') {
        setError('Permission ditolak. Silakan aktifkan di pengaturan browser.');
      } else {
        setError('Permission dibatalkan');
      }
    } catch (err: any) {
      console.error('Error requesting permission:', err);
      setError(err.message || 'Gagal meminta permission');
    } finally {
      setLoading(false);
    }
  }

  // Unsubscribe from push notifications
  async function unsubscribe() {
    setLoading(true);
    setError(null);

    try {
      console.log('🔕 Unsubscribing from push...');
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        const endpoint = subscription.endpoint;
        
        // Unsubscribe from browser
        await subscription.unsubscribe();
        console.log('✅ Browser unsubscribed');

        // Delete from database
        const { error: dbError } = await supabase
          .from('push_subscriptions')
          .delete()
          .eq('user_id', userId)
          .eq('endpoint', endpoint);

        if (dbError) throw dbError;

        setIsSubscribed(false);
        console.log('✅ Subscription removed from database');
      }
    } catch (err: any) {
      console.error('❌ Error unsubscribing:', err);
      setError(err.message || 'Gagal menonaktifkan notifikasi');
    } finally {
      setLoading(false);
    }
  }

  // Test notification
  async function sendTestNotification() {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification('Test Notification', {
        body: 'Push notifications berfungsi dengan baik! 🎉',
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-72.png',
        tag: 'test',
        data: { url: '/dashboard' }
      });
      console.log('✅ Test notification shown');
    } catch (err: any) {
      console.error('Error showing test notification:', err);
      setError(err.message);
    }
  }

  // UI: Browser not supported
  if (!isSupported) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg border border-gray-300">
        <p className="text-sm text-gray-600">
          ⚠️ Push notifications tidak didukung di browser ini.
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Gunakan Chrome, Edge, atau Safari terbaru.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold mb-1">Push Notifications</h3>
        <p className="text-sm text-gray-600">
          Terima notifikasi untuk transaksi dan reminder penting
        </p>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-600">Status:</span>
        <span className={`font-medium ${
          permission === 'granted' ? 'text-green-600' :
          permission === 'denied' ? 'text-red-600' :
          'text-gray-600'
        }`}>
          {permission === 'granted' ? '✅ Aktif' :
           permission === 'denied' ? '❌ Ditolak' :
           '⏸️ Belum Diaktifkan'}
        </span>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">❌ {error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3">
        {/* Request Permission */}
        {permission === 'default' && (
          <button
            onClick={requestPermission}
            disabled={loading}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {loading ? '⏳ Loading...' : '🔔 Aktifkan Notifikasi'}
          </button>
        )}

        {/* Permission Denied */}
        {permission === 'denied' && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800 mb-2">
              <strong>Permission ditolak</strong>
            </p>
            <p className="text-xs text-yellow-700">
              Untuk mengaktifkan notifikasi, buka pengaturan browser dan ubah permission untuk situs ini.
            </p>
          </div>
        )}

        {/* Subscribe (permission granted but not subscribed) */}
        {permission === 'granted' && !isSubscribed && (
          <button
            onClick={subscribeToPush}
            disabled={loading}
            className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium transition-colors"
          >
            {loading ? '⏳ Loading...' : '✅ Subscribe to Push'}
          </button>
        )}

        {/* Already Subscribed */}
        {isSubscribed && (
          <div className="space-y-3">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                ✅ Notifikasi aktif! Anda akan menerima update penting.
              </p>
            </div>

            {/* Test Notification Button */}
            <button
              onClick={sendTestNotification}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors"
            >
              🧪 Test Notifikasi
            </button>

            {/* Unsubscribe Button */}
            <button
              onClick={unsubscribe}
              disabled={loading}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium transition-colors"
            >
              {loading ? '⏳ Loading...' : '🔕 Nonaktifkan Notifikasi'}
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          💡 <strong>Tip:</strong> Untuk iOS, pastikan PWA sudah di-install ke Home Screen agar notifikasi berfungsi.
        </p>
      </div>
    </div>
  );
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Convert VAPID key dari base64 string ke Uint8Array
 * Required untuk subscribe to Push Manager
 */
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

/**
 * Detect device type dari User Agent
 */
function getDeviceType(): 'ios' | 'android' | 'desktop' {
  const ua = navigator.userAgent.toLowerCase();
  
  if (/iphone|ipad|ipod/.test(ua)) {
    return 'ios';
  } else if (/android/.test(ua)) {
    return 'android';
  } else {
    return 'desktop';
  }
}
