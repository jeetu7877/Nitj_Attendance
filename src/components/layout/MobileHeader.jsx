// src/components/layout/MobileHeader.jsx
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext.jsx";
import Icon from "../common/Icon.jsx";
import { ICONS } from "../../constants/icons.js";

export default function MobileHeader({ title, unreadCount }) {
  const navigate = useNavigate();
  const { darkMode, toggleDark } = useTheme();

  return (
    <header className="mobile-header">
      <div style={{
        width: 30, height: 30, background: "var(--blue)", borderRadius: 8,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 800, fontSize: 13, color: "#fff", flexShrink: 0,
      }}>N</div>
      <div style={{ fontWeight: 600, flex: 1, fontSize: 15 }}>{title}</div>
      <button className="btn btn-icon" onClick={toggleDark} style={{ color: "rgba(255,255,255,0.8)" }} aria-label="Toggle theme">
        <Icon d={darkMode ? ICONS.sun : ICONS.moon} size={18} />
      </button>
      <button
        className="btn btn-icon"
        style={{ position: "relative", color: "rgba(255,255,255,0.8)" }}
        onClick={() => navigate("/notifications")}
        aria-label="Notifications"
      >
        <Icon d={ICONS.bell} size={18} />
        {unreadCount > 0 && (
          <span style={{
            position: "absolute", top: 4, right: 4,
            background: "var(--danger)", color: "#fff",
            fontSize: 9, borderRadius: "50%",
            width: 14, height: 14, display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700,
          }}>{unreadCount > 9 ? "9+" : unreadCount}</span>
        )}
      </button>
    </header>
  );
}
