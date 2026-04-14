-- ============================================================
-- FILE: 008_push_subscriptions_service_access.sql
-- PURPOSE: Allow service role to access push_subscriptions for sending notifications
-- CREATED: 2026-04-14
-- ============================================================

-- CHANGES:
--   * Add policy to allow service role to SELECT all subscriptions
--   * This enables API route to fetch subscriptions for push sending

-- DEPENDENCIES:
--   * 007_fix_push_subscriptions_rls.sql

-- ============================================================
-- SQL MIGRATION
-- ============================================================

-- Allow service role (server-side) to SELECT all subscriptions
-- This is needed for /api/push/send to fetch user subscriptions
CREATE POLICY "service_role_select_all_subscriptions" 
  ON push_subscriptions 
  FOR SELECT 
  TO service_role
  USING (true);

-- Allow service role to UPDATE subscriptions (for last_used_at)
CREATE POLICY "service_role_update_subscriptions" 
  ON push_subscriptions 
  FOR UPDATE 
  TO service_role
  USING (true);

-- Allow service role to DELETE invalid subscriptions (410 errors)
CREATE POLICY "service_role_delete_subscriptions" 
  ON push_subscriptions 
  FOR DELETE 
  TO service_role
  USING (true);

COMMENT ON POLICY "service_role_select_all_subscriptions" ON push_subscriptions IS 
  'Allow server-side API to fetch subscriptions for push notification delivery';
