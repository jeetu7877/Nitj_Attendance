// src/components/common/SkeletonCard.jsx
export default function SkeletonCard({ lines = 3 }) {
  return (
    <div className="card">
      <div className="skeleton" style={{ height: 16, width: "60%", marginBottom: 12 }} />
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton"
          style={{ height: 12, width: i === lines - 1 ? "40%" : "90%", marginBottom: 8 }}
        />
      ))}
    </div>
  );
}
