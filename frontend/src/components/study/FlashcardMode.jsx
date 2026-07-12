import { useState } from "react";
import { speak, shuffle } from "./helpers";
import { C } from "../../styles/theme";

export default function FlashcardMode({ vocab, accentColor }) {
  const [idx, setIdx] = useState(0);
  const [known, setKnown] = useState(new Set());
  const [deck, setDeck] = useState(vocab);

  if (!vocab.length) return <p className="text-gray-400 text-center">Chưa có từ vựng cho khóa học này.</p>;

  const card = deck[idx];

  const next = (k) => {
    if (k) setKnown((prev) => new Set([...prev, card.zh]));
    setIdx((i) => (i + 1) % deck.length);
  };

  const reset = () => {
    setDeck(shuffle(vocab));
    setIdx(0);
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

      <div className="w-[min(480px,100%)] rounded-[24px] px-8 py-9"
        style={{ background: `linear-gradient(150deg, ${C.ink}, #2D1B4E)`, boxShadow: "0 12px 40px rgba(0,0,0,.25)" }}>
        <div className="leading-tight" style={{ fontFamily: C.hanzi, color: "#fff", fontSize: 56 }}>{card.zh}</div>
        <div className="text-lg italic mt-3" style={{ color: C.gold }}>{card.pinyin}</div>
        <div className="text-xl font-bold mt-2" style={{ color: "#fff" }}>{card.vi}</div>
        {card.en && <div className="text-sm mt-1" style={{ color: "rgba(255,255,255,.45)" }}>{card.en}</div>}

        {(card.tags || []).length > 0 && (
          <div className="flex gap-1.5 mt-3 flex-wrap">
            {card.tags.map((t) => (
              <span key={t} className="rounded-full px-2.5 py-0.5 text-[11px]"
                style={{ background: "rgba(255,255,255,.1)", color: "rgba(255,255,255,.7)" }}>{t}</span>
            ))}
          </div>
        )}

        {card.example_zh && (
          <>
            <div className="my-5" style={{ borderTop: "1px solid rgba(255,255,255,.14)" }} />
            <div className="text-lg leading-snug" style={{ fontFamily: C.hanzi, color: "#fff" }}>{card.example_zh}</div>
            <div className="text-sm mt-1.5" style={{ color: "rgba(255,255,255,.5)" }}>{card.example_pinyin}</div>
            <div className="text-sm italic mt-1" style={{ color: "rgba(255,255,255,.65)" }}>{card.example_vi}</div>
          </>
        )}

        <button
          onClick={() => speak(card.example_zh || card.zh)}
          className="mt-5 rounded-full px-4 py-2 text-sm font-bold"
          style={{ background: "rgba(255,255,255,.12)", color: "#fff", border: "none", cursor: "pointer" }}
        >🔊 Nghe câu</button>
      </div>

      <div className="flex gap-3">
        <button onClick={() => next(false)} className="px-7 py-3 rounded-2xl border-2 border-[#E74C3C] bg-transparent text-[#E74C3C] text-[15px] font-semibold">✗ Chưa nhớ</button>
        <button onClick={() => next(true)} className="px-7 py-3 rounded-2xl border-none bg-emerald-500 text-white text-[15px] font-semibold">✓ Đã nhớ</button>
      </div>
      <button onClick={reset} className="bg-transparent border-none text-gray-400 text-[13px]">🔀 Xáo bài & làm lại</button>
    </div>
  );
}
