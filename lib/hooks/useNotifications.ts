// =====================================================
// FINANCE APP - Notifications Hook
// =====================================================
// Description: React hooks for notification management
// =====================================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  notificationService,
  type Notification,
  type NotificationGroup,
  type NotificationFilters,
  type CreateNotificationInput,
  type NotificationType
} from '@/lib/services/notifications';

/**
 * Hook for fetching all notifications
 */
export function useNotifications(filters: NotificationFilters = {}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await notificationService.getNotifications(filters);
      setNotifications(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    loading,
    error,
    refresh: fetchNotifications
  };
}

/**
 * Hook for fetching grouped notifications (Today, Yesterday, etc.)
 */
export function useGroupedNotifications() {
  const [groups, setGroups] = useState<NotificationGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await notificationService.getGroupedNotifications();
      setGroups(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching grouped notifications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  return {
    groups,
    loading,
    error,
    refresh: fetchGroups
  };
}

/**
 * Hook for unread notification count
 */
export function useUnreadCount() {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCount = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const unreadCount = await notificationService.getUnreadCount();
      setCount(unreadCount);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching unread count:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  return {
    count,
    loading,
    error,
    refresh: fetchCount
  };
}

/**
 * Hook for managing notifications (CRUD operations)
 */
export function useManageNotifications() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createNotification = useCallback(async (input: CreateNotificationInput) => {
    try {
      setLoading(true);
      setError(null);
      const notification = await notificationService.createNotification(input);
      return notification;
    } catch (err) {
      setError(err as Error);
      console.error('Error creating notification:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      setLoading(true);
      setError(null);
      await notificationService.markAsRead(notificationId);
    } catch (err) {
      setError(err as Error);
      console.error('Error marking notification as read:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await notificationService.markAllAsRead();
    } catch (err) {
      setError(err as Error);
      console.error('Error marking all notifications as read:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const archiveNotification = useCallback(async (notificationId: string) => {
    try {
      setLoading(true);
      setError(null);
      await notificationService.archiveNotification(notificationId);
    } catch (err) {
      setError(err as Error);
      console.error('Error archiving notification:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      setLoading(true);
      setError(null);
      await notificationService.deleteNotification(notificationId);
    } catch (err) {
      setError(err as Error);
      console.error('Error deleting notification:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createNotification,
    markAsRead,
    markAllAsRead,
    archiveNotification,
    deleteNotification
  };
}

/**
 * Hook for archived notifications
 */
export function useArchivedNotifications(limit: number = 50) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchArchived = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await notificationService.getArchivedNotifications(limit);
      setNotifications(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching archived notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchArchived();
  }, [fetchArchived]);

  return {
    notifications,
    loading,
    error,
    refresh: fetchArchived
  };
}
