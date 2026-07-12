import { useState } from "react";
import { C } from "../styles/theme";
import { postCheckin } from "../services/checkinService";

export default function DailyCheckin({ summary, onChecked }) {
  const [loading, setLoading] = useState(false);
  if (!summary) return null;

  async function handleCheckin() {
    if (summary.checkedInToday || loading) return;
    setLoading(true);
    try {
      const updated = await postCheckin();
      onChecked(updated);
    } catch (err) {
      console.error("Lỗi điểm danh:", err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ background: "#fff", borderRadius: 18, padding: 20, border: `1.5px solid ${C.border}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700 }}>📅 Điểm danh hôm nay</div>
          <div style={{ fontSize: 12, color: C.t3 }}>Điểm danh mỗi ngày để tích điểm</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.gold }}>⭐ {summary.totalPoints}</div>
          <div style={{ fontSize: 10.5, color: C.t3 }}>điểm tích lũy</div>
        </div>
      </div>

      <button
        onClick={handleCheckin}
        disabled={summary.checkedInToday || loading}
        style={{
          width: "100%", padding: "10px 0", borderRadius: 12, border: "none",
          background: summary.checkedInToday ? C.greenSoft : C.gold,
          color: summary.checkedInToday ? C.green : "#fff",
          fontSize: 14, fontWeight: 700,
          cursor: summary.checkedInToday || loading ? "default" : "pointer",
        }}
      >
        {summary.checkedInToday ? "✓ Đã điểm danh hôm nay" : loading ? "Đang điểm danh..." : "Điểm danh ngay (+10 điểm)"}
      </button>

      {summary.streak > 0 && (
        <div style={{ fontSize: 11.5, color: C.t3, marginTop: 10, textAlign: "center" }}>
          🔥 Chuỗi điểm danh: <b style={{ color: C.t2 }}>{summary.streak} ngày liên tiếp</b>
        </div>
      )}
    </div>
  );
}
