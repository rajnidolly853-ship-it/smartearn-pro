import { doc, getDoc, setDoc, updateDoc, collection, addDoc, query, where, orderBy, limit, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase.config';

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'reward' | 'withdrawal' | 'system' | 'promo';
  isRead: boolean;
  createdAt: number;
  data?: Record<string, any>;
}

/**
 * Get user's notifications
 */
export const getNotifications = async (
  userId: string,
  limitCount: number = 20
): Promise<AppNotification[]> => {
  try {
    const q = query(
      collection(db, `users/${userId}/notifications`),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    })) as AppNotification[];
  } catch (error) {
    console.error('Error getting notifications:', error);
    return [];
  }
};

/**
 * Get unread notification count
 */
export const getUnreadCount = async (userId: string): Promise<number> => {
  try {
    const q = query(
      collection(db, `users/${userId}/notifications`),
      where('isRead', '==', false)
    );

    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
};

/**
 * Create a new notification
 */
export const createNotification = async (
  userId: string,
  title: string,
  message: string,
  type: AppNotification['type'] = 'system',
  data?: Record<string, any>
): Promise<boolean> => {
  try {
    await addDoc(collection(db, `users/${userId}/notifications`), {
      userId,
      title,
      message,
      type,
      isRead: false,
      createdAt: Date.now(),
      data
    });
    return true;
  } catch (error) {
    console.error('Error creating notification:', error);
    return false;
  }
};

/**
 * Mark notification as read
 */
export const markAsRead = async (userId: string, notificationId: string): Promise<boolean> => {
  try {
    const notifRef = doc(db, `users/${userId}/notifications`, notificationId);
    await updateDoc(notifRef, { isRead: true });
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async (userId: string): Promise<boolean> => {
  try {
    const q = query(
      collection(db, `users/${userId}/notifications`),
      where('isRead', '==', false)
    );

    const snapshot = await getDocs(q);

    const updatePromises = snapshot.docs.map((docSnap) =>
      updateDoc(doc(db, `users/${userId}/notifications`, docSnap.id), { isRead: true })
    );

    await Promise.all(updatePromises);
    return true;
  } catch (error) {
    console.error('Error marking all as read:', error);
    return false;
  }
};

/**
 * Delete a notification
 */
export const deleteNotification = async (userId: string, notificationId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, `users/${userId}/notifications`, notificationId));
    return true;
  } catch (error) {
    console.error('Error deleting notification:', error);
    return false;
  }
};

/**
 * Clear all notifications
 */
export const clearAllNotifications = async (userId: string): Promise<boolean> => {
  try {
    const q = query(collection(db, `users/${userId}/notifications`));
    const snapshot = await getDocs(q);

    const deletePromises = snapshot.docs.map((docSnap) =>
      deleteDoc(doc(db, `users/${userId}/notifications`, docSnap.id))
    );

    await Promise.all(deletePromises);
    return true;
  } catch (error) {
    console.error('Error clearing notifications:', error);
    return false;
  }
};

// ========================================
// 📱 PUSH NOTIFICATION (FCM Setup)
// ========================================

/**
 * Save FCM token to user profile
 */
export const saveFCMToken = async (userId: string, token: string): Promise<boolean> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { fcmToken: token });
    return true;
  } catch (error) {
    console.error('Error saving FCM token:', error);
    return false;
  }
};

/**
 * Request notification permission
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported');
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting permission:', error);
    return false;
  }
};

/**
 * Send local notification (for PWA)
 */
export const sendLocalNotification = (title: string, body: string, icon?: string): void => {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  try {
    new Notification(title, {
      body,
      icon: icon || '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      tag: 'smartearn-notification',
      renotify: true
    });
  } catch (error) {
    console.error('Error sending local notification:', error);
  }
};

// ========================================
// 🎯 PRE-DEFINED NOTIFICATION TEMPLATES
// ========================================

export const NotificationTemplates = {
  DAILY_REMINDER: {
    title: '🎁 Daily Bonus Waiting!',
    message: 'Claim your daily check-in bonus before it resets!'
  },
  WITHDRAWAL_APPROVED: (amount: string) => ({
    title: '💰 Withdrawal Approved!',
    message: `Your withdrawal of ${amount} has been approved and processed.`
  }),
  WITHDRAWAL_REJECTED: (reason: string) => ({
    title: '❌ Withdrawal Rejected',
    message: `Your withdrawal was rejected. Reason: ${reason}`
  }),
  REFERRAL_JOINED: (name: string) => ({
    title: '👥 New Referral!',
    message: `${name} joined using your referral code!`
  }),
  REFERRAL_BONUS: (amount: number) => ({
    title: '🎉 Referral Bonus!',
    message: `You earned ${amount} coins from your referral!`
  }),
  SPIN_WIN: (amount: number) => ({
    title: '🎡 Spin Win!',
    message: `Congratulations! You won ${amount} coins!`
  })
};

export default {
  getNotifications,
  getUnreadCount,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  saveFCMToken,
  requestNotificationPermission,
  sendLocalNotification,
  NotificationTemplates
};
