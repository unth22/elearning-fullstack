import { useState } from "react";
import { speak } from "./helpers";

function Question({ q, index, accentColor, dark }) {
  const [chosen, setChosen] = useState(null);

  return (
    <div className="bg-dem-nhat rounded-2xl px-5 py-4 mb-3" style={{ border: `1px solid ${accentColor}33` }}>
      <div className="text-chu-ngoc text-[15px] font-serif leading-relaxed mb-3">
        <span style={{ color: accentColor }} className="font-bold">{index + 1}. </span>{q.question}
      </div>
      <div className="flex flex-col gap-2">
        {q.options.map((opt, i) => {
          let cls = "bg-dem-nhat-2 border-vien-dem text-chu-ngoc";
          let style;
          if (chosen !== null) {
            if (i === q.correct_index) {
              cls = "";
              style = dark
                ? { background: "#1A4A3A", borderColor: "#4CAF8E", color: "#4CAF8E" }
                : { background: "#D1FAE5", borderColor: "#059669", color: "#047857" };
            } else if (i === chosen) {
              cls = "";
              style = dark
                ? { background: "#4A1A1A", borderColor: "#E74C3C", color: "#E74C3C" }
                : { background: "#FEE2E2", borderColor: "#DC2626", color: "#B91C1C" };
            }
          }
          return (
            <button key={i} onClick={() => chosen === null && setChosen(i)} style={style}
              className={`px-3.5 py-2.5 rounded-xl border-2 text-left text-sm ${cls}`}>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ReadingComprehensionMode({ passage, questions, accentColor, dark = false }) {
  return (
    <div className="max-w-2xl mx-auto px-2">
      <div className="text-vang-kim text-[13px] font-semibold mb-3">BÀI KHÓA</div>
      <div className="bg-dem-nhat rounded-2xl p-6 mb-6" style={{ border: `1px solid ${accentColor}33` }}>
        <div className="flex items-center justify-between mb-3 gap-3">
          <div className="text-chu-ngoc text-lg font-bold">{passage.title}</div>
          <button onClick={() => speak(passage.content_zh)}
            className="shrink-0 bg-transparent rounded-full px-3 py-1 text-xs"
            style={{ border: `1px solid ${accentColor}44`, color: accentColor }}>🔊 Nghe</button>
        </div>
        <div className="text-chu-ngoc text-base font-serif leading-loose whitespace-pre-line mb-3">{passage.content_zh}</div>
        {passage.content_pinyin && (
          <div className="text-chu-nhat text-[13px] leading-relaxed whitespace-pre-line mb-3">{passage.content_pinyin}</div>
        )}
        <div className="text-chu-mo text-sm leading-relaxed whitespace-pre-line border-t border-vien-dem pt-3">{passage.content_vi}</div>
      </div>

      {questions.length > 0 && (
        <>
          <div className="text-vang-kim text-[13px] font-semibold mb-3">TRẮC NGHIỆM ĐỌC HIỂU</div>
          {questions.map((q, i) => (
            <Question key={q.id} q={q} index={i} accentColor={accentColor} dark={dark} />
          ))}
        </>
      )}
    </div>
  );
}
