import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import {
  getUserNotifications,
  markNotificationAsRead,
  UserNotification,
} from '@/features/accounts/api/user-notification-api';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const AllNotificationsPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated || !user || !user['account-id']) {
        setIsLoading(false);
        return;
    };
    setIsLoading(true);
    try {
      const fetchedNotifications = await getUserNotifications(user['account-id']);
      setNotifications(fetchedNotifications.sort((a, b) => new Date(b['created-at']).getTime() - new Date(a['created-at']).getTime()));
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (notificationId: string) => {
    const notification = notifications.find(n => n['notification-id'] === notificationId);
    if (!notification || notification['is-read']) return;

    try {
      await markNotificationAsRead(notificationId, { 'is-read': true });
      setNotifications((prev) =>
        prev.map((n) =>
          n['notification-id'] === notificationId ? { ...n, 'is-read': true, 'read-at': new Date().toISOString() } : n
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  if (isLoading) {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center items-center p-10">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
            </div>
        </div>
    );
  }

  if (!isAuthenticated) {
    return (
        <div className="container mx-auto px-4 py-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p>Please log in to view your notifications.</p>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">All Notifications</h1>
      <div className="bg-surface-dark shadow-xl rounded-lg">
        <ul className="divide-y divide-gray-700">
          {notifications.length === 0 ? (
            <li className="p-6 text-center text-gray-400">
              You have no notifications.
            </li>
          ) : (
            notifications.map((notification) => (
              <li key={notification['notification-id']} onClick={() => handleMarkAsRead(notification['notification-id'])} className={`p-6 hover:bg-gray-700/50 cursor-pointer transition-colors duration-200 ${!notification['is-read'] ? 'bg-gray-900/50' : ''}`}>
                <div className="flex items-start gap-4">
                  {!notification['is-read'] && (<div className="mt-1.5 flex-shrink-0 w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>)}
                  <div className={`flex-1 ${notification['is-read'] ? 'ml-[18px]' : ''}`}>
                    <div className="flex justify-between items-baseline">
                        <p className="text-base font-semibold text-white">{notification.title}</p>
                        <p className="text-xs text-gray-400">{formatDistanceToNow(new Date(notification['created-at']), { addSuffix: true, locale: vi })}</p>
                    </div>
                    <p className="text-sm text-gray-300 mt-1">{notification.content}</p>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default AllNotificationsPage;