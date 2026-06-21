// src/components/layout/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import Icon from "../common/Icon.jsx";
import { ICONS } from "../../constants/icons.js";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: ICONS.home },
  { to: "/classrooms", label: "Classrooms", icon: ICONS.classes },
  { to: "/assignments", label: "Assignments", icon: ICONS.tasks },
  { to: "/attendance", label: "My Attendance", icon: ICONS.attend },
  { to: "/notifications", label: "Notifications", icon: ICONS.bell },
  { to: "/profile", label: "Profile", icon: ICONS.profile },
];

export default function Sidebar({ collapsed, onToggle, unreadCount }) {
  const { logout } = useAuth();

  return (
    <nav className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Logo */}
      <div style={{
        padding: collapsed ? "16px 0" : "20px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        justifyContent: collapsed ? "center" : "flex-start",
      }}>
        <div style={{
          width: 32, height: 32, background: "var(--blue)", borderRadius: 8,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 800, fontSize: 14, color: "#fff", flexShrink: 0,
        }}>N</div>
        {!collapsed && (
          <div>
            <div className="sidebar-logo-text" style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>NITJ Classroom</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>AI Attendance</div>
          </div>
        )}
      </div>

      {/* Toggle button */}
      <button
        onClick={onToggle}
        style={{
          position: "absolute", right: -12, top: 28,
          width: 24, height: 24, borderRadius: "50%",
          background: "var(--blue)", border: "2px solid var(--card)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", color: "#fff", zIndex: 10,
        }}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <Icon d={collapsed ? ICONS.chevronRight : ICONS.chevronLeft} size={12} />
      </button>

      {/* Nav links */}
      <div style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: collapsed ? "10px 0" : "10px 12px",
              justifyContent: collapsed ? "center" : "flex-start",
              borderRadius: 8,
              color: isActive ? "#fff" : "rgba(255,255,255,0.6)",
              background: isActive ? "rgba(255,255,255,0.12)" : "transparent",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: isActive ? 600 : 400,
              transition: "all 0.15s",
              position: "relative",
            })}
          >
            <div style={{ position: "relative", flexShrink: 0 }}>
              <Icon d={item.icon} size={18} />
              {item.to === "/notifications" && unreadCount > 0 && (
                <span style={{
                  position: "absolute", top: -4, right: -4,
                  background: "var(--danger)", color: "#fff",
                  fontSize: 9, fontWeight: 700, borderRadius: "50%",
                  width: 14, height: 14, display: "flex", alignItems: "center", justifyContent: "center",
                }}>{unreadCount > 9 ? "9+" : unreadCount}</span>
              )}
            </div>
            <span className="sidebar-label">{item.label}</span>
            {item.to === "/notifications" && !collapsed && unreadCount > 0 && (
              <span style={{
                marginLeft: "auto", background: "var(--danger)", color: "#fff",
                fontSize: 10, fontWeight: 700, borderRadius: "99px", padding: "1px 6px",
              }}>{unreadCount}</span>
            )}
          </NavLink>
        ))}
      </div>

      {/* Logout */}
      <div style={{ padding: "8px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <button
          onClick={logout}
          style={{
            width: "100%", display: "flex", alignItems: "center",
            gap: 10, padding: collapsed ? "10px 0" : "10px 12px",
            justifyContent: collapsed ? "center" : "flex-start",
            background: "none", border: "none", color: "rgba(255,255,255,0.6)",
            cursor: "pointer", borderRadius: 8, fontSize: 14,
            transition: "all 0.15s",
          }}
        >
          <Icon d={ICONS.logout} size={18} />
          <span className="sidebar-label">Sign out</span>
        </button>
      </div>
    </nav>
  );
}
