// src/pages/DashboardPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { listClassrooms } from "../api/classrooms.js";
import { myAssignments } from "../api/assignments.js";
import ClassCard from "../components/classroom/ClassCard.jsx";
import CreateClassroomModal from "../components/classroom/CreateClassroomModal.jsx";
import JoinClassroomModal from "../components/classroom/JoinClassroomModal.jsx";
import SkeletonCard from "../components/common/SkeletonCard.jsx";
import Icon from "../components/common/Icon.jsx";
import { ICONS } from "../constants/icons.js";
import { formatDate, isOverdue } from "../utils/formatDate.js";

export default function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);

  useEffect(() => {
    Promise.all([listClassrooms(), myAssignments()])
      .then(([cData, aData]) => {
        setClasses(Array.isArray(cData) ? cData : (cData.classrooms || []));
        setAssignments(Array.isArray(aData) ? aData : (aData.assignments || []));
      })
      .catch(() => toast("Failed to load dashboard", "error"))
      .finally(() => setLoading(false));
  }, []);

  const firstName = user?.name?.split(" ")[0] || "there";
  const adminCount = classes.filter((c) => c.is_admin === 1 || c.is_admin === true).length;
  const now = new Date();
  const upcoming = assignments.filter((a) => !a.submitted && !isOverdue(a.due_date));
  const overdue = assignments.filter((a) => !a.submitted && isOverdue(a.due_date));
  const upcomingTop3 = [...upcoming].sort((a, b) => new Date(a.due_date) - new Date(b.due_date)).slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <div className="hero-banner">
        <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 4 }}>
          {now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>Welcome back, {firstName}! 👋</h1>
        <p style={{ opacity: 0.8, fontSize: 14 }}>
          {classes.length} classroom{classes.length !== 1 ? "s" : ""} · {upcoming.length} upcoming · {overdue.length} overdue
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: "Classes", value: classes.length, icon: ICONS.classes, color: "var(--blue)", bg: "rgba(26,115,232,0.12)" },
          { label: "Upcoming", value: upcoming.length, icon: ICONS.clock, color: "var(--warning)", bg: "rgba(245,158,11,0.12)" },
          { label: "Overdue", value: overdue.length, icon: ICONS.warning, color: "var(--danger)", bg: "rgba(239,68,68,0.12)" },
          { label: "Admin of", value: adminCount, icon: ICONS.users, color: "var(--success)", bg: "rgba(34,197,94,0.12)" },
        ].map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-icon" style={{ background: s.bg }}>
              <Icon d={s.icon} size={22} color={s.color} />
            </div>
            <div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming deadlines */}
      {upcomingTop3.length > 0 && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header">
            <span className="card-title">⏰ Upcoming Deadlines</span>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate("/assignments")}>View all</button>
          </div>
          {upcomingTop3.map((a) => (
            <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
              <div>
                <div style={{ fontWeight: 500, fontSize: 14 }}>{a.title}</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{a.class_name}</div>
              </div>
              <span className="badge badge-yellow">{formatDate(a.due_date)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Quick actions + Classroom grid */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Your Classrooms</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => setShowJoin(true)}>
            <Icon d={ICONS.plus} size={16} /> Join
          </button>
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
            <Icon d={ICONS.plus} size={16} /> Create
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid-auto">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : classes.length === 0 ? (
        <div className="empty-state">
          <Icon d={ICONS.classes} size={48} />
          <h3>No classrooms yet</h3>
          <p>Create a classroom or join one with a code.</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 16 }}>
            <button className="btn btn-primary" onClick={() => setShowCreate(true)}>Create</button>
            <button className="btn btn-ghost" onClick={() => setShowJoin(true)}>Join</button>
          </div>
        </div>
      ) : (
        <div className="grid-auto">
          {classes.map((c) => (
            <ClassCard
              key={c.id}
              classroom={c}
              onDeleted={(id) => setClasses((cl) => cl.filter((x) => x.id !== id))}
            />
          ))}
        </div>
      )}

      {showCreate && (
        <CreateClassroomModal
          onClose={() => setShowCreate(false)}
          onCreated={(c) => setClasses((cl) => [c, ...cl])}
        />
      )}
      {showJoin && (
        <JoinClassroomModal
          onClose={() => setShowJoin(false)}
          onJoined={() => listClassrooms().then((d) => setClasses(Array.isArray(d) ? d : (d.classrooms || [])))}
        />
      )}
    </div>
  );
}
