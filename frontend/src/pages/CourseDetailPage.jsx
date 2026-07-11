import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getCourseById } from "../services/courseService";
import { getCurrentUser } from "../services/authService";
import { C, Pill, Btn } from "../styles/theme";
import TrialModal from "../components/study/TrialModal";

function trialModalSeenKey(courseId) {
  return `trialModalSeen_${courseId}`;
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h2 style={{ fontFamily: C.serif, fontSize: 22, fontWeight: 800, color: C.t1, marginBottom: 16 }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function StatItem({ value, label }) {
  return (
    <div>
      <div style={{ fontSize: 15, fontWeight: 800, color: C.t1, textDecoration: "underline",
        textDecorationColor: C.border, textUnderlineOffset: 4 }}>{value}</div>
      <div style={{ fontSize: 12.5, color: C.t3, marginTop: 3, lineHeight: 1.5 }}>{label}</div>
    </div>
  );
}

export default function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showTrialModal, setShowTrialModal] = useState(false);

  useEffect(() => {
    getCourseById(id)
      .then(setCourse)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div style={{ minHeight: "100vh", background: C.bg, display: "flex",
      alignItems: "center", justifyContent: "center", fontFamily: C.body, color: C.t3 }}>Đang tải...</div>;
  }
  if (error || !course) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 16, fontFamily: C.body, color: C.t3 }}>
        <p>{error || "Không tìm thấy khóa học."}</p>
        <Link to="/courses" style={{ color: C.red }}>← Quay lại</Link>
      </div>
    );
  }

  const info = course.intro_content;
  const accent = course.accent_color || C.red;
  const moduleCount = info?.modules?.length || 0;
  const ctaLabel = user ? "Vào học ngay →" : "Học thử miễn phí →";

  function handleEnterClass() {
    if (!user) { navigate("/courses"); return; }
    if (localStorage.getItem(trialModalSeenKey(course.id))) {
      navigate(`/course/${course.id}`);
      return;
    }
    setShowTrialModal(true);
  }

  function confirmStartTrial() {
    localStorage.setItem(trialModalSeenKey(course.id), "1");
    setShowTrialModal(false);
    navigate(`/course/${course.id}`);
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: C.body, color: C.t1 }}>
      {/* Header kiểu Coursera: eyebrow + tiêu đề lớn + giảng viên + CTA, sau đó
          1 thẻ thống kê (module/trình độ/hình thức/lịch học) đè nhẹ lên đáy header. */}
      <div style={{ background: `linear-gradient(150deg, ${C.ink}, #2D1B4E)`, padding: "48px 24px 64px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <button onClick={() => navigate(-1)} style={{ background: "none", border: "none",
            color: "rgba(255,255,255,.6)", fontSize: 14, cursor: "pointer", marginBottom: 18, padding: 0 }}>
            ← Quay lại
          </button>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase",
            color: C.gold, marginBottom: 14 }}>
            {course.icon} {course.industry || "Chuyên ngành"} {course.level ? `· ${course.level}` : ""}
          </div>
          <h1 style={{ fontFamily: C.serif, fontSize: 34, fontWeight: 800, color: "#fff", marginBottom: 8 }}>
            {course.title}
          </h1>
          {course.name_zh && (
            <div style={{ fontFamily: C.hanzi, fontSize: 16, color: "rgba(255,255,255,.5)", marginBottom: 16 }}>{course.name_zh}</div>
          )}
          <p style={{ fontSize: 15, color: "rgba(255,255,255,.65)", marginBottom: 22 }}>
            Thuộc chương trình <b style={{ color: "#fff" }}>Business Chinese Pro</b>
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 26 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: accent + "33",
              color: accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
              🎓
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)" }}>
              Giảng viên: <span style={{ color: "#fff", fontWeight: 600 }}>Đội ngũ Business Chinese Pro</span>
            </div>
          </div>
          <Btn size="lg" onClick={handleEnterClass}>
            {ctaLabel}
          </Btn>
        </div>
      </div>

      {/* Thẻ thống kê — đè nhẹ lên đáy header, giống bố cục Coursera */}
      <div style={{ maxWidth: 780, margin: "-34px auto 0", padding: "0 24px", position: "relative" }}>
        <div style={{ background: "#fff", borderRadius: 18, border: `1px solid ${C.border}`,
          boxShadow: "0 10px 34px rgba(26,26,46,.1)", padding: "22px 26px",
          display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 22 }}>
          <StatItem value={moduleCount > 0 ? `${moduleCount} module` : "Đang cập nhật"} label="Nội dung học, hiểu nền tảng và thực hành" />
          <StatItem value={course.level || "Mọi trình độ"} label="Không yêu cầu kinh nghiệm trước" />
          <StatItem value="Tự học theo giáo trình" label="Video, flashcard, luyện tập tương tác" />
          <StatItem value="Lịch học linh hoạt" label="Học theo tiến độ riêng của bạn" />
        </div>
      </div>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "36px 24px 80px" }}>
        {!info ? (
          <div style={{ background: "#fff", borderRadius: 18, border: `1px solid ${C.border}`,
            padding: "40px 24px", textAlign: "center", color: C.t3 }}>
            📝 Nội dung giới thiệu khóa học đang được cập nhật.
          </div>
        ) : (
          <>
            {info.description && (
              <Section title="Mô tả khóa học">
                {info.description.intro && (
                  <p style={{ fontSize: 17, fontWeight: 700, color: accent, marginBottom: 16, lineHeight: 1.6 }}>
                    {info.description.intro}
                  </p>
                )}
                {(info.description.paragraphs || []).map((p, i) => (
                  <p key={i} style={{ fontSize: 15, color: C.t2, lineHeight: 1.8, marginBottom: 14 }}>{p}</p>
                ))}
              </Section>
            )}

            {info.audience && (
              <Section title="Khóa học phù hợp với">
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {info.audience.map((a, i) => (
                    <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "16px 18px",
                      border: `1px solid ${C.border}` }}>
                      <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{a.title}</div>
                      <div style={{ fontSize: 14, color: C.t3, lineHeight: 1.6 }}>{a.desc}</div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {info.outcomes && (
              <Section title="Sau khóa học bạn sẽ làm được">
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {info.outcomes.map((o, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span style={{ color: C.green, fontWeight: 800, flexShrink: 0 }}>✔</span>
                      <span style={{ fontSize: 15, color: C.t2, lineHeight: 1.6 }}>{o}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {info.modules && (
              <Section title="Bạn sẽ học những gì?">
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {info.modules.map((m, i) => (
                    <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "16px 18px",
                      border: `1px solid ${C.border}`, display: "flex", gap: 14, alignItems: "flex-start" }}>
                      <div style={{ width: 30, height: 30, borderRadius: 8, background: accent + "18",
                        color: accent, display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
                        {i + 1}
                      </div>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: accent, letterSpacing: 1,
                          textTransform: "uppercase", marginBottom: 3 }}>{m.title}</div>
                        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{m.subtitle}</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {(m.topics || []).map((t, j) => (
                            <span key={j} style={{ fontSize: 12, color: C.t3, background: C.bg,
                              borderRadius: 8, padding: "3px 10px" }}>{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {info.methodology && (
              <Section title="Phương pháp học">
                {info.methodology.intro && (
                  <p style={{ fontSize: 15, color: C.t2, lineHeight: 1.8, marginBottom: 16 }}>{info.methodology.intro}</p>
                )}
                {info.methodology.lesson_includes && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                    {info.methodology.lesson_includes.map((f, i) => (
                      <Pill key={i} color={accent}>{f}</Pill>
                    ))}
                  </div>
                )}
                {info.methodology.highlight && (
                  <div style={{ background: C.goldSoft, borderRadius: 14, padding: "16px 18px",
                    fontSize: 14, color: C.t2, lineHeight: 1.7, marginBottom: 20 }}>
                    💡 {info.methodology.highlight}
                  </div>
                )}
                {info.methodology.lms_name && (
                  <div style={{ background: `linear-gradient(150deg, ${C.ink}, #2D1B4E)`, borderRadius: 16, padding: 22 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.gold, marginBottom: 12 }}>
                      {info.methodology.lms_name}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {(info.methodology.lms_features || []).map((f, i) => (
                        <span key={i} style={{ fontSize: 12.5, color: "rgba(255,255,255,.8)",
                          background: "rgba(255,255,255,.08)", borderRadius: 8, padding: "5px 12px" }}>{f}</span>
                      ))}
                    </div>
                  </div>
                )}
              </Section>
            )}

            {info.output && (
              <Section title="Đầu ra khóa học">
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {info.output.map((o, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span style={{ color: accent, fontWeight: 800, flexShrink: 0 }}>•</span>
                      <span style={{ fontSize: 15, color: C.t2, lineHeight: 1.6 }}>{o}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {info.materials && (
              <Section title="Giáo trình & tài liệu">
                {info.materials.intro && (
                  <p style={{ fontSize: 15, color: C.t2, lineHeight: 1.8, marginBottom: 16 }}>{info.materials.intro}</p>
                )}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {(info.materials.items || []).map((it, i) => (
                    <span key={i} style={{ fontSize: 13, color: C.t2, background: "#fff",
                      border: `1px solid ${C.border}`, borderRadius: 10, padding: "7px 14px" }}>{it}</span>
                  ))}
                </div>
              </Section>
            )}
          </>
        )}

        <Btn size="lg" style={{ width: "100%" }}
          onClick={handleEnterClass}>
          {user ? "Vào học ngay →" : "Đăng ký khóa học →"}
        </Btn>
      </div>

      {showTrialModal && (
        <TrialModal
          courseTitle={course.title}
          onClose={() => setShowTrialModal(false)}
          onStart={confirmStartTrial}
        />
      )}
    </div>
  );
}
