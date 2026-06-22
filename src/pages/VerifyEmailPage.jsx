// src/pages/VerifyEmailPage.jsx
// Stub for future email-verification flow (currently disabled in v10.2 direct-registration backend)
import { useLocation, useNavigate } from "react-router-dom";
import AuthShell from "../components/auth/AuthShell.jsx";
import OtpBoxes from "../components/auth/OtpBoxes.jsx";
import Button from "../components/common/Button.jsx";
import { useState } from "react";
import { sendOtp, verifyOtp } from "../api/auth.js";
import { useToast } from "../context/ToastContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import useCountdown from "../hooks/useCountdown.js";

export default function VerifyEmailPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  const email = state?.email || "";
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const { seconds, start, running } = useCountdown(60);

  const resend = async () => {
    try { await sendOtp({ email }); toast("OTP resent", "success"); start(); }
    catch (err) { toast(err.message || "Failed", "error"); }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (otp.length < 6) { toast("Enter the 6-digit code", "error"); return; }
    setLoading(true);
    try {
      const res = await verifyOtp({ email, otp });
      if (res.access_token) { login(res.access_token, res.user); navigate("/dashboard"); }
      else { toast("Verified! Please log in.", "success"); navigate("/login"); }
    } catch (err) { toast(err.message || "Verification failed", "error"); }
    finally { setLoading(false); }
  };

  return (
    <AuthShell>
      <h1 style={{ fontSize: 20, fontWeight: 700, textAlign: "center", marginBottom: 6 }}>Verify your email</h1>
      <p style={{ textAlign: "center", color: "var(--muted)", fontSize: 14, marginBottom: 4 }}>
        Code sent to <strong>{email}</strong>
      </p>
      <form onSubmit={submit}>
        <OtpBoxes value={otp} onChange={setOtp} length={6} />
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          {running
            ? <span style={{ fontSize: 13, color: "var(--muted)" }}>Resend in {seconds}s</span>
            : <button type="button" onClick={resend} style={{ background: "none", border: "none", color: "var(--blue)", cursor: "pointer", fontSize: 13 }}>Resend code</button>}
        </div>
        <Button type="submit" variant="primary" full loading={loading}>Verify</Button>
      </form>
    </AuthShell>
  );
}
