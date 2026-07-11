import { useState, useEffect, useRef } from "react";
import { searchDict } from "../../services/dictService";
import { speak } from "./helpers";

export default function DictionaryPopup({ onClose, accentColor }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [onClose]);

  useEffect(() => {
    const q = query.trim();
    if (!q) { setResults([]); return; }
    setLoading(true);
    const t = setTimeout(() => {
      searchDict(q).then(setResults).catch(() => setResults([])).finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <div ref={panelRef} style={{ position: "fixed", right: 78, bottom: 24, zIndex: 250,
      width: 340, maxHeight: "65vh", background: "#fff", borderRadius: 16,
      border: "1px solid #E5E7EB", boxShadow: "0 12px 36px rgba(0,0,0,.18)",
      display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ padding: "14px 16px", borderBottom: "1px solid #E5E7EB",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <div style={{ fontWeight: 800, fontSize: 14, color: "#111827" }}>📖 Từ điển</div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer",
          fontSize: 16, color: "#9CA3AF" }}>✕</button>
      </div>
      <div style={{ padding: 14, flexShrink: 0 }}>
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nhập chữ Hán, pinyin hoặc tiếng Việt..."
          style={{ width: "100%", boxSizing: "border-box", padding: "9px 12px",
            border: "1.5px solid #E5E7EB", borderRadius: 10, fontSize: 13, outline: "none" }}
        />
      </div>
      <div style={{ padding: "0 14px 14px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
        {loading && <div style={{ fontSize: 13, color: "#9CA3AF" }}>Đang tìm...</div>}
        {!loading && query.trim() && results.length === 0 && (
          <div style={{ fontSize: 13, color: "#9CA3AF" }}>Không tìm thấy "{query.trim()}".</div>
        )}
        {!loading && results.map((r) => (
          <div key={r.id} style={{ border: "1px solid #E5E7EB", borderRadius: 10, padding: "9px 10px",
            display: "flex", alignItems: "flex-start", gap: 8 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap" }}>
                <span style={{ fontSize: 19, color: "#111827" }}>{r.zh}</span>
                <span style={{ fontSize: 12, color: accentColor, fontStyle: "italic" }}>{r.pinyin}</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginTop: 2 }}>{r.vi}</div>
              {r.en && <div style={{ fontSize: 11, color: "#9CA3AF" }}>{r.en}</div>}
            </div>
            <button onClick={() => speak(r.zh)} style={{ flexShrink: 0, background: accentColor + "18",
              border: "none", borderRadius: 8, width: 30, height: 30, cursor: "pointer", fontSize: 13 }}>🔊</button>
          </div>
        ))}
      </div>
    </div>
  );
}
