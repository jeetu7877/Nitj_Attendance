// src/components/classroom/AdminFaceResetModal.jsx
import { useState, useEffect } from "react";
import Modal from "../common/Modal.jsx";
import Button from "../common/Button.jsx";
import { adminResetFace, adminClearFace } from "../../api/classrooms.js";
import { useToast } from "../../context/ToastContext.jsx";
import useCamera from "../../hooks/useCamera.js";
import Icon from "../common/Icon.jsx";
import { ICONS } from "../../constants/icons.js";

export default function AdminFaceResetModal({ classId, uid, userName, onClose }) {
  const { toast } = useToast();
  const [mode, setMode] = useState("choose"); // "choose" | "capture" | "clear"
  const [loading, setLoading] = useState(false);
  const { videoRef, active, error: camErr, start, stop, flip, capture } = useCamera();

  useEffect(() => {
    if (mode === "capture") start();
    return () => { if (mode === "capture") stop(); };
  }, [mode]);

  const handleCapture = async () => {
    const img = capture(0.8);
    if (!img) { toast("Capture failed", "error"); return; }
    setLoading(true);
    try {
      await adminResetFace({ classroom_id: classId, student_id: uid, image: img });
      toast(`Face reset for ${userName}`, "success");
      stop();
      onClose();
    } catch (err) {
      toast(err.message || "Reset failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    // TODO: replace with custom ConfirmModal
    if (!confirm(`Clear face data for ${userName}?`)) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("classroom_id", classId);
      fd.append("user_id", uid);
      await adminClearFace(fd);
      toast(`Face data cleared for ${userName}`, "success");
      onClose();
    } catch (err) {
      toast(err.message || "Clear failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={`Manage face — ${userName}`} onClose={onClose}>
      {mode === "choose" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Button variant="primary" full onClick={() => setMode("capture")}>
            <Icon d={ICONS.camera} size={16} /> Reset face (capture new)
          </Button>
          <Button variant="danger" full onClick={handleClear} loading={loading}>
            <Icon d={ICONS.trash} size={16} /> Clear face data
          </Button>
          <Button variant="secondary" full onClick={onClose}>Cancel</Button>
        </div>
      )}
      {mode === "capture" && (
        <div>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>
            Have {userName} look at the camera, then capture.
          </p>
          <div className="camera-wrap">
            <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div className="camera-overlay">
              <button className="btn btn-secondary btn-sm" onClick={flip}>
                <Icon d={ICONS.flip} size={16} /> Flip
              </button>
            </div>
          </div>
          {camErr && <div className="form-error" style={{ marginTop: 8 }}>{camErr}</div>}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}>
            <Button variant="secondary" onClick={() => { stop(); setMode("choose"); }}>Back</Button>
            <Button variant="primary" onClick={handleCapture} loading={loading} disabled={!active}>
              <Icon d={ICONS.camera} size={16} /> Capture
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
