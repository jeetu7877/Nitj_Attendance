// src/pages/ClassroomDetailPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getClassroom } from "../api/classrooms.js";
import { getAssignment, updateDueDate, deleteAssignment, submitAssignment } from "../api/assignments.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import ClassFeed from "../components/classroom/ClassFeed.jsx";
import MembersTable from "../components/classroom/MembersTable.jsx";
import AttendanceTakerPanel from "../components/classroom/AttendanceTakerPanel.jsx";
import AttendanceRecordsTable from "../components/classroom/AttendanceRecordsTable.jsx";
import MyAttendancePanel from "../components/classroom/MyAttendancePanel.jsx";
import FaceManagementPanel from "../components/classroom/FaceManagementPanel.jsx";
import AssignmentCard from "../components/assignments/AssignmentCard.jsx";
import CreateAssignmentModal from "../components/assignments/CreateAssignmentModal.jsx";
import SubmissionsModal from "../components/assignments/SubmissionsModal.jsx";
import Modal from "../components/common/Modal.jsx";
import Button from "../components/common/Button.jsx";
import { PageSpinner } from "../components/common/Spinner.jsx";
import Icon from "../components/common/Icon.jsx";
import { ICONS } from "../constants/icons.js";
import { formatDate, isOverdue } from "../utils/formatDate.js";

const ADMIN_TABS = ["Feed", "Members", "Assignments", "Attendance", "Take Attendance", "Faces"];
const STUDENT_TABS = ["Feed", "Assignments", "My Attendance"];

