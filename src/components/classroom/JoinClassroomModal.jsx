// src/components/classroom/JoinClassroomModal.jsx
import { useState, useEffect } from "react";
import Modal from "../common/Modal.jsx";
import Button from "../common/Button.jsx";
import { joinClassroom } from "../../api/classrooms.js";
import { useToast } from "../../context/ToastContext.jsx";
import useCamera from "../../hooks/useCamera.js";
import Icon from "../common/Icon.jsx";
import { ICONS } from "../../constants/icons.js";

export default function JoinClassroomModal({ onClose, onJoined }) {
  const { toast } = useToast();
  const [code, setCode] = useState("");
  const [step, setStep] = useState("code"); // "code" | "camera"
  const [loading, setLoading] = useState(false);
  const { videoRef, active, error: camErr, start, stop, flip, capture } = useCamera();

  useEffect(() => {
    if (step === "camera") start();
    return () => stop();
  }, [step]);

  const handleCodeNext = (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setStep("camera");
  };

  const handleCapture = async () => {
    const img = capture(0.8);
    if (!img) {
      toast("Failed to capture image", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await joinClassroom({ code: code.trim(), image: img });
      toast(res.message || "Joined successfully!", "success");
      stop();
      if (onJoined) onJoined();
      onClose();
    } catch (err) {
      toast(err.message || "Failed to join", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Join Classroom" onClose={onClose}>
      {step === "code" ? (
        <form onSubmit={handleCodeNext}>
          <div className="form-group">
            <label className="form-label">Classroom code</label>
            <input
              className="form-input"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter 6-digit code"
              required
              autoFocus
              style={{ fontFamily: "monospace", fontSize: 18, letterSpacing: 4, textAlign: "center" }}
            />
          </div>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
            Next, you'll capture your face for attendance recognition.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary">Continue →</Button>
          </div>
        </form>
      ) : (
        <div>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>
            Look directly at the camera and click Capture.
          </p>
          <div className="camera-wrap">
            <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div className="camera-overlay">
              <button className="btn btn-secondary btn-sm" onClick={flip} aria-label="Flip camera">
                <Icon d={ICONS.flip} size={16} /> Flip
              </button>
            </div>
          </div>
          {camErr && <div className="form-error" style={{ marginTop: 8 }}>{camErr}</div>}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}>
            <Button variant="secondary" onClick={() => { stop(); setStep("code"); }}>Back</Button>
            <Button variant="primary" onClick={handleCapture} loading={loading} disabled={!active}>
              <Icon d={ICONS.camera} size={16} /> Capture & Join
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
