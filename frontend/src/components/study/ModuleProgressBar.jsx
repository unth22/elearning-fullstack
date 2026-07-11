export const MODULE_STEPS = [
  { id: "lecture", label: "Bài giảng", icon: "🎬" },
  { id: "quiz", label: "Trắc nghiệm đọc hiểu", icon: "✏️" },
  { id: "flashcard", label: "Flashcard", icon: "🃏" },
  { id: "phrases", label: "Cụm từ", icon: "🔤" },
  { id: "grammar", label: "Ngữ pháp", icon: "📝" },
  { id: "dialogue", label: "Câu hội thoại", icon: "💬" },
  { id: "dictation", label: "Nghe chép", icon: "🎧" },
  { id: "shadowing", label: "Shadowing", icon: "🎤" },
];

export default function ModuleProgressBar({ activeStepId, completedSteps, onSelect, accentColor }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", overflowX: "auto", padding: "14px 20px 10px",
      borderBottom: "1px solid #E5E7EB", background: "#fff" }}>
      {MODULE_STEPS.map((s, i) => {
        const active = s.id === activeStepId;
        const done = completedSteps?.has(s.id);
        return (
          <div key={s.id} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <button onClick={() => onSelect(s.id)} style={{ background: "none", border: "none",
              cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center",
              gap: 5, padding: "0 12px", minWidth: 74 }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", display: "flex",
                alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800,
                background: active ? accentColor : done ? accentColor + "22" : "#F3F4F6",
                color: active ? "#fff" : done ? accentColor : "#9CA3AF",
                border: active ? "none" : `1.5px solid ${done ? accentColor + "55" : "#E5E7EB"}` }}>
                {done && !active ? "✓" : s.icon}
              </div>
              <span style={{ fontSize: 10.5, textAlign: "center", lineHeight: 1.3, whiteSpace: "nowrap",
                color: active ? accentColor : "#6B7280", fontWeight: active ? 700 : 500 }}>
                {s.label}
              </span>
            </button>
            {i < MODULE_STEPS.length - 1 && (
              <div style={{ width: 20, height: 1.5, background: done ? accentColor + "55" : "#E5E7EB",
                marginTop: -14, flexShrink: 0 }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
