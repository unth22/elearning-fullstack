import { useState } from "react";
import { speak, shuffle } from "./helpers";

export default function FlashcardMode({ vocab, accentColor }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(new Set());
  const [deck, setDeck] = useState(vocab);

  if (!vocab.length) return <p className="text-gray-400 text-center">Chưa có từ vựng cho khóa học này.</p>;

  const card = deck[idx];

  const next = (k) => {
    if (k) setKnown((prev) => new Set([...prev, card.zh]));
    setFlipped(false);
    setTimeout(() => setIdx((i) => (i + 1) % deck.length), 150);
  };

  const reset = () => {
    setDeck(shuffle(vocab));
    setIdx(0);
    setFlipped(false);
    setKnown(new Set());
  };

  return (
    <div className="flex flex-col items-center gap-6 px-4">
      <div className="flex gap-3 items-center">
        <span className="font-mono text-[13px]" style={{ color: accentColor }}>{idx + 1} / {deck.length}</span>
        <div className="bg-gray-200 rounded-full h-1.5 w-[180px] overflow-hidden">
          <div
            className="h-full transition-all duration-300"
            style={{ background: accentColor, width: `${((idx + 1) / deck.length) * 100}%` }}
          />
        </div>
        <span className="text-emerald-600 text-[13px]">✓ {known.size}</span>
      </div>

      <div onClick={() => setFlipped((f) => !f)} className="w-[min(440px,100%)] h-[340px] cursor-pointer select-none" style={{ perspective: 1200 }}>
        <div
          className="relative w-full h-full transition-transform duration-[450ms]"
          style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
        >
          {/* Mặt trước — chỉ chữ Hán */}
          <div
            className="absolute inset-0 rounded-[20px] flex flex-col items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
            style={{ backfaceVisibility: "hidden", background: "#fff", border: `2px solid ${accentColor}33` }}
          >
            <div className="text-7xl font-serif text-gray-900 leading-tight">{card.zh}</div>
            <button
              onClick={(e) => { e.stopPropagation(); speak(card.zh); }}
              className="mt-6 bg-transparent rounded-full px-4 py-1.5 text-[13px]"
              style={{ border: `1px solid ${accentColor}66`, color: accentColor }}
            >🔊 Nghe</button>
            <div className="absolute bottom-3.5 text-gray-400 text-xs">Nhấn để lật ↓</div>
          </div>

          {/* Mặt sau — pinyin, nghĩa Việt, tiếng Anh, câu ví dụ */}
          <div
            className="absolute inset-0 rounded-[20px] flex flex-col items-center justify-center gap-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.08)] px-6 py-5 overflow-y-auto"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "#F9FAFB", border: `2px solid ${accentColor}66` }}
          >
            <div className="font-mono text-sm" style={{ color: accentColor }}>{card.pinyin}</div>
            <div className="text-2xl text-gray-900 font-bold text-center">{card.vi}</div>
            {card.en && <div className="text-sm text-gray-400">{card.en}</div>}
            <div className="flex gap-1.5 mt-1 flex-wrap justify-center">
              {(card.tags || []).map((t) => (
                <span key={t} className="rounded-full px-2.5 py-0.5 text-[11px]" style={{ background: accentColor + "18", color: accentColor }}>{t}</span>
              ))}
            </div>

            {card.example_zh && (
              <div className="w-full mt-2.5 pt-2.5 border-t border-gray-200 text-center">
                <div className="text-base font-serif text-gray-900 leading-snug">{card.example_zh}</div>
                <div className="font-mono text-xs text-gray-500 mt-1">{card.example_pinyin}</div>
                <div className="text-xs text-gray-400 mt-1">{card.example_vi}</div>
                <button
                  onClick={(e) => { e.stopPropagation(); speak(card.example_zh); }}
                  className="mt-2 bg-transparent rounded-full px-3 py-1 text-[11px]"
                  style={{ border: `1px solid ${accentColor}44`, color: accentColor }}
                >🔊 Nghe câu</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={() => next(false)} className="px-7 py-3 rounded-2xl border-2 border-[#E74C3C] bg-transparent text-[#E74C3C] text-[15px] font-semibold">✗ Chưa nhớ</button>
        <button onClick={() => next(true)} className="px-7 py-3 rounded-2xl border-none bg-emerald-500 text-white text-[15px] font-semibold">✓ Đã nhớ</button>
      </div>
      <button onClick={reset} className="bg-transparent border-none text-gray-400 text-[13px]">🔀 Xáo bài & làm lại</button>
    </div>
  );
}
