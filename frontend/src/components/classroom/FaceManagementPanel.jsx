// src/components/classroom/FaceManagementPanel.jsx
import { useState, useEffect } from "react";
import { getMembers, getFaceAudit } from "../../api/classrooms.js";
import { useToast } from "../../context/ToastContext.jsx";
import AdminFaceResetModal from "./AdminFaceResetModal.jsx";
import { formatDateTime } from "../../utils/formatDate.js";
import Icon from "../common/Icon.jsx";
import { ICONS } from "../../constants/icons.js";
import Spinner from "../common/Spinner.jsx";

export default function FaceManagementPanel({ classId }) {
  const { toast } = useToast();
  const [members, setMembers] = useState([]);
  const [audit, setAudit] = useState([]);
  const [loading, setLoading] = useState(true);
  const [faceModal, setFaceModal] = useState(null);

  useEffect(() => {
    Promise.all([
      getMembers(classId),
      getFaceAudit(classId).catch(() => ({ logs: [] })),
    ])
      .then(([mData, aData]) => {
        setMembers(Array.isArray(mData) ? mData : (mData.members || []));
        setAudit(Array.isArray(aData) ? aData : (aData.logs || []));
      })
      .catch(() => toast("Failed to load face data", "error"))
      .finally(() => setLoading(false));
  }, [classId]);

  if (loading) return <Spinner />;

  return (
    <div>
      <h3 style={{ fontWeight: 600, marginBottom: 12 }}>Student Face Status</h3>
      <div className="table-wrap" style={{ marginBottom: 28 }}>
        <table className="table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Email</th>
              <th>Face Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--blue)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>
                      {m.name?.[0]?.toUpperCase()}
                    </div>
                    {m.name}
                  </div>
                </td>
                <td style={{ fontSize: 13, color: "var(--muted)" }}>{m.email}</td>
                <td>
                  {m.face_enrolled
                    ? <span className="badge badge-green">Enrolled</span>
                    : <span className="badge badge-red">Not enrolled</span>}
                </td>
                <td>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setFaceModal({ uid: m.id, name: m.name })}
                  >
                    <Icon d={ICONS.face} size={14} /> Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {members.length === 0 && <div className="empty-state"><h3>No members</h3></div>}
      </div>

      <h3 style={{ fontWeight: 600, marginBottom: 12 }}>Face Audit Log</h3>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr><th>Action</th><th>Student</th><th>Admin</th><th>Date</th></tr>
          </thead>
          <tbody>
            {audit.map((a, i) => (
              <tr key={i}>
                <td><span className="badge badge-blue">{a.action || "reset"}</span></td>
                <td style={{ fontSize: 13 }}>{a.student_name || a.student_email || "—"}</td>
                <td style={{ fontSize: 13, color: "var(--muted)" }}>{a.admin_name || "—"}</td>
                <td style={{ fontSize: 13, color: "var(--muted)" }}>{formatDateTime(a.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {audit.length === 0 && <div className="empty-state"><h3>No audit entries</h3></div>}
      </div>

      {faceModal && (
        <AdminFaceResetModal
          classId={classId}
          uid={faceModal.uid}
          userName={faceModal.name}
          onClose={() => setFaceModal(null)}
        />
      )}
    </div>
  );
}
