import * as notificationApi from "@/api/notification";
import api from "@/api/axios";

const getBaseUrl = () => {
  return api.defaults.baseURL || "";
};

class NotificationService {
  constructor() {
    this.eventSource = null;
    this.listeners = [];
    this.connected = false;
    this.reconnectTimeout = null;
    this.refreshTimeout = null;
  }

  connect() {
    if (this.connected) return;

    this.disconnect();

    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const token = userData.token;

    if (!token) return;

    const baseUrl = getBaseUrl();
    const streamUrl = `${baseUrl}/notifications/stream?auth_token=${encodeURIComponent(
      token
    )}`;

    console.log(`Connecting to Notification Service`);
    this.eventSource = new EventSource(streamUrl, {
      withCredentials: true,
    });

    this.eventSource.onopen = () => {
      console.log("Notification Service connection established");
      this.connected = true;
      
      this.refreshTimeout = setTimeout(() => {
        console.log("Proactively refreshing Notification Service connection");
        this.disconnect();
        this.connect();
      }, 110000);
    };

    this.eventSource.addEventListener("notification", (event) => {
      try {
        const notification = JSON.parse(event.data);
        console.log("notification", notification)
        this.listeners.forEach((listener) => listener(notification));
      } catch (error) {
        console.error("Failed to parse notification:", error);
      }
    });

    this.eventSource.addEventListener("ping", () => {
      console.log("Ping received");
    });

    this.eventSource.onerror = (error) => {
      console.error("Notification Service connection error:", error);
      this.disconnect();

      this.reconnectTimeout = setTimeout(() => this.connect(), 5000);
    };
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }

    this.connected = false;

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
      this.refreshTimeout = null;
    }
  }

  addListener(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(
        (listener) => listener !== callback
      );
    };
  }

  async getNotifications(limit = 6, offset = 0) {
    return notificationApi.getNotifications(limit, offset);
  }

  async getUnreadCount() {
    return notificationApi.getUnreadCount();
  }

  async markAsRead(notificationId) {
    return notificationApi.markAsRead(notificationId);
  }

  async markAllAsRead() {
    return notificationApi.markAllAsRead();
  }
}

const notificationService = new NotificationService();
export default notificationService;
