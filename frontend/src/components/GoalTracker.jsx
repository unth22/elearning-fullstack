import { useState } from "react";
import { C, Btn } from "../styles/theme";
import { setEnrollmentGoal } from "../services/enrollmentService";

const PRESETS = [30, 60, 90];

// Các mốc trưởng thành của cây, tưới nước mỗi ngày học sẽ giúp cây lớn dần —
// hình ảnh hóa % hoàn thành khóa học thay vì chỉ hiện con số khô khan.
const PLANT_STAGES = [
  { max: 19, icon: "🌱", label: "Mới gieo mầm" },
  { max: 39, icon: "🌿", label: "Chồi non đang lớn" },
  { max: 59, icon: "🪴", label: "Cây con cứng cáp" },
  { max: 84, icon: "🌳", label: "Cây trưởng thành" },
  { max: 100, icon: "🌸", label: "Đơm hoa kết trái" },
];

function plantStage(percent) {
  return PLANT_STAGES.find((s) => percent <= s.max) || PLANT_STAGES[PLANT_STAGES.length - 1];
}

function StreakBadge({ streak }) {
  if (streak === undefined || streak === null) return null;
  return (
    <div style={{ textAlign: "right", flexShrink: 0 }}>
      <div style={{ fontSize: 15, fontWeight: 800, color: C.gold }}>🔥 {streak}</div>
      <div style={{ fontSize: 9.5, color: C.t3 }}>ngày streak</div>
    </div>
  );
}

export default function GoalTracker({ enrollment, progressPercent, wateredToday, streak, onGoalSet }) {
  const [customDays, setCustomDays] = useState("");
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const accent = enrollment.accent_color || C.red;

  async function saveGoal(days) {
    if (!days || days < 1) return;
    setSaving(true);
    try {
      const updated = await setEnrollmentGoal(enrollment.course_id, days);
      onGoalSet(updated);
      setEditing(false);
    } catch (err) {
      console.error("Lỗi đặt mục tiêu:", err.message);
    } finally {
      setSaving(false);
    }
  }

  if (!enrollment.target_days || editing) {
    return (
      <div style={{ background: "#fff", borderRadius: 18, padding: 20, border: `1.5px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>🎯 Đặt mục tiêu học tập</div>
          <StreakBadge streak={streak} />
        </div>
        <p style={{ fontSize: 12.5, color: C.t3, lineHeight: 1.6, marginBottom: 14 }}>
          Chọn thời gian bạn muốn hoàn thành khóa này để theo dõi tiến độ thực tế.
        </p>
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          {PRESETS.map((d) => (
            <button key={d} disabled={saving} onClick={() => saveGoal(d)} style={{
              flex: 1, padding: "8px 0", borderRadius: 10, border: `1.5px solid ${C.border}`,
              background: "#fff", color: C.t1, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              {d} ngày
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="number" min="1" value={customDays}
            onChange={(e) => setCustomDays(e.target.value)}
            placeholder="Số ngày khác..."
            style={{ flex: 1, padding: "8px 10px", borderRadius: 10, border: `1.5px solid ${C.border}`,
              fontSize: 13, fontFamily: "inherit", boxSizing: "border-box" }}
          />
          <button disabled={saving || !customDays} onClick={() => saveGoal(Number(customDays))} style={{
            padding: "8px 16px", borderRadius: 10, border: "none", background: accent,
            color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            Xác nhận
          </button>
        </div>
        {enrollment.target_days && (
          <button onClick={() => setEditing(false)} style={{ marginTop: 10, background: "none", border: "none",
            color: C.t3, fontSize: 12, cursor: "pointer", padding: 0 }}>
            ← Hủy, giữ mục tiêu cũ
          </button>
        )}
      </div>
    );
  }

  const daysElapsed = Math.floor((Date.now() - new Date(enrollment.goal_set_at).getTime()) / 86400000);
  const daysRemaining = enrollment.target_days - daysElapsed;
  const expectedPercent = Math.min(100, Math.round((daysElapsed / enrollment.target_days) * 100));
  const stage = plantStage(progressPercent);
  const onTrack = progressPercent >= expectedPercent - 10;

  return (
    <div style={{ background: "#fff", borderRadius: 18, padding: 20, border: `1.5px solid ${C.border}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
            🎯 Mục tiêu học tập
            <button onClick={() => setEditing(true)} title="Đặt lại thời gian mục tiêu" style={{
              background: "none", border: "none", cursor: "pointer", fontSize: 13, color: C.t3, padding: 0 }}>
              ✏️
            </button>
          </div>
          <div style={{ fontSize: 12, color: C.t3 }}>Hoàn thành trong {enrollment.target_days} ngày</div>
        </div>
        <StreakBadge streak={streak} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14, background: C.bg, borderRadius: 14,
        padding: "14px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 40, lineHeight: 1 }}>{stage.icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.t1 }}>{stage.label}</div>
          <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>
            {wateredToday ? "Đã tưới nước hôm nay" : "Học hôm nay để tưới nước cho cây!"}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.t3, marginBottom: 4 }}>
          <span>Tiến độ thực tế</span>
          <span style={{ fontWeight: 700, color: accent }}>{progressPercent}%</span>
        </div>
        <div style={{ background: C.border, borderRadius: 99, height: 8, overflow: "hidden", position: "relative" }}>
          <div style={{ height: "100%", width: `${progressPercent}%`, background: accent, borderRadius: 99 }} />
          <div title={`Kỳ vọng theo lịch: ${expectedPercent}%`} style={{ position: "absolute", top: -2, left: `${expectedPercent}%`,
            width: 2, height: 12, background: C.t1, opacity: .5 }} />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 11, color: onTrack ? C.green : C.red, fontWeight: 600 }}>
          {onTrack ? "Đang đúng tiến độ" : "Đang chậm hơn kế hoạch — cố lên nhé!"}
        </div>
        <div style={{ fontSize: 10.5, color: daysRemaining >= 0 ? C.t3 : C.red }}>
          {daysRemaining >= 0 ? `${daysRemaining} ngày còn lại` : `+${-daysRemaining} ngày quá hạn`}
        </div>
      </div>
    </div>
  );
}
