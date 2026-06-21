// src/components/auth/AuthShell.jsx
export default function AuthShell({ children }) {
  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-logo">
          <div style={{
            width: 52, height: 52, background: "var(--blue)", borderRadius: 14,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 10px", fontSize: 22, fontWeight: 800, color: "#fff"
          }}>N</div>
          <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text)" }}>NITJ Classroom</div>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>AI Attendance Platform</div>
        </div>
        {children}
      </div>
    </div>
  );
}
