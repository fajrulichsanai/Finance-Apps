// ============================================================
// Example Usage: Send Push Notification
// ============================================================
// File ini berisi contoh-contoh cara menggunakan Push Notification API

import { SendPushRequest, PushNotificationPayload } from '@/types';

// ============================================================
// 1. BASIC USAGE - Send Simple Notification
// ============================================================

async function sendSimpleNotification(userId: string) {
  const payload: PushNotificationPayload = {
    title: '💰 Transaksi Baru',
    body: 'Pengeluaran Rp 50.000 berhasil dicatat',
  };

  const response = await fetch('/api/push/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, payload })
  });

  const result = await response.json();
  console.log('Push result:', result);
}

// ============================================================
// 2. ADVANCED USAGE - With Custom Icon and URL
// ============================================================

async function sendTransactionNotification(
  userId: string, 
  amount: number, 
  category: string
) {
  const payload: PushNotificationPayload = {
    title: '💸 Pengeluaran Tercatat',
    body: `${category}: Rp ${amount.toLocaleString('id-ID')}`,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-72.png',
    tag: 'transaction',
    data: {
      url: '/activity',
      transactionId: 'txn-123',
      amount: amount
    }
  };

  const request: SendPushRequest = { userId, payload };

  const response = await fetch('/api/push/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    throw new Error('Failed to send push notification');
  }

  return await response.json();
}

// ============================================================
// 3. BUDGET ALERT - Over Budget Warning
// ============================================================

async function sendBudgetAlert(userId: string, category: string, spent: number, budget: number) {
  const percentage = Math.round((spent / budget) * 100);

  const payload: PushNotificationPayload = {
    title: '⚠️ Budget Alert!',
    body: `${category}: Sudah ${percentage}% dari budget (Rp ${spent.toLocaleString('id-ID')} / Rp ${budget.toLocaleString('id-ID')})`,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-72.png',
    tag: 'budget-alert',
    data: {
      url: '/budget',
      category,
      percentage
    }
  };

  await fetch('/api/push/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, payload })
  });
}

// ============================================================
// 4. REMINDER - Daily/Weekly Reminder
// ============================================================

async function sendReminder(userId: string, message: string) {
  const payload: PushNotificationPayload = {
    title: '🔔 Reminder',
    body: message,
    icon: '/icons/icon-192.png',
    tag: 'reminder',
    data: {
      url: '/dashboard'
    }
  };

  await fetch('/api/push/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, payload })
  });
}

// ============================================================
// 5. BATCH NOTIFICATIONS - Multiple Users
// ============================================================

async function sendBulkNotifications(userIds: string[], message: string) {
  const results = await Promise.allSettled(
    userIds.map(userId => 
      fetch('/api/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          payload: {
            title: 'Finance App',
            body: message,
            icon: '/icons/icon-192.png'
          }
        })
      })
    )
  );

  const successful = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;

  console.log(`Sent to ${successful} users, ${failed} failed`);
}

// ============================================================
// 6. TRIGGER FROM SERVER ACTION - After Transaction Create
// ============================================================

// File: app/record/actions.ts
export async function createTransactionAction(formData: FormData) {
  'use server';
  
  // ... create transaction logic
  
  const userId = 'user-id-here';
  const amount = parseFloat(formData.get('amount') as string);
  const category = formData.get('category') as string;

  // Send push notification after successful creation
  try {
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/push/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        payload: {
          title: '✅ Transaksi Berhasil',
          body: `${category}: Rp ${amount.toLocaleString('id-ID')}`,
          data: { url: '/activity' }
        }
      })
    });
  } catch (error) {
    console.error('Failed to send push:', error);
    // Don't fail transaction if push fails
  }
}

// ============================================================
// 7. SCHEDULE NOTIFICATIONS - Using Cron Job or Edge Function
// ============================================================

// File: app/api/cron/daily-summary/route.ts
export async function GET() {
  // Fetch all users
  // Calculate daily summary
  // Send push to each user

  const users = []; // fetch from DB
  
  for (const user of users) {
    await fetch('/api/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        payload: {
          title: '📊 Daily Summary',
          body: `Hari ini: Pengeluaran Rp ${user.todayExpense.toLocaleString('id-ID')}`,
          data: { url: '/insight' }
        }
      })
    });
  }

  return new Response('OK');
}

export { 
  sendSimpleNotification,
  sendTransactionNotification,
  sendBudgetAlert,
  sendReminder,
  sendBulkNotifications
};
