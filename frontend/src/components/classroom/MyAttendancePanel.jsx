// src/components/classroom/MyAttendancePanel.jsx
import { useState, useEffect } from "react";
import { getAttendance } from "../../api/attendance.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { formatDateTime } from "../../utils/formatDate.js";
import Icon from "../common/Icon.jsx";
import { ICONS } from "../../constants/icons.js";
import Spinner from "../common/Spinner.jsx";

export default function MyAttendancePanel({ classId }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  getAttendance(classId)
    .then((d) => {
      const all = Array.isArray(d) ? d : d.records || [];
      
      setRecords(all);
    })
    .catch(() => toast("Failed to load attendance", "error"))
    .finally(() => setLoading(false));
}, [classId]);

  if (loading) return <Spinner />;

  const total = records.length;
  const present = records.filter((r) => r.status === "present").length;
  const pct = total ? Math.round((present / total) * 100) : 0;
  const low = pct < 75 && total > 0;

  return (
    <div>
      <div className="grid-3" style={{ marginBottom: 20 }}>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "rgba(26,115,232,0.12)" }}
          >
            <Icon d={ICONS.calendar} size={22} color="var(--blue)" />
          </div>
          <div>
            <div className="stat-value">{total}</div>
            <div className="stat-label">Total classes</div>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "rgba(34,197,94,0.12)" }}
          >
            <Icon d={ICONS.check} size={22} color="var(--success)" />
          </div>
          <div>
            <div className="stat-value">{present}</div>
            <div className="stat-label">Present</div>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{
              background: low ? "rgba(239,68,68,0.12)" : "rgba(34,197,94,0.12)",
            }}
          >
            <Icon
              d={ICONS.attend}
              size={22}
              color={low ? "var(--danger)" : "var(--success)"}
            />
          </div>
          <div>
            <div
              className="stat-value"
              style={{ color: low ? "var(--danger)" : "inherit" }}
            >
              {pct}%
            </div>
            <div className="stat-label">Attendance</div>
          </div>
        </div>
      </div>

      {low && (
        <div
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid var(--danger)",
            borderRadius: "var(--radius-sm)",
            padding: "12px 16px",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 14,
            color: "var(--danger)",
          }}
        >
          <Icon d={ICONS.warning} size={16} />
          Your attendance is below 75%. Please attend classes regularly.
        </div>
      )}

      <div className="progress-bar-wrap" style={{ marginBottom: 20 }}>
        <div
          className={`progress-bar-fill ${low ? "danger" : "success"}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => (
              <tr key={i}>
                <td style={{ fontSize: 13 }}>
                  {r.date && r.time
                    ? `${r.date} ${r.time}`
                    : formatDateTime(r.created_at || r.date)}
                </td>
                <td>
                  <span
                    className={`badge ${r.status === "present" ? "badge-green" : "badge-red"}`}
                  >
                    {r.status || "absent"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {records.length === 0 && (
          <div className="empty-state">
            <Icon d={ICONS.calendar} size={36} />
            <h3>No records yet</h3>
          </div>
        )}
      </div>
    </div>
  );
}
