import { deleteNote } from "../../services/noteService";
import { HIGHLIGHT_COLOR_HEX } from "./helpers";

export default function NotesPanel({ notes, onClose, onDeleted }) {
  async function handleDelete(id) {
    await deleteNote(id).catch(() => {});
    onDeleted(id);
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 300,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16,
        width: "100%", maxWidth: 440, maxHeight: "80vh", overflowY: "auto", padding: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: "#111827" }}>📝 Ghi chú & highlight của tôi</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer",
            fontSize: 18, color: "#9CA3AF" }}>✕</button>
        </div>

        {!notes.length && (
          <p style={{ color: "#9CA3AF", fontSize: 14, lineHeight: 1.6 }}>
            Chưa có ghi chú nào. Bôi đen nội dung bài giảng để tô màu highlight hoặc lưu ghi chú.
          </p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {notes.map((n) => (
            <div key={n.id} style={{ border: "1px solid #E5E7EB", borderRadius: 12, padding: 12 }}>
              <div style={{ fontSize: 13, background: (HIGHLIGHT_COLOR_HEX[n.color] || "#FDE68A") + "80",
                borderRadius: 8, padding: "5px 10px", marginBottom: n.note ? 8 : 0, display: "inline-block" }}>
                {n.selected_text}
              </div>
              {n.note && <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>{n.note}</div>}
              <div>
                <button onClick={() => handleDelete(n.id)} style={{ marginTop: 8, fontSize: 12,
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
