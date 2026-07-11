import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCourses } from "../services/courseService";
import { getCurrentUser } from "../services/authService";
import { enrollInCourse } from "../services/enrollmentService";
import { C } from "../styles/theme";
import { LEVELS, GOALS } from "../data/learningOptions";

const STEPS = [
  { title: "Khóa học bạn quan tâm", subtitle: "Chúng tôi sẽ chọn bài học phù hợp nhất", cta: "Tiếp theo →" },
  { title: "Tiếng Trung của bạn hiện tại?", subtitle: "Không cần lo — mọi cấp độ đều được hỗ trợ", cta: "Tiếp theo →" },
  { title: "Bạn muốn đạt được gì?", subtitle: "Mục tiêu rõ ràng giúp học nhanh hơn 3x", cta: "Bắt đầu học! 🚀" },
];

function OptionCard({ icon, label, sub, active, accent, onClick, detailHref }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "#fff", borderRadius: 20, padding: "34px 16px 30px",
        border: `2px solid ${active ? accent : C.border}`,
        boxShadow: active ? `0 4px 20px ${accent}30` : "0 1px 4px rgba(26,26,46,.05)",
        cursor: "pointer", textAlign: "center", fontFamily: "inherit", position: "relative",
        transition: "border-color .15s, box-shadow .15s, transform .15s",
        transform: active ? "translateY(-2px)" : "none",
      }}
    >
      {detailHref && (
        <span
          role="link"
          title="Xem chi tiết khóa học"
          onClick={(e) => { e.stopPropagation(); window.open(detailHref, "_blank"); }}
          style={{ position: "absolute", top: 10, right: 12, fontSize: 18, fontWeight: 800,
            width: 26, height: 26, borderRadius: "50%", background: C.bg, color: C.t3,
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            lineHeight: 1 }}
        >
          ⋯
        </span>
      )}
      <div style={{ fontSize: 44, marginBottom: 18, lineHeight: 1 }}>{icon}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: active ? accent : C.t1, lineHeight: 1.4 }}>
        {label}
      </div>
      {sub && (
        <div style={{ fontFamily: C.hanzi, fontSize: 14, color: active ? accent : C.t3, marginTop: 6 }}>
          {sub}
        </div>
      )}
    </button>
  );
}

