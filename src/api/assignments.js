// src/api/assignments.js
import { api, apiForm } from "./client.js";

export const createAssignment = (formData) => apiForm("/create_assignment", formData);
export const getAssignment = (id) => api(`/assignments/${id}`);
export const myAssignments = () => api("/my_assignments");
export const updateDueDate = (id, data) =>
  api(`/assignment/${id}/due_date`, { method: "PUT", body: { due_date: data.due_date } });
export const deleteAssignment = (id) =>
  api(`/assignment/${id}`, { method: "DELETE" });
export const submitAssignment = (formData) => apiForm("/submit_assignment", formData);
export const getSubmissions = (id) => api(`/submissions/${id}`);
