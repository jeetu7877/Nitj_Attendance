// src/components/classroom/ClassCard.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { deleteClassroom } from "../../api/classrooms.js";
import Icon from "../common/Icon.jsx";
import { ICONS } from "../../constants/icons.js";

const BANNER_COLORS = [
  "#1a73e8", "#0f3d6e", "#7c3aed", "#059669",
  "#dc2626", "#d97706", "#0891b2", "#be185d",
];

function colorFor(id) {
  const h = [...(id || "x")].reduce((a, c) => a + c.charCodeAt(0), 0);
  return BANNER_COLORS[h % BANNER_COLORS.length];
}

export default function ClassCard({ classroom, onDeleted }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isAdmin = classroom.is_admin === 1 || classroom.is_admin === true || classroom.creator_id === user?.id;
  const color = colorFor(classroom.id);

  const handleDelete = async (e) => {
    e.stopPropagation();
    // TODO: replace with custom ConfirmModal
    if (!confirm(`Delete "${classroom.name}"? This cannot be undone.`)) return;
    try {
      await deleteClassroom(classroom.id);
      toast("Classroom deleted", "success");
      if (onDeleted) onDeleted(classroom.id);
    } catch (err) {
      toast(err.message || "Delete failed", "error");
    }
  };

  return (
    <div className="class-card" onClick={() => navigate(`/classroom/${classroom.id}`)}>
      <div className="class-card-banner" style={{ background: color }} />
      <div className="class-card-body">
        <div className="class-card-actions" onClick={(e) => e.stopPropagation()}>
          {isAdmin && (
            <button className="btn btn-icon btn-sm" onClick={handleDelete} title="Delete classroom" aria-label="Delete classroom">
              <Icon d={ICONS.trash} size={15} color="var(--danger)" />
            </button>
          )}
        </div>
        <div className="class-card-title">{classroom.name}</div>
        <div className="class-card-meta">
          <span className="code-pill">{classroom.code}</span>
          {isAdmin && <span className="badge badge-blue">Admin</span>}
          {(classroom.upcoming_assignments > 0 || classroom.upcoming_count > 0) && (
            <span className="badge badge-yellow">{classroom.upcoming_assignments || classroom.upcoming_count} due soon</span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 10, fontSize: 12, color: "var(--muted)" }}>
          <Icon d={ICONS.users} size={13} />
          <span>{classroom.member_count || 0} members</span>
        </div>
      </div>
    </div>
  );
}
