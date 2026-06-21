// src/components/classroom/CreateClassroomModal.jsx
import { useState } from "react";
import Modal from "../common/Modal.jsx";
import Button from "../common/Button.jsx";
import { createClassroom } from "../../api/classrooms.js";
import { useToast } from "../../context/ToastContext.jsx";

const BRANCHES = ["CSE","ECE","ME","CE","CHE","EE","IT","BT","Other"];
const SECTIONS = ["A","B","C","D","E"];

export default function CreateClassroomModal({ onClose, onCreated }) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "", subject: "", branch: "CSE",
    year: 1, section: "A", description: "", banner_color: "#1565C0"
  });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createClassroom({ ...form, year: Number(form.year) });
      toast(`Classroom created! Code: ${res.code}`, "success");
      if (onCreated) onCreated(res);
      onClose();
    } catch (err) {
      toast(err.message || "Failed to create classroom", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Create Classroom"
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
          <label className="form-label">Classroom name *</label>
          <input className="form-input" value={form.name} onChange={set("name")}
            placeholder="e.g. Data Structures" required autoFocus />
        </div>
        <div className="form-group">
          <label className="form-label">Subject *</label>
          <input className="form-input" value={form.subject} onChange={set("subject")}
            placeholder="e.g. CS301" required />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          <div className="form-group">
            <label className="form-label">Branch *</label>
            <select className="form-select" value={form.branch} onChange={set("branch")} required>
              {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Year *</label>
            <select className="form-select" value={form.year} onChange={set("year")} required>
              {[1,2,3,4].map((y) => <option key={y} value={y}>Year {y}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Section *</label>
            <select className="form-select" value={form.section} onChange={set("section")} required>
              {SECTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Description (optional)</label>
          <textarea className="form-input" value={form.description} onChange={set("description")}
            placeholder="Brief description…" rows={2} style={{ resize: "vertical" }} />
        </div>
        <div className="form-group">
          <label className="form-label">Banner color</label>
          <input type="color" value={form.banner_color} onChange={set("banner_color")}
            style={{ width: 48, height: 36, border: "1px solid var(--border)", borderRadius: 6, cursor: "pointer", padding: 2 }} />
        </div>
      </form>
    </Modal>
  );
}
