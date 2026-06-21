// src/components/common/Spinner.jsx
export default function Spinner({ size = "md", label = "Loading…" }) {
  const cls = size === "lg" ? "spinner spinner-lg" : "spinner";
  return (
    <span className={cls} role="status" aria-label={label} />
  );
}

export function PageSpinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
      <Spinner size="lg" />
    </div>
  );
}
