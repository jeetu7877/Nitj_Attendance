// src/components/assignments/SubmissionsModal.jsx
import { useState, useEffect } from "react";
import Modal from "../common/Modal.jsx";
import { getSubmissions } from "../../api/assignments.js";
import { useToast } from "../../context/ToastContext.jsx";
import { formatDateTime, isOverdue } from "../../utils/formatDate.js";
import Icon from "../common/Icon.jsx";
import { ICONS } from "../../constants/icons.js";
import Spinner from "../common/Spinner.jsx";

export default function SubmissionsModal({ assignment, onClose }) {
  const { toast } = useToast();
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSubmissions(assignment.id)
      .then((d) => setSubs(Array.isArray(d) ? d : (d.submissions || [])))
      .catch(() => toast("Failed to load submissions", "error"))
      .finally(() => setLoading(false));
  }, [assignment.id]);

  return (
    <Modal title={`Submissions — ${assignment.title}`} onClose={onClose} maxWidth={680}>
      {loading ? (
        <div style={{ textAlign: "center", padding: 40 }}><Spinner size="lg" /></div>
      ) : (
        <div className="table-wrap">
          <div style={{ marginBottom: 12, fontSize: 13, color: "var(--muted)" }}>
            {subs.length} submission{subs.length !== 1 ? "s" : ""}
          </div>
          <table className="table">
            <thead>
              <tr><th>Student</th><th>Submitted at</th><th>Status</th><th>File</th></tr>
            </thead>
            <tbody>
              {subs.map((s, i) => {
                const late = isOverdue(assignment.due_date) && new Date(s.submitted_at) > new Date(assignment.due_date);
                return (
                  <tr key={i}>
                    <td>
                      <div>{s.student_name || "—"}</div>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>{s.student_email}</div>
                    </td>
                    <td style={{ fontSize: 13 }}>{formatDateTime(s.submitted_at)}</td>
                    <td>
                      {late
                        ? <span className="badge badge-red">Late</span>
                        : <span className="badge badge-green">On time</span>}
                    </td>
                    <td>
                      {s.file_url ? (
                        <a href={s.file_url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                          <Icon d={ICONS.download} size={13} /> Download
                        </a>
                      ) : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {subs.length === 0 && (
            <div className="empty-state">
              <Icon d={ICONS.file} size={36} />
              <h3>No submissions yet</h3>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
