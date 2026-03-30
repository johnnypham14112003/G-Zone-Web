import React, { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { notificationApi, UserNotificationResponse } from "@/features/notifications/api/notification-api";

const NotificationPage: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<UserNotificationResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.id) return;
      try {
        const result = await notificationApi.getNotificationsByAccount(user.id);
        if (result.statusCode === 200 && result.data) {
          setNotifications(result.data);
        }
      } catch (error) {
        console.error("Error fetching notifications", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
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
      console.error("Error marking as read", error);
    }
  };

  return (
    <div className="mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tight text-white">
            Notifications
          </h1>
          <p className="mt-2 text-white/60">
            View all your system alerts, order updates, and promotions.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-surface-border bg-surface-dark p-6">
        {loading ? (
          <div className="flex h-32 items-center justify-center text-white/50">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-white/50">
            You have no notifications.
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.notificationId}
                className={`flex items-start gap-4 rounded-xl border p-4 transition-colors ${
                  !notification.isRead
                    ? "border-primary/50 bg-primary/5"
                    : "border-surface-border bg-black/20"
                }`}
              >
                <div
                  className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    !notification.isRead ? "bg-primary text-white" : "bg-white/10 text-white/50"
                  }`}
                >
                  <span className="material-symbols-outlined">notifications</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h3
                      className={`text-lg ${
                        !notification.isRead ? "font-bold text-white" : "font-medium text-white/80"
                      }`}
                    >
                      {notification.title}
                    </h3>
                    <span className="text-xs text-white/40">
                      {new Date(notification.createdAt).toLocaleDateString()} {new Date(notification.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-white/60">{notification.message}</p>
                  
                  {!notification.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notification.notificationId)}
                      className="mt-3 text-xs font-bold text-primary hover:text-white transition-colors"
                    >
                      MARK AS READ
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;

