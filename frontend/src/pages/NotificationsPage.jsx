// src/pages/NotificationsPage.jsx
import { useState, useEffect } from "react";
import { getNotifications, readAllNotifications } from "../api/notifications.js";
import { useToast } from "../context/ToastContext.jsx";
import NotificationItem from "../components/notifications/NotificationItem.jsx";
import Button from "../components/common/Button.jsx";
import { PageSpinner } from "../components/common/Spinner.jsx";
import Icon from "../components/common/Icon.jsx";
import { ICONS } from "../constants/icons.js";

export default function NotificationsPage() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  const load = () => {
    getNotifications()
      .then((d) => setNotifications(Array.isArray(d) ? d : (d.notifications || [])))
      .catch(() => toast("Failed to load notifications", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleMarkAll = async () => {
    setMarking(true);
    try {
      await readAllNotifications();
      setNotifications((n) => n.map((x) => ({ ...x, read: true })));
      toast("All notifications marked as read", "success");
    } catch (err) {
      toast(err.message || "Failed", "error");
    } finally {
      setMarking(false);
    }
  };

  const unread = notifications.filter((n) => !n.read).length;

  if (loading) return <PageSpinner />;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>Notifications</h1>
          {unread > 0 && <div style={{ fontSize: 13, color: "var(--muted)" }}>{unread} unread</div>}
        </div>
        {unread > 0 && (
          <Button variant="ghost" size="sm" onClick={handleMarkAll} loading={marking}>
            Mark all read
          </Button>
        )}
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {notifications.length === 0 ? (
          <div className="empty-state">
            <Icon d={ICONS.bell} size={48} />
            <h3>All caught up!</h3>
            <p>No notifications yet.</p>
          </div>
        ) : (
          notifications.map((n, i) => (
            <NotificationItem key={n.id || i} notification={n} />
          ))
        )}
      </div>
    </div>
  );
}
