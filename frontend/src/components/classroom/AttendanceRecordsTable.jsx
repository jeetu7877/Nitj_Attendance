// src/components/classroom/AttendanceRecordsTable.jsx
import { useState, useEffect } from "react";
import { getAttendance } from "../../api/attendance.js";
import { useToast } from "../../context/ToastContext.jsx";
import { formatDate, formatDateTime } from "../../utils/formatDate.js";
import Icon from "../common/Icon.jsx";
import { ICONS } from "../../constants/icons.js";
import Spinner from "../common/Spinner.jsx";
import Button from "../common/Button.jsx";

export default function AttendanceRecordsTable({ classId }) {
  const { toast } = useToast();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    getAttendance(classId)
      .then((d) => setRecords(Array.isArray(d) ? d : d.records || []))
      .catch(() => toast("Failed to load attendance records", "error"))
      .finally(() => setLoading(false));
  }, [classId]);

  const filtered = dateFilter
    ? records.filter(
        (r) =>
          r.date?.startsWith(dateFilter) ||
          r.created_at?.startsWith(dateFilter),
      )
    : records;

  const exportCSV = () => {
    const header = "Name,Email,Status,Date\n";
    const rows = filtered
      .map(
        (r) =>
          `"${r.student_name || r.name || ""}","${r.student_email || r.email || ""}","${r.status || ""}","${formatDateTime(r.created_at || r.date)}"`,
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_${classId}_${dateFilter || "all"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 16,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <label style={{ fontSize: 13, color: "var(--muted)" }}>
          Filter by date:
        </label>
        <input
          type="date"
          className="form-input"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          style={{ width: "auto" }}
        />
        {dateFilter && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setDateFilter("")}
          >
            Clear
          </button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={exportCSV}
          style={{ marginLeft: "auto" }}
        >
          <Icon d={ICONS.download} size={14} /> Export CSV
        </Button>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={i}>
                <td>{r.student_name || r.name || "—"}</td>
                <td style={{ fontSize: 13, color: "var(--muted)" }}>
                  {r.student_email || r.email || "—"}
                </td>
                <td>
                  <span
                    className={`badge ${r.status === "present" ? "badge-green" : "badge-red"}`}
                  >
                    {r.status || "absent"}
                  </span>
                </td>
                <td style={{ fontSize: 13, color: "var(--muted)" }}>
                  {r.date && r.time
                    ? `${r.date} ${r.time}`
                    : formatDateTime(r.created_at || r.date)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="empty-state">
            <Icon d={ICONS.calendar} size={36} />
            <h3>No records found</h3>
            <p>
              {dateFilter
                ? "No attendance for this date."
                : "No attendance taken yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
