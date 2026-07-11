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
import LectureMode from "../components/study/LectureMode";

// Từ vựng gắn nhãn này chỉ dùng để tra cứu (mục "Từ vựng" có bộ lọc theo tag),
// không đưa vào vòng luyện tập chính (Flashcard/Trắc nghiệm/Nét chữ) để tránh tràn lan.
const LOOKUP_ONLY_TAG = "Chủ đề: Kỹ thuật";

const PRACTICE_MODES = [
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
  const [mode, setMode] = useState("lecture");
  const [moduleIndex, setModuleIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([getCourseById(id), getVocabulary(id), getGrammar(id), getSentences(id)])
      .then(([c, v, g, s]) => { setCourse(c); setVocab(v); setGrammar(g); setSentences(s); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-white flex items-center justify-center text-gray-400">Đang tải khóa học...</div>;
  }
  if (error || !course) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 text-gray-400">
        <p>{error || "Không tìm thấy khóa học."}</p>
        <Link to="/" className="text-do-han">← Về trang chủ</Link>
      </div>
    );
  }

  const accentColor = course.accent_color || "#C0392B";
  const mainVocab = vocab.filter((v) => !(v.tags || []).includes(LOOKUP_ONLY_TAG));
  const modules = course.intro_content?.modules || [];

  const currentLabel = mode === "lecture"
    ? (modules[moduleIndex]?.subtitle || "Bài giảng")
    : PRACTICE_MODES.find((m) => m.id === mode)?.label;

  function selectModule(i) {
    setMode("lecture");
    setModuleIndex(i);
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "w-[240px] min-w-[240px]" : "w-0 min-w-0"} bg-gray-50 border-r border-gray-200 transition-all overflow-hidden flex-shrink-0 flex flex-col`}
      >
        <div className="px-4 pt-5 pb-3">
          <Link to="/dashboard" className="bg-transparent border-none text-gray-400 text-[13px] mb-4 flex items-center gap-1.5 no-underline hover:text-gray-600">
            ← Về Dashboard
          </Link>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{course.icon}</span>
            <div className="text-[15px] font-bold text-gray-900 leading-tight">{course.title}</div>
          </div>
          <div className="text-gray-400 text-xs">{vocab.length} từ vựng</div>
        </div>
        <div className="flex-1 overflow-y-auto px-2.5 pb-5">
          {modules.length > 0 && (
            <>
              <div className="text-[11px] text-gray-400 tracking-widest font-semibold px-1.5 mt-3 mb-2">BÀI GIẢNG</div>
              {modules.map((m, i) => (
                <button
                  key={i}
                  onClick={() => selectModule(i)}
                  className="w-full text-left px-3.5 py-2.5 rounded-[10px] mb-1 text-sm transition-all"
                  style={{
                    background: mode === "lecture" && moduleIndex === i ? accentColor + "16" : "transparent",
                    border: `1px solid ${mode === "lecture" && moduleIndex === i ? accentColor + "55" : "transparent"}`,
                    color: mode === "lecture" && moduleIndex === i ? accentColor : "#374151",
                  }}
                >
                  <div className="text-[10px] font-bold tracking-wider opacity-70">{m.title}</div>
                  <div className="leading-snug">{m.subtitle}</div>
                </button>
              ))}
              <div className="text-[11px] text-gray-400 tracking-widest font-semibold px-1.5 mt-4 mb-2">LUYỆN TẬP</div>
            </>
          )}
          {PRACTICE_MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className="w-full text-left px-3.5 py-2.5 rounded-[10px] mb-1 text-sm flex items-center gap-2 transition-all"
              style={{
                background: mode === m.id ? accentColor + "16" : "transparent",
                border: `1px solid ${mode === m.id ? accentColor + "55" : "transparent"}`,
                color: mode === m.id ? accentColor : "#374151",
              }}
            >
              <span>{m.icon}</span> {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Breadcrumb */}
        <div className="px-5 py-4 border-b border-gray-200 flex items-center gap-3 bg-white">
          <button onClick={() => setSidebarOpen((o) => !o)} className="bg-transparent border-none text-gray-400 text-lg">☰</button>
          <div className="flex-1 text-sm">
            <Link to="/dashboard" className="text-gray-400 no-underline hover:text-gray-600">{course.title}</Link>
            <span className="text-gray-300 mx-2">›</span>
            <span className="text-gray-900 font-semibold">{currentLabel}</span>
          </div>
          <button
            onClick={() => vocab[0] && speak(vocab[0].zh)}
            className="bg-transparent rounded-full px-3.5 py-1.5 text-[13px]"
            style={{ border: `1px solid ${accentColor}44`, color: accentColor }}
          >🔊 TTS</button>
        </div>

        {/* Mode tabs (mobile) */}
        <div className="flex gap-1.5 px-4 py-2.5 overflow-x-auto border-b border-gray-200 bg-white">
          {modules.map((m, i) => (
            <button
              key={i}
              onClick={() => selectModule(i)}
              className="px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap flex-shrink-0"
              style={{
                border: `1px solid ${mode === "lecture" && moduleIndex === i ? accentColor : "#E5E7EB"}`,
                background: mode === "lecture" && moduleIndex === i ? accentColor + "16" : "transparent",
                color: mode === "lecture" && moduleIndex === i ? accentColor : "#6B7280",
              }}
            >{m.title}</button>
          ))}
          {PRACTICE_MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className="px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap flex-shrink-0"
              style={{
                border: `1px solid ${mode === m.id ? accentColor : "#E5E7EB"}`,
                background: mode === m.id ? accentColor + "16" : "transparent",
                color: mode === m.id ? accentColor : "#6B7280",
              }}
            >{m.icon} {m.label}</button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto py-7 px-5 bg-white">
          {mode === "lecture" && <LectureMode course={course} moduleIndex={moduleIndex} accentColor={accentColor} />}
          {mode === "flashcard" && <FlashcardMode vocab={mainVocab} accentColor={accentColor} key="fc" />}
          {mode === "quiz" && <QuizMode vocab={mainVocab} accentColor={accentColor} key="q" />}
          {mode === "vocab" && <VocabMode vocab={vocab} accentColor={accentColor} />}
          {mode === "hanzi" && <HanziMode vocab={mainVocab} accentColor={accentColor} key="hz" />}
          {mode === "dictation" && <DictationMode sentences={sentences} accentColor={accentColor} key="d" />}
          {mode === "shadowing" && <ShadowingMode sentences={sentences} accentColor={accentColor} key="s" />}
          {mode === "grammar" && <GrammarMode grammar={grammar} sentences={sentences} accentColor={accentColor} />}
        </div>
      </div>
    </div>
  );
}
