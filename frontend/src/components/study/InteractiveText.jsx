import { useState } from "react";
import { searchDict } from "../../services/dictService";

const PUNCT = /[，。！？、,.!?“”"'：:；;（）()\s]/;

// Tách văn bản thành từng "từ" để bấm/di chuột xem nghĩa kiểu Duolingo — ưu
// tiên khớp cụm từ vựng dài nhất đã học trong bài (danh sách vocabWords đã
// sắp theo độ dài giảm dần), phần còn lại tách theo từng chữ Hán riêng lẻ.
function segmentText(text, vocabWords) {
  const segments = [];
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (PUNCT.test(ch)) {
      segments.push({ text: ch, interactive: false, key: `p${i}` });
      i++;
      continue;
    }
    const matched = vocabWords.find((w) => w.length > 1 && text.startsWith(w, i));
    const word = matched || ch;
    segments.push({ text: word, interactive: true, key: `w${i}` });
    i += word.length;
  }
  return segments;
}

function Word({ text, entry, accentColor, dark, active, onOpen, onClose }) {
  const [remote, setRemote] = useState(null);

  function ensureLoaded() {
    if (entry || remote) return;
    setRemote({ loading: true });
    searchDict(text)
      .then((results) => {
        const match = results.find((r) => r.zh === text) || results[0];
        setRemote(match ? { pinyin: match.pinyin, vi: match.vi, loading: false } : { notFound: true, loading: false });
      })
      .catch(() => setRemote({ notFound: true, loading: false }));
  }

  const data = entry || remote;
  const bubbleBg = dark ? "#22243D" : "#1F2937";

  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <span
        onMouseEnter={() => { ensureLoaded(); onOpen(); }}
        onMouseLeave={onClose}
        onClick={(e) => { e.stopPropagation(); ensureLoaded(); active ? onClose() : onOpen(); }}
        style={{ cursor: "pointer", borderBottom: `1.5px dotted ${accentColor}77` }}
      >
        {text}
      </span>
      {active && (
        <div onClick={(e) => e.stopPropagation()} style={{
          position: "absolute", bottom: "calc(100% + 7px)", left: "50%", transform: "translateX(-50%)",
          background: bubbleBg, color: "#fff", borderRadius: 10, padding: "7px 11px",
          fontSize: 12, whiteSpace: "nowrap", boxShadow: "0 8px 22px rgba(0,0,0,.28)", zIndex: 50,
          textAlign: "center", fontFamily: "inherit", pointerEvents: "auto" }}>
          {!data || data.loading ? (
            <span style={{ opacity: .7 }}>Đang tra...</span>
          ) : data.notFound ? (
            <span style={{ opacity: .7 }}>Chưa có trong từ điển</span>
          ) : (
            <>
              <div style={{ fontStyle: "italic", color: accentColor }}>{data.pinyin}</div>
              <div style={{ fontWeight: 700 }}>{data.vi}</div>
            </>
          )}
          <div style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)",
            width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent",
            borderTop: `5px solid ${bubbleBg}` }} />
        </div>
      )}
    </span>
  );
}

export default function InteractiveText({ text, vocab = [], accentColor, dark = false }) {
  const [activeKey, setActiveKey] = useState(null);

  const vocabMap = {};
  const vocabWords = [];
  for (const v of vocab) {
    if (v.zh && !vocabMap[v.zh]) {
      vocabMap[v.zh] = { pinyin: v.pinyin, vi: v.vi };
      vocabWords.push(v.zh);
    }
  }
  vocabWords.sort((a, b) => b.length - a.length);

  const segments = segmentText(text, vocabWords);

  return segments.map((seg) =>
    seg.interactive ? (
      <Word
        key={seg.key}
        text={seg.text}
        entry={vocabMap[seg.text]}
        accentColor={accentColor}
        dark={dark}
        active={activeKey === seg.key}
        onOpen={() => setActiveKey(seg.key)}
        onClose={() => setActiveKey((k) => (k === seg.key ? null : k))}
      />
    ) : (
      <span key={seg.key}>{seg.text}</span>
    )
  );
}
