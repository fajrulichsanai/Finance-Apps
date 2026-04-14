-- ============================================================
-- FILE: 006_add_push_notifications.sql
-- PURPOSE: Store Web Push notification subscriptions
-- CREATED: 2026-04-14
-- ============================================================

-- CHANGES:
--   * Create push_subscriptions table for storing device subscriptions
--   * Add indexes for user_id and endpoint (fast lookups)
--   * Enable RLS for user-specific access
--   * Add unique constraint to prevent duplicate subscriptions

-- DEPENDENCIES:
--   * auth.users table (for user_id foreign key)

-- ============================================================
-- SQL MIGRATION
-- ============================================================

-- 1. CREATE TABLE
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Push subscription data (dari PushSubscription.toJSON())
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,      -- Client public key untuk encryption
  auth TEXT NOT NULL,         -- Authentication secret
  
  -- Device metadata
  user_agent TEXT,
  device_type TEXT CHECK (device_type IN ('ios', 'android', 'desktop')),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Prevent duplicate subscriptions untuk user + endpoint yang sama
  UNIQUE(user_id, endpoint)
);

-- 2. CREATE INDEXES
-- Index untuk query by user_id (paling sering digunakan)
CREATE INDEX idx_push_subscriptions_user_id ON push_subscriptions(user_id);

-- Index untuk endpoint lookups (saat mengecek subscription)
CREATE INDEX idx_push_subscriptions_endpoint ON push_subscriptions(endpoint);

-- Index untuk cleanup subscriptions yang lama
CREATE INDEX idx_push_subscriptions_last_used ON push_subscriptions(last_used_at);

-- 3. ENABLE ROW LEVEL SECURITY
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- 4. CREATE RLS POLICIES
-- Users dapat mengakses hanya subscription mereka sendiri
CREATE POLICY "users_access_own_subscriptions" 
  ON push_subscriptions 
  FOR ALL 
  USING (auth.uid() = user_id);

-- 5. ADD COMMENTS (documentation)
COMMENT ON TABLE push_subscriptions IS 'Web Push notification subscriptions per user device';
COMMENT ON COLUMN push_subscriptions.user_id IS 'User yang memiliki subscription';
COMMENT ON COLUMN push_subscriptions.endpoint IS 'Unique push service endpoint URL dari browser';
COMMENT ON COLUMN push_subscriptions.p256dh IS 'Client public key untuk message encryption (base64)';
COMMENT ON COLUMN push_subscriptions.auth IS 'Authentication secret untuk push service (base64)';
COMMENT ON COLUMN push_subscriptions.device_type IS 'Tipe device: ios, android, atau desktop';
COMMENT ON COLUMN push_subscriptions.last_used_at IS 'Last time push was successfully sent to this subscription';

-- ============================================================
-- OPTIONAL: Cleanup Function
-- ============================================================

-- Function untuk auto-cleanup subscriptions yang sudah inactive > 90 hari
CREATE OR REPLACE FUNCTION cleanup_old_push_subscriptions()
RETURNS void AS $$
BEGIN
  DELETE FROM push_subscriptions
  WHERE last_used_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION cleanup_old_push_subscriptions IS 'Delete inactive push subscriptions older than 90 days';

-- ============================================================
-- VERIFICATION QUERIES (untuk testing)
-- ============================================================

-- Check table created successfully
-- SELECT table_name, table_type FROM information_schema.tables WHERE table_name = 'push_subscriptions';

-- Check indexes
-- SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'push_subscriptions';

-- Check RLS enabled
-- SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'push_subscriptions';

-- Check policies
-- SELECT policyname, cmd, qual FROM pg_policies WHERE tablename = 'push_subscriptions';
