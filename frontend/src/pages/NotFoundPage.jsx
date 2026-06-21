// src/pages/NotFoundPage.jsx
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button.jsx";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 20 }}>
      <div>
        <div style={{ fontSize: 72, fontWeight: 800, color: "var(--blue)", lineHeight: 1 }}>404</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: "12px 0 8px" }}>Page not found</h1>
        <p style={{ color: "var(--muted)", marginBottom: 24 }}>This page doesn't exist or you don't have access.</p>
        <Button variant="primary" onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
      </div>
    </div>
  );
}
