// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { me } from "../api/auth.js";
import { setUnauthorizedHandler, BASE } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children, navigate }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("nitj_tok"));
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("nitj_tok");
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      logout();
      if (navigate) navigate("/login");
    });
  }, [logout, navigate]);

  // Fetch /me whenever token changes (on page load or after login)
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`${BASE}/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setUser)
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, [token]); // eslint-disable-line

  const login = (tok) => {
    localStorage.setItem("nitj_tok", tok);
    setToken(tok); // This triggers the useEffect above which calls /me
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
