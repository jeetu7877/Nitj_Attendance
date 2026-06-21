// src/utils/validators.js
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function passwordStrength(pw) {
  if (!pw || pw.length < 6) return "weak";
  const hasUpper = /[A-Z]/.test(pw);
  const hasNum = /\d/.test(pw);
  const hasSpecial = /[^a-zA-Z0-9]/.test(pw);
  const score = [pw.length >= 8, hasUpper, hasNum, hasSpecial].filter(Boolean).length;
  if (score >= 3) return "strong";
  if (score >= 2) return "medium";
  return "weak";
}
