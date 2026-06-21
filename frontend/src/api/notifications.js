// src/api/notifications.js
import { api } from "./client.js";

export const getNotifications = () => api("/notifications");
export const readAllNotifications = () => api("/notifications/read_all", { method: "POST" });
