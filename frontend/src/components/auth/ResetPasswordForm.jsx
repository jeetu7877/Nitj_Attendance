// src/components/auth/ResetPasswordForm.jsx
import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { resetPassword, forgotPassword } from "../../api/auth.js";
import { useToast } from "../../context/ToastContext.jsx";
import { passwordStrength } from "../../utils/validators.js";
import useCountdown from "../../hooks/useCountdown.js";
import OtpBoxes from "./OtpBoxes.jsx";
import Button from "../common/Button.jsx";

export default function ResetPasswordForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { seconds, start, running } = useCountdown(60);

  const resend = async () => {
    try {
      await forgotPassword({ email });
      toast("New OTP sent", "success");
      start();
    } catch (err) {
      toast(err.message || "Failed to resend", "error");
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (otp.length < 6) {
      toast("Enter the 6-digit code", "error");
      return;
    }
    setLoading(true);
    try {
      await resetPassword({ email, otp, new_password: password });
      setDone(true);
    } catch (err) {
      toast(err.message || "Reset failed", "error");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>✅</div>
        <h2 style={{ marginBottom: 8 }}>Password updated!</h2>
        <p style={{ color: "var(--muted)", marginBottom: 24 }}>You can now sign in with your new password.</p>
        <Link to="/login"><Button variant="primary" full>Back to Sign in</Button></Link>
      </div>
    );
  }

  const strength = passwordStrength(password);

  return (
    <>
      <h1 className="auth-title">Enter reset code</h1>
      <p className="auth-subtitle">
        Code sent to <strong>{email}</strong>
      </p>
      <form onSubmit={submit}>
        <OtpBoxes value={otp} onChange={setOtp} length={6} />
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          {running ? (
            <span style={{ fontSize: 13, color: "var(--muted)" }}>Resend in {seconds}s</span>
          ) : (
            <button type="button" onClick={resend} style={{ background: "none", border: "none", color: "var(--blue)", cursor: "pointer", fontSize: 13 }}>
              Resend code
            </button>
          )}
        </div>
        <div className="form-group">
          <label className="form-label">New password</label>
          <input
            className="form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 6 characters"
            required
            minLength={6}
          />
          {password && <div className={`pw-strength ${strength}`} />}
        </div>
        <Button type="submit" variant="primary" full loading={loading}>
          Reset password
        </Button>
      </form>
    </>
  );
}
