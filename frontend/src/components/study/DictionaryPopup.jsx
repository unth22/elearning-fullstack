import { useState, useEffect, useRef } from "react";
import { searchDict, explainWord } from "../../services/dictService";
import { speak } from "./helpers";

function Chips({ items, color }) {
  if (!items || !items.length) return <div style={{ fontSize: 12, color: "#D1D5DB" }}>Không có</div>;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {items.map((it, i) => (
        <span key={i} style={{ fontSize: 12, color: "#374151", background: color + "14",
          borderRadius: 8, padding: "4px 9px", lineHeight: 1.4 }}>{it}</span>
      ))}
    </div>
  );
}

function DetailSection({ title, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: .4,
        textTransform: "uppercase", marginBottom: 6 }}>{title}</div>
      {children}
    </div>
  );
}

export default function DictionaryPopup({ onClose, accentColor }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null); // { loading, error, data, word }
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

  function openDetail(word) {
    setDetail({ loading: true, error: "", data: null, word });
    explainWord(word)
      .then((data) => setDetail({ loading: false, error: "", data, word }))
      .catch((err) => setDetail({ loading: false, error: err.message, data: null, word }));
  }

  return (
    <div ref={panelRef} style={{ position: "fixed", right: 78, bottom: 24, zIndex: 250,
      width: 360, maxHeight: "72vh", background: "#fff", borderRadius: 16,
      border: "1px solid #E5E7EB", boxShadow: "0 12px 36px rgba(0,0,0,.18)",
      display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ padding: "14px 16px", borderBottom: "1px solid #E5E7EB",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <div style={{ fontWeight: 800, fontSize: 14, color: "#111827", display: "flex", alignItems: "center", gap: 8 }}>
          {detail && (
            <button onClick={() => setDetail(null)} style={{ background: "none", border: "none",
              cursor: "pointer", fontSize: 15, color: "#6B7280", padding: 0 }}>←</button>
          )}
          📖 Từ điển
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer",
          fontSize: 16, color: "#9CA3AF" }}>✕</button>
      </div>

      {!detail && (
        <>
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
              <div style={{ fontSize: 13, color: "#9CA3AF" }}>
                Không tìm thấy "{query.trim()}" trong kho từ vựng.{" "}
                <button onClick={() => openDetail(query.trim())} style={{ background: "none", border: "none",
                  color: accentColor, cursor: "pointer", fontWeight: 700, fontSize: 13, padding: 0 }}>
                  🤖 Giải thích bằng AI
                </button>
              </div>
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
                  <button onClick={() => openDetail(r.zh)} style={{ marginTop: 4, background: "none",
                    border: "none", color: accentColor, cursor: "pointer", fontSize: 11.5,
                    fontWeight: 700, padding: 0 }}>
                    🔎 Giải thích chi tiết
                  </button>
                </div>
                <button onClick={() => speak(r.zh)} style={{ flexShrink: 0, background: accentColor + "18",
                  border: "none", borderRadius: 8, width: 30, height: 30, cursor: "pointer", fontSize: 13 }}>🔊</button>
              </div>
            ))}
          </div>
        </>
      )}

      {detail && (
        <div style={{ padding: 16, overflowY: "auto" }}>
          {detail.loading && <div style={{ fontSize: 13, color: "#9CA3AF" }}>🤖 Đang phân tích "{detail.word}"...</div>}
          {detail.error && <div style={{ fontSize: 13, color: "#EF4444" }}>{detail.error}</div>}
          {detail.data && (
            <>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 2 }}>
                <span style={{ fontSize: 26, color: "#111827" }}>{detail.data.word}</span>
                <button onClick={() => speak(detail.data.word)} style={{ background: accentColor + "18",
                  border: "none", borderRadius: 8, width: 26, height: 26, cursor: "pointer", fontSize: 12 }}>🔊</button>
              </div>
              <div style={{ fontSize: 13, color: accentColor, fontStyle: "italic", marginBottom: 4 }}>{detail.data.pinyin}</div>
              {detail.data.word_type && (
                <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", background: "#6B7280",
                  borderRadius: 6, padding: "2px 8px", display: "inline-block", marginBottom: 12 }}>
                  {detail.data.word_type}
                </span>
              )}

              <DetailSection title="Nghĩa">
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {(detail.data.meanings || []).map((m, i) => (
                    <div key={i} style={{ fontSize: 13, color: "#111827" }}>
                      <b>{i + 1}.</b> {m.vi} {m.en && <span style={{ color: "#9CA3AF" }}>({m.en})</span>}
                    </div>
                  ))}
                </div>
              </DetailSection>

              {!!(detail.data.examples || []).length && (
                <DetailSection title="Câu mẫu">
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {detail.data.examples.map((ex, i) => (
                      <div key={i} style={{ background: "#F9FAFB", borderRadius: 8, padding: "6px 9px" }}>
                        <div style={{ fontSize: 13, color: "#111827" }}>{ex.zh}</div>
                        <div style={{ fontSize: 11, color: accentColor, fontStyle: "italic" }}>{ex.pinyin}</div>
                        <div style={{ fontSize: 11, color: "#6B7280" }}>{ex.vi}</div>
                      </div>
                    ))}
                  </div>
                </DetailSection>
              )}

              <DetailSection title="Cụm từ hay dùng"><Chips items={detail.data.phrases} color={accentColor} /></DetailSection>
              <DetailSection title="Từ ghép"><Chips items={detail.data.compounds} color={accentColor} /></DetailSection>
              <DetailSection title="Đồng nghĩa"><Chips items={detail.data.synonyms} color="#10B981" /></DetailSection>
              <DetailSection title="Trái nghĩa"><Chips items={detail.data.antonyms} color="#EF4444" /></DetailSection>
              {!!(detail.data.idioms || []).length && (
                <DetailSection title="Thành ngữ liên quan"><Chips items={detail.data.idioms} color="#8B5CF6" /></DetailSection>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
