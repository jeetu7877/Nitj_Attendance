// src/api/client.js

const getBase = () => {
  const h = window.location.hostname;
  if (!h || h === "localhost" || h === "127.0.0.1") return "http://localhost:8000";
  return import.meta.env.VITE_API_URL || window.location.origin;
};

export const BASE = getBase();

let _onUnauthorized = null;
export function setUnauthorizedHandler(fn) {
  _onUnauthorized = fn;
}

function getToken() {
  return localStorage.getItem("nitj_tok");
}

async function handleResponse(res) {
  if (res.status === 401) {
    localStorage.removeItem("nitj_tok");
    if (_onUnauthorized) _onUnauthorized();
    throw new Error("Session expired. Please log in again.");
  }
  const ct = res.headers.get("content-type") || "";
  const data = ct.includes("application/json") ? await res.json() : await res.text();
  if (!res.ok) {
    const msg =
      (data && (data.detail || data.message || data.error)) ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

export async function api(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });
  return handleResponse(res);
}

export async function apiForm(path, formData, method = "POST") {
  const token = getToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: formData,
  });
  return handleResponse(res);
}

export async function apiRaw(path, options = {}) {
  const token = getToken();
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  return handleResponse(res);
}
