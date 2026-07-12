import { useState } from "react";
import { speak } from "./helpers";

export default function DictationMode({ sentences, accentColor }) {
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);

  if (!sentences.length) return <p className="text-chu-nhat text-center">Chưa có câu ví dụ cho khóa học này.</p>;

  const current = sentences[idx];

  const check = () => {
    const correct = input.trim() === current.zh;
    setResult(correct ? "correct" : "wrong");
    if (correct) setScore((s) => s + 1);
  };

  const goTo = (newIdx) => {
    setInput(""); setResult(null);
    setIdx((newIdx + sentences.length) % sentences.length);
  };

  const borderColor = result === "correct" ? "#4CAF8E" : result === "wrong" ? "#E74C3C" : "#2A4A7F";

  return (
    <div className="max-w-[520px] mx-auto px-4">
      <div className="flex items-center justify-between mb-4">
        <div className="text-chu-nhat text-[13px]">Nghe và gõ lại câu tiếng Trung • {idx + 1}/{sentences.length}</div>
        <div className="flex gap-2">
          <button onClick={() => goTo(idx - 1)} title="Câu trước"
            className="w-8 h-8 rounded-full bg-dem-nhat text-chu-ngoc text-sm" style={{ border: `1px solid ${accentColor}44` }}>←</button>
          <button onClick={() => goTo(idx + 1)} title="Câu tiếp"
            className="w-8 h-8 rounded-full bg-dem-nhat text-chu-ngoc text-sm" style={{ border: `1px solid ${accentColor}44` }}>→</button>
        </div>
      </div>

      <div className="flex justify-center mb-5">
        <button
          onClick={() => speak(current.zh)}
          className="border-none rounded-full w-20 h-20 text-3xl flex items-center justify-center"
          style={{ background: accentColor, color: "#0F1A2E" }}
        >🔊</button>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Gõ câu tiếng Trung vào đây..."
        style={{ borderColor }}
        className="w-full min-h-[80px] bg-dem-sau border-2 rounded-xl text-chu-ngoc text-lg px-4 py-3 font-serif resize-y outline-none box-border"
      />
      {result && (
        <div className={`rounded-xl p-4 mt-2 ${result === "correct" ? "bg-[#1A4A3A]" : "bg-[#4A1A1A]"}`}>
          <div className={`font-bold ${result === "correct" ? "text-xanh-luc" : "text-[#E74C3C]"}`}>
            {result === "correct" ? "✓ Chính xác!" : "✗ Chưa đúng"}
          </div>
          <div className="text-chu-ngoc text-lg font-serif mt-1.5">{current.zh}</div>
          <div className="text-chu-nhat text-[13px] mt-1">{current.pinyin}</div>
          <div className="text-chu-mo text-sm mt-1">{current.vi}</div>
        </div>
      )}
      <div className="flex gap-2.5 mt-3">
        {!result ? (
          <button onClick={check} disabled={!input.trim()} className="flex-1 py-3 border-none rounded-xl text-[15px] font-bold"
            style={{ background: accentColor, color: "#0F1A2E", opacity: input.trim() ? 1 : .5 }}>Kiểm tra</button>
        ) : (
          <button onClick={() => goTo(idx + 1)} className="flex-1 py-3 bg-dem-nhat rounded-xl text-[15px]" style={{ border: `1px solid ${accentColor}`, color: accentColor }}>Câu tiếp →</button>
        )}
      </div>
    </div>
  );
}
