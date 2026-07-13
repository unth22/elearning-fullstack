import Highlightable from "./Highlightable";

// Bài giảng dạng nội dung phong phú (bảng biểu, danh sách, các bước) — dùng
// cho những module tham khảo/nền tảng (vd. ngữ âm, cài đặt gõ) không phù hợp
// với khung "chip chủ đề" đơn giản mặc định bên dưới.
function Section({ s, accentColor, dark, notes, onSaveNote, onUpdateNote }) {
  const textColor = dark ? "#EDEDF2" : "#111827";
  const subColor = dark ? "#9A9AB0" : "#4B5563";
  const borderColor = dark ? "#2A2C3D" : "#E5E7EB";
  const cellBg = dark ? "#181A26" : "#F9FAFB";

  return (
    <div className="mb-7">
      {s.heading && (
        <h3 className="text-base font-bold mb-2" style={{ color: textColor }}>{s.heading}</h3>
      )}
      {s.note && <p className="text-sm mb-3" style={{ color: subColor }}>{s.note}</p>}

      {s.type === "text" && onSaveNote ? (
        <Highlightable text={s.body} notes={notes} onSave={onSaveNote} onUpdate={onUpdateNote}
          className="text-sm leading-relaxed whitespace-pre-line block" style={{ color: subColor }} />
      ) : s.type === "text" ? (
        <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: subColor }}>{s.body}</p>
      ) : null}

      {s.type === "list" && (
        <ul className="flex flex-col gap-1.5">
          {s.items.map((it, i) => (
            <li key={i} className="text-sm leading-relaxed flex gap-2" style={{ color: subColor }}>
              <span style={{ color: accentColor }}>✦</span>{it}
            </li>
          ))}
        </ul>
      )}

      {s.type === "steps" && (
        <ol className="flex flex-col gap-2.5">
          {s.items.map((it, i) => (
            <li key={i} className="text-sm leading-relaxed flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: accentColor + "22", color: accentColor }}>{i + 1}</span>
              <span style={{ color: subColor }}>{it}</span>
            </li>
          ))}
        </ol>
      )}

      {s.type === "table" && (
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor }}>
          <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {s.columns.map((c, i) => (
                  <th key={i} className="text-left px-3 py-2 font-bold" style={{ color: accentColor, background: cellBg, borderBottom: `1px solid ${borderColor}` }}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {s.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-3 py-2" style={{ color: textColor, borderBottom: ri < s.rows.length - 1 ? `1px solid ${borderColor}` : "none" }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

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

  if (m.sections?.length) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-[11px] font-bold tracking-widest uppercase" style={{ color: accentColor }}>{m.title}</div>
          <div className="h-px flex-1" style={{ background: dark ? "#2A2C3D" : "#E5E7EB" }} />
        </div>
        <h2 className="text-xl font-bold mb-6" style={{ color: dark ? "#EDEDF2" : "#111827" }}>{m.subtitle}</h2>
        {m.sections.map((s, i) => (
          <Section key={i} s={s} accentColor={accentColor} dark={dark} notes={notes} onSaveNote={onSaveNote} onUpdateNote={onUpdateNote} />
        ))}
        <p className="text-xs" style={{ color: dark ? "#6E6E85" : "#9CA3AF" }}>
          💡 Mẹo: bôi đen chữ trong phần giải thích để tô màu highlight hoặc lưu vào ghi chú (icon 📝 góc dưới bên phải).
        </p>
      </div>
    );
  }

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
