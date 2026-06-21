// src/pages/ProfilePage.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import ProfileTab from "../components/profile/ProfileTab.jsx";
import SecurityTab from "../components/profile/SecurityTab.jsx";
import SettingsTab from "../components/profile/SettingsTab.jsx";

const TABS = ["Profile", "Security", "Settings"];

export default function ProfilePage() {
  const { user } = useAuth();
  const [active, setActive] = useState(0);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Account</h1>
        <div style={{ fontSize: 14, color: "var(--muted)" }}>{user?.email}</div>
      </div>

      <div className="tabs">
        {TABS.map((t, i) => (
          <button
            key={t}
            className={`tab-btn ${active === i ? "active" : ""}`}
            onClick={() => setActive(i)}
          >{t}</button>
        ))}
      </div>

      {active === 0 && <ProfileTab />}
      {active === 1 && <SecurityTab />}
      {active === 2 && <SettingsTab />}
    </div>
  );
}
