// src/components/common/Toast.jsx
import Icon from "./Icon.jsx";
import { ICONS } from "../../constants/icons.js";
import { useToast } from "../../context/ToastContext.jsx";

function Toast({ id, msg, type }) {
  const { remove } = useToast();
  const iconMap = {
    success: ICONS.success,
    error: ICONS.x,
    warning: ICONS.warning,
    info: ICONS.info,
  };
  return (
    <div className={`toast ${type}`} role="alert">
      <Icon d={iconMap[type] || ICONS.info} size={16} />
      <span style={{ flex: 1 }}>{msg}</span>
      <button
        onClick={() => remove(id)}
        style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", padding: "2px" }}
        aria-label="Dismiss"
      >
        <Icon d={ICONS.x} size={14} />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const { toasts } = useToast();
  if (!toasts.length) return null;
  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((t) => (
        <Toast key={t.id} {...t} />
      ))}
    </div>
  );
}
