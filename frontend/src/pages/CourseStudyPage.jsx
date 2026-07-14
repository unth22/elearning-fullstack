import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { getCourseById, getVocabulary, getGrammar, getSentences, getPhrases, getDialogue, getReadingPassages, getComprehensionQuestions } from "../services/courseService";
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
  { id: "quiz", label: "Bài khóa", icon: "📖" },
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
  const activeModuleRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("studyTheme", dark ? "dark" : "light");
  }, [dark]);

  // Cuộn bài học đang chọn lên gần đầu danh sách module bên trái, để khi bấm
  // vào 1 bài từ lộ trình Dashboard (dẫn thẳng vào module đó) học viên thấy
  // ngay bài đang học thay vì phải tự cuộn tìm trong sidebar. Phụ thuộc cả
  // course vì lúc mount đầu tiên (course chưa tải xong) sidebar chưa render
  // ra nút module nào để cuộn tới — phải chờ tải xong rồi mới cuộn được.
  useEffect(() => {
    activeModuleRef.current?.scrollIntoView({ block: "center", behavior: "auto" });
  }, [moduleIndex, course]);

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

  // Đánh dấu 1 bước là đã hoàn thành (lưu cả vào DB module_progress để Dashboard
  // hiển thị lộ trình chính xác). Gọi khi thực sự làm xong nội dung của bước đó,
  // không phải chỉ mở/xem qua.
  function markStepComplete(stepId, mIdx = moduleIndex) {
    setModuleProgress((prev) => {
      const set = new Set(prev[mIdx] || []);
      if (set.has(stepId)) return prev;
      set.add(stepId);
      markModuleStep(id, mIdx, stepId).catch((err) => console.error("Lỗi lưu tiến độ module:", err.message));
      return { ...prev, [mIdx]: set };
    });
  }

  // Các bước chỉ có nội dung để đọc/xem toàn bộ trên 1 trang (không phân trang
  // từng thẻ) — mở lên là đã thấy hết nội dung, nên coi là hoàn thành ngay khi
  // xem. Các bước còn lại (flashcard/quiz/nét chữ/nghe chép/shadowing) có nhiều
  // thẻ/câu nối tiếp nhau nên phải tự báo hoàn thành qua onComplete khi đi hết.
  const PASSIVE_STEPS = ["lecture", "grammar", "dialogue"];
  useEffect(() => {
    if (!course) return;
    const mods = course.intro_content?.modules || [];
    if (mods.length === 0 || !PASSIVE_STEPS.includes(mode)) return;
    markStepComplete(mode);
  }, [course, mode, moduleIndex, id]);

  // Module chỉ có bài giảng (lectureOnly) không có kĩ năng nào khác — nếu vì lý
  // do gì đó mode bị đặt khác "lecture" (vd. link cũ còn lưu mode khác), tự đưa
  // về lại bài giảng vì các chế độ khác không có nội dung/toolbar cho module này.
  useEffect(() => {
    if (!course) return;
    const mods = course.intro_content?.modules || [];
    if (mods[moduleIndex]?.lectureOnly && mode !== "lecture") setMode("lecture");
  }, [course, moduleIndex, mode]);

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

  const currentStepLabel = MODULE_STEPS.find((s) => s.id === mode)?.label
    || PRACTICE_MODES.find((m) => m.id === mode)?.label
    || "";

  // Module chỉ có bài giảng tham khảo (vd. Nhập môn/Phát âm) không có flashcard,
  // trắc nghiệm... nên không hiện thanh kĩ năng và luôn khóa ở chế độ bài giảng.
  const lectureOnly = !!modules[moduleIndex]?.lectureOnly;

  function selectModule(i) {
    setMode("lecture");
    setModuleIndex(i);
  }

  function goToStep(stepId) {
    setMode(stepId);
  }

  const inModuleFlow = modules.length > 0 && MODULE_STEPS.some((s) => s.id === mode);

  return (
    <div className={`flex h-screen ${dark ? "" : "theme-light"}`} style={{ background: theme.pageBg }}>
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
                  ref={moduleIndex === i ? activeModuleRef : null}
                  onClick={() => selectModule(i)}
                  className="w-full text-left px-3.5 py-2.5 rounded-[10px] mb-1 text-sm transition-all"
                  style={{
                    background: moduleIndex === i ? accentColor + "16" : "transparent",
                    border: `1px solid ${moduleIndex === i ? accentColor + "55" : "transparent"}`,
                    color: moduleIndex === i ? accentColor : theme.text2,
                  }}
                >
                  <div className="text-[10px] font-bold tracking-wider opacity-70">{m.title}</div>
                  <div className="leading-snug">{m.subtitle}</div>
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Breadcrumb */}
        <div className="px-5 py-4 border-b flex items-center gap-3" style={{ borderColor: theme.border, background: theme.pageBg }}>
          <button onClick={() => setSidebarOpen((o) => !o)} className="bg-transparent border-none text-lg" style={{ color: theme.text3 }}>☰</button>
          <div className="flex-1 text-sm">
            <Link to="/dashboard" className="no-underline" style={{ color: theme.text3 }}>{course.title}</Link>
            {modules.length > 0 && (
              <>
                <span className="mx-2" style={{ color: theme.text3 }}>›</span>
                <span style={{ color: theme.text3 }}>Module {moduleIndex + 1}</span>
              </>
            )}
            <span className="mx-2" style={{ color: theme.text3 }}>›</span>
            <span className="font-semibold" style={{ color: theme.text1 }}>{currentStepLabel}</span>
          </div>
          <button
            onClick={() => setDark((d) => !d)}
            title={dark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
            className="rounded-full flex items-center justify-center"
            style={{ width: 34, height: 34, border: `1px solid ${theme.border}`, background: "transparent", cursor: "pointer" }}
          >
            {dark ? (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="#4A6FA5">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            ) : (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="#F7C948">
                <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .963L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
                <circle cx="20" cy="4" r="1.3" />
                <circle cx="4" cy="19.5" r="1" />
              </svg>
            )}
          </button>
        </div>

        {/* Thanh tiến trình trong module: bài giảng → trắc nghiệm → flashcard → cụm từ →
            ngữ pháp → hội thoại → nghe chép → shadowing */}
        {modules.length > 0 && !lectureOnly && (
          <ModuleProgressBar
            activeStepId={inModuleFlow ? mode : null}
            completedSteps={moduleProgress[moduleIndex]}
            onSelect={goToStep}
            accentColor={accentColor}
            dark={dark}
          />
        )}

        <div className="flex-1 overflow-y-auto py-7 px-5" style={{ background: theme.pageBg }}>
          {mode === "lecture" && trialExpired && <TrialExpiredNotice accentColor={accentColor} />}
          {mode === "lecture" && !trialExpired && <LectureMode course={course} moduleIndex={moduleIndex} accentColor={accentColor} notes={notes} onSaveNote={handleSaveNote} onUpdateNote={handleUpdateNote} dark={dark} />}
          {mode === "phrases" && <PhrasesMode phrases={scopedPhrases} accentColor={accentColor} dark={dark} onComplete={() => markStepComplete("phrases")} storageKey={`phrases_${id}_${moduleIndex}`} key={`ph-${moduleIndex}`} />}
          {mode === "dialogue" && <DialogueMode lines={scopedDialogue} accentColor={accentColor} dark={dark} />}
          {mode === "flashcard" && <FlashcardMode vocab={mainVocab} accentColor={accentColor} dark={dark} onComplete={() => markStepComplete("flashcard")} key={`fc-${moduleIndex}`} />}
          {mode === "quiz" && (scopedPassage
            ? <ReadingComprehensionMode passage={scopedPassage} questions={scopedQuestions} accentColor={accentColor} dark={dark} onComplete={() => markStepComplete("quiz")} notes={notes} onSaveNote={handleSaveNote} onUpdateNote={handleUpdateNote} vocab={scopedVocab} phrases={scopedPhrases} key={`rc-${moduleIndex}`} />
            : <QuizMode vocab={mainVocab} accentColor={accentColor} dark={dark} onComplete={() => markStepComplete("quiz")} key={`q-${moduleIndex}`} />)}
          {mode === "vocab" && <VocabMode vocab={scopedVocab} accentColor={accentColor} />}
          {mode === "hanzi" && <HanziMode vocab={mainVocab} accentColor={accentColor} dark={dark} onComplete={() => markStepComplete("hanzi")} key={`hz-${moduleIndex}`} />}
          {mode === "dictation" && <DictationMode sentences={scopedSentences} accentColor={accentColor} dark={dark} onComplete={() => markStepComplete("dictation")} key={`d-${moduleIndex}`} />}
          {mode === "shadowing" && <ShadowingMode sentences={scopedSentences} accentColor={accentColor} onComplete={() => markStepComplete("shadowing")} key={`s-${moduleIndex}`} />}
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
