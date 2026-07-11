import { useState, useEffect } from "react";
import { speak, shuffle } from "./helpers";

function buildQuestions(vocab) {
  return shuffle(vocab).slice(0, Math.min(8, vocab.length)).map((card) => {
    const wrong = shuffle(vocab.filter((v) => v.zh !== card.zh)).slice(0, 3);
    const opts = shuffle([card, ...wrong]);
    return { card, opts, type: Math.random() > 0.5 ? "zh2vi" : "vi2zh" };
  });
}

export default function QuizMode({ vocab, accentColor }) {
  const [qIdx, setQIdx] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    setQuestions(buildQuestions(vocab));
    setQIdx(0); setChosen(null); setScore(0); setDone(false);
  }, [vocab]);

  if (vocab.length < 4) return <p className="text-chu-nhat text-center">Cần ít nhất 4 từ vựng để làm trắc nghiệm.</p>;
  if (!questions.length) return null;

  if (done) {
    return (
      <div className="text-center p-10">
        <div className="text-6xl">{score >= 6 ? "🏆" : score >= 4 ? "👍" : "💪"}</div>
        <div className="text-3xl text-vang-kim font-bold mt-2">{score}/{questions.length}</div>
        <div className="text-chu-nhat mt-1">
          {score >= 6 ? "Xuất sắc! Bạn nắm vững từ vựng." : score >= 4 ? "Khá tốt! Hãy ôn thêm một chút." : "Tiếp tục cố gắng nhé!"}
        </div>
        <button
          onClick={() => { setQuestions(buildQuestions(vocab)); setQIdx(0); setChosen(null); setScore(0); setDone(false); }}
          className="mt-5 border-none text-white rounded-2xl px-7 py-3 text-base font-semibold"
          style={{ background: accentColor }}
        >Làm lại</button>
      </div>
    );
  }

  const q = questions[qIdx];
  const isZh2Vi = q.type === "zh2vi";

  const pick = (opt) => {
    if (chosen) return;
    setChosen(opt.zh);
    if (opt.zh === q.card.zh) setScore((s) => s + 1);
    setTimeout(() => {
      if (qIdx + 1 >= questions.length) setDone(true);
      else { setQIdx((i) => i + 1); setChosen(null); }
    }, 1000);
  };

  return (
    <div className="max-w-[500px] mx-auto px-4">
      <div className="flex justify-between mb-5 text-chu-nhat text-[13px]">
        <span>Câu {qIdx + 1}/{questions.length}</span>
        <span className="text-vang-kim">🌟 {score} điểm</span>
      </div>
      <div className="bg-dem-nhat rounded-2xl px-6 py-7 mb-5 text-center" style={{ border: `1px solid ${accentColor}33` }}>
        <div className="text-xs text-chu-mo mb-2">{isZh2Vi ? "Từ này có nghĩa là gì?" : "Chọn từ tiếng Trung đúng:"}</div>
        {isZh2Vi ? (
          <>
            <div className="text-[52px] font-serif text-chu-ngoc">{q.card.zh}</div>
            <div className="text-sm text-chu-nhat font-mono">{q.card.pinyin}</div>
            <button onClick={() => speak(q.card.zh)} className="mt-3 bg-transparent rounded-full px-3.5 py-1 text-xs" style={{ border: `1px solid ${accentColor}44`, color: accentColor }}>🔊</button>
          </>
        ) : (
          <div className="text-2xl text-chu-ngoc font-semibold">{q.card.vi}</div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {q.opts.map((opt) => {
          let cls = "bg-dem-nhat border-vien-dem text-chu-ngoc";
          if (chosen) {
            if (opt.zh === q.card.zh) cls = "bg-[#1A4A3A] border-xanh-luc text-xanh-luc";
            else if (opt.zh === chosen) cls = "bg-[#4A1A1A] border-[#E74C3C] text-[#E74C3C]";
          }
          return (
            <button
              key={opt.zh}
              onClick={() => pick(opt)}
              className={`px-3 py-4 rounded-xl border-2 transition-all text-center ${cls} ${isZh2Vi ? "text-base" : "text-[13px] font-serif"}`}
            >
              {isZh2Vi ? opt.vi : opt.zh}
            </button>
          );
        })}
      </div>
    </div>
  );
}
