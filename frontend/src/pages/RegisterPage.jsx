// src/pages/RegisterPage.jsx
import AuthShell from "../components/auth/AuthShell.jsx";
import RegisterForm from "../components/auth/RegisterForm.jsx";

export default function RegisterPage() {
  return (
    <AuthShell>
      <RegisterForm />
    </AuthShell>
  );
}
