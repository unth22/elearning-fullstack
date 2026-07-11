import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getCourseById, getVocabulary, getGrammar, getSentences } from "../services/courseService";
import { speak } from "../components/study/helpers";
import FlashcardMode from "../components/study/FlashcardMode";
import QuizMode from "../components/study/QuizMode";
import VocabMode from "../components/study/VocabMode";
import HanziMode from "../components/study/HanziMode";
import DictationMode from "../components/study/DictationMode";
import ShadowingMode from "../components/study/ShadowingMode";
import GrammarMode from "../components/study/GrammarMode";

const MODES = [
  { id: "flashcard", label: "Flashcard", icon: "🃏" },
  { id: "quiz", label: "Trắc nghiệm", icon: "✏️" },
  { id: "vocab", label: "Từ vựng", icon: "📖" },
  { id: "hanzi", label: "Nét chữ", icon: "✍️" },
  { id: "dictation", label: "Nghe chép", icon: "🎧" },
  { id: "shadowing", label: "Shadowing", icon: "🎤" },
  { id: "grammar", label: "Ngữ pháp", icon: "📝" },
];

export default function CourseStudyPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [vocab, setVocab] = useState([]);
  const [grammar, setGrammar] = useState([]);
  const [sentences, setSentences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("flashcard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([getCourseById(id), getVocabulary(id), getGrammar(id), getSentences(id)])
      .then(([c, v, g, s]) => { setCourse(c); setVocab(v); setGrammar(g); setSentences(s); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-dem-sau flex items-center justify-center text-chu-nhat">Đang tải khóa học...</div>;
  }
  if (error || !course) {
    return (
      <div className="min-h-screen bg-dem-sau flex flex-col items-center justify-center gap-4 text-chu-nhat">
        <p>{error || "Không tìm thấy khóa học."}</p>
        <Link to="/" className="text-vang-kim">← Về trang chủ</Link>
      </div>
    );
  }

  const accentColor = course.accent_color || "#E8B84B";

  return (
    <div className="flex min-h-screen bg-dem-sau">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "w-[220px] min-w-[220px]" : "w-0 min-w-0"} bg-dem-toi border-r border-dem-nhat transition-all overflow-hidden flex-shrink-0 flex flex-col`}
      >
        <div className="px-4 pt-5 pb-3">
          <Link to="/dashboard" className="bg-transparent border-none text-chu-nhat text-[13px] mb-4 flex items-center gap-1.5">
            ← Về Dashboard
          </Link>
          <div className="text-[11px] text-vang-kim tracking-widest font-semibold mb-3">CHẾ ĐỘ HỌC</div>
        </div>
        <div className="flex-1 overflow-y-auto px-2.5 pb-5">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className="w-full text-left px-3.5 py-2.5 rounded-[10px] mb-1 text-sm flex items-center gap-2 transition-all"
              style={{
                background: mode === m.id ? accentColor + "22" : "transparent",
                border: `1px solid ${mode === m.id ? accentColor + "66" : "transparent"}`,
                color: mode === m.id ? accentColor : "#8BA3C0",
              }}
            >
              <span>{m.icon}</span> {m.label}
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-dem-nhat">
          <div className="text-2xl font-serif" style={{ color: accentColor }}>{course.icon} {course.name_zh}</div>
          <div className="text-chu-mo text-xs mt-1">{vocab.length} từ vựng</div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-5 py-4 border-b border-dem-nhat flex items-center gap-3 bg-dem-toi">
          <button onClick={() => setSidebarOpen((o) => !o)} className="bg-transparent border-none text-chu-nhat text-lg">☰</button>
          <div className="flex-1">
            <div className="text-base font-semibold text-chu-ngoc">{course.title}</div>
            <div className="text-xs text-chu-mo">{MODES.find((m) => m.id === mode)?.icon} {MODES.find((m) => m.id === mode)?.label}</div>
          </div>
          <button
            onClick={() => vocab[0] && speak(vocab[0].zh)}
            className="bg-transparent rounded-full px-3.5 py-1.5 text-[13px]"
            style={{ border: `1px solid ${accentColor}44`, color: accentColor }}
          >🔊 TTS</button>
        </div>

        {/* Mode tabs (mobile) */}
        <div className="flex gap-1.5 px-4 py-2.5 overflow-x-auto border-b border-dem-nhat bg-dem-toi">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className="px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap flex-shrink-0"
              style={{
                border: `1px solid ${mode === m.id ? accentColor : "#2A4A7F"}`,
                background: mode === m.id ? accentColor + "22" : "transparent",
                color: mode === m.id ? accentColor : "#6A8AAA",
              }}
            >{m.icon} {m.label}</button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto py-7 px-5">
          {mode === "flashcard" && <FlashcardMode vocab={vocab} accentColor={accentColor} key="fc" />}
          {mode === "quiz" && <QuizMode vocab={vocab} accentColor={accentColor} key="q" />}
          {mode === "vocab" && <VocabMode vocab={vocab} accentColor={accentColor} />}
          {mode === "hanzi" && <HanziMode vocab={vocab} accentColor={accentColor} key="hz" />}
          {mode === "dictation" && <DictationMode sentences={sentences} accentColor={accentColor} key="d" />}
          {mode === "shadowing" && <ShadowingMode sentences={sentences} accentColor={accentColor} key="s" />}
          {mode === "grammar" && <GrammarMode grammar={grammar} sentences={sentences} accentColor={accentColor} />}
        </div>
      </div>
    </div>
  );
}
