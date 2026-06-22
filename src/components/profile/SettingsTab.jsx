// src/components/profile/SettingsTab.jsx
import { useAuth } from "../../context/AuthContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button.jsx";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी (Hindi)" },
  { code: "pa", label: "ਪੰਜਾਬੀ (Punjabi)" },
];

export default function SettingsTab() {
  const { logout } = useAuth();
  const { darkMode, toggleDark, fontSize, setFontSize } = useTheme();
  const navigate = useNavigate();

  const resetSettings = () => {
    if (darkMode) toggleDark();
    setFontSize("md");
    localStorage.removeItem("nitj_notif_prefs");
  };

  return (
    <div style={{ maxWidth: 560 }}>
      {/* Appearance */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 16 }}>Appearance</div>

        <div className="toggle-wrap">
          <div>
            <div style={{ fontWeight: 500, fontSize: 14 }}>Dark mode</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>Switch to dark theme</div>
          </div>
          <label className="toggle">
            <input type="checkbox" checked={darkMode} onChange={toggleDark} />
            <span className="toggle-slider" />
          </label>
        </div>

        <div style={{ padding: "12px 0" }}>
          <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 8 }}>Font size</div>
          <div style={{ display: "flex", gap: 8 }}>
            {[["sm", "Small"], ["md", "Medium"], ["lg", "Large"]].map(([val, label]) => (
              <button
                key={val}
                className={`btn ${fontSize === val ? "btn-primary" : "btn-secondary"} btn-sm`}
                onClick={() => setFontSize(val)}
              >{label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Language */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 12 }}>Language</div>
        <select
          className="form-select"
          defaultValue={localStorage.getItem("nitj_lang") || "en"}
          onChange={(e) => localStorage.setItem("nitj_lang", e.target.value)}
        >
          {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
        </select>
        <div className="form-hint">UI translation coming soon.</div>
      </div>

      {/* Preview card */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Live preview</div>
        <div style={{ padding: 16, background: "var(--bg)", borderRadius: "var(--radius-sm)" }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Sample heading</div>
          <div style={{ color: "var(--muted)", fontSize: "0.9em" }}>This text reflects your current font size and theme settings.</div>
        </div>
      </div>

      {/* About */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>About</div>
        <div style={{ fontSize: 13, color: "var(--muted)" }}>
          <div>NITJ Classroom — AI Attendance Platform</div>
          <div>Version 10.2 (Vite + React 18)</div>
          <div>NIT Jalandhar</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Button variant="secondary" onClick={resetSettings}>Reset all settings</Button>
        <Button variant="danger" onClick={() => { logout(); navigate("/login"); }}>Sign out</Button>
      </div>
    </div>
  );
}
