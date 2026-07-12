import { useRef, useState } from "react";
import { HIGHLIGHT_COLORS, HIGHLIGHT_COLOR_HEX } from "./helpers";

// Tách `text` thành các đoạn dựa trên các ghi chú/highlight đã lưu (khớp theo
// nội dung text, không theo vị trí DOM) — đơn giản, đủ dùng cho câu/đoạn ngắn.
function splitByNotes(text, notes) {
  if (!notes || !notes.length) return [{ text }];
  const ranges = [];
  for (const n of notes) {
    const idx = text.indexOf(n.selected_text);
    if (idx === -1) continue;
    ranges.push({ start: idx, end: idx + n.selected_text.length, color: n.color, note: n.note });
  }
  ranges.sort((a, b) => a.start - b.start);
  const clean = [];
  let lastEnd = 0;
  for (const r of ranges) {
    if (r.start < lastEnd) continue;
    clean.push(r);
    lastEnd = r.end;
  }
  const pieces = [];
  let cursor = 0;
  for (const r of clean) {
    if (r.start > cursor) pieces.push({ text: text.slice(cursor, r.start) });
    pieces.push({ text: text.slice(r.start, r.end), color: r.color, note: r.note });
    cursor = r.end;
  }
  if (cursor < text.length) pieces.push({ text: text.slice(cursor) });
  return pieces;
}

export default function Highlightable({ text, notes, onSave, onUpdate, as: Tag = "span", className, style }) {
  const [toolbar, setToolbar] = useState(null); // { x, y, selectedText }
  const [pending, setPending] = useState(null); // { color, noteId } — highlight đã tô, chờ (có thể) thêm ghi chú
  const [noteDraft, setNoteDraft] = useState("");
  const containerRef = useRef(null);

  function handleMouseUp() {
    const sel = window.getSelection();
    const selectedText = sel && sel.toString().trim();
    if (!selectedText || !containerRef.current || !sel.anchorNode || !containerRef.current.contains(sel.anchorNode)) {
      return;
    }
    const rect = sel.getRangeAt(0).getBoundingClientRect();
    setToolbar({ x: rect.left + rect.width / 2, y: rect.top - 46, selectedText });
    setPending(null);
  }

  async function pickColor(color) {
    if (!toolbar) return;
    const created = await onSave({ selectedText: toolbar.selectedText, color, note: null });
    setPending({ color, noteId: created?.id || null });
  }

  async function saveNote() {
    if (!toolbar || !pending) return;
    const text = noteDraft.trim();
    if (!text) { closeAll(); return; }
    if (pending.noteId && onUpdate) {
      await onUpdate(pending.noteId, { note: text, color: pending.color });
    } else {
      await onSave({ selectedText: toolbar.selectedText, color: pending.color, note: text });
    }
    closeAll();
  }

  function closeAll() {
    setToolbar(null);
    setPending(null);
    setNoteDraft("");
    window.getSelection()?.removeAllRanges();
  }

  const pieces = splitByNotes(text, notes);

  return (
    <Tag ref={containerRef} onMouseUp={handleMouseUp} className={className} style={{ position: "relative", ...style }}>
      {pieces.map((p, i) => p.color ? (
        <mark key={i} title={p.note || undefined}
          style={{ background: HIGHLIGHT_COLOR_HEX[p.color] || HIGHLIGHT_COLOR_HEX.yellow, borderRadius: 3, padding: "0 2px" }}>
          {p.text}
        </mark>
      ) : <span key={i}>{p.text}</span>)}

      {toolbar && !(pending && pending.showPopup) && (
        <div
          style={{ position: "fixed", left: toolbar.x, top: toolbar.y, transform: "translateX(-50%)",
            background: "#1F2937", borderRadius: 10, padding: "6px 8px", display: "flex", gap: 6,
            alignItems: "center", zIndex: 200, boxShadow: "0 6px 20px rgba(0,0,0,.25)" }}
          onMouseDown={(e) => e.preventDefault()}
        >
          {HIGHLIGHT_COLORS.map((c) => (
            <button key={c.id} onClick={() => pickColor(c.id)} title="Highlight"
              style={{ width: 20, height: 20, borderRadius: "50%", background: c.hex,
                border: pending?.color === c.id ? "2px solid #fff" : "2px solid rgba(255,255,255,.4)",
                boxShadow: pending?.color === c.id ? "0 0 0 2px " + c.hex : "none",
                cursor: "pointer", padding: 0 }} />
          ))}
          <span style={{ width: 1, height: 18, background: "rgba(255,255,255,.25)", margin: "0 2px" }} />
          <button onClick={() => setPending((p) => ({ ...(p || { color: "yellow", noteId: null }), showPopup: true }))}
            title="Viết ghi chú"
            style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: 14, padding: "0 2px" }}>
            ✏️
          </button>
        </div>
      )}

      {toolbar && pending?.showPopup && (
        <div
          style={{ position: "fixed", left: toolbar.x, top: toolbar.y, transform: "translateX(-50%)",
            width: 220, background: HIGHLIGHT_COLOR_HEX[pending.color] || HIGHLIGHT_COLOR_HEX.yellow,
            borderRadius: 10, padding: 10, zIndex: 200, boxShadow: "0 8px 24px rgba(0,0,0,.25)" }}
        >
          <textarea
            autoFocus
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            placeholder="Viết ghi chú..."
            rows={3}
            style={{ width: "100%", boxSizing: "border-box", border: "none", borderRadius: 6,
              padding: 8, fontSize: 13, fontFamily: "inherit", resize: "none", outline: "none",
              background: "rgba(255,255,255,.55)", marginBottom: 8 }}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
            <button onClick={closeAll} style={{ background: "none", border: "none", cursor: "pointer",
              fontSize: 12, color: "#1F2937", opacity: .7, padding: "4px 8px" }}>
              Hủy
            </button>
            <button onClick={saveNote} style={{ background: "#1F2937", border: "none", borderRadius: 6,
              cursor: "pointer", fontSize: 12, color: "#fff", fontWeight: 700, padding: "4px 10px" }}>
              Lưu
            </button>
          </div>
        </div>
      )}
    </Tag>
  );
}
