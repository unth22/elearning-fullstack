import { useState, useEffect, useRef } from "react";
import { speak } from "./helpers";
import Highlightable from "./Highlightable";
import InteractiveText from "./InteractiveText";

function Question({ q, index, accentColor, dark, onAnswered }) {
  const [chosen, setChosen] = useState(null);

  function pick(i) {
    if (chosen !== null) return;
    setChosen(i);
    onAnswered();
  }

  return (
    <div className="bg-dem-nhat rounded-2xl px-5 py-4 mb-3" style={{ border: `1px solid ${accentColor}33` }}>
      <div className="text-chu-ngoc text-[15px] font-serif leading-relaxed mb-1">
        <span style={{ color: accentColor }} className="font-bold">{index + 1}. </span>{q.question}
      </div>
      {/* Pinyin/nghĩa câu hỏi chỉ hiện SAU khi đã chọn đáp án, để học viên phải
          tự đọc hiểu câu hỏi tiếng Trung trước, không dựa dẫm vào bản dịch. */}
      {chosen !== null && (q.question_pinyin || q.question_vi) && (
        <div className="mb-2.5">
          {q.question_pinyin && <div className="text-chu-nhat text-xs">{q.question_pinyin}</div>}
          {q.question_vi && <div className="text-chu-mo text-xs font-medium mt-0.5">{q.question_vi}</div>}
        </div>
      )}
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
            <button key={i} onClick={() => pick(i)} style={style}
              className={`px-3.5 py-2.5 rounded-xl border-2 text-left text-sm ${cls}`}>
              <div>{opt}</div>
              {chosen !== null && (q.option_pinyin?.[i] || q.option_vi?.[i]) && (
                <div className="mt-1 text-xs opacity-80 font-normal">
                  {q.option_pinyin?.[i]}{q.option_pinyin?.[i] && q.option_vi?.[i] ? " — " : ""}{q.option_vi?.[i]}
                </div>
              )}
            </button>
          );
        })}
      </div>
      {chosen !== null && q.explanation && (
        <div className="mt-3 pt-3 text-xs leading-relaxed" style={{ borderTop: `1px dashed ${accentColor}33`, color: dark ? "#9A9AB0" : "#4B5563" }}>
          <span className="font-semibold" style={{ color: accentColor }}>Giải thích: </span>{q.explanation}
        </div>
      )}
    </div>
  );
}

export default function ReadingComprehensionMode({ passage, questions, accentColor, dark = false, onComplete, notes, onSaveNote, onUpdateNote, vocab = [], phrases = [] }) {
  const answered = useRef(new Set());
  const completedRef = useRef(false);

  // Chỉ báo hoàn thành khi đã trả lời hết TẤT CẢ câu hỏi trắc nghiệm của bài
  // khóa, không phải chỉ mở trang là tính xong.
  function handleAnswered(qId) {
    answered.current.add(qId);
    if (!completedRef.current && questions.length > 0 && answered.current.size >= questions.length) {
      completedRef.current = true;
      onComplete?.();
    }
  }

  useEffect(() => {
    if (questions.length === 0 && !completedRef.current) {
      // Bài không có câu hỏi (hiếm) — coi như hoàn thành khi đã đọc bài khóa.
      completedRef.current = true;
      onComplete?.();
    }
  }, [questions, onComplete]);

  const passageNotes = (notes || []).filter((n) => passage.content_zh.includes(n.selected_text));

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
        {onSaveNote ? (
          <Highlightable as="div" text={passage.content_zh} notes={passageNotes} onSave={onSaveNote} onUpdate={onUpdateNote}
            className="text-chu-ngoc text-base font-serif leading-loose whitespace-pre-line mb-3"
            renderText={(t) => <InteractiveText text={t} vocab={vocab} phrases={phrases} accentColor={accentColor} dark={dark} />} />
        ) : (
          <div className="text-chu-ngoc text-base font-serif leading-loose whitespace-pre-line mb-3">
            <InteractiveText text={passage.content_zh} vocab={vocab} phrases={phrases} accentColor={accentColor} dark={dark} />
          </div>
        )}
        {passage.content_pinyin && (
          <div className="text-chu-nhat text-[13px] leading-relaxed whitespace-pre-line mb-3">{passage.content_pinyin}</div>
        )}
        <div className="text-chu-mo text-sm font-medium leading-relaxed whitespace-pre-line border-t border-vien-dem pt-3">{passage.content_vi}</div>
        <div className="text-chu-nhat text-[11px] mt-3 opacity-70">
          💡 Mẹo: di chuột hoặc bấm vào chữ trong bài khóa để xem nghĩa{onSaveNote ? ", bôi đen để tô màu highlight hoặc lưu vào ghi chú (icon 📝 góc dưới bên phải)" : ""}.
        </div>
      </div>

      {questions.length > 0 && (
        <>
          <div className="text-vang-kim text-[13px] font-semibold mb-3">TRẮC NGHIỆM ĐỌC HIỂU</div>
          {questions.map((q, i) => (
            <Question key={q.id} q={q} index={i} accentColor={accentColor} dark={dark} onAnswered={() => handleAnswered(q.id)} />
          ))}
        </>
      )}
    </div>
  );
}
