-- filename: 20260413_add_notifications.sql

-- PURPOSE:
-- Create notifications system for budget alerts, insights, and user notifications
-- Supports real-time budget warnings and AI-driven insights

-- CHANGES:
-- * Create notifications table with user relationship
-- * Add type field for categorizing notifications (warning, alert, info, insight)
-- * Add is_read flag for tracking notification status
-- * Add archived_at for soft deletion
-- * Create indexes for user_id, is_read, and archived_at queries
-- * Enable RLS for user data isolation
-- * Create comprehensive access policies

-- DEPENDENCIES:
-- * Requires Supabase Auth to be enabled
-- * Requires auth.users table

-- ============================================================
-- NOTIFICATIONS TABLE
-- ============================================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('warning', 'alert', 'info', 'insight')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action_label TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

-- Index for fetching user's unread notifications
CREATE INDEX idx_notifications_user_unread 
  ON notifications(user_id, is_read, created_at DESC) 
  WHERE archived_at IS NULL;

-- Index for fetching user's notifications by type
CREATE INDEX idx_notifications_user_type 
  ON notifications(user_id, type, created_at DESC) 
  WHERE archived_at IS NULL;

-- Index for archived notifications
CREATE INDEX idx_notifications_archived 
  ON notifications(user_id, archived_at DESC) 
  WHERE archived_at IS NOT NULL;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own notifications (for system-generated)
CREATE POLICY "Users can insert their own notifications"
  ON notifications
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own notifications (mark as read, archive)
CREATE POLICY "Users can update their own notifications"
  ON notifications
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own notifications
CREATE POLICY "Users can delete their own notifications"
  ON notifications
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Function to create a notification
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_action_label TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_notification_id UUID;
BEGIN
  INSERT INTO notifications (user_id, type, title, message, action_label)
  VALUES (p_user_id, p_type, p_title, p_message, p_action_label)
  RETURNING id INTO v_notification_id;
  
  RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark notification as read
CREATE OR REPLACE FUNCTION mark_notification_read(
  p_notification_id UUID,
  p_user_id UUID
)
RETURNS VOID AS $$
BEGIN
  UPDATE notifications
  SET is_read = TRUE, updated_at = NOW()
  WHERE id = p_notification_id AND user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark all notifications as read
CREATE OR REPLACE FUNCTION mark_all_notifications_read(
  p_user_id UUID
)
RETURNS VOID AS $$
BEGIN
  UPDATE notifications
  SET is_read = TRUE, updated_at = NOW()
  WHERE user_id = p_user_id AND is_read = FALSE AND archived_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to archive notification (soft delete)
CREATE OR REPLACE FUNCTION archive_notification(
  p_notification_id UUID,
  p_user_id UUID
)
RETURNS VOID AS $$
BEGIN
  UPDATE notifications
  SET archived_at = NOW(), updated_at = NOW()
  WHERE id = p_notification_id AND user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- COMMENTS
-- ============================================================

COMMENT ON TABLE notifications IS 'User notifications for budget alerts, insights, and system messages';
COMMENT ON COLUMN notifications.type IS 'Notification type: warning, alert, info, or insight';
COMMENT ON COLUMN notifications.is_read IS 'Whether the user has read this notification';
COMMENT ON COLUMN notifications.archived_at IS 'Timestamp when notification was archived (soft delete)';
COMMENT ON FUNCTION create_notification IS 'Helper function to create a new notification';
COMMENT ON FUNCTION mark_notification_read IS 'Mark a single notification as read';
COMMENT ON FUNCTION mark_all_notifications_read IS 'Mark all unread notifications as read for a user';
COMMENT ON FUNCTION archive_notification IS 'Archive (soft delete) a notification';
