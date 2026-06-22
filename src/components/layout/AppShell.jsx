// src/components/layout/AppShell.jsx
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import MobileHeader from "./MobileHeader.jsx";
import BottomNav from "./BottomNav.jsx";
import { getNotifications } from "../../api/notifications.js";
import usePolling from "../../hooks/usePolling.js";
import { useAuth } from "../../context/AuthContext.jsx";

const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/classrooms": "Classrooms",
  "/assignments": "Assignments",
  "/attendance": "My Attendance",
  "/notifications": "Notifications",
  "/profile": "Profile",
};

function getTitle(pathname) {
  if (pathname.startsWith("/classroom/")) return "Classroom";
  return PAGE_TITLES[pathname] || "NITJ Classroom";
}

export default function AppShell({ children }) {
  const { token } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [unread, setUnread] = useState(0);
  const location = useLocation();
  const title = getTitle(location.pathname);

  const fetchNotifications = () => {
    if (!token) return;
    getNotifications()
      .then((data) => {
        const list = Array.isArray(data) ? data : (data.notifications || []);
        setUnread(list.filter((n) => !n.read).length);
      })
      .catch(() => {});
  };

  usePolling(fetchNotifications, 30000, !!token);

  return (
    <div className="app-shell">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        unreadCount={unread}
      />
      <div className={`main-content ${collapsed ? "sidebar-collapsed" : ""}`}>
        <MobileHeader title={title} unreadCount={unread} />
        <Topbar title={title} unreadCount={unread} />
        <main className="page-body fade-in">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
