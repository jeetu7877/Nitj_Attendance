// src/pages/ClassroomsPage.jsx
import { useState, useEffect } from "react";
import { listClassrooms } from "../api/classrooms.js";
import { useToast } from "../context/ToastContext.jsx";
import ClassCard from "../components/classroom/ClassCard.jsx";
import CreateClassroomModal from "../components/classroom/CreateClassroomModal.jsx";
import JoinClassroomModal from "../components/classroom/JoinClassroomModal.jsx";
import SkeletonCard from "../components/common/SkeletonCard.jsx";
import Icon from "../components/common/Icon.jsx";
import { ICONS } from "../constants/icons.js";

export default function ClassroomsPage() {
  const { toast } = useToast();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [search, setSearch] = useState("");

  const load = () => {
    setLoading(true);
    listClassrooms()
      .then((d) => setClasses(Array.isArray(d) ? d : (d.classrooms || [])))
      .catch(() => toast("Failed to load classrooms", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = classes.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.code?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Classrooms</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => setShowJoin(true)}>
            <Icon d={ICONS.plus} size={16} /> Join
          </button>
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
            <Icon d={ICONS.plus} size={16} /> Create
          </button>
        </div>
      </div>

      <div style={{ position: "relative", marginBottom: 20 }}>
        <Icon d={ICONS.search} size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
        <input
          className="form-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search classrooms…"
          style={{ paddingLeft: 38 }}
        />
      </div>

      {loading ? (
        <div className="grid-auto">{[1,2,3].map((i) => <SkeletonCard key={i} />)}</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <Icon d={ICONS.classes} size={48} />
          <h3>{search ? "No results" : "No classrooms yet"}</h3>
          <p>{search ? "Try a different search." : "Create or join a classroom to get started."}</p>
        </div>
      ) : (
        <div className="grid-auto">
          {filtered.map((c) => (
            <ClassCard
              key={c.id}
              classroom={c}
              onDeleted={(id) => setClasses((cl) => cl.filter((x) => x.id !== id))}
            />
          ))}
        </div>
      )}

      {showCreate && (
        <CreateClassroomModal
          onClose={() => setShowCreate(false)}
          onCreated={(c) => setClasses((cl) => [c, ...cl])}
        />
      )}
      {showJoin && (
        <JoinClassroomModal onClose={() => setShowJoin(false)} onJoined={load} />
      )}
    </div>
  );
}
