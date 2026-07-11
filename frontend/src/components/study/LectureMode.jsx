export default function LectureMode({ course, accentColor }) {
  const modules = course?.intro_content?.modules;

  if (!modules || !modules.length) {
    return (
      <p className="text-chu-nhat text-center">
        📹 Nội dung bài giảng đang được cập nhật cho khóa học này.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3 max-w-2xl mx-auto">
      {modules.map((m, i) => (
        <div key={i} className="bg-dem-nhat border border-vien-dem rounded-xl px-5 py-4 flex gap-4 items-start">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0"
            style={{ background: accentColor + "22", color: accentColor }}
          >
            {i + 1}
          </div>
          <div className="flex-1">
            <div className="text-[11px] font-semibold tracking-widest uppercase mb-0.5" style={{ color: accentColor }}>
              {m.title}
            </div>
            <div className="text-chu-ngoc text-[15px] font-semibold mb-2">{m.subtitle}</div>
            <div className="flex flex-wrap gap-1.5">
              {(m.topics || []).map((t, j) => (
                <span key={j} className="text-chu-nhat text-xs bg-dem-toi rounded-lg px-2.5 py-1">{t}</span>
              ))}
            </div>
          </div>
          <span className="text-chu-mo text-xs flex-shrink-0">🎬 Sắp ra mắt</span>
        </div>
      ))}
    </div>
  );
}
