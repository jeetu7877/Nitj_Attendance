// src/components/auth/LoginForm.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as apiLogin } from "../../api/auth.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import Button from "../common/Button.jsx";
import Icon from "../common/Icon.jsx";
import { ICONS } from "../../constants/icons.js";

export default function LoginForm() {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiLogin(form);
      // Backend returns { token, message } — /me will be fetched by AuthContext
      login(res.token);
      navigate("/dashboard");
    } catch (err) {
      if (err.message?.includes("EMAIL_NOT_VERIFIED")) {
        toast("Please verify your email first.", "warning");
        navigate("/verify-email", { state: { email: form.email } });
      } else {
        toast(err.message || "Login failed", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="auth-title">Welcome back</h1>
      <p className="auth-subtitle">Sign in to continue</p>
      <form onSubmit={submit}>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            className="form-input"
            type="email"
            value={form.email}
            onChange={set("email")}
            placeholder="you@example.com"
            required
            autoFocus
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <div style={{ position: "relative" }}>
            <input
              className="form-input"
              type={showPw ? "text" : "password"}
              value={form.password}
              onChange={set("password")}
              placeholder="••••••••"
              required
              style={{ paddingRight: 42 }}
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--muted)" }}
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              <Icon d={showPw ? ICONS.eyeOff : ICONS.eye} size={18} />
            </button>
          </div>
        </div>
        <div style={{ textAlign: "right", marginBottom: 16 }}>
          <Link to="/forgot-password" style={{ fontSize: 13 }}>Forgot password?</Link>
        </div>
        <Button type="submit" variant="primary" full loading={loading}>
          Sign in
        </Button>
      </form>
      <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "var(--muted)" }}>
        Don't have an account?{" "}
        <Link to="/register">Create one</Link>
      </p>
    </>
  );
}
