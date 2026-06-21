// src/components/assignments/AssignmentCard.jsx
import { formatDate, isOverdue } from "../../utils/formatDate.js";
import Icon from "../common/Icon.jsx";
import { ICONS } from "../../constants/icons.js";

export default function AssignmentCard({ assignment, onClick, isAdmin, onSubmit }) {
  const overdue = isOverdue(assignment.due_date);
  const done = assignment.submitted;

  let statusBadge;
  if (done) statusBadge = <span className="badge badge-green">Done</span>;
  else if (overdue) statusBadge = <span className="badge badge-red">Overdue</span>;
  else statusBadge = <span className="badge badge-yellow">Pending</span>;

  return (
    <div
      className="card"
      style={{ cursor: onClick ? "pointer" : "default", borderLeft: `4px solid ${done ? "var(--success)" : overdue ? "var(--danger)" : "var(--warning)"}` }}
      onClick={onClick}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{assignment.title}</div>
          {assignment.class_name && (
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>{assignment.class_name}</div>
          )}
          {assignment.description && (
            <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 8 }}>{assignment.description}</div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--muted)" }}>
            <Icon d={ICONS.clock} size={13} />
            <span>Due: {formatDate(assignment.due_date)}</span>
            {statusBadge}
          </div>
        </div>
        {!isAdmin && !done && onSubmit && (
          <button
            className="btn btn-primary btn-sm"
            onClick={(e) => { e.stopPropagation(); onSubmit(assignment); }}
          >
            <Icon d={ICONS.upload} size={14} /> Submit
          </button>
        )}
      </div>
    </div>
  );
}
