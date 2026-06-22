// src/api/classrooms.js
import { api, apiForm } from "./client.js";

export const createClassroom = (data) => api("/create_classroom", { method: "POST", body: data });
export const listClassrooms = () => api("/classrooms");
export const getClassroom = (id) => api(`/classroom/${id}`);
export const deleteClassroom = (id) => api(`/classroom/${id}`, { method: "DELETE" });
export const getMembers = (id) => api(`/classroom/${id}/members`);
export const removeMember = (classId, uid) =>
  api(`/classroom/${classId}/remove/${uid}`, { method: "DELETE" });
export const joinClassroom = (data) => api("/join_classroom", { method: "POST", body: data });
export const adminResetFace = (data) => api("/admin_reset_face", { method: "POST", body: data });
export const adminClearFace = (formData) => apiForm("/admin_clear_face", formData);
export const getFaceAudit = (id) => api(`/admin/face_audit/${id}`);
