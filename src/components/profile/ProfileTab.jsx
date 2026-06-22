// src/components/profile/ProfileTab.jsx
import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import Button from "../common/Button.jsx";

const DEPARTMENTS = [
  "Computer Science", "Electronics", "Mechanical", "Civil",
  "Chemical", "Electrical", "Mathematics", "Physics",
  "Biotechnology", "Management", "Other",
];

export default function ProfileTab() {
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || "", department: user?.department || "" });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = () => {
    // NOTE: No PUT /me endpoint exists on the backend yet — local-only update (same limitation as original code)
    setUser((u) => ({ ...u, ...form }));
    toast("Profile updated (local only — backend update not yet available)", "info");
    setEditing(false);
  };

  return (
    <div className="card" style={{ maxWidth: 560 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: "var(--blue)", color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 28, fontWeight: 700,
        }}>{user?.name?.[0]?.toUpperCase()}</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 20 }}>{user?.name}</div>
          <div style={{ color: "var(--muted)", fontSize: 14 }}>{user?.email}</div>
          <div style={{ color: "var(--muted)", fontSize: 13 }}>{user?.department}</div>
        </div>
      </div>

      {editing ? (
        <>
          <div className="form-group">
            <label className="form-label">Full name</label>
            <input className="form-input" value={form.name} onChange={set("name")} />
          </div>
          <div className="form-group">
            <label className="form-label">Department</label>
            <select className="form-select" value={form.department} onChange={set("department")}>
              <option value="">Select department</option>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Button variant="primary" onClick={save}>Save changes</Button>
            <Button variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
          </div>
        </>
      ) : (
        <Button variant="ghost" onClick={() => setEditing(true)}>Edit profile</Button>
      )}
    </div>
  );
}
