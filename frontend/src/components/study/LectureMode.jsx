import Highlightable from "./Highlightable";

export default function LectureMode({ course, moduleIndex = 0, accentColor, notes = [], onSaveNote, onUpdateNote, dark = false }) {
  const modules = course?.intro_content?.modules;

  if (!modules || !modules.length) {
    return (
      <p className="text-gray-400 text-center">
        📹 Nội dung bài giảng đang được cập nhật cho khóa học này.
      </p>
    );
  }

  const m = modules[moduleIndex] || modules[0];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Khối video placeholder — nội dung video sẽ được bổ sung sau */}
      <div className="rounded-2xl overflow-hidden border border-gray-200 mb-6"
        style={{ background: `linear-gradient(135deg, #1E293B, #0F172A)` }}>
        <div className="aspect-video flex flex-col items-center justify-center gap-3 text-center px-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
            style={{ background: accentColor + "22", color: accentColor }}>
            ▶
          </div>
          <div className="text-white font-semibold text-lg">{m.subtitle}</div>
          <div className="text-white/40 text-xs">🎬 Video bài giảng sắp ra mắt</div>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="text-[11px] font-bold tracking-widest uppercase" style={{ color: accentColor }}>
          {m.title}
        </div>
        <div className="h-px flex-1" style={{ background: dark ? "#2A2C3D" : "#E5E7EB" }} />
      </div>
      <Highlightable as="h2" text={m.subtitle} notes={notes} onSave={onSaveNote} onUpdate={onUpdateNote}
        className="text-xl font-bold mb-4 block" style={{ color: dark ? "#EDEDF2" : "#111827" }} />
      <div className="flex flex-wrap gap-2 mb-8">
        {(m.topics || []).map((t, j) => (
          <Highlightable key={j} text={t} notes={notes} onSave={onSaveNote} onUpdate={onUpdateNote}
            className="text-sm rounded-lg px-3 py-1.5 inline-block"
            style={{ color: dark ? "#C4C4D6" : "#4B5563", background: dark ? "#22243380" : "#F3F4F6" }} />
        ))}
      </div>

      <p className="text-xs" style={{ color: dark ? "#6E6E85" : "#9CA3AF" }}>
        💡 Mẹo: bôi đen chữ trong bài giảng để tô màu highlight hoặc lưu vào ghi chú (icon 📝 góc dưới bên phải).
      </p>
    </div>
  );
}
