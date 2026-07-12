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

export default function Highlightable({ text, notes, onSave, as: Tag = "span", className, style }) {
  const [toolbar, setToolbar] = useState(null);
  const containerRef = useRef(null);

  function handleMouseUp() {
    const sel = window.getSelection();
    const selectedText = sel && sel.toString().trim();
    if (!selectedText || !containerRef.current || !sel.anchorNode || !containerRef.current.contains(sel.anchorNode)) {
      return;
    }
    const rect = sel.getRangeAt(0).getBoundingClientRect();
    setToolbar({ x: rect.left + rect.width / 2, y: rect.top - 46, selectedText });
  }

  function pickColor(color) {
    if (toolbar) onSave({ selectedText: toolbar.selectedText, color, note: null });
    closeToolbar();
  }

  function addNote() {
    if (!toolbar) return;
    const note = window.prompt(`Ghi chú cho "${toolbar.selectedText}":`, "");
    if (note && note.trim()) {
      onSave({ selectedText: toolbar.selectedText, color: "yellow", note: note.trim() });
    }
    closeToolbar();
  }

  function closeToolbar() {
    setToolbar(null);
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

      {toolbar && (
        <div
          style={{ position: "fixed", left: toolbar.x, top: toolbar.y, transform: "translateX(-50%)",
            background: "#1F2937", borderRadius: 10, padding: "6px 8px", display: "flex", gap: 6,
            alignItems: "center", zIndex: 200, boxShadow: "0 6px 20px rgba(0,0,0,.25)" }}
          onMouseDown={(e) => e.preventDefault()}
        >
          {HIGHLIGHT_COLORS.map((c) => (
            <button key={c.id} onClick={() => pickColor(c.id)} title="Highlight"
              style={{ width: 20, height: 20, borderRadius: "50%", background: c.hex,
                border: "2px solid #fff", cursor: "pointer", padding: 0 }} />
          ))}
          <span style={{ width: 1, height: 18, background: "rgba(255,255,255,.25)", margin: "0 2px" }} />
          <button onClick={addNote} title="Viết ghi chú"
            style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: 14, padding: "0 2px" }}>
            ✏️
          </button>
        </div>
      )}
    </Tag>
  );
}
