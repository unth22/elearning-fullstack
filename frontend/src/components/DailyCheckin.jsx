import { useState } from "react";
import { C } from "../styles/theme";
import { postCheckin } from "../services/checkinService";

// Compact — chỉ hiện điểm tích lũy + trạng thái điểm danh hôm nay. Điểm danh
// giờ chủ yếu tự động khi học sinh học bất kỳ bước nào (xem moduleProgressController),
// nút bấm ở đây chỉ để những ngày học sinh ghé qua mà chưa học gì.
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
    <button
      onClick={handleCheckin}
      disabled={summary.checkedInToday || loading}
      title={summary.checkedInToday ? "Đã điểm danh hôm nay" : "Điểm danh ngay (+10 điểm)"}
      style={{
        background: summary.checkedInToday ? C.greenSoft : C.goldSoft,
        borderRadius: 14, padding: "12px 16px", textAlign: "center", border: "none",
        cursor: summary.checkedInToday || loading ? "default" : "pointer",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 1,
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 800, color: summary.checkedInToday ? C.green : C.gold }}>
        ⭐ {summary.totalPoints}
      </div>
      <div style={{ fontSize: 10, color: C.t3, whiteSpace: "nowrap" }}>
        {summary.checkedInToday ? "✓ đã điểm danh" : "điểm • bấm để danh"}
      </div>
    </button>
  );
}
