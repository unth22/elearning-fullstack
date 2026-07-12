import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getCurrentUser, logout } from "../services/authService";
import { getMyEnrollments } from "../services/enrollmentService";
import { getMyProgress, setLessonProgress } from "../services/progressService";
import { getSrsStats } from "../services/srsService";
import { getMyActivity } from "../services/activityService";
import { getCourseById } from "../services/courseService";
import { getModuleProgress } from "../services/moduleProgressService";
import { MODULE_STEPS } from "../components/study/ModuleProgressBar";
import { C, Pill, Btn, PBar } from "../styles/theme";
import QuickLookup from "../components/QuickLookup";
import GoalTracker from "../components/GoalTracker";

function greeting() {
  const h = new Date().getHours();
  if (h < 11) return "Chào buổi sáng ☀️";
  if (h < 18) return "Chào buổi chiều 🌤️";
  return "Chào buổi tối 🌙";
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [enrollments, setEnrollments] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [progress, setProgress] = useState([]);
  const [srsStats, setSrsStats] = useState({ due: 0, learned: 0 });
  const [activity, setActivity] = useState({ streak: 0, week: [] });
  const [courseDetail, setCourseDetail] = useState(null);
  const [moduleProgressRows, setModuleProgressRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseLoading, setCourseLoading] = useState(false);
  const [error, setError] = useState("");
  const sidebarRef = useRef(null);
  const [roadmapMaxHeight, setRoadmapMaxHeight] = useState(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getMyEnrollments(), getMyActivity()])
      .then(([enrs, act]) => {
        if (cancelled) return;
        if (!enrs.length) { navigate("/courses"); return; }
        setEnrollments(enrs);
        setSelectedCourseId(enrs[0].course_id);
        setActivity(act);
      })
      .catch((err) => setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [navigate]);

  useEffect(() => {
    if (!selectedCourseId) return;
    let cancelled = false;
    setCourseLoading(true);
    Promise.all([
      getMyProgress(selectedCourseId), getSrsStats(selectedCourseId),
      getCourseById(selectedCourseId), getModuleProgress(selectedCourseId).catch(() => []),
    ])
      .then(([p, s, c, mp]) => {
        if (cancelled) return;
        setProgress(p);
        setSrsStats(s);
        setCourseDetail(c);
        setModuleProgressRows(mp);
      })
      .catch((err) => setError(err.message))
      .finally(() => !cancelled && setCourseLoading(false));
    return () => { cancelled = true; };
  }, [selectedCourseId]);

  // Đo chiều cao cột sidebar (SRS, mục tiêu, tra cứu, gợi ý lịch học) để lộ trình
  // bên trái dừng cuộn ở đúng chiều cao đó thay vì kéo dài vô hạn theo số module.
  useEffect(() => {
    function measure() {
      if (sidebarRef.current) setRoadmapMaxHeight(sidebarRef.current.offsetHeight);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [courseDetail, moduleProgressRows, srsStats, enrollments, selectedCourseId]);

  async function toggleLesson(lessonId, current) {
    await setLessonProgress(lessonId, !current);
    const [p, a] = await Promise.all([getMyProgress(selectedCourseId), getMyActivity()]);
    setProgress(p);
    setActivity(a);
  }

  if (loading) {
    return <div style={{ minHeight: "100vh", background: C.bg, display: "flex",
      alignItems: "center", justifyContent: "center", fontFamily: C.body, color: C.t3 }}>Đang tải...</div>;
  }
  const enrollment = enrollments.find((e) => e.course_id === selectedCourseId) || enrollments[0];
  if (error || !enrollment) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 16, fontFamily: C.body, color: C.t3 }}>
        <p>{error || "Không tìm thấy khóa học đã đăng ký."}</p>
        <Link to="/courses" style={{ color: C.red }}>← Chọn khóa học</Link>
      </div>
    );
  }

  const modules = courseDetail?.intro_content?.modules || [];
  const hasModules = modules.length > 0;

  // Gộp danh sách bước đã hoàn thành theo từng module thành Set để tra cứu nhanh.
  const moduleStepsDone = {};
  for (const row of moduleProgressRows) {
    const set = moduleStepsDone[row.module_index] || new Set();
    set.add(row.step_id);
    moduleStepsDone[row.module_index] = set;
  }
  function stepsDoneCount(i) { return moduleStepsDone[i]?.size || 0; }
  function moduleStatus(i) {
    const done = stepsDoneCount(i);
    if (done >= MODULE_STEPS.length) return "done";
    if (done > 0) return "in-progress";
    return "not-started";
  }
  function nextStep(i) {
    const done = moduleStepsDone[i] || new Set();
    return MODULE_STEPS.find((s) => !done.has(s.id)) || MODULE_STEPS[0];
  }

  const doneModuleCount = modules.filter((_, i) => moduleStatus(i) === "done").length;
  const currentModuleIdx = hasModules ? modules.findIndex((_, i) => moduleStatus(i) !== "done") : -1;
  const moduleProgressPercent = hasModules ? Math.round((doneModuleCount / modules.length) * 100) : 0;

  const totalLessons = progress.length;
  const completedCount = progress.filter((p) => p.is_completed).length;
  const continueLesson = progress.find((p) => !p.is_completed) || null;

  const overallProgressPercent = hasModules
    ? moduleProgressPercent
    : (totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0);

  const heroTitle = hasModules
    ? (currentModuleIdx >= 0 ? modules[currentModuleIdx].subtitle : "Xem lại nội dung khóa học")
    : (continueLesson ? continueLesson.title : "Xem lại nội dung khóa học");
  const heroDone = hasModules ? doneModuleCount === modules.length : (totalLessons > 0 && completedCount === totalLessons);
  const heroLink = hasModules && currentModuleIdx >= 0
    ? `/course/${enrollment.course_id}?module=${currentModuleIdx}&mode=${nextStep(currentModuleIdx).id}`
    : `/course/${enrollment.course_id}`;

  const tip = srsStats.due > 0
    ? `Bạn có ${srsStats.due} thẻ từ vựng cần ôn hôm nay — ôn ngay để không quên nhé!`
    : hasModules && currentModuleIdx >= 0
      ? `Hôm nay hãy tiếp tục "${modules[currentModuleIdx].subtitle}" — bước tiếp theo: ${nextStep(currentModuleIdx).icon} ${nextStep(currentModuleIdx).label}.`
      : !hasModules && continueLesson
        ? `Bạn còn ${totalLessons - completedCount} bài chưa hoàn thành trong khóa "${enrollment.title}" — tiếp tục học nhé!`
        : `Bạn đã hoàn thành hết nội dung khóa học này! Hãy khám phá khóa học khác.`;

  const todayIdx = (new Date().getDay() + 6) % 7; // T2=0 ... CN=6
  const wateredToday = !!activity.week?.[todayIdx]?.active;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: C.body }}>
      {/* Nav */}
      <div style={{ background: C.ink, padding: "0 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", height: 60,
          display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontFamily: C.hanzi, fontSize: 24, color: C.gold }}>商</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", lineHeight: 1.1 }}>
              Tiếng Trung Thương Mại
            </div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,.5)", letterSpacing: .8 }}>
              BUSINESS CHINESE & HSK6 WITH AI
            </div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 16, alignItems: "center" }}>
            <Link to="/" style={{ color: "rgba(255,255,255,.6)", fontSize: 13, textDecoration: "none" }}>
              ← Trang chủ
            </Link>
            <button onClick={() => { logout(); navigate("/"); }} style={{ background: "none",
              border: "none", color: "rgba(255,255,255,.6)", fontSize: 13, cursor: "pointer" }}>
              Đăng xuất
            </button>
            <Link to="/profile" style={{ width: 36, height: 36, borderRadius: 18, background: C.red,
              color: "#fff", display: "flex", alignItems: "center",
              justifyContent: "center", fontWeight: 700, fontSize: 14, textDecoration: "none",
              overflow: "hidden", flexShrink: 0 }}>
              {user?.avatarUrl
                ? <img src={user.avatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : (user?.fullName || "?")[0].toUpperCase()}
            </Link>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>
        {/* Greeting + stats */}
        <div style={{ display: "flex", justifyContent: "space-between",
          alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 14 }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ fontSize: 13, color: C.t3 }}>{greeting()}</div>
            <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 14 }}>{user?.fullName}</div>

            {/* Khóa học của tôi — để cạnh mục tiêu học tập cho đầy phần đầu trang */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.t3, letterSpacing: .6 }}>
                KHÓA HỌC CỦA TÔI
              </div>
              <Link to="/courses" style={{
                padding: "6px 14px", borderRadius: 20, textDecoration: "none",
                border: `1.5px dashed ${C.border}`, color: C.t3, fontSize: 12.5, fontWeight: 600 }}>
                + Đăng ký khóa học khác
              </Link>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {enrollments.map((e) => {
                const active = e.course_id === selectedCourseId;
                const accent = e.accent_color || C.red;
                return (
                  <button key={e.course_id} onClick={() => setSelectedCourseId(e.course_id)} style={{
                    display: "flex", alignItems: "center", gap: 10, minWidth: 160,
                    padding: "12px 16px", borderRadius: 16, cursor: "pointer", textAlign: "left",
                    border: `1.5px solid ${active ? accent : C.border}`,
                    background: active ? accent + "0F" : "#fff",
                    boxShadow: active ? `0 4px 14px ${accent}22` : "none" }}>
                    <span style={{ fontSize: 22, flexShrink: 0 }}>{e.icon}</span>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: active ? accent : C.t1, lineHeight: 1.3 }}>{e.title}</div>
                      {e.name_zh && <div style={{ fontFamily: C.hanzi, fontSize: 11, color: C.t3, marginTop: 2 }}>{e.name_zh}</div>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ background: C.greenSoft, borderRadius: 14, padding: "12px 18px", textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: C.green }}>{srsStats.learned}</div>
                <div style={{ fontSize: 11, color: C.t3 }}>từ đã học</div>
              </div>
              {/* Mục tiêu học tập — streak hiện ở góc phải trên của thẻ này */}
              <div style={{ width: 260 }}>
                <GoalTracker
                  enrollment={enrollment}
                  progressPercent={overallProgressPercent}
                  wateredToday={wateredToday}
                  streak={activity.streak}
                  onGoalSet={(updated) => setEnrollments((prev) => prev.map((e) =>
                    e.course_id === updated.course_id ? { ...e, ...updated } : e))}
                />
              </div>
            </div>
            {/* Điểm danh tuần — nhỏ gọn, không nêu bật */}
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 10, justifyContent: "flex-end" }}>
              {(activity.week.length ? activity.week : Array(7).fill({ active: false })).map((d, i) => (
                <span key={d.date || i} title={["T2", "T3", "T4", "T5", "T6", "T7", "CN"][i]} style={{
                  width: 14, height: 14, borderRadius: 4, background: d.active ? C.red : C.border,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontSize: 8, color: "#fff", flexShrink: 0 }}>
                  {d.active ? "✓" : ""}
                </span>
              ))}
              <span style={{ fontSize: 10, color: C.t3, marginLeft: 3 }}>tuần này</span>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start",
          opacity: courseLoading ? 0.5 : 1, transition: "opacity .15s", pointerEvents: courseLoading ? "none" : "auto" }}>
          {/* Main column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Continue learning */}
            <div onClick={() => navigate(heroLink)} style={{
              background: C.ink, borderRadius: 20, padding: 24, cursor: "pointer",
              position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", right: -14, top: -14, fontSize: 90, opacity: .07 }}>
                {enrollment.icon}
              </div>
              <Pill color={C.gold} style={{ marginBottom: 10 }}>
                {heroDone ? "ĐÃ HOÀN THÀNH" : "TIẾP TỤC HỌC"}
              </Pill>
              <div style={{ fontSize: 19, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
                {heroTitle}
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)", marginBottom: 14,
                display: "flex", alignItems: "center", gap: 8 }}>
                {enrollment.title}
                <Link to={`/course/${enrollment.course_id}/detail`} onClick={(e) => e.stopPropagation()}
                  title="Xem chi tiết khóa học"
                  style={{ color: "rgba(255,255,255,.7)", textDecoration: "none", fontWeight: 800,
                    fontSize: 15, width: 22, height: 22, borderRadius: "50%",
                    background: "rgba(255,255,255,.12)", display: "flex", alignItems: "center",
                    justifyContent: "center", lineHeight: 1 }}>
                  ⋯
                </Link>
              </div>
              <PBar value={hasModules ? doneModuleCount : completedCount} max={hasModules ? (modules.length || 1) : (totalLessons || 1)} color={C.red} h={6} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,.4)" }}>
                  {hasModules ? `${doneModuleCount}/${modules.length} module hoàn thành` : `${completedCount}/${totalLessons} bài hoàn thành`}
                </span>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.gold }}>Học tiếp →</span>
              </div>
            </div>

            {/* Lộ trình — theo module nếu khóa có, ngược lại theo bài học cũ */}
            <div style={{ background: "#fff", borderRadius: 18, border: `1px solid ${C.border}`, overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`,
                fontSize: 13, fontWeight: 700, color: C.t3, letterSpacing: .6 }}>
                LỘ TRÌNH CỦA BẠN
              </div>

              <div style={{ maxHeight: roadmapMaxHeight || undefined, overflowY: roadmapMaxHeight ? "auto" : "visible" }}>
              {hasModules ? modules.map((m, i) => {
                const status = moduleStatus(i);
                const done = stepsDoneCount(i);
                return (
                  <Link key={i} to={`/course/${enrollment.course_id}?module=${i}&mode=${nextStep(i).id}`}
                    style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                    <div style={{ padding: "14px 20px",
                      borderBottom: i < modules.length - 1 ? `1px solid ${C.border}` : "none",
                      display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                        background: status === "done" ? C.green : status === "in-progress" ? C.goldSoft : C.bg,
                        color: status === "done" ? "#fff" : status === "in-progress" ? C.gold : C.t3,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: 800, fontSize: 13 }}>
                        {status === "done" ? "✓" : i + 1}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>{m.subtitle}</div>
                        {status === "in-progress" ? (
                          <>
                            <div style={{ fontSize: 11.5, color: C.t3, marginTop: 2, marginBottom: 5 }}>
                              Tiếp tục: {nextStep(i).icon} {nextStep(i).label}
                            </div>
                            <PBar value={done} max={MODULE_STEPS.length} color={enrollment.accent_color || C.red} h={5} />
                          </>
                        ) : (
                          <div style={{ fontSize: 12, color: C.t3 }}>
                            {status === "done" ? "Đã hoàn thành" : "Chưa bắt đầu"}
                          </div>
                        )}
                      </div>
                      {status === "done" && <Pill color={C.green}>Hoàn thành</Pill>}
                    </div>
                  </Link>
                );
              }) : (
                <>
                  {totalLessons === 0 && (
                    <div style={{ padding: 20, color: C.t3, fontSize: 14 }}>
                      Khóa học này chưa có bài học nào.
                    </div>
                  )}
                  {progress.map((l, i) => (
                    <div key={l.lesson_id} style={{ padding: "14px 20px",
                      borderBottom: i < progress.length - 1 ? `1px solid ${C.border}` : "none",
                      display: "flex", alignItems: "center", gap: 14 }}>
                      <button onClick={() => toggleLesson(l.lesson_id, l.is_completed)} style={{
                        width: 34, height: 34, borderRadius: 10, border: "none", cursor: "pointer",
                        background: l.is_completed ? C.green : C.bg,
                        color: l.is_completed ? "#fff" : C.t3,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: 800, fontSize: 13 }}>
                        {l.is_completed ? "✓" : i + 1}
                      </button>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>{l.title}</div>
                        <div style={{ fontSize: 12, color: C.t3 }}>
                          {l.is_completed ? "Đã hoàn thành" : "Chưa hoàn thành"}
                        </div>
                      </div>
                      {l.is_completed && <Pill color={C.green}>Hoàn thành</Pill>}
                    </div>
                  ))}
                </>
              )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div ref={sidebarRef} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* SRS widget */}
            <div style={{ background: "#fff", borderRadius: 18, padding: 20,
              border: `1.5px solid ${srsStats.due > 0 ? C.red + "44" : C.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 26 }}>🃏</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>Ôn tập từ vựng đã học</div>
                  <div style={{ fontSize: 12, color: C.t3 }}>Ôn đúng lúc để nhớ lâu dài</div>
                </div>
              </div>
              {srsStats.due > 0 ? (
                <>
                  <div style={{ background: C.redSoft, borderRadius: 12, padding: "12px 14px",
                    marginBottom: 14, textAlign: "center" }}>
                    <div style={{ fontSize: 26, fontWeight: 800, color: C.red }}>{srsStats.due}</div>
                    <div style={{ fontSize: 12, color: C.t2 }}>thẻ cần ôn hôm nay</div>
                  </div>
                  <Btn style={{ width: "100%" }} onClick={() => navigate(`/srs-review?courseId=${enrollment.course_id}`)}>
                    🎯 Ôn ngay
                  </Btn>
                </>
              ) : (
                <div style={{ background: C.greenSoft, borderRadius: 12, padding: 14, textAlign: "center" }}>
                  <div style={{ fontSize: 22 }}>✅</div>
                  <div style={{ fontSize: 13, color: C.green, fontWeight: 700 }}>Đã ôn hết hôm nay!</div>
                </div>
              )}
            </div>

            {/* Tra cứu nhanh từ vựng chuyên ngành */}
            <QuickLookup />

            {/* Gợi ý — dựa trên dữ liệu thật (SRS đến hạn / module đang học), không giả lập */}
            <div style={{ background: `linear-gradient(150deg, ${C.ink}, #2D1B4E)`, borderRadius: 18, padding: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.gold, marginBottom: 10, letterSpacing: .6 }}>
                💡 GỢI Ý LỊCH HỌC HÔM NAY
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,.8)", lineHeight: 1.7 }}>{tip}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
