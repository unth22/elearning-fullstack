import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getDueCards, rateCard } from "../services/srsService";
import { C, Btn, PBar, speak } from "../styles/theme";

const RATINGS = [
  { val: 0, label: "Quên", emoji: "😵", color: C.red, next: "Ôn ngay" },
  { val: 1, label: "Khó", emoji: "😓", color: "#D97706", next: "1 ngày" },
  { val: 2, label: "Ổn", emoji: "🙂", color: C.green, next: "3 ngày" },
  { val: 3, label: "Dễ", emoji: "😎", color: C.blue, next: "1 tuần" },
];

export default function SrsReviewPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("courseId");

  const queue = useRef([]);
  const [loading, setLoading] = useState(true);
  const [sIdx, setSIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [log, setLog] = useState([]);
  const [sessionDone, setSessionDone] = useState(false);

  useEffect(() => {
    if (!courseId) { navigate("/dashboard"); return; }
    getDueCards(courseId).then((cards) => {
      queue.current = cards.slice(0, 10);
      setLoading(false);
      setSessionDone(queue.current.length === 0);
    });
  }, [courseId, navigate]);

  useEffect(() => {
    if (!loading && !sessionDone && queue.current[sIdx]) speak(queue.current[sIdx].zh);
  }, [sIdx, loading, sessionDone]);

  if (loading) {
    return <div style={{ minHeight: "100vh", background: C.bg, display: "flex",
      alignItems: "center", justifyContent: "center", fontFamily: C.body, color: C.t3 }}>Đang tải...</div>;
  }

  async function handleRate(rating) {
    const card = queue.current[sIdx];
    await rateCard(card.id, rating);
    setLog((l) => [...l, { card, rating }]);
    if (sIdx + 1 >= queue.current.length) setSessionDone(true);
    else { setSIdx((i) => i + 1); setFlipped(false); }
  }

  if (sessionDone || queue.current.length === 0) {
    const correct = log.filter((l) => l.rating >= 2).length;
    const pct = log.length ? Math.round((correct / log.length) * 100) : 100;
    return (
      <div style={{ minHeight: "100vh", background: C.bg, fontFamily: C.body,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ background: "#fff", borderRadius: 26, padding: "44px 40px",
          maxWidth: 460, width: "100%", textAlign: "center",
          border: `1px solid ${C.border}`, boxShadow: "0 12px 48px rgba(26,26,46,.1)" }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>
            {log.length === 0 ? "✅" : pct >= 80 ? "🎉" : "💪"}
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
            {log.length === 0 ? "Không có thẻ nào cần ôn!" : "Hoàn thành phiên ôn!"}
          </h2>
          {log.length > 0 && (
            <>
              <p style={{ fontSize: 14, color: C.t3, marginBottom: 24 }}>{log.length} thẻ · {pct}% ghi nhớ</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 28 }}>
                {RATINGS.map((r) => (
                  <div key={r.val} style={{ background: r.color + "12", borderRadius: 12, padding: "12px 6px" }}>
                    <div style={{ fontSize: 20 }}>{r.emoji}</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: r.color }}>
                      {log.filter((l) => l.rating === r.val).length}
                    </div>
                    <div style={{ fontSize: 10, color: C.t3 }}>{r.label}</div>
                  </div>
                ))}
              </div>
            </>
          )}
          <Btn size="lg" style={{ width: "100%" }} onClick={() => navigate("/dashboard")}>
            ← Về Dashboard
          </Btn>
        </div>
      </div>
    );
  }

  const card = queue.current[sIdx];
  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: C.body, display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${C.border}`,
        padding: "12px 24px", display: "flex", alignItems: "center", gap: 14 }}>
        <button onClick={() => navigate("/dashboard")} style={{ background: "none",
          border: "none", fontSize: 18, cursor: "pointer", color: C.t3 }}>←</button>
        <div style={{ flex: 1, maxWidth: 400 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.t3, marginBottom: 5 }}>
            <span style={{ fontWeight: 700, color: C.red }}>Ôn tập SRS</span>
            <span>{sIdx + 1}/{queue.current.length}</span>
          </div>
          <PBar value={sIdx} max={queue.current.length} h={5} />
        </div>
      </div>

      {/* Card */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div onClick={() => !flipped && setFlipped(true)} style={{
          width: "100%", maxWidth: 480, height: 380, perspective: 1200,
          cursor: flipped ? "default" : "pointer" }}>
          <div style={{ width: "100%", height: "100%", position: "relative",
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "none",
            transition: "transform .5s cubic-bezier(.4,0,.2,1)" }}>
            {/* Front */}
            <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden", background: "#fff", borderRadius: 24,
              border: `1.5px solid ${C.border}`, boxShadow: "0 8px 36px rgba(26,26,46,.08)",
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", gap: 14 }}>
              <div style={{ fontFamily: C.hanzi, fontSize: 84, color: C.ink, lineHeight: 1 }}>{card.zh}</div>
              <button onClick={(e) => { e.stopPropagation(); speak(card.zh); }}
                style={{ background: C.blueSoft, border: "none", borderRadius: 10,
                  padding: "8px 18px", color: C.blue, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                🔊 Phát âm
              </button>
              <div style={{ fontSize: 12, color: C.t3 }}>Nhấn để xem nghĩa</div>
            </div>
            {/* Back */}
            <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)",
              background: `linear-gradient(160deg, ${C.ink}, #2D1B4E)`, borderRadius: 24,
              display: "flex", flexDirection: "column", padding: "26px 32px",
              justifyContent: "center", gap: 6, overflowY: "auto" }}>
              <div style={{ fontFamily: C.hanzi, fontSize: 38, color: "#fff" }}>{card.zh}</div>
              <div style={{ fontSize: 17, color: C.gold, fontStyle: "italic" }}>{card.pinyin}</div>
              <div style={{ fontSize: 16, color: "rgba(255,255,255,.85)", fontWeight: 600 }}>{card.vi}</div>
              {card.en && (
                <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)" }}>{card.en}</div>
              )}
              {card.example_zh && (
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,.12)" }}>
                  <div style={{ fontFamily: C.hanzi, fontSize: 16, color: "rgba(255,255,255,.9)", lineHeight: 1.5 }}>
                    {card.example_zh}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)", marginTop: 4 }}>
                    {card.example_pinyin}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,.6)", marginTop: 2, fontStyle: "italic" }}>
                    {card.example_vi}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ width: "100%", maxWidth: 480, marginTop: 20 }}>
          {!flipped ? (
            <Btn variant="dark" size="lg" style={{ width: "100%" }} onClick={() => setFlipped(true)}>
              Xem đáp án
            </Btn>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
              {RATINGS.map((r) => (
                <button key={r.val} onClick={() => handleRate(r.val)} style={{
                  padding: "13px 8px", border: `2px solid ${r.color}35`,
                  borderRadius: 13, background: r.color + "10", cursor: "pointer", textAlign: "center" }}>
                  <div style={{ fontSize: 20, marginBottom: 3 }}>{r.emoji}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: r.color }}>{r.label}</div>
                  <div style={{ fontSize: 10, color: C.t3 }}>{r.next}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
