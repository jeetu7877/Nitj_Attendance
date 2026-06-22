// src/components/assignments/CreateAssignmentModal.jsx
import { useState } from "react";
import Modal from "../common/Modal.jsx";
import Button from "../common/Button.jsx";
import { createAssignment } from "../../api/assignments.js";
import { useToast } from "../../context/ToastContext.jsx";
import Icon from "../common/Icon.jsx";
import { ICONS } from "../../constants/icons.js";

export default function CreateAssignmentModal({ classId, onClose, onCreated }) {
  const { toast } = useToast();
  const [form, setForm] = useState({ title: "", description: "", due_date: "" });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("class_id", classId);
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("due_date", form.due_date);
      if (file) fd.append("file", file);
      const res = await createAssignment(fd);
      toast("Assignment created!", "success");
      if (onCreated) onCreated(res.assignment || res);
      onClose();
    } catch (err) {
      toast(err.message || "Failed to create assignment", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Create Assignment"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={submit} loading={loading}>Create</Button>
        </>
      }
    >
      <form onSubmit={submit}>
        <div className="form-group">
          <label className="form-label">Title</label>
          <input className="form-input" value={form.title} onChange={set("title")} placeholder="Assignment title" required autoFocus />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-input" value={form.description} onChange={set("description")} placeholder="Instructions…" rows={3} style={{ resize: "vertical" }} />
        </div>
        <div className="form-group">
          <label className="form-label">Due date</label>
          <input className="form-input" type="datetime-local" value={form.due_date} onChange={set("due_date")} required />
        </div>
        <div className="form-group">
          <label className="form-label">Attachment (optional)</label>
          <div className="file-input-wrap">
            <label>
              <input type="file" onChange={(e) => setFile(e.target.files[0])} />
              <Icon d={ICONS.upload} size={20} color="var(--muted)" />
              <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 6 }}>
                {file ? file.name : "Click to attach file"}
              </p>
            </label>
          </div>
        </div>
      </form>
    </Modal>
  );
}
