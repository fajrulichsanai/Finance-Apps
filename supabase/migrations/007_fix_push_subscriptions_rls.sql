-- ============================================================
-- FILE: 007_fix_push_subscriptions_rls.sql
-- PURPOSE: Fix RLS policy untuk push_subscriptions
-- CREATED: 2026-04-14
-- ============================================================

-- CHANGES:
--   * Drop existing policy
--   * Create separate policies for SELECT, INSERT, UPDATE, DELETE
--   * Allow INSERT for authenticated users (they insert their own data)
--   * Maintain security: users can only access their own subscriptions

-- DEPENDENCIES:
--   * 006_add_push_notifications.sql

-- ============================================================
-- SQL MIGRATION
-- ============================================================

-- 1. Drop existing policy
DROP POLICY IF EXISTS "users_access_own_subscriptions" ON push_subscriptions;

-- 2. Create separate policies for each operation

-- SELECT: Users can only view their own subscriptions
CREATE POLICY "users_select_own_subscriptions" 
  ON push_subscriptions 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- INSERT: Authenticated users can insert subscriptions
-- The user_id will be validated to match auth.uid() in the application
CREATE POLICY "users_insert_own_subscriptions" 
  ON push_subscriptions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can only update their own subscriptions
CREATE POLICY "users_update_own_subscriptions" 
  ON push_subscriptions 
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can only delete their own subscriptions
CREATE POLICY "users_delete_own_subscriptions" 
  ON push_subscriptions 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- 3. Add comment
COMMENT ON TABLE push_subscriptions IS 'Web Push notification subscriptions - RLS policies updated for granular control';
