import api from "./axios";

export const getNotifications = async (limit = 20, offset = 0) => {
  const res = await api.get(`/notifications?limit=${limit}&offset=${offset}`);
  if (res.status !== 200 || !res?.data?.data)
    throw new Error("Failed to fetch notifications");
  return res.data.data;
};

export const getUnreadCount = async () => {
  const res = await api.get("/notifications/unread-count");
  if (res.status !== 200 || !res?.data?.data)
    throw new Error("Failed to fetch unread count");
  return res.data.data;
};

export const markAsRead = async (notificationId) => {
  const res = await api.put(`/notifications/${notificationId}/read`);
  if (res.status !== 204)
    throw new Error("Failed to mark notification as read");
};

export const markAllAsRead = async () => {
  const res = await api.put("/notifications/read-all");
  if (res.status !== 204)
    throw new Error("Failed to mark all notifications as read");
};
