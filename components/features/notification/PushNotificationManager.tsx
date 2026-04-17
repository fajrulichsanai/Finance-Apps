'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Bell, BellOff, Check, AlertCircle, Info } from 'lucide-react';

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
  }, [userId]);

  async function checkSubscription() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch (err) {
      console.error('Error checking subscription:', err);
    }
  }

  async function subscribeToPush() {
    if (!isSupported || permission !== 'granted') {
      setError('Izin notifikasi belum diberikan');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      });

      await navigator.serviceWorker.ready;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ) as BufferSource
      });

      const subscriptionJson = subscription.toJSON();
      
      if (!subscriptionJson.keys) {
        throw new Error('Invalid subscription: missing keys');
      }

      const pushData: PushSubscriptionData = {
        endpoint: subscription.endpoint,
        p256dh: subscriptionJson.keys.p256dh,
        auth: subscriptionJson.keys.auth,
      };

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
      
    } catch (err: any) {
      console.error('Error subscribing to push:', err);
      setError(err.message || 'Gagal mengaktifkan notifikasi');
    } finally {
      setLoading(false);
    }
  }

  async function requestPermission() {
    if (!isSupported) {
      setError('Browser tidak mendukung notifikasi push');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        await subscribeToPush();
      } else if (result === 'denied') {
        setError('Izin ditolak. Aktifkan di pengaturan browser.');
      } else {
        setError('Izin dibatalkan');
      }
    } catch (err: any) {
      console.error('Error requesting permission:', err);
      setError(err.message || 'Gagal meminta izin notifikasi');
    } finally {
      setLoading(false);
    }
  }

  async function unsubscribe() {
    setLoading(true);
    setError(null);

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        const endpoint = subscription.endpoint;
        
        await subscription.unsubscribe();

        const { error: dbError } = await supabase
          .from('push_subscriptions')
          .delete()
          .eq('user_id', userId)
          .eq('endpoint', endpoint);

        if (dbError) throw dbError;

        setIsSubscribed(false);
      }
    } catch (err: any) {
      console.error('Error unsubscribing:', err);
      setError(err.message || 'Gagal menonaktifkan notifikasi');
    } finally {
      setLoading(false);
    }
  }

  if (!isSupported) {
    return (
      <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 transition-colors">
        <AlertCircle className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Notifikasi Tidak Tersedia
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Browser Anda tidak mendukung notifikasi push. Silakan gunakan Chrome, Edge, atau Safari versi terbaru.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Notifikasi Push
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Dapatkan pemberitahuan real-time untuk transaksi dan pengingat penting
          </p>
        </div>
      </div>

      {/* Status Card */}
      <div className={`p-4 rounded-xl border transition-colors ${
        permission === 'granted' && isSubscribed
          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
          : permission === 'denied'
          ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
          : 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</span>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
            permission === 'granted' && isSubscribed
              ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400'
              : permission === 'denied'
              ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}>
            {permission === 'granted' && isSubscribed ? (
              <>
                <Check className="w-3 h-3" />
                Aktif
              </>
            ) : permission === 'denied' ? (
              <>
                <BellOff className="w-3 h-3" />
                Dinonaktifkan
              </>
            ) : (
              <>
                <Bell className="w-3 h-3" />
                Belum Aktif
              </>
            )}
          </span>
        </div>
        
        <p className="text-xs text-gray-600 dark:text-gray-400">
          {permission === 'granted' && isSubscribed
            ? 'Anda akan menerima notifikasi untuk aktivitas penting'
            : permission === 'denied'
            ? 'Notifikasi dinonaktifkan untuk aplikasi ini'
            : 'Aktifkan notifikasi untuk tetap mendapat update'}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 transition-colors">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3">
        {permission === 'default' && (
          <button
            onClick={requestPermission}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Bell className="w-4 h-4" />
            {loading ? 'Memproses...' : 'Aktifkan Notifikasi'}
          </button>
        )}

        {permission === 'denied' && (
          <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 transition-colors">
            <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-900 dark:text-amber-400 mb-1">
                Izin Notifikasi Ditolak
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-500">
                Untuk mengaktifkan kembali, buka pengaturan browser dan ubah izin notifikasi untuk situs ini.
              </p>
            </div>
          </div>
        )}

        {permission === 'granted' && !isSubscribed && (
          <button
            onClick={subscribeToPush}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white text-sm font-semibold rounded-xl disabled:opacity-50 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {loading ? 'Memproses...' : 'Langganan Notifikasi'}
          </button>
        )}

        {isSubscribed && (
          <button
            onClick={unsubscribe}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
          >
            <BellOff className="w-4 h-4" />
            {loading ? 'Memproses...' : 'Nonaktifkan Notifikasi'}
          </button>
        )}
      </div>

      {/* Info Footer for iOS */}
      {getDeviceType() === 'ios' && (
        <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800 transition-colors">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 dark:text-blue-400">
            <span className="font-semibold">Pengguna iOS:</span> Pastikan aplikasi sudah diinstal ke Home Screen agar notifikasi dapat berfungsi dengan baik.
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

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
