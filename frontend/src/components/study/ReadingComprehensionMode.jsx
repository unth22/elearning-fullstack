import { useState } from "react";
import { speak } from "./helpers";

export default function ReadingComprehensionMode({ passage, questions, accentColor }) {
  const [phase, setPhase] = useState("reading"); // reading | quiz | done
  const [qIdx, setQIdx] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [score, setScore] = useState(0);

  function pick(i) {
    if (chosen !== null) return;
    setChosen(i);
    if (i === questions[qIdx].correct_index) setScore((s) => s + 1);
    setTimeout(() => {
      if (qIdx + 1 >= questions.length) setPhase("done");
      else { setQIdx((q) => q + 1); setChosen(null); }
    }, 900);
  }

  function restart() {
    setPhase("quiz"); setQIdx(0); setChosen(null); setScore(0);
  }

  if (phase === "reading") {
    return (
      <div className="max-w-2xl mx-auto px-2">
        <div className="text-vang-kim text-[13px] font-semibold mb-3">BÀI KHÓA</div>
        <div className="bg-dem-nhat rounded-2xl p-6 mb-5" style={{ border: `1px solid ${accentColor}33` }}>
          <div className="flex items-center justify-between mb-3 gap-3">
            <div className="text-chu-ngoc text-lg font-bold">{passage.title}</div>
            <button onClick={() => speak(passage.content_zh)}
              className="shrink-0 bg-transparent rounded-full px-3 py-1 text-xs"
              style={{ border: `1px solid ${accentColor}44`, color: accentColor }}>🔊 Nghe</button>
          </div>
          <div className="text-chu-ngoc text-base font-serif leading-loose whitespace-pre-line mb-3">{passage.content_zh}</div>
          {passage.content_pinyin && (
            <div className="text-chu-nhat font-mono text-[13px] leading-relaxed whitespace-pre-line mb-3">{passage.content_pinyin}</div>
          )}
          <div className="text-chu-mo text-sm leading-relaxed whitespace-pre-line border-t border-vien-dem pt-3">{passage.content_vi}</div>
        </div>
        {questions.length > 0 ? (
          <button onClick={() => setPhase("quiz")}
            className="w-full py-3 border-none rounded-xl text-[15px] font-bold text-white"
            style={{ background: accentColor }}>
            Bắt đầu trắc nghiệm đọc hiểu →
          </button>
        ) : (
          <p className="text-chu-nhat text-center text-sm">Chưa có câu hỏi trắc nghiệm cho bài này.</p>
        )}
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div className="text-center p-10">
        <div className="text-6xl">{score >= questions.length * 0.75 ? "🏆" : score >= questions.length * 0.5 ? "👍" : "💪"}</div>
        <div className="text-3xl text-vang-kim font-bold mt-2">{score}/{questions.length}</div>
        <div className="text-chu-nhat mt-1">
          {score === questions.length ? "Xuất sắc! Bạn hiểu rất rõ bài khóa." : "Ôn lại bài khóa để nắm chắc hơn nhé."}
        </div>
        <div className="flex gap-3 justify-center mt-5">
          <button onClick={() => setPhase("reading")}
            className="rounded-2xl px-6 py-3 text-sm font-semibold bg-dem-nhat text-chu-ngoc"
            style={{ border: `1px solid ${accentColor}44` }}>← Đọc lại bài khóa</button>
          <button onClick={restart} className="border-none text-white rounded-2xl px-6 py-3 text-sm font-semibold"
            style={{ background: accentColor }}>Làm lại</button>
        </div>
      </div>
    );
  }

  const q = questions[qIdx];
  return (
    <div className="max-w-[560px] mx-auto px-4">
      <div className="flex justify-between mb-5 text-chu-nhat text-[13px]">
        <span>Câu {qIdx + 1}/{questions.length}</span>
        <span className="text-vang-kim">🌟 {score} điểm</span>
      </div>
      <div className="bg-dem-nhat rounded-2xl px-6 py-6 mb-5" style={{ border: `1px solid ${accentColor}33` }}>
        <div className="text-chu-ngoc text-base leading-relaxed">{q.question}</div>
      </div>
      <div className="flex flex-col gap-2.5">
        {q.options.map((opt, i) => {
          let cls = "bg-dem-nhat border-vien-dem text-chu-ngoc";
          if (chosen !== null) {
            if (i === q.correct_index) cls = "bg-[#1A4A3A] border-xanh-luc text-xanh-luc";
            else if (i === chosen) cls = "bg-[#4A1A1A] border-[#E74C3C] text-[#E74C3C]";
          }
          return (
            <button key={i} onClick={() => pick(i)}
              className={`px-4 py-3 rounded-xl border-2 text-left text-sm ${cls}`}>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
