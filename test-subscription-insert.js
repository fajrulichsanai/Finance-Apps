// Debug script: Test insert subscription tanpa Service Worker
// Run di browser console: copy paste script ini

const testSubscription = async () => {
  const { createClient } = await import('/lib/supabase/client');
  const supabase = createClient();
  
  console.log('🧪 Testing subscription insert...');
  
  const testData = {
    user_id: '4e7053ab-c109-46cf-9d99-7fe242b59298',
    endpoint: 'https://fcm.googleapis.com/fcm/send/test-endpoint-' + Date.now(),
    p256dh: 'test-p256dh-key',
    auth: 'test-auth-key',
    user_agent: navigator.userAgent,
    device_type: 'desktop',
    last_used_at: new Date().toISOString()
  };
  
  console.log('📝 Data to insert:', testData);
  
  const { data, error } = await supabase
    .from('push_subscriptions')
    .insert(testData)
    .select();
  
  if (error) {
    console.error('❌ Insert failed:', error);
    return;
  }
  
  console.log('✅ Insert successful:', data);
  
  // Cleanup
  if (data && data[0]) {
    const { error: deleteError } = await supabase
      .from('push_subscriptions')
      .delete()
      .eq('id', data[0].id);
    
    if (deleteError) {
      console.error('⚠️ Cleanup failed:', deleteError);
    } else {
      console.log('🗑️ Test data cleaned up');
    }
  }
};

testSubscription();
