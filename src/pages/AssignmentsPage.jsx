// src/pages/AssignmentsPage.jsx
import { useState, useEffect } from "react";
import { myAssignments, submitAssignment } from "../api/assignments.js";
import { useToast } from "../context/ToastContext.jsx";
import AssignmentCard from "../components/assignments/AssignmentCard.jsx";
import Modal from "../components/common/Modal.jsx";
import Button from "../components/common/Button.jsx";
import SkeletonCard from "../components/common/SkeletonCard.jsx";
import Icon from "../components/common/Icon.jsx";
import { ICONS } from "../constants/icons.js";
import { isOverdue } from "../utils/formatDate.js";

const FILTERS = ["All", "Pending", "Done", "Overdue"];

function SubmitModal({ assignment, onClose, onSubmitted }) {
  const { toast } = useToast();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const late = isOverdue(assignment.due_date);

  const submit = async (e) => {
    e.preventDefault();
    if (!file) { toast("Select a file", "error"); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("assignment_id", assignment.id);
      fd.append("file", file);
      await submitAssignment(fd);
      toast(late ? "Submitted (late)" : "Submitted on time!", late ? "warning" : "success");
      if (onSubmitted) onSubmitted(assignment.id);
      onClose();
    } catch (err) {
      toast(err.message || "Submit failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={`Submit — ${assignment.title}`} onClose={onClose}>
      {late && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid var(--danger)", borderRadius: 8, padding: "10px 14px", marginBottom: 12, fontSize: 13, color: "var(--danger)" }}>
          ⚠ Deadline passed — late submission.
        </div>
      )}
      <form onSubmit={submit}>
        <div className="form-group">
          <label className="form-label">Your file</label>
          <div className="file-input-wrap">
            <label>
              <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
              <Icon d={ICONS.upload} size={20} color="var(--muted)" />
              <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 6 }}>{file ? file.name : "Click to select file"}</p>
            </label>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" loading={loading}>Submit</Button>
        </div>
      </form>
    </Modal>
  );
}

export default function AssignmentsPage() {
  const { toast } = useToast();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [submitModal, setSubmitModal] = useState(null);

  useEffect(() => {
    myAssignments()
      .then((d) => setAssignments(Array.isArray(d) ? d : (d.assignments || [])))
      .catch(() => toast("Failed to load assignments", "error"))
      .finally(() => setLoading(false));
  }, []);

  const counts = {
    All: assignments.length,
    Pending: assignments.filter((a) => !a.submitted && !isOverdue(a.due_date)).length,
    Done: assignments.filter((a) => a.submitted).length,
    Overdue: assignments.filter((a) => !a.submitted && isOverdue(a.due_date)).length,
  };

  const filtered = assignments.filter((a) => {
    if (filter === "Pending") return !a.submitted && !isOverdue(a.due_date);
    if (filter === "Done") return a.submitted;
    if (filter === "Overdue") return !a.submitted && isOverdue(a.due_date);
    return true;
  });

  const markSubmitted = (id) => setAssignments((a) => a.map((x) => x.id === id ? { ...x, submitted: true } : x));

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>Assignments</h1>

      {/* Filter chips */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setFilter(f)}
          >
            {f} <span style={{ opacity: 0.7, marginLeft: 4 }}>({counts[f]})</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[1,2,3].map((i) => <SkeletonCard key={i} lines={2} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <Icon d={ICONS.tasks} size={48} />
          <h3>No {filter.toLowerCase()} assignments</h3>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((a) => (
            <AssignmentCard
              key={a.id}
              assignment={a}
              onSubmit={!a.submitted ? (asgn) => setSubmitModal(asgn) : undefined}
            />
          ))}
        </div>
      )}

      {submitModal && (
        <SubmitModal
          assignment={submitModal}
          onClose={() => setSubmitModal(null)}
          onSubmitted={markSubmitted}
        />
      )}
    </div>
  );
}
