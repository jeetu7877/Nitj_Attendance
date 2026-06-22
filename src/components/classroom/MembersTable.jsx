// src/components/classroom/MembersTable.jsx
import { useState, useEffect } from "react";
import { getMembers, removeMember } from "../../api/classrooms.js";
import { useToast } from "../../context/ToastContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import AdminFaceResetModal from "./AdminFaceResetModal.jsx";
import Icon from "../common/Icon.jsx";
import { ICONS } from "../../constants/icons.js";
import Spinner from "../common/Spinner.jsx";

export default function MembersTable({ classId, isAdmin }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [faceModal, setFaceModal] = useState(null); // {uid, name}

  useEffect(() => {
    getMembers(classId)
      .then((data) => setMembers(Array.isArray(data) ? data : (data.members || [])))
      .catch(() => toast("Failed to load members", "error"))
      .finally(() => setLoading(false));
  }, [classId]);

  const handleRemove = async (uid, name) => {
    // TODO: replace with custom ConfirmModal
    if (!confirm(`Remove ${name} from this classroom?`)) return;
    try {
      await removeMember(classId, uid);
      setMembers((m) => m.filter((x) => x.id !== uid));
      toast("Member removed", "success");
    } catch (err) {
      toast(err.message || "Failed to remove", "error");
    }
  };

  if (loading) return <Spinner />;

  return (
    <>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Face</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: "50%",
                      background: "var(--blue)", color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 700, fontSize: 12, flexShrink: 0,
                    }}>{m.name?.[0]?.toUpperCase()}</div>
                    <span>{m.name}</span>
                    {m.id === user?.id && <span className="badge badge-muted">You</span>}
                  </div>
                </td>
                <td style={{ color: "var(--muted)", fontSize: 13 }}>{m.email}</td>
                <td style={{ fontSize: 13 }}>{m.department || "—"}</td>
                <td>
                  {m.face_enrolled ? (
                    <span className="badge badge-green">Enrolled</span>
                  ) : (
                    <span className="badge badge-muted">Not enrolled</span>
                  )}
                </td>
                {isAdmin && (
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => setFaceModal({ uid: m.id, name: m.name })}
                      >
                        <Icon d={ICONS.face} size={14} /> Reset Face
                      </button>
                      {m.id !== user?.id && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRemove(m.id, m.name)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {members.length === 0 && (
          <div className="empty-state">
            <Icon d={ICONS.users} size={36} />
            <h3>No members yet</h3>
            <p>Share the classroom code to invite students.</p>
          </div>
        )}
      </div>

      {faceModal && (
        <AdminFaceResetModal
          classId={classId}
          uid={faceModal.uid}
          userName={faceModal.name}
          onClose={() => setFaceModal(null)}
        />
      )}
    </>
  );
}
