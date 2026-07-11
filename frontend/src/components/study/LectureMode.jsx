export default function LectureMode({ course, moduleIndex = 0, accentColor }) {
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
        <div className="h-px flex-1 bg-gray-200" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">{m.subtitle}</h2>
      <div className="flex flex-wrap gap-2 mb-8">
        {(m.topics || []).map((t, j) => (
          <span key={j} className="text-sm text-gray-600 bg-gray-100 rounded-lg px-3 py-1.5">{t}</span>
        ))}
      </div>
    </div>
  );
}
