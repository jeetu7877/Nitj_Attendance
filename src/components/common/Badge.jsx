// src/components/common/Badge.jsx
export default function Badge({ children, variant = "blue", icon }) {
  return (
    <span className={`badge badge-${variant}`}>
      {icon && <span>{icon}</span>}
      {children}
    </span>
  );
}
