import { useState, useEffect, useCallback } from 'react';
import { AppNotification } from '../services/notification.service';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  requestNotificationPermission,
  sendLocalNotification
} from '../services/notification.service';

interface UseNotificationsReturn {
  notifications: AppNotification[];
  unreadCount: number;
  isLoading: boolean;
  hasPermission: boolean;
  refresh: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  deleteNotif: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  requestPermission: () => Promise<boolean>;
  sendLocal: (title: string, body: string) => void;
}

export const useNotifications = (userId: string | undefined): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  // Check notification permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setHasPermission(Notification.permission === 'granted');
    }
  }, []);

  // Load notifications
  useEffect(() => {
    if (userId) {
      loadNotifications();
    }
  }, [userId]);

  const loadNotifications = async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const [notifs, count] = await Promise.all([
        getNotifications(userId, 20),
        getUnreadCount(userId)
      ]);

      setNotifications(notifs);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh notifications
  const refresh = useCallback(async (): Promise<void> => {
    await loadNotifications();
  }, [userId]);

  // Mark single notification as read
  const markRead = useCallback(async (id: string): Promise<void> => {
    if (!userId) return;

    const success = await markAsRead(userId, id);
    if (success) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  }, [userId]);

  // Mark all as read
  const markAllRead = useCallback(async (): Promise<void> => {
    if (!userId) return;

    const success = await markAllAsRead(userId);
    if (success) {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    }
  }, [userId]);

  // Delete notification
  const deleteNotif = useCallback(async (id: string): Promise<void> => {
    if (!userId) return;

    const success = await deleteNotification(userId, id);
    if (success) {
      const notif = notifications.find((n) => n.id === id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (notif && !notif.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    }
  }, [userId, notifications]);

  // Clear all notifications
  const clearAll = useCallback(async (): Promise<void> => {
    if (!userId) return;

    const success = await clearAllNotifications(userId);
    if (success) {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [userId]);

  // Request push notification permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    const granted = await requestNotificationPermission();
    setHasPermission(granted);
    return granted;
  }, []);

  // Send local notification
  const sendLocal = useCallback((title: string, body: string): void => {
    if (hasPermission) {
      sendLocalNotification(title, body);
    }
  }, [hasPermission]);

  return {
    notifications,
    unreadCount,
    isLoading,
    hasPermission,
    refresh,
    markRead,
    markAllRead,
    deleteNotif,
    clearAll,
    requestPermission,
    sendLocal
  };
};

export default useNotifications;
