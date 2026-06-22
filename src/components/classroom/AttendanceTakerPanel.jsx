// src/components/classroom/AttendanceTakerPanel.jsx
import { useState, useEffect, useRef } from "react";
import { recognize, markAbsent } from "../../api/attendance.js";
import { useToast } from "../../context/ToastContext.jsx";
import useCamera from "../../hooks/useCamera.js";
import Button from "../common/Button.jsx";
import Icon from "../common/Icon.jsx";
import { ICONS } from "../../constants/icons.js";

export default function AttendanceTakerPanel({ classId }) {
  const { toast } = useToast();
  const { videoRef, active, error: camErr, start, stop, flip, capture } = useCamera();
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState([]);
  const [markingAbsent, setMarkingAbsent] = useState(false);
  const intervalRef = useRef(null);
  const logEndRef = useRef(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [log]);

  useEffect(() => () => { stop(); clearInterval(intervalRef.current); }, []);

  const addLog = (text, type = "info") => {
    const time = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setLog((l) => [...l, { text, type, time }]);
  };

  const startSession = async () => {
    await start();
    setRunning(true);
    addLog("Attendance session started", "info");
    intervalRef.current = setInterval(async () => {
      const img = capture(0.7);
      if (!img) return;
      try {
        const res = await recognize({ classroom_id: classId, image: img });
        const results = Array.isArray(res) ? res : (res.results || [res]);
        results.forEach((r) => {
          if (r.status === "present") addLog(`✓ ${r.name} marked present`, "present");
          else if (r.status === "duplicate") addLog(`↺ ${r.name} already marked`, "duplicate");
          else if (r.status === "unknown") addLog("? Unknown face detected", "unknown");
          else if (r.error || r.status === "error") addLog(`⚠ ${r.error || "Recognition error"}`, "error");
        });
      } catch (err) {
        addLog(`⚠ ${err.message || "Recognition error"}`, "error");
      }
    }, 3000);
  };

  const stopSession = () => {
    clearInterval(intervalRef.current);
    stop();
    setRunning(false);
    addLog("Session stopped", "info");
  };

  const handleMarkAbsent = async () => {
    // TODO: replace with custom ConfirmModal
    if (!confirm("Mark all remaining students as absent?")) return;
    setMarkingAbsent(true);
    try {
      await markAbsent(classId);
      toast("Remaining students marked absent", "success");
      addLog("Remaining students marked absent", "info");
    } catch (err) {
      toast(err.message || "Failed", "error");
    } finally {
      setMarkingAbsent(false);
    }
  };

  return (
    <div>
      <div className="camera-wrap" style={{ marginBottom: 16 }}>
        <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        {!active && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)", color: "#fff", fontSize: 14 }}>
            <Icon d={ICONS.camera} size={24} />
            <span style={{ marginLeft: 8 }}>Camera inactive</span>
          </div>
        )}
        <div className="camera-overlay">
          {active && (
            <button className="btn btn-secondary btn-sm" onClick={flip} aria-label="Flip camera">
              <Icon d={ICONS.flip} size={16} /> Flip
            </button>
          )}
        </div>
      </div>

      {camErr && <div className="form-error" style={{ marginBottom: 12 }}>{camErr}</div>}

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        {!running ? (
          <Button variant="primary" onClick={startSession}>
            <Icon d={ICONS.camera} size={16} /> Start Session
          </Button>
        ) : (
          <Button variant="danger" onClick={stopSession}>
            Stop Session
          </Button>
        )}
        <Button variant="secondary" onClick={handleMarkAbsent} loading={markingAbsent}>
          Mark Remaining Absent
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setLog([])}>
          Clear log
        </Button>
      </div>

      {running && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, color: "var(--success)", fontSize: 13, fontWeight: 600 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--success)", display: "inline-block", animation: "pulse 1.5s infinite" }} />
          Scanning every 3 seconds…
        </div>
      )}

      <div className="detection-log">
        {log.length === 0 && <div className="log-unknown">Start a session to begin recognizing faces.</div>}
        {log.map((entry, i) => (
          <div key={i} className={`log-line log-${entry.type}`}>
            <span style={{ color: "rgba(255,255,255,0.4)", marginRight: 8 }}>{entry.time}</span>
            {entry.text}
          </div>
        ))}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}
