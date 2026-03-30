import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import {
  getUserNotifications,
  markNotificationAsRead,
  UserNotification,
} from '@/features/accounts/api/user-notification-api';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Link } from 'react-router-dom';

const NotificationBell: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n['is-read']).length;

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated || !user || !user['account-id']) return;
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
    if (isAuthenticated && user && isOpen) {
      fetchNotifications();
    }
  }, [isAuthenticated, user, isOpen, fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleIconClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      setIsOpen((prev) => !prev);
    }
  };

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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleIconClick}
        className="relative flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white transition-colors hover:border-primary/40 hover:text-primary"
      >
        <span className="material-symbols-outlined">notifications</span>
        {isAuthenticated && unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && isAuthenticated && (
        <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 max-h-96 overflow-y-auto z-50">
          <div className="py-1">
            <div className="px-4 py-2 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Notifications</h3>
            </div>
            {isLoading ? (
              <div className="flex justify-center items-center p-4"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div></div>
            ) : notifications.length === 0 ? (
              <p className="text-gray-400 text-center py-4">You have no new notifications.</p>
            ) : (
              notifications.slice(0, 7).map((notification) => (
                <div key={notification['notification-id']} onClick={() => handleMarkAsRead(notification['notification-id'])} className={`px-4 py-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-b-0 ${!notification['is-read'] ? 'bg-gray-900/50' : ''}`}>
                  <div className="flex items-start gap-3">
                    {!notification['is-read'] && (<div className="mt-1.5 w-2 h-2 rounded-full bg-primary"></div>)}
                    <div className={`flex-1 ${notification['is-read'] ? 'ml-5' : ''}`}>
                      <p className="text-sm font-semibold text-white line-clamp-1">{notification.title}</p>
                      <p className="text-sm text-gray-300 line-clamp-2">{notification.content}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatDistanceToNow(new Date(notification['created-at']), { addSuffix: true, locale: vi })}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
             <div className="px-4 py-2 border-t border-gray-700 text-center sticky bottom-0 bg-gray-800">
                <Link to="/profile/notifications" onClick={() => setIsOpen(false)} className="text-sm text-primary hover:underline">
                    View all notifications
                </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;