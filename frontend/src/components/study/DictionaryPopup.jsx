import { useState, useEffect } from "react";
import { searchDict } from "../../services/dictService";
import { speak } from "./helpers";

export default function DictionaryPopup({ onClose, accentColor }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

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
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 300,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16,
        width: "100%", maxWidth: 420, maxHeight: "80vh", display: "flex", flexDirection: "column",
        overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #E5E7EB",
          display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: "#111827" }}>📖 Từ điển</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer",
            fontSize: 18, color: "#9CA3AF" }}>✕</button>
        </div>
        <div style={{ padding: 16 }}>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nhập chữ Hán, pinyin hoặc tiếng Việt..."
            style={{ width: "100%", boxSizing: "border-box", padding: "11px 14px",
              border: "1.5px solid #E5E7EB", borderRadius: 11, fontSize: 14, outline: "none" }}
          />
        </div>
        <div style={{ padding: "0 16px 16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
          {loading && <div style={{ fontSize: 13, color: "#9CA3AF" }}>Đang tìm...</div>}
          {!loading && query.trim() && results.length === 0 && (
            <div style={{ fontSize: 13, color: "#9CA3AF" }}>Không tìm thấy "{query.trim()}".</div>
          )}
          {!loading && results.map((r) => (
            <div key={r.id} style={{ border: "1px solid #E5E7EB", borderRadius: 12, padding: "10px 12px",
              display: "flex", alignItems: "flex-start", gap: 10 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 22, color: "#111827" }}>{r.zh}</span>
                  <span style={{ fontSize: 13, color: accentColor, fontStyle: "italic" }}>{r.pinyin}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginTop: 2 }}>{r.vi}</div>
                {r.en && <div style={{ fontSize: 12, color: "#9CA3AF" }}>{r.en}</div>}
              </div>
              <button onClick={() => speak(r.zh)} style={{ flexShrink: 0, background: accentColor + "18",
                border: "none", borderRadius: 9, width: 34, height: 34, cursor: "pointer", fontSize: 14 }}>🔊</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
