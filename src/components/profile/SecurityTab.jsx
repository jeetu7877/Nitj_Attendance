// src/components/profile/SecurityTab.jsx
// NOTE: No real password-change endpoint exists. The workaround (same as original code)
// is to verify old password via /login, then redirect to the forgot-password OTP flow.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as apiLogin } from "../../api/auth.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import Button from "../common/Button.jsx";
import { formatDateTime } from "../../utils/formatDate.js";

export default function SecurityTab() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [oldPw, setOldPw] = useState("");
  const [verifying, setVerifying] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setVerifying(true);
    try {
      await apiLogin({ email: user?.email, password: oldPw });
      // Old password verified — redirect to forgot-password OTP flow for actual reset
      toast("Password verified. Follow the reset flow to set a new password.", "info");
      navigate("/forgot-password");
    } catch {
      toast("Incorrect current password", "error");
    } finally {
      setVerifying(false);
    }
  };

  const handleSignOutAll = () => {
    // TODO: replace with custom ConfirmModal
    if (!confirm("Sign out of all devices? You'll need to log in again.")) return;
    logout();
    navigate("/login");
  };

  return (
    <div style={{ maxWidth: 560 }}>
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 16 }}>Change password</div>
        <form onSubmit={handleChangePassword}>
          <div className="form-group">
            <label className="form-label">Current password</label>
            <input className="form-input" type="password" value={oldPw} onChange={(e) => setOldPw(e.target.value)} placeholder="Enter current password" required />
          </div>
          <div className="form-hint" style={{ marginBottom: 12 }}>
            We'll verify your current password, then guide you through setting a new one via the reset flow.
          </div>
          <Button type="submit" variant="primary" loading={verifying}>
            Verify & continue
          </Button>
        </form>
      </div>

      <div className="card">
        <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 12 }}>Active session</div>
        <div style={{ fontSize: 14, color: "var(--muted)", marginBottom: 4 }}>Signed in as</div>
        <div style={{ fontWeight: 500, marginBottom: 4 }}>{user?.email}</div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16 }}>
          Session started: {formatDateTime(new Date().toISOString())}
        </div>
        <Button variant="danger" onClick={handleSignOutAll}>
          Sign out all devices
        </Button>
      </div>
    </div>
  );
}
