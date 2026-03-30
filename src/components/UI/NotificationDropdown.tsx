import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { notificationApi, UserNotificationResponse } from "@/features/notifications/api/notification-api";

const NotificationDropdown: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<UserNotificationResponse[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    if (!user?.id) return;
    try {
      const result = await notificationApi.getNotificationsByAccount(user.id);
      if (result.statusCode === 200 && result.data) {
        setNotifications(result.data);
      }
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Setup simple polling every 1 minute
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [user]);

  const handleMarkAsRead = async (notificationId: string) => {
    if (!user?.id) return;
    try {
      await notificationApi.markAsRead(user.id, notificationId);
      setNotifications((prev) =>
        prev.map((n) =>
          n.notificationId === notificationId ? { ...n, isRead: true } : n
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white/50 hover:text-white transition-colors"
      >
        <span className="material-symbols-outlined text-[28px] mt-2">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-surface-border bg-surface-dark shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between border-b border-surface-border bg-black/20 px-4 py-3">
            <h3 className="font-bold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs text-primary">{unreadCount} unread</span>
            )}
          </div>

          <div className="max-h-[360px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-sm text-white/40">
                You have no notifications yet.
              </div>
            ) : (
              <div className="divide-y divide-surface-border">
                {notifications.slice(0, 10).map((notification) => (
                  <div
                    key={notification.notificationId}
                    onClick={() => handleMarkAsRead(notification.notificationId)}
                    className={`cursor-pointer p-4 transition-colors hover:bg-white/[0.02] ${
                      !notification.isRead ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                          !notification.isRead ? "bg-primary" : "bg-transparent"
                        }`}
                      />
                      <div className="flex-1 space-y-1">
                        <p
                          className={`text-sm ${
                            !notification.isRead ? "font-bold text-white" : "text-white/80"
                          }`}
                        >
                          {notification.title}
                        </p>
                        <p className="text-xs text-white/50 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-[10px] text-white/30">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <Link
            to="/profile/notifications"
            onClick={() => setIsOpen(false)}
            className="block border-t border-surface-border bg-black/20 p-3 text-center text-xs font-bold text-primary hover:bg-black/40 hover:text-white transition-colors"
          >
            VIEW ALL NOTIFICATIONS
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;


