// src/components/auth/ForgotPasswordForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../api/auth.js";
import { useToast } from "../../context/ToastContext.jsx";
import { isValidEmail } from "../../utils/validators.js";
import Button from "../common/Button.jsx";

export default function ForgotPasswordForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      toast("Enter a valid email address", "error");
      return;
    }
    setLoading(true);
    try {
      await forgotPassword({ email });
      toast("OTP sent to your email", "success");
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      toast(err.message || "Failed to send OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="auth-title">Reset password</h1>
      <p className="auth-subtitle">We'll send a 6-digit code to your email</p>
      <form onSubmit={submit}>
        <div className="form-group">
          <label className="form-label">Email address</label>
          <input
            className="form-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoFocus
          />
        </div>
        <Button type="submit" variant="primary" full loading={loading}>
          Send reset code
        </Button>
      </form>
    </>
  );
}
