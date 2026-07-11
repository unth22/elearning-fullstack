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

  const next = () => {
    setInput(""); setResult(null);
    setIdx((i) => (i + 1) % sentences.length);
  };

  const borderColor = result === "correct" ? "#4CAF8E" : result === "wrong" ? "#E74C3C" : "#2A4A7F";

  return (
    <div className="max-w-[520px] mx-auto px-4">
      <div className="text-chu-nhat text-[13px] mb-4">Nghe và gõ lại câu tiếng Trung • {idx + 1}/{sentences.length}</div>
      <div className="bg-dem-nhat rounded-2xl p-6 mb-4" style={{ border: `1px solid ${accentColor}33` }}>
        <div className="text-chu-nhat text-[13px] mb-2">Nghĩa tiếng Việt:</div>
        <div className="text-chu-ngoc text-[17px] leading-relaxed">{current.vi}</div>
        <button
          onClick={() => speak(current.zh)}
          className="mt-4 border-none rounded-full px-5 py-2 text-sm font-bold"
          style={{ background: accentColor, color: "#0F1A2E" }}
        >🔊 Nghe câu tiếng Trung</button>
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
          <div className="text-chu-nhat font-mono text-[13px] mt-1">{current.pinyin}</div>
        </div>
      )}
      <div className="flex gap-2.5 mt-3">
        {!result ? (
          <button onClick={check} className="flex-1 py-3 border-none rounded-xl text-[15px] font-bold" style={{ background: accentColor, color: "#0F1A2E" }}>Kiểm tra</button>
        ) : (
          <button onClick={next} className="flex-1 py-3 bg-dem-nhat rounded-xl text-[15px]" style={{ border: `1px solid ${accentColor}`, color: accentColor }}>Câu tiếp →</button>
        )}
      </div>
    </div>
  );
}
