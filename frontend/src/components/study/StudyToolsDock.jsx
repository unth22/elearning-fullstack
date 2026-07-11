export default function StudyToolsDock({ onOpenDictionary, onOpenNotes, notesCount, accentColor }) {
  return (
    <div style={{ position: "fixed", right: 18, bottom: 24, zIndex: 150,
      display: "flex", flexDirection: "column", gap: 10 }}>
      <button onClick={onOpenDictionary} title="Từ điển"
        style={{ width: 48, height: 48, borderRadius: "50%", background: "#fff",
          border: "1px solid #E5E7EB", boxShadow: "0 4px 14px rgba(0,0,0,.12)",
          cursor: "pointer", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
        📖
      </button>
      <button onClick={onOpenNotes} title="Ghi chú của tôi"
        style={{ width: 48, height: 48, borderRadius: "50%", background: "#fff",
          border: "1px solid #E5E7EB", boxShadow: "0 4px 14px rgba(0,0,0,.12)",
          cursor: "pointer", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative" }}>
        📝
        {notesCount > 0 && (
          <span style={{ position: "absolute", top: -4, right: -4, background: accentColor, color: "#fff",
            fontSize: 10, fontWeight: 800, borderRadius: 99, minWidth: 18, height: 18, padding: "0 4px",
            display: "flex", alignItems: "center", justifyContent: "center" }}>
            {notesCount}
          </span>
        )}
      </button>
    </div>
  );
}
