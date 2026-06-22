// src/pages/MyAttendancePage.jsx
import { useState, useEffect } from "react";
import { myAttendance } from "../api/attendance.js";
import { useToast } from "../context/ToastContext.jsx";
import { PageSpinner } from "../components/common/Spinner.jsx";
import Icon from "../components/common/Icon.jsx";
import { ICONS } from "../constants/icons.js";
import { formatDateTime } from "../utils/formatDate.js";

export default function MyAttendancePage() {
  const { toast } = useToast();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    myAttendance()
      .then((d) => setData(Array.isArray(d) ? d : (d.classrooms || [])))
      .catch(() => toast("Failed to load attendance", "error"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageSpinner />;

  const overallLow = data.some((c) => {
    const pct = c.total ? Math.round((c.present / c.total) * 100) : 0;
    return pct < 75 && c.total > 0;
  });

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>My Attendance</h1>

      {overallLow && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid var(--danger)", borderRadius: "var(--radius-sm)", padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 8, color: "var(--danger)", fontSize: 14 }}>
          <Icon d={ICONS.warning} size={16} />
          Warning: Your attendance in one or more classes is below 75%.
        </div>
      )}

      {data.length === 0 ? (
        <div className="empty-state">
          <Icon d={ICONS.attend} size={48} />
          <h3>No attendance records</h3>
          <p>Join a classroom to start tracking attendance.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {data.map((cls) => {
            const pct = cls.total ? Math.round(((cls.present || 0) / cls.total) * 100) : 0;
            const low = pct < 75 && cls.total > 0;
            return (
              <div className="card" key={cls.class_id || cls.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>{cls.class_name || cls.name}</div>
                    <div style={{ fontSize: 13, color: "var(--muted)" }}>{cls.present || 0} / {cls.total || 0} classes attended</div>
                  </div>
                  <span className={`badge ${low ? "badge-red" : "badge-green"}`}>{pct}%</span>
                </div>

                <div className="progress-bar-wrap" style={{ marginBottom: 12 }}>
                  <div className={`progress-bar-fill ${low ? "danger" : "success"}`} style={{ width: `${pct}%` }} />
                </div>

                {low && (
                  <div style={{ fontSize: 12, color: "var(--danger)", marginBottom: 10 }}>
                    ⚠ Below 75% — attend more classes to meet the requirement.
                  </div>
                )}

                {cls.records && cls.records.length > 0 && (
                  <div className="table-wrap">
                    <table className="table" style={{ fontSize: 12 }}>
                      <thead><tr><th>Date & Time</th><th>Status</th></tr></thead>
                      <tbody>
                        {cls.records.slice(0, 5).map((r, i) => (
                          <tr key={i}>
                            <td>{formatDateTime(r.created_at || r.date)}</td>
                            <td><span className={`badge ${r.status === "present" ? "badge-green" : "badge-red"}`}>{r.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {cls.records.length > 5 && (
                      <div style={{ textAlign: "center", fontSize: 12, color: "var(--muted)", padding: "8px" }}>
                        +{cls.records.length - 5} more records
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