function SubmitAssignmentModal({ assignment, onClose, onSubmitted }) {
  const { toast } = useToast();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const late = isOverdue(assignment.due_date);

  const submit = async (e) => {
    e.preventDefault();
    if (!file) { toast("Select a file to submit", "error"); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("assignment_id", assignment.id);
      fd.append("file", file);
      await submitAssignment(fd);
      toast(late ? "Submitted (late)" : "Submitted on time!", late ? "warning" : "success");
      if (onSubmitted) onSubmitted();
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
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid var(--danger)", borderRadius: 8, padding: "10px 14px", marginBottom: 12, fontSize: 13, color: "var(--danger)", display: "flex", alignItems: "center", gap: 6 }}>
          <Icon d={ICONS.warning} size={14} /> Deadline passed — this will be marked as a late submission.
        </div>
      )}
      <form onSubmit={submit}>
        <div className="form-group">
          <label className="form-label">Your file</label>
          <div className="file-input-wrap">
            <label>
              <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
              <Icon d={ICONS.upload} size={20} color="var(--muted)" />
              <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 6 }}>
                {file ? file.name : "Click to select file"}
              </p>
            </label>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" loading={loading}>
            <Icon d={ICONS.upload} size={14} /> Submit
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function AssignmentsTab({ classId, isAdmin, assignments, setAssignments }) {
  const { toast } = useToast();
  const [showCreate, setShowCreate] = useState(false);
  const [submitModal, setSubmitModal] = useState(null);
  const [subsModal, setSubsModal] = useState(null);
  const [editingDue, setEditingDue] = useState(null);
  const [newDue, setNewDue] = useState("");

  const handleDeleteAssignment = async (id) => {
    // TODO: replace with custom ConfirmModal
    if (!confirm("Delete this assignment?")) return;
    try {
      await deleteAssignment(id);
      setAssignments((a) => a.filter((x) => x.id !== id));
      toast("Assignment deleted", "success");
    } catch (err) {
      toast(err.message || "Delete failed", "error");
    }
  };

  const handleUpdateDue = async (id) => {
    if (!newDue) return;
    try {
      await updateDueDate(id, { due_date: newDue });
      setAssignments((a) => a.map((x) => x.id === id ? { ...x, due_date: newDue } : x));
      toast("Due date updated", "success");
      setEditingDue(null);
    } catch (err) {
      toast(err.message || "Update failed", "error");
    }
  };

  return (
    <div>
      {isAdmin && (
        <div style={{ marginBottom: 16 }}>
          <Button variant="primary" onClick={() => setShowCreate(true)}>
            <Icon d={ICONS.plus} size={16} /> New Assignment
          </Button>
        </div>
      )}

      {assignments.length === 0 ? (
        <div className="empty-state">
          <Icon d={ICONS.tasks} size={48} />
          <h3>No assignments yet</h3>
          {isAdmin && <p>Create one above.</p>}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {assignments.map((a) => (
            <div key={a.id}>
              <AssignmentCard
                assignment={a}
                isAdmin={isAdmin}
                onSubmit={!isAdmin ? (asgn) => setSubmitModal(asgn) : undefined}
              />
              {isAdmin && (
                <div style={{ display: "flex", gap: 8, marginTop: 6, paddingLeft: 4 }}>
                  <Button variant="ghost" size="sm" onClick={() => setSubsModal(a)}>
                    <Icon d={ICONS.users} size={13} /> Submissions
                  </Button>
                  {editingDue === a.id ? (
                    <>
                      <input type="datetime-local" className="form-input" value={newDue} onChange={(e) => setNewDue(e.target.value)} style={{ width: "auto", fontSize: 12, padding: "4px 8px" }} />
                      <Button size="sm" variant="primary" onClick={() => handleUpdateDue(a.id)}>Save</Button>
                      <Button size="sm" variant="secondary" onClick={() => setEditingDue(null)}>Cancel</Button>
                    </>
                  ) : (
                    <Button variant="ghost" size="sm" onClick={() => { setEditingDue(a.id); setNewDue(a.due_date || ""); }}>
                      <Icon d={ICONS.edit} size={13} /> Edit due date
                    </Button>
                  )}
                  <Button variant="danger" size="sm" onClick={() => handleDeleteAssignment(a.id)}>
                    <Icon d={ICONS.trash} size={13} />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <CreateAssignmentModal
          classId={classId}
          onClose={() => setShowCreate(false)}
          onCreated={(a) => setAssignments((prev) => [a, ...prev])}
        />
      )}
      {submitModal && (
        <SubmitAssignmentModal
          assignment={submitModal}
          onClose={() => setSubmitModal(null)}
          onSubmitted={() => setAssignments((prev) => prev.map((x) => x.id === submitModal.id ? { ...x, submitted: true } : x))}
        />
      )}
      {subsModal && (
        <SubmissionsModal assignment={subsModal} onClose={() => setSubsModal(null)} />
      )}
    </div>
  );
}

export default function ClassroomDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [classroom, setClassroom] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    getClassroom(id)
      .then((data) => {
        setClassroom(data.classroom || data);
        setAssignments(data.assignments || []);
      })
      .catch((err) => {
        toast(err.message || "Failed to load classroom", "error");
        navigate("/classrooms");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageSpinner />;
  if (!classroom) return null;

  const isAdmin = classroom.is_admin === 1 || classroom.is_admin === true;
  const tabs = isAdmin ? ADMIN_TABS : STUDENT_TABS;

  const renderTab = () => {
    const tabName = tabs[activeTab];
    switch (tabName) {
      case "Feed": return <ClassFeed classId={id} isAdmin={isAdmin} />;
      case "Members": return <MembersTable classId={id} isAdmin={isAdmin} />;
      case "Assignments": return <AssignmentsTab classId={id} isAdmin={isAdmin} assignments={assignments} setAssignments={setAssignments} />;
      case "Attendance": return <AttendanceRecordsTable classId={id} />;
      case "My Attendance": return <MyAttendancePanel classId={id} />;
      case "Take Attendance": return <AttendanceTakerPanel classId={id} />;
      case "Faces": return <FaceManagementPanel classId={id} />;
      default: return null;
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate("/classrooms")} style={{ marginBottom: 10 }}>
          <Icon d={ICONS.chevronLeft} size={14} /> Back
        </button>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{classroom.name}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span className="code-pill">{classroom.code}</span>
              {isAdmin && <span className="badge badge-blue">Admin</span>}
              <span style={{ fontSize: 13, color: "var(--muted)", display: "flex", alignItems: "center", gap: 4 }}>
                <Icon d={ICONS.users} size={13} />{classroom.member_count || 0} members
              </span>
            </div>
            {classroom.description && (
              <p style={{ marginTop: 6, fontSize: 14, color: "var(--muted)" }}>{classroom.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === i ? "active" : ""}`}
            onClick={() => setActiveTab(i)}
          >{tab}</button>
        ))}
      </div>

      {renderTab()}
    </div>
  );
}
