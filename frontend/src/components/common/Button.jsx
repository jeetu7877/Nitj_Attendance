// src/components/common/Button.jsx
import Spinner from "./Spinner.jsx";

export default function Button({
  children,
  variant = "primary",
  size,
  loading,
  full,
  icon,
  ...props
}) {
  const cls = [
    "btn",
    `btn-${variant}`,
    size ? `btn-${size}` : "",
    full ? "btn-full" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button {...props} className={cls} disabled={loading || props.disabled}>
      {loading ? <Spinner /> : icon}
      {children}
    </button>
  );
}
