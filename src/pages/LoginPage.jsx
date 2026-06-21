// src/pages/LoginPage.jsx
import AuthShell from "../components/auth/AuthShell.jsx";
import LoginForm from "../components/auth/LoginForm.jsx";

export default function LoginPage() {
  return (
    <AuthShell>
      <LoginForm />
    </AuthShell>
  );
}
