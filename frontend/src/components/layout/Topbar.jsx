// src/components/layout/Topbar.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import Icon from "../common/Icon.jsx";
import { ICONS } from "../../constants/icons.js";

export default function Topbar({ title, unreadCount }) {
  const { user } = useAuth();
  const { darkMode, toggleDark } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="topbar">
      <div style={{ fontWeight: 600, fontSize: 16, flex: 1 }}>{title}</div>
      <button
        className="btn btn-icon"
        onClick={toggleDark}
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        <Icon d={darkMode ? ICONS.sun : ICONS.moon} size={18} />
      </button>
      <button
        className="btn btn-icon"
        style={{ position: "relative" }}
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
      <div
        onClick={() => navigate("/profile")}
        style={{
          width: 34, height: 34, borderRadius: "50%",
          background: "var(--blue)", color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 700, fontSize: 14, cursor: "pointer", flexShrink: 0,
        }}
        aria-label="Profile"
      >
        {user?.name?.[0]?.toUpperCase() || "U"}
      </div>
    </header>
  );
}
