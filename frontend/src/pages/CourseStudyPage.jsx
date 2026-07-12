import { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { getCourseById, getVocabulary, getGrammar, getSentences, getPhrases, getDialogue, getReadingPassages, getComprehensionQuestions } from "../services/courseService";
import { speak } from "../components/study/helpers";
import FlashcardMode from "../components/study/FlashcardMode";
import QuizMode from "../components/study/QuizMode";
import VocabMode from "../components/study/VocabMode";
import HanziMode from "../components/study/HanziMode";
import DictationMode from "../components/study/DictationMode";
import ShadowingMode from "../components/study/ShadowingMode";
import GrammarMode from "../components/study/GrammarMode";
import LectureMode from "../components/study/LectureMode";
import PhrasesMode from "../components/study/PhrasesMode";
import DialogueMode from "../components/study/DialogueMode";
import ReadingComprehensionMode from "../components/study/ReadingComprehensionMode";
import ModuleProgressBar, { MODULE_STEPS } from "../components/study/ModuleProgressBar";
import StudyToolsDock from "../components/study/StudyToolsDock";
import DictionaryPopup from "../components/study/DictionaryPopup";
import NotesPanel from "../components/study/NotesPanel";
import TrialExpiredNotice from "../components/study/TrialExpiredNotice";
import { getNotesByCourse, createNote, updateNote } from "../services/noteService";
import { getMyEnrollments } from "../services/enrollmentService";
import { getModuleProgress, markModuleStep } from "../services/moduleProgressService";

const TRIAL_DAYS = 3;

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
  const [searchParams] = useSearchParams();
  const [course, setCourse] = useState(null);
  const [vocab, setVocab] = useState([]);
  const [grammar, setGrammar] = useState([]);
  const [sentences, setSentences] = useState([]);
  const [phrases, setPhrases] = useState([]);
  const [dialogueLines, setDialogueLines] = useState([]);
  const [passages, setPassages] = useState([]);
  const [comprehensionQuestions, setComprehensionQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mode, setMode] = useState(searchParams.get("mode") || "lecture");
  const [moduleIndex, setModuleIndex] = useState(Number(searchParams.get("module")) || 0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notes, setNotes] = useState([]);
  const [showDictionary, setShowDictionary] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [moduleProgress, setModuleProgress] = useState({}); // { [moduleIndex]: Set(stepId) }
  const [enrolledAt, setEnrolledAt] = useState(null);
  const [dark, setDark] = useState(() => localStorage.getItem("studyTheme") === "dark");

  useEffect(() => {
    localStorage.setItem("studyTheme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getCourseById(id), getVocabulary(id), getGrammar(id), getSentences(id),
      getNotesByCourse(id).catch(() => []), getMyEnrollments().catch(() => []),
      getModuleProgress(id).catch(() => []),
      getPhrases(id).catch(() => []), getDialogue(id).catch(() => []),
      getReadingPassages(id).catch(() => []), getComprehensionQuestions(id).catch(() => []),
    ])
      .then(([c, v, g, s, n, enrollments, moduleProgressRows, ph, dl, rp, cq]) => {
        setCourse(c); setVocab(v); setGrammar(g); setSentences(s); setNotes(n);
        setPhrases(ph); setDialogueLines(dl); setPassages(rp); setComprehensionQuestions(cq);
        const enr = enrollments.find((e) => String(e.course_id) === String(id));
        setEnrolledAt(enr?.enrolled_at || null);
        const hydrated = {};
        for (const row of moduleProgressRows) {
          const set = hydrated[row.module_index] || new Set();
          set.add(row.step_id);
          hydrated[row.module_index] = set;
        }
        setModuleProgress(hydrated);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  // Đánh dấu bước hiện tại là đã xem, bất kể đến bằng cách nào (tải trang lần đầu,
  // chọn module, bấm thanh tiến trình, hay bấm mục luyện tập ở sidebar). Lưu cả
  // vào DB (module_progress) để Dashboard hiển thị lộ trình chính xác.
  useEffect(() => {
    if (!course) return;
    const mods = course.intro_content?.modules || [];
    const inFlow = mods.length > 0 && MODULE_STEPS.some((s) => s.id === mode);
    if (!inFlow) return;
    setModuleProgress((prev) => {
      const set = new Set(prev[moduleIndex] || []);
      if (set.has(mode)) return prev;
      set.add(mode);
      markModuleStep(id, moduleIndex, mode).catch((err) => console.error("Lỗi lưu tiến độ module:", err.message));
      return { ...prev, [moduleIndex]: set };
    });
  }, [course, mode, moduleIndex, id]);

  async function handleSaveNote({ selectedText, color, note }) {
    try {
      const created = await createNote({ courseId: id, selectedText, color, note });
      setNotes((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      console.error("Lỗi lưu ghi chú:", err.message);
      return null;
    }
  }

  async function handleUpdateNote(noteId, { note, color }) {
    try {
      const updated = await updateNote(noteId, { note, color });
      setNotes((prev) => prev.map((n) => (n.id === noteId ? updated : n)));
      return updated;
    } catch (err) {
      console.error("Lỗi cập nhật ghi chú:", err.message);
      return null;
    }
  }

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
  const modules = course.intro_content?.modules || [];

  // Bảng màu chế độ tối cho khung trang (sidebar/breadcrumb/nền chính) —
  // mặt trời = sáng (mặc định), mặt trăng = tối, chỉ đổi ở đây và LectureMode.
  const theme = dark
    ? { pageBg: "#12131C", sidebarBg: "#181A26", border: "#2A2C3D", text1: "#EDEDF2", text2: "#9A9AB0", text3: "#6E6E85" }
    : { pageBg: "#fff", sidebarBg: "#F9FAFB", border: "#E5E7EB", text1: "#111827", text2: "#374151", text3: "#9CA3AF" };

  // Nội dung có module_index (bài nào) chỉ hiện đúng bài đang học; nội dung
  // module_index = null (khóa học cũ, chưa tách theo bài) vẫn hiện xuyên suốt khóa.
  const inModuleScope = (row) => row.module_index === null || row.module_index === undefined || row.module_index === moduleIndex;
  const scopedVocab = vocab.filter(inModuleScope);
  const scopedGrammar = grammar.filter(inModuleScope);
  const scopedSentences = sentences.filter(inModuleScope);
  const scopedPhrases = phrases.filter(inModuleScope);
  const scopedDialogue = dialogueLines.filter(inModuleScope);
  const scopedPassage = passages.find((p) => p.module_index === moduleIndex) || null;
  const scopedQuestions = comprehensionQuestions.filter(inModuleScope);
  const mainVocab = scopedVocab.filter((v) => !(v.tags || []).includes(LOOKUP_ONLY_TAG));
  const trialExpired = !!enrolledAt
    && (Date.now() - new Date(enrolledAt).getTime()) > TRIAL_DAYS * 24 * 60 * 60 * 1000;

  const currentLabel = mode === "lecture"
    ? (modules[moduleIndex]?.subtitle || "Bài giảng")
    : PRACTICE_MODES.find((m) => m.id === mode)?.label
      || MODULE_STEPS.find((s) => s.id === mode)?.label
      || "";

  function selectModule(i) {
    setMode("lecture");
    setModuleIndex(i);
  }

  function goToStep(stepId) {
    setMode(stepId);
  }

  const inModuleFlow = modules.length > 0 && MODULE_STEPS.some((s) => s.id === mode);

  return (
    <div className={`flex min-h-screen ${dark ? "" : "theme-light"}`} style={{ background: theme.pageBg }}>
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "w-[240px] min-w-[240px]" : "w-0 min-w-0"} border-r transition-all overflow-hidden flex-shrink-0 flex flex-col`}
        style={{ background: theme.sidebarBg, borderColor: theme.border }}
      >
        <div className="px-4 pt-5 pb-3">
          <Link to="/dashboard" className="bg-transparent border-none text-[13px] mb-4 flex items-center gap-1.5 no-underline" style={{ color: theme.text3 }}>
            ← Về Dashboard
          </Link>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{course.icon}</span>
            <div className="text-[15px] font-bold leading-tight" style={{ color: theme.text1 }}>{course.title}</div>
          </div>
          <div className="text-xs" style={{ color: theme.text3 }}>{modules.length > 0 ? `${scopedVocab.length} từ vựng (bài này)` : `${vocab.length} từ vựng`}</div>
        </div>
        <div className="flex-1 overflow-y-auto px-2.5 pb-5">
          {modules.length > 0 && (
            <>
              <div className="text-[11px] tracking-widest font-semibold px-1.5 mt-3 mb-2" style={{ color: theme.text3 }}>BÀI GIẢNG</div>
              {modules.map((m, i) => (
                <button
                  key={i}
                  onClick={() => selectModule(i)}
                  className="w-full text-left px-3.5 py-2.5 rounded-[10px] mb-1 text-sm transition-all"
                  style={{
                    background: mode === "lecture" && moduleIndex === i ? accentColor + "16" : "transparent",
                    border: `1px solid ${mode === "lecture" && moduleIndex === i ? accentColor + "55" : "transparent"}`,
                    color: mode === "lecture" && moduleIndex === i ? accentColor : theme.text2,
                  }}
                >
                  <div className="text-[10px] font-bold tracking-wider opacity-70">{m.title}</div>
                  <div className="leading-snug">{m.subtitle}</div>
                </button>
              ))}
              <div className="text-[11px] tracking-widest font-semibold px-1.5 mt-4 mb-2" style={{ color: theme.text3 }}>LUYỆN TẬP</div>
            </>
          )}
          {PRACTICE_MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => goToStep(m.id)}
              className="w-full text-left px-3.5 py-2.5 rounded-[10px] mb-1 text-sm flex items-center gap-2 transition-all"
              style={{
                background: mode === m.id ? accentColor + "16" : "transparent",
                border: `1px solid ${mode === m.id ? accentColor + "55" : "transparent"}`,
                color: mode === m.id ? accentColor : theme.text2,
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
        <div className="px-5 py-4 border-b flex items-center gap-3" style={{ borderColor: theme.border, background: theme.pageBg }}>
          <button onClick={() => setSidebarOpen((o) => !o)} className="bg-transparent border-none text-lg" style={{ color: theme.text3 }}>☰</button>
          <div className="flex-1 text-sm">
            <Link to="/dashboard" className="no-underline" style={{ color: theme.text3 }}>{course.title}</Link>
            <span className="mx-2" style={{ color: theme.text3 }}>›</span>
            <span className="font-semibold" style={{ color: theme.text1 }}>{currentLabel}</span>
          </div>
          <button
            onClick={() => scopedVocab[0] && speak(scopedVocab[0].zh)}
            className="bg-transparent rounded-full px-3.5 py-1.5 text-[13px]"
            style={{ border: `1px solid ${accentColor}44`, color: accentColor }}
          >🔊 TTS</button>
          <button
            onClick={() => setDark((d) => !d)}
            title={dark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
            className="rounded-full text-base"
            style={{ width: 34, height: 34, border: `1px solid ${theme.border}`, background: "transparent", cursor: "pointer" }}
          >{dark ? "🌙" : "☀️"}</button>
        </div>

        {/* Thanh tiến trình trong module: bài giảng → trắc nghiệm → flashcard → cụm từ →
            ngữ pháp → hội thoại → nghe chép → shadowing */}
        {modules.length > 0 && (
          <ModuleProgressBar
            activeStepId={inModuleFlow ? mode : null}
            completedSteps={moduleProgress[moduleIndex]}
            onSelect={goToStep}
            accentColor={accentColor}
          />
        )}

        <div className="flex-1 overflow-y-auto py-7 px-5" style={{ background: theme.pageBg }}>
          {mode === "lecture" && trialExpired && <TrialExpiredNotice accentColor={accentColor} />}
          {mode === "lecture" && !trialExpired && <LectureMode course={course} moduleIndex={moduleIndex} accentColor={accentColor} notes={notes} onSaveNote={handleSaveNote} onUpdateNote={handleUpdateNote} dark={dark} />}
          {mode === "phrases" && <PhrasesMode phrases={scopedPhrases} accentColor={accentColor} dark={dark} />}
          {mode === "dialogue" && <DialogueMode lines={scopedDialogue} accentColor={accentColor} dark={dark} />}
          {mode === "flashcard" && <FlashcardMode vocab={mainVocab} accentColor={accentColor} dark={dark} key={`fc-${moduleIndex}`} />}
          {mode === "quiz" && (scopedPassage
            ? <ReadingComprehensionMode passage={scopedPassage} questions={scopedQuestions} accentColor={accentColor} key={`rc-${moduleIndex}`} />
            : <QuizMode vocab={mainVocab} accentColor={accentColor} key={`q-${moduleIndex}`} />)}
          {mode === "vocab" && <VocabMode vocab={scopedVocab} accentColor={accentColor} />}
          {mode === "hanzi" && <HanziMode vocab={mainVocab} accentColor={accentColor} key={`hz-${moduleIndex}`} />}
          {mode === "dictation" && <DictationMode sentences={scopedSentences} accentColor={accentColor} key={`d-${moduleIndex}`} />}
          {mode === "shadowing" && <ShadowingMode sentences={scopedSentences} accentColor={accentColor} key={`s-${moduleIndex}`} />}
          {mode === "grammar" && <GrammarMode grammar={scopedGrammar} sentences={scopedSentences} accentColor={accentColor} />}
        </div>
      </div>

      <StudyToolsDock
        accentColor={accentColor}
        notesCount={notes.length}
        onOpenDictionary={() => { setShowDictionary(true); setShowNotes(false); }}
        onOpenNotes={() => { setShowNotes(true); setShowDictionary(false); }}
      />
      {showDictionary && <DictionaryPopup accentColor={accentColor} onClose={() => setShowDictionary(false)} />}
      {showNotes && (
        <NotesPanel
          notes={notes}
          onClose={() => setShowNotes(false)}
          onDeleted={(delId) => setNotes((prev) => prev.filter((n) => n.id !== delId))}
        />
      )}
    </div>
  );
}
