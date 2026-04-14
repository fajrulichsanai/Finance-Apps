// Test Push Notification Script
const userId = process.argv[2] || 'test-user-id';

const payload = {
  userId: userId,
  payload: {
    title: '🔔 Test Push Notification',
    body: 'Hello from Finance App! Notifikasi berfungsi dengan baik ✅',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-72.png',
    tag: 'test',
    data: {
      url: '/dashboard',
      timestamp: new Date().toISOString()
    }
  }
};

fetch('http://localhost:3000/api/push/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
})
.then(res => res.json())
.then(data => {
  console.log('\n✅ Response:', JSON.stringify(data, null, 2));
})
.catch(err => {
  console.error('\n❌ Error:', err.message);
});
