// src/pages/ResetPasswordPage.jsx
import AuthShell from "../components/auth/AuthShell.jsx";
import ResetPasswordForm from "../components/auth/ResetPasswordForm.jsx";

export default function ResetPasswordPage() {
  return (
    <AuthShell>
      <ResetPasswordForm />
    </AuthShell>
  );
}
