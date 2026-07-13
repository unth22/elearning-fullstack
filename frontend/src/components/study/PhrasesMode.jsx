import { useState, useRef } from "react";
import { speak } from "./helpers";

export default function PhrasesMode({ phrases, accentColor, dark = false, onComplete }) {
  const [inputs, setInputs] = useState({}); // { [id]: string }
  const [correctIds, setCorrectIds] = useState({}); // { [id]: true }
  const correctRef = useRef(new Set());
  const completedRef = useRef(false);

  if (!phrases || !phrases.length) {
    return (
      <p className="text-gray-400 text-center">
        🔤 Nội dung cụm từ theo bài giảng đang được cập nhật.
      </p>
    );
  }

  // Chỉ báo hoàn thành khi đã gõ đúng hết toàn bộ cụm từ trong bài, không phải
  // chỉ mở trang lên xem qua.
  function handleChange(p, value) {
    setInputs((prev) => ({ ...prev, [p.id]: value }));
    if (value.trim() === p.zh) {
      setCorrectIds((prev) => ({ ...prev, [p.id]: true }));
      correctRef.current.add(p.id);
      if (!completedRef.current && correctRef.current.size >= phrases.length) {
        completedRef.current = true;
        onComplete?.();
      }
    } else if (correctIds[p.id]) {
      setCorrectIds((prev) => { const n = { ...prev }; delete n[p.id]; return n; });
    }
  }

  function handleRetry(p) {
    setInputs((prev) => ({ ...prev, [p.id]: "" }));
    setCorrectIds((prev) => { const n = { ...prev }; delete n[p.id]; return n; });
  }

  return (
    <div className="max-w-2xl mx-auto px-2">
      <div className="text-[13px] font-semibold mb-3" style={{ color: accentColor }}>CỤM TỪ TRONG BÀI</div>
      <div className="grid sm:grid-cols-2 gap-3">
        {phrases.map((p) => {
          const isCorrect = !!correctIds[p.id];
          const value = inputs[p.id] || "";
          return (
            <div key={p.id} className="rounded-2xl p-4 border"
              style={{ background: dark ? "#181A26" : "#F9FAFB", borderColor: isCorrect ? "#4CAF8E" : (dark ? "#2A2C3D" : "#F3F4F6") }}>
              <div className="flex items-start justify-between gap-2">
                <div className="text-xl font-serif" style={{ color: dark ? "#EDEDF2" : "#111827" }}>{p.zh}</div>
                <button
                  onClick={() => speak(p.zh)}
                  className="shrink-0 bg-transparent rounded-full px-2.5 py-1 text-xs"
                  style={{ border: `1px solid ${accentColor}44`, color: accentColor }}
                >🔊</button>
              </div>
              <div className="font-mono text-xs mt-1" style={{ color: dark ? "#6E6E85" : "#9CA3AF" }}>{p.pinyin}</div>
              <div className="text-sm mt-1.5" style={{ color: dark ? "#9A9AB0" : "#4B5563" }}>{p.vi}</div>

              <div className="flex items-center gap-1.5 mt-3">
                <input
                  value={value}
                  onChange={(e) => handleChange(p, e.target.value)}
                  disabled={isCorrect}
                  placeholder="Gõ lại cụm từ tiếng Trung..."
                  className="flex-1 min-w-0 text-base font-serif px-3 py-2 rounded-lg border outline-none"
                  style={{
                    borderColor: isCorrect ? "#4CAF8E" : accentColor + "55",
                    background: dark ? "#12131C" : "#fff",
                    color: dark ? "#EDEDF2" : "#111827",
                  }}
                />
                {isCorrect && <span className="text-lg shrink-0" style={{ color: "#4CAF8E" }}>✓</span>}
                <button
                  onClick={() => handleRetry(p)}
                  title="Viết lại"
                  className="shrink-0 bg-transparent rounded-full w-7 h-7 text-sm"
                  style={{ border: `1px solid ${accentColor}44`, color: accentColor }}
                >↺</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
