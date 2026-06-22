// src/api/posts.js
import { api, apiForm } from "./client.js";

export const createPost = (data) => api("/post", { method: "POST", body: data });
export const uploadMaterial = (formData) => apiForm("/upload_material", formData);
export const getPosts = (classId) => api(`/posts/${classId}`);
export const deletePost = (id) => api(`/post/${id}`, { method: "DELETE" });
export const createComment = (data) => api("/comment", { method: "POST", body: data });
export const getComments = (postId) => api(`/comments/${postId}`);
