// src/components/notifications/NotificationItem.jsx
import { formatDateTime } from "../../utils/formatDate.js";
import Icon from "../common/Icon.jsx";
import { ICONS } from "../../constants/icons.js";

const TYPE_MAP = {
  info:    { icon: ICONS.info,    color: "var(--blue)",    bg: "rgba(26,115,232,0.1)" },
  warning: { icon: ICONS.warning, color: "var(--warning)", bg: "rgba(245,158,11,0.1)" },
  error:   { icon: ICONS.x,       color: "var(--danger)",  bg: "rgba(239,68,68,0.1)"  },
  success: { icon: ICONS.success, color: "var(--success)", bg: "rgba(34,197,94,0.1)"  },
};

export default function NotificationItem({ notification }) {
  const t = TYPE_MAP[notification.type] || TYPE_MAP.info;
  return (
    <div style={{
      display: "flex",
      gap: 14,
      padding: "14px 16px",
      borderBottom: "1px solid var(--border)",
      background: notification.read ? "transparent" : "rgba(26,115,232,0.04)",
      transition: "background 0.2s",
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: "50%",
        background: t.bg, display: "flex", alignItems: "center",
        justifyContent: "center", flexShrink: 0,
      }}>
        <Icon d={t.icon} size={16} color={t.color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: notification.read ? 400 : 600, fontSize: 14, marginBottom: 2 }}>
          {notification.message || notification.title}
        </div>
        {notification.body && (
          <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 4 }}>{notification.body}</div>
        )}
        <div style={{ fontSize: 12, color: "var(--muted)" }}>{formatDateTime(notification.created_at)}</div>
      </div>
      {!notification.read && (
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--blue)", flexShrink: 0, marginTop: 6 }} />
      )}
    </div>
  );
}
