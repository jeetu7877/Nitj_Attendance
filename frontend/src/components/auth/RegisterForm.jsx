// src/components/auth/RegisterForm.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../api/auth.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { passwordStrength } from "../../utils/validators.js";
import Button from "../common/Button.jsx";

const DEPARTMENTS = [
  "Computer Science", "Electronics", "Mechanical", "Civil",
  "Chemical", "Electrical", "Mathematics", "Physics",
  "Biotechnology", "Management", "Other",
];

export default function RegisterForm() {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", department: "", password: "", confirm: ""
  });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const strength = passwordStrength(form.password);
  const match = form.password && form.confirm && form.password === form.confirm;
  const mismatch = form.confirm && !match;

  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast("Passwords do not match", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await register({
        name: form.name,
        email: form.email,
        department: form.department,
        password: form.password,
      });
      // Backend returns { token, message } — /me will be fetched by AuthContext
      if (res.token) {
        login(res.token);
        navigate("/dashboard");
      } else {
        toast("Registration successful! Please verify your email.", "success");
        navigate("/login");
      }
    } catch (err) {
      toast(err.message || "Registration failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="auth-title">Create account</h1>
      <p className="auth-subtitle">Join NITJ Classroom</p>
      <form onSubmit={submit}>
        <div className="form-group">
          <label className="form-label">Full name</label>
          <input className="form-input" value={form.name} onChange={set("name")} placeholder="Your name" required />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" required />
        </div>
        <div className="form-group">
          <label className="form-label">Department</label>
          <select className="form-select" value={form.department} onChange={set("department")} required>
            <option value="">Select department</option>
            {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" value={form.password} onChange={set("password")} placeholder="Min. 6 characters" required minLength={6} />
          {form.password && (
            <div className={`pw-strength ${strength}`} title={`Strength: ${strength}`} />
          )}
          {form.password && (
            <div className="form-hint">Strength: {strength}</div>
          )}
        </div>
        <div className="form-group">
          <label className="form-label">Confirm password</label>
          <input
            className={`form-input ${mismatch ? "error" : ""}`}
            type="password"
            value={form.confirm}
            onChange={set("confirm")}
            placeholder="Repeat password"
            required
          />
          {mismatch && <div className="form-error">Passwords do not match</div>}
          {match && <div style={{ fontSize: 12, color: "var(--success)", marginTop: 4 }}>✓ Passwords match</div>}
        </div>
        <Button type="submit" variant="primary" full loading={loading}>
          Create account
        </Button>
      </form>
      <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "var(--muted)" }}>
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </>
  );
}
