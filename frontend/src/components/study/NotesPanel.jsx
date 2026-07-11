import { useEffect, useRef } from "react";
import { deleteNote } from "../../services/noteService";
import { HIGHLIGHT_COLOR_HEX } from "./helpers";

export default function NotesPanel({ notes, onClose, onDeleted }) {
  const panelRef = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [onClose]);

  async function handleDelete(id) {
    await deleteNote(id).catch(() => {});
    onDeleted(id);
  }

  return (
    <div ref={panelRef} style={{ position: "fixed", right: 78, bottom: 24, zIndex: 250,
      width: 340, maxHeight: "65vh", background: "#fff", borderRadius: 16,
      border: "1px solid #E5E7EB", boxShadow: "0 12px 36px rgba(0,0,0,.18)",
      display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ padding: "14px 16px", borderBottom: "1px solid #E5E7EB",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <div style={{ fontWeight: 800, fontSize: 14, color: "#111827" }}>📝 Ghi chú & highlight</div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer",
          fontSize: 16, color: "#9CA3AF" }}>✕</button>
      </div>

      <div style={{ padding: 14, overflowY: "auto" }}>
        {!notes.length && (
          <p style={{ color: "#9CA3AF", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
            Chưa có ghi chú nào. Bôi đen nội dung bài giảng để tô màu highlight hoặc kèm ghi chú.
          </p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {notes.map((n) => (
            <div key={n.id} style={{ border: "1px solid #E5E7EB", borderRadius: 10, padding: 10 }}>
              <div style={{ fontSize: 12.5, background: (HIGHLIGHT_COLOR_HEX[n.color] || "#FDE68A") + "80",
                borderRadius: 8, padding: "4px 9px", marginBottom: n.note ? 6 : 0, display: "inline-block" }}>
                {n.selected_text}
              </div>
              {n.note && <div style={{ fontSize: 12.5, color: "#374151", lineHeight: 1.6 }}>{n.note}</div>}
              <div>
                <button onClick={() => handleDelete(n.id)} style={{ marginTop: 6, fontSize: 11,
                  color: "#EF4444", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
