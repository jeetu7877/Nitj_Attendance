// src/api/auth.js
import { api } from "./client.js";

export const register = (data) => api("/register", { method: "POST", body: data });
export const sendOtp = (data) => api("/send_otp", { method: "POST", body: data });
export const login = (data) => api("/login", { method: "POST", body: data });
export const me = () => api("/me");
export const forgotPassword = (data) => api("/forgot_password", { method: "POST", body: data });
export const resetPassword = (data) => api("/reset_password", { method: "POST", body: data });
export const verifyOtp = (data) => api("/verify_otp", { method: "POST", body: data });
