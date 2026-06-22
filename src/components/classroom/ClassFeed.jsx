// src/components/classroom/ClassFeed.jsx
import { useState, useEffect } from "react";
import { getPosts, createPost, deletePost, uploadMaterial, createComment, getComments } from "../../api/posts.js";
import { useToast } from "../../context/ToastContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { formatDateTime } from "../../utils/formatDate.js";
import Icon from "../common/Icon.jsx";
import { ICONS } from "../../constants/icons.js";
import Button from "../common/Button.jsx";
import Spinner from "../common/Spinner.jsx";

function CommentSection({ postId }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getComments(postId)
      .then((d) => setComments(Array.isArray(d) ? d : (d.comments || [])))
      .catch(() => {});
  }, [postId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await createComment({ post_id: postId, comment: text });
      setComments((c) => [...c, res.comment || { ...res, author_name: user?.name }]);
      setText("");
    } catch (err) {
      toast(err.message || "Failed to comment", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
      {comments.map((c, i) => (
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <div style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--blue)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
            {(c.user_name || c.author_name)?.[0]?.toUpperCase()}
          </div>
          <div>
            <span style={{ fontWeight: 600, fontSize: 12 }}>{c.user_name || c.author_name}</span>
            <span style={{ fontSize: 11, color: "var(--muted)", marginLeft: 6 }}>{formatDateTime(c.created_at)}</span>
            <p style={{ fontSize: 13, marginTop: 2 }}>{c.content}</p>
          </div>
        </div>
      ))}
      <form onSubmit={submit} style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <input
          className="form-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment…"
          style={{ fontSize: 13, flex: 1 }}
        />
        <Button type="submit" variant="primary" size="sm" loading={loading}>Post</Button>
      </form>
    </div>
  );
}

function PostCard({ post, isAdmin, onDelete }) {
  const [showComments, setShowComments] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    // TODO: replace with custom ConfirmModal
    if (!confirm("Delete this post?")) return;
    try {
      await deletePost(post.id);
      if (onDelete) onDelete(post.id);
      toast("Post deleted", "success");
    } catch (err) {
      toast(err.message || "Delete failed", "error");
    }
  };

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--blue)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, flexShrink: 0 }}>
          {(post.user_name || post.author_name)?.[0]?.toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{post.user_name || post.author_name}</div>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>{formatDateTime(post.created_at)}</div>
        </div>
        {isAdmin && (
          <button className="btn btn-icon" onClick={handleDelete} title="Delete post" aria-label="Delete post">
            <Icon d={ICONS.trash} size={16} color="var(--danger)" />
          </button>
        )}
      </div>

      {post.title && <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{post.title}</h3>}
      {post.content && <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 8 }}>{post.content}</p>}
      {post.file_url && (
        <a href={post.file_url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" style={{ display: "inline-flex", marginTop: 4 }}>
          <Icon d={ICONS.download} size={14} /> Download attachment
        </a>
      )}

      <button
        style={{ background: "none", border: "none", color: "var(--blue)", cursor: "pointer", fontSize: 13, marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}
        onClick={() => setShowComments((v) => !v)}
      >
        <Icon d={ICONS.chevronDown} size={14} />
        {showComments ? "Hide" : "Show"} comments
      </button>
      {showComments && <CommentSection postId={post.id} />}
    </div>
  );
}

export default function ClassFeed({ classId, isAdmin }) {
  const { toast } = useToast();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [composerText, setComposerText] = useState("");
  const [composerFile, setComposerFile] = useState(null);
  const [composerTitle, setComposerTitle] = useState("");
  const [posting, setPosting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [materialTitle, setMaterialTitle] = useState("");
  const [materialDesc, setMaterialDesc] = useState("");
  const [materialFile, setMaterialFile] = useState(null);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    getPosts(classId)
      .then((d) => setPosts(Array.isArray(d) ? d : (d.posts || [])))
      .catch(() => toast("Failed to load posts", "error"))
      .finally(() => setLoading(false));
  }, [classId]);

  const submitPost = async (e) => {
    e.preventDefault();
    if (!composerText.trim()) return;
    setPosting(true);
    try {
      const res = await createPost({ classroom_id: classId, title: composerTitle, content: composerText });
      setPosts((p) => [res.post || res, ...p]);
      setComposerText("");
      setComposerTitle("");
      setComposerFile(null);
    } catch (err) {
      toast(err.message || "Post failed", "error");
    } finally {
      setPosting(false);
    }
  };

  const submitMaterial = async (e) => {
    e.preventDefault();
    if (!materialFile) { toast("Select a file", "error"); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("classroom_id", classId);
      fd.append("title", materialTitle);
      fd.append("description", materialDesc);
      fd.append("file", materialFile);
      const res = await uploadMaterial(fd);
      setPosts((p) => [res.post || res, ...p]);
      setMaterialTitle(""); setMaterialDesc(""); setMaterialFile(null);
      setShowUpload(false);
      toast("Material uploaded", "success");
    } catch (err) {
      toast(err.message || "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      {isAdmin && (
        <div className="card" style={{ marginBottom: 20 }}>
          <form onSubmit={submitPost}>
            <input
              className="form-input"
              value={composerTitle}
              onChange={(e) => setComposerTitle(e.target.value)}
              placeholder="Title (optional)"
              style={{ marginBottom: 8 }}
            />
            <textarea
              className="form-input"
              value={composerText}
              onChange={(e) => setComposerText(e.target.value)}
              placeholder="Post an announcement…"
              rows={3}
              style={{ resize: "vertical", marginBottom: 8 }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowUpload(!showUpload)}>
                <Icon d={ICONS.upload} size={14} /> Upload material
              </button>
              <Button type="submit" variant="primary" size="sm" loading={posting}>Post</Button>
            </div>
          </form>

          {showUpload && (
            <form onSubmit={submitMaterial} style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
              <div style={{ fontWeight: 600, marginBottom: 10 }}>Upload material</div>
              <div className="form-group">
                <input className="form-input" value={materialTitle} onChange={(e) => setMaterialTitle(e.target.value)} placeholder="Material title" required />
              </div>
              <div className="form-group">
                <textarea className="form-input" value={materialDesc} onChange={(e) => setMaterialDesc(e.target.value)} placeholder="Description (optional)" rows={2} />
              </div>
              <div className="file-input-wrap" style={{ marginBottom: 12 }}>
                <label>
                  <input type="file" onChange={(e) => setMaterialFile(e.target.files[0])} required />
                  <Icon d={ICONS.upload} size={20} color="var(--muted)" />
                  <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 6 }}>
                    {materialFile ? materialFile.name : "Click to select file"}
                  </p>
                </label>
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <Button type="button" variant="secondary" size="sm" onClick={() => setShowUpload(false)}>Cancel</Button>
                <Button type="submit" variant="primary" size="sm" loading={uploading}>Upload</Button>
              </div>
            </form>
          )}
        </div>
      )}

      {posts.length === 0 ? (
        <div className="empty-state">
          <Icon d={ICONS.file} size={40} />
          <h3>No posts yet</h3>
          {isAdmin && <p>Share an announcement or upload materials above.</p>}
        </div>
      ) : (
        posts.map((p) => (
          <PostCard
            key={p.id}
            post={p}
            isAdmin={isAdmin}
            onDelete={(id) => setPosts((pp) => pp.filter((x) => x.id !== id))}
          />
        ))
      )}
    </div>
  );
}
