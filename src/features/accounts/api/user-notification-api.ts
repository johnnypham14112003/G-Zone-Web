import privateApi from '@/lib/axios-api';

/**
 * Represents a user notification.
 * Corresponds to the C# `UserNotification` model.
 */
export interface UserNotification {
  'is-read': boolean;
  'read-at': string | null; // DateTime? in C# maps to ISO date string or null in TypeScript
  'created-at': string; // DateTime in C# maps to ISO date string in TypeScript
  'account-id': string; // Guid in C# maps to string in TypeScript
  'notification-id': string; // Guid in C# maps to string in TypeScript
  'title': string; // Tiêu đề của thông báo
  'content': string; // Nội dung của thông báo
}

/**
 * Payload for marking a notification as read.
 */
export interface MarkNotificationAsReadPayload {
  'is-read': boolean;
}

/**
 * Fetches all notifications for a given account ID.
 * @param accountId The ID of the account to fetch notifications for.
 * @returns A promise that resolves to an array of UserNotification objects.
 */
export const getUserNotifications = async (accountId: string): Promise<UserNotification[]> => {
  // Giả định endpoint là /user-notifications/account/{accountId}
  const response = await privateApi.get<{ data: UserNotification[] }>(`/user-notifications/account/${accountId}`);
  return response.data.data;
};

/**
 * Marks a specific user notification as read.
 * @param notificationId The ID of the notification to mark as read.
 * @param payload The payload containing the 'is-read' status.
 */
export const markNotificationAsRead = async (notificationId: string, payload: MarkNotificationAsReadPayload): Promise<void> => {
  // Giả định endpoint là /user-notifications/{notificationId}/read
  await privateApi.put(`/user-notifications/${notificationId}/read`, payload);
};