export default function CoursesPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [step, setStep] = useState(0);
  const [courseId, setCourseId] = useState(null);
  const [level, setLevel] = useState(null);
  const [goal, setGoal] = useState(null);
  const [customGoal, setCustomGoal] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const user = getCurrentUser();

  useEffect(() => {
    getCourses()
      .then(setCourses)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const selections = [courseId, level, goal];
  const isCustomGoal = goal === "other";
  const canNext = step === 2
    ? goal != null && (!isCustomGoal || customGoal.trim().length > 0)
    : selections[step] != null;

  async function handleNext() {
    if (!canNext || submitting) return;
    if (!user) { navigate("/login"); return; }
    if (step < 2) {
      setStep((s) => s + 1);
      window.scrollTo(0, 0);
      return;
    }
    setSubmitting(true);
    try {
      const levelLabel = LEVELS.find((l) => l.id === level)?.label;
      const goalLabel = isCustomGoal ? customGoal.trim() : GOALS.find((g) => g.id === goal)?.label;
      await enrollInCourse(courseId, { startLevel: levelLabel, goal: goalLabel });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  const { title, subtitle, cta } = STEPS[step];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: C.body, color: C.t1,
      display: "flex", flexDirection: "column" }}>
      <div style={{ width: "100%", maxWidth: 560, margin: "0 auto", padding: "28px 20px 120px", flex: 1 }}>

        {/* Step indicator + back */}
        <div style={{ position: "relative", display: "flex", justifyContent: "center",
          alignItems: "center", gap: 8, marginBottom: 40 }}>
          {step > 0 && (
            <button onClick={() => setStep((s) => s - 1)} style={{
              position: "absolute", left: 0, background: "none", border: "none",
              fontSize: 22, color: C.t3, cursor: "pointer", padding: 4 }}>←</button>
          )}
          {[0, 1, 2].map((i) => (
            <span key={i} style={{
              width: i === step ? 34 : 9, height: 9, borderRadius: 99,
              background: i === step ? C.red : C.border, transition: "width .2s, background .2s" }} />
          ))}
        </div>

        {/* Heading */}
        <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: -.5, marginBottom: 10 }}>
          {title}
        </h1>
        <p style={{ fontSize: 16, color: C.t3, marginBottom: 28 }}>
          {subtitle}
        </p>

        {error && <p style={{ color: C.red, marginBottom: 16 }}>{error}</p>}

        {/* Step 1: chọn khóa học */}
        {step === 0 && (
          <>
            {loading && <p style={{ color: C.t3 }}>Đang tải khóa học...</p>}
            {!loading && !error && courses.length === 0 && (
              <p style={{ color: C.t3 }}>
                Chưa có khóa học nào được đăng. Hãy tạo khóa học đầu tiên từ trang Admin.
              </p>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {courses.map((course) => (
                <OptionCard
                  key={course.id}
                  icon={course.icon || "📚"}
                  label={course.title}
                  sub={course.name_zh}
                  active={course.id === courseId}
                  accent={course.accent_color || C.red}
                  onClick={() => setCourseId(course.id)}
                  detailHref={`/course/${course.id}/detail`}
                />
              ))}
            </div>
          </>
        )}

        {/* Step 2: trình độ hiện tại */}
        {step === 1 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {LEVELS.map((l) => (
              <OptionCard
                key={l.id}
                icon={l.icon}
                label={l.label}
                active={l.id === level}
                accent={C.red}
                onClick={() => setLevel(l.id)}
              />
            ))}
          </div>
        )}

        {/* Step 3: mục tiêu */}
        {step === 2 && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {GOALS.map((g) => (
                <OptionCard
                  key={g.id}
                  icon={g.icon}
                  label={g.label}
                  active={g.id === goal}
                  accent={C.red}
                  onClick={() => setGoal(g.id)}
                />
              ))}
            </div>
            {isCustomGoal && (
              <input
                autoFocus
                value={customGoal}
                onChange={(e) => setCustomGoal(e.target.value)}
                placeholder="Nhập mục tiêu của bạn..."
                style={{ width: "100%", marginTop: 16, padding: "14px 16px", borderRadius: 14,
                  border: `1.5px solid ${C.border}`, fontSize: 15, boxSizing: "border-box",
                  fontFamily: "inherit" }}
              />
            )}
          </>
        )}

        {user && step === 0 && (
          <p style={{ fontSize: 13, color: C.t3, textAlign: "center", marginTop: 24 }}>
            Đã có khóa học? <Link to="/dashboard" style={{ color: C.red, fontWeight: 600 }}>Về Dashboard</Link>
          </p>
        )}
      </div>

      {/* Bottom CTA */}
      <div style={{ position: "fixed", left: 0, right: 0, bottom: 0,
        background: "linear-gradient(180deg, rgba(247,247,250,0) 0%, #F7F7FA 40%)", padding: "28px 20px 20px" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <button
            onClick={handleNext}
            disabled={!canNext || submitting}
            style={{
              width: "100%", padding: "17px 24px", borderRadius: 16, border: "none",
              fontSize: 17, fontWeight: 700, fontFamily: "inherit",
              cursor: canNext && !submitting ? "pointer" : "default",
              background: canNext ? C.red : "#E9E9EF",
              color: canNext ? "#fff" : C.t3,
              transition: "background .2s, color .2s",
            }}
          >
            {submitting ? "Đang đăng ký..." : cta}
          </button>
        </div>
      </div>
    </div>
  );
}
