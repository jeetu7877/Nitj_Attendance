// src/pages/ForgotPasswordPage.jsx
import AuthShell from "../components/auth/AuthShell.jsx";
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm.jsx";

export default function ForgotPasswordPage() {
  return (
    <AuthShell>
      <ForgotPasswordForm />
    </AuthShell>
  );
}
