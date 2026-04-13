// =====================================================
// FINANCE APP - Notifications Service
// =====================================================
// Description: Manage user notifications for budget alerts and insights
// =====================================================

import { createClient } from '@/lib/supabase/client';

export type NotificationType = 'warning' | 'alert' | 'info' | 'insight';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  action_label?: string | null;
  is_read: boolean;
  archived_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateNotificationInput {
  type: NotificationType;
  title: string;
  message: string;
  action_label?: string;
}

export interface NotificationFilters {
  type?: NotificationType;
  is_read?: boolean;
  include_archived?: boolean;
  limit?: number;
  offset?: number;
}

export interface NotificationGroup {
  label: string;
  notifications: Notification[];
}

class NotificationService {
  private supabase = createClient();

  /**
   * Get all notifications for current user
   */
  async getNotifications(filters: NotificationFilters = {}): Promise<Notification[]> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      let query = this.supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Apply filters
      if (!filters.include_archived) {
        query = query.is('archived_at', null);
      }
      if (filters.type) {
        query = query.eq('type', filters.type);
      }
      if (filters.is_read !== undefined) {
        query = query.eq('is_read', filters.is_read);
      }
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data || []) as Notification[];

    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  /**
   * Get notifications grouped by time (Today, Yesterday, This Week, etc.)
   */
  async getGroupedNotifications(): Promise<NotificationGroup[]> {
    try {
      const notifications = await this.getNotifications({ include_archived: false });

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);

      const groups: NotificationGroup[] = [];

      // Group by time
      const todayNotifs = notifications.filter(n => new Date(n.created_at) >= today);
      const yesterdayNotifs = notifications.filter(n => {
        const date = new Date(n.created_at);
        return date >= yesterday && date < today;
      });
      const thisWeekNotifs = notifications.filter(n => {
        const date = new Date(n.created_at);
        return date >= weekAgo && date < yesterday;
      });
      const olderNotifs = notifications.filter(n => new Date(n.created_at) < weekAgo);

      if (todayNotifs.length > 0) {
        groups.push({ label: 'TODAY', notifications: todayNotifs });
      }
      if (yesterdayNotifs.length > 0) {
        groups.push({ label: 'YESTERDAY', notifications: yesterdayNotifs });
      }
      if (thisWeekNotifs.length > 0) {
        groups.push({ label: 'THIS WEEK', notifications: thisWeekNotifs });
      }
      if (olderNotifs.length > 0) {
        groups.push({ label: 'OLDER', notifications: olderNotifs });
      }

      return groups;

    } catch (error) {
      console.error('Error fetching grouped notifications:', error);
      throw error;
    }
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(): Promise<number> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { count, error } = await this.supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false)
        .is('archived_at', null);

      if (error) throw error;

      return count || 0;

    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  }

  /**
   * Create a new notification (system-generated)
   */
  async createNotification(input: CreateNotificationInput): Promise<Notification> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Validate input
      if (!input.title || !input.title.trim()) {
        throw new Error('Notification title is required');
      }
      if (!input.message || !input.message.trim()) {
        throw new Error('Notification message is required');
      }

      const { data, error } = await this.supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          type: input.type,
          title: input.title.trim(),
          message: input.message.trim(),
          action_label: input.action_label?.trim() || null
        })
        .select()
        .single();

      if (error) throw error;

      return data as Notification;

    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await this.supabase
        .from('notifications')
        .update({ is_read: true, updated_at: new Date().toISOString() })
        .eq('id', notificationId)
        .eq('user_id', user.id);

      if (error) throw error;

    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await this.supabase.rpc('mark_all_notifications_read', {
        p_user_id: user.id
      });

      if (error) throw error;

    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  /**
   * Archive (soft delete) a notification
   */
  async archiveNotification(notificationId: string): Promise<void> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await this.supabase.rpc('archive_notification', {
        p_notification_id: notificationId,
        p_user_id: user.id
      });

      if (error) throw error;

    } catch (error) {
      console.error('Error archiving notification:', error);
      throw error;
    }
  }

  /**
   * Get archived notifications
   */
  async getArchivedNotifications(limit: number = 50): Promise<Notification[]> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await this.supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .not('archived_at', 'is', null)
        .order('archived_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []) as Notification[];

    } catch (error) {
      console.error('Error fetching archived notifications:', error);
      throw error;
    }
  }

  /**
   * Delete notification permanently (hard delete)
   */
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await this.supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', user.id);

      if (error) throw error;

    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
