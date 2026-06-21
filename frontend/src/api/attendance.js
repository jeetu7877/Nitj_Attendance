// src/api/attendance.js
import { api } from "./client.js";

export const recognize = (data) => api("/recognize", { method: "POST", body: data });
export const getAttendance = (classId) => api(`/attendance/${classId}`);
export const myAttendance = () => api("/my_attendance");
export const markAbsent = (classId) => api(`/mark_absent/${classId}`, { method: "POST" });
