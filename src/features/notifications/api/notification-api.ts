import { publicApi as api } from '@/lib/axios-api';

export interface UserNotificationResponse {
  notificationId: string;
  accountId: string;
  title: string;
  message: string;
  notificationType: string;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

const mapNotification = (data: any): UserNotificationResponse => ({
  notificationId: data["notification-id"],
  accountId: data["account-id"],
  title: data["title"],
  message: data["message"],
  notificationType: data["notification-type"],
  isRead: data["is-read"],
  readAt: data["read-at"],
  createdAt: data["created-at"],
});

export const notificationApi = {
  getNotificationsByAccount: async (accountId: string) => {
    const response = await api.get<any>(/user-notifications/ + accountId);
    const rawData = response.data;
    return {
      statusCode: rawData["status-code"],
      message: rawData["message"],
      data: (rawData["data"] || []).map(mapNotification),
    };
  },

  markAsRead: async (accountId: string, notificationId: string) => {
    const response = await api.put<any>(/user-notifications/ + accountId + /mark-read/ + notificationId);     
    const rawData = response.data;
    return {
      statusCode: rawData["status-code"],
      message: rawData["message"],
      data: rawData["data"]
    };
  },

  sendNotification: async (accountId: string, data: { title: string, message: string, type?: string }) => {
    const response = await api.post<any>(/user-notifications/ + accountId, {
      title: data.title,
      message: data.message,
      type: data.type || "System"
    });
    const rawData = response.data;
    return {
      statusCode: rawData["status-code"],
      message: rawData["message"],
      data: rawData["data"]
    };
  }
};
