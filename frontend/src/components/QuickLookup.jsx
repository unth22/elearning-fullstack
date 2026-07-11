import { useState, useEffect } from "react";
import { searchDict } from "../services/dictService";
import { C, speak } from "../styles/theme";

export default function QuickLookup() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const q = query.trim();
    if (!q) { setResults([]); setLoading(false); return; }
    setLoading(true);
    const t = setTimeout(() => {
      searchDict(q)
        .then((r) => setResults(r))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const q = query.trim();

  return (
    <div style={{ background: "#fff", borderRadius: 18, padding: 20, border: `1px solid ${C.border}` }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: C.t3, marginBottom: 12, letterSpacing: .6 }}>
        🔍 TRA CỨU NHANH TỪ VỰNG
      </div>

      <input
        value={query}
        onChange={(e) => { setQuery(e.target.value); setTouched(true); }}
        placeholder="Nhập chữ Hán, pinyin hoặc tiếng Việt..."
        style={{
          width: "100%", padding: "11px 14px", boxSizing: "border-box",
          border: `1.5px solid ${C.border}`, borderRadius: 11, fontSize: 14,
          outline: "none", fontFamily: C.body,
        }}
      />

      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8,
        maxHeight: 320, overflowY: "auto" }}>
        {loading && <div style={{ fontSize: 13, color: C.t3 }}>Đang tìm...</div>}

        {!loading && q && results.length === 0 && (
          <div style={{ fontSize: 13, color: C.t3, lineHeight: 1.6 }}>
            Không tìm thấy "{q}" trong kho từ vựng chuyên ngành.
          </div>
        )}

        {!loading && !q && touched && (
          <div style={{ fontSize: 13, color: C.t3 }}>Gõ để tra cứu từ vựng.</div>
        )}

        {!loading && results.map((r) => (
          <div key={r.id} style={{
            border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 12px",
            display: "flex", alignItems: "flex-start", gap: 10 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontFamily: C.hanzi, fontSize: 22, color: C.ink, lineHeight: 1.2 }}>{r.zh}</span>
                <span style={{ fontSize: 13, color: C.blue, fontStyle: "italic" }}>{r.pinyin}</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.t1, marginTop: 2 }}>{r.vi}</div>
              {r.en && <div style={{ fontSize: 12, color: C.t3 }}>{r.en}</div>}
              <div style={{ marginTop: 6 }}>
                <span style={{
                  background: (r.accent_color || C.red) + "18", color: r.accent_color || C.red,
                  borderRadius: 99, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>
                  {r.course_icon} {r.course_title}
                </span>
              </div>
            </div>
            <button onClick={() => speak(r.zh)} style={{
              flexShrink: 0, background: C.blueSoft, border: "none", borderRadius: 9,
              width: 34, height: 34, cursor: "pointer", fontSize: 14 }}>🔊</button>
          </div>
        ))}
      </div>
    </div>
  );
}
