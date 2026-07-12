import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getCurrentUser, logout } from "../services/authService";
import { getMyEnrollments } from "../services/enrollmentService";
import { getMyProgress, setLessonProgress } from "../services/progressService";
import { getSrsStats } from "../services/srsService";
import { getMyActivity } from "../services/activityService";
import { C, Pill, Btn, PBar } from "../styles/theme";
import QuickLookup from "../components/QuickLookup";

function greeting() {
  const h = new Date().getHours();
  if (h < 11) return "Chào buổi sáng ☀️";
  if (h < 18) return "Chào buổi chiều 🌤️";
  return "Chào buổi tối 🌙";
}

function buildTodaySchedule(srsDue) {
  return [
    { icon: "🎬", label: "Bài giảng", tasks: [
      "Xem tiếp bài giảng module hiện tại",
      "Ghi chú lại từ vựng/ngữ pháp mới gặp",
    ] },
    { icon: "🃏", label: "Flashcard", tasks: srsDue > 0
      ? [`${srsDue} thẻ cần ôn hôm nay`, "Ôn lại từ vựng bằng Flashcard"]
      : ["Đã ôn hết thẻ hôm nay ✅", "Học thêm từ vựng mới nếu muốn"] },
    { icon: "✏️", label: "Trắc nghiệm", tasks: [
      "Làm bài trắc nghiệm kiểm tra từ đã học",
      "Xem lại các câu đã làm sai",
    ] },
    { icon: "📝", label: "Ngữ pháp", tasks: [
      "Ôn lại 1 cấu trúc ngữ pháp mới",
      "Đặt câu ví dụ áp dụng thực tế",
    ] },
    { icon: "🎧", label: "Nghe chép", tasks: [
      "Nghe chép 1 đoạn hội thoại ngắn",
      "Tự chữa câu sai, không xem đáp án trước",
    ] },
    { icon: "🎤", label: "Shadowing", tasks: [
      "Luyện shadowing theo câu mẫu",
      "Luyện phát âm 4 thanh điệu chuẩn",
    ] },
  ];
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [enrollments, setEnrollments] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [progress, setProgress] = useState([]);
  const [srsStats, setSrsStats] = useState({ due: 0, learned: 0 });
  const [activity, setActivity] = useState({ streak: 0, week: [] });
  const [loading, setLoading] = useState(true);
  const [courseLoading, setCourseLoading] = useState(false);
  const [error, setError] = useState("");

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
    Promise.all([getMyProgress(selectedCourseId), getSrsStats(selectedCourseId)])
      .then(([p, s]) => {
        if (cancelled) return;
        setProgress(p);
        setSrsStats(s);
      })
      .catch((err) => setError(err.message))
      .finally(() => !cancelled && setCourseLoading(false));
    return () => { cancelled = true; };
  }, [selectedCourseId]);

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

  const totalLessons = progress.length;
  const completedCount = progress.filter((p) => p.is_completed).length;
  const continueLesson = progress.find((p) => !p.is_completed) || null;

  const tip = srsStats.due > 0
    ? `Bạn có ${srsStats.due} thẻ từ vựng cần ôn hôm nay — ôn ngay để không quên nhé!`
    : continueLesson
      ? `Bạn còn ${totalLessons - completedCount} bài chưa hoàn thành trong khóa "${enrollment.title}" — tiếp tục học nhé!`
      : `Bạn đã hoàn thành hết nội dung khóa học này! Hãy khám phá khóa học khác.`;

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
          <div>
            <div style={{ fontSize: 13, color: C.t3 }}>{greeting()}</div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>{user?.fullName}</div>
          </div>
          <div>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ background: C.goldSoft, borderRadius: 14, padding: "12px 18px", textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: C.gold }}>🔥 {activity.streak}</div>
                <div style={{ fontSize: 11, color: C.t3 }}>ngày streak</div>
              </div>
              <div style={{ background: C.greenSoft, borderRadius: 14, padding: "12px 18px", textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: C.green }}>{srsStats.learned}</div>
                <div style={{ fontSize: 11, color: C.t3 }}>từ đã học</div>
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

        {/* Chọn khóa học bạn đang học */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.t3, marginBottom: 10, letterSpacing: .6 }}>
            KHÓA HỌC BẠN ĐANG HỌC
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            {enrollments.map((e) => {
              const active = e.course_id === selectedCourseId;
              const accent = e.accent_color || C.red;
              return (
                <button key={e.course_id} onClick={() => setSelectedCourseId(e.course_id)} style={{
                  padding: "8px 16px", borderRadius: 20, cursor: "pointer",
                  border: `1.5px solid ${active ? accent : C.border}`,
                  background: active ? accent + "18" : "#fff",
                  color: active ? accent : C.t2,
                  fontSize: 13, fontWeight: 700 }}>
                  {e.icon} {e.title}
                </button>
              );
            })}
            <Link to="/courses" style={{
              padding: "8px 16px", borderRadius: 20, textDecoration: "none",
              border: `1.5px dashed ${C.border}`, color: C.t3, fontSize: 13, fontWeight: 600 }}>
              + Khóa học khác
            </Link>
          </div>
        </div>

        {/* Lịch học hôm nay — gợi ý theo từng kỹ năng cho khóa đang chọn */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.t3, marginBottom: 10, letterSpacing: .6 }}>
            LỊCH HỌC HÔM NAY
          </div>
          <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 6 }}>
            {buildTodaySchedule(srsStats.due).map((s) => (
              <div key={s.label} onClick={() => navigate(`/course/${enrollment.course_id}`)}
                style={{ minWidth: 220, flexShrink: 0, background: "#fff", borderRadius: 16,
                  border: `1px solid ${C.border}`, padding: 16, cursor: "pointer" }}>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{s.icon} {s.label}</div>
                <div style={{ fontSize: 12, color: C.t3, marginBottom: 2 }}>
                  Khóa học: <span style={{ color: enrollment.accent_color || C.red, fontWeight: 600 }}>{enrollment.title}</span>
                </div>
                <div style={{ fontSize: 11, color: C.t3, marginBottom: 12 }}>Hàng ngày</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {s.tasks.map((t, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, marginTop: 4, flexShrink: 0,
                        background: enrollment.accent_color || C.red }} />
                      <span style={{ fontSize: 12.5, color: C.t2, lineHeight: 1.5 }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start",
          opacity: courseLoading ? 0.5 : 1, transition: "opacity .15s", pointerEvents: courseLoading ? "none" : "auto" }}>
          {/* Main column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Continue learning */}
            <div onClick={() => navigate(`/course/${enrollment.course_id}`)} style={{
              background: C.ink, borderRadius: 20, padding: 24, cursor: "pointer",
              position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", right: -14, top: -14, fontSize: 90, opacity: .07 }}>
                {enrollment.icon}
              </div>
              <Pill color={C.gold} style={{ marginBottom: 10 }}>
                {continueLesson ? "TIẾP TỤC HỌC" : "ĐÃ HOÀN THÀNH"}
              </Pill>
              <div style={{ fontSize: 19, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
                {continueLesson ? continueLesson.title : "Xem lại nội dung khóa học"}
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
              <PBar value={completedCount} max={totalLessons || 1} color={C.red} h={6} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,.4)" }}>
                  {completedCount}/{totalLessons} bài hoàn thành
                </span>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.gold }}>Học tiếp →</span>
              </div>
            </div>

            {/* Curriculum — real lessons */}
            <div style={{ background: "#fff", borderRadius: 18, border: `1px solid ${C.border}`, overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`,
                fontSize: 13, fontWeight: 700, color: C.t3, letterSpacing: .6 }}>
                LỘ TRÌNH CỦA BẠN
              </div>
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
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* SRS widget */}
            <div style={{ background: "#fff", borderRadius: 18, padding: 20,
              border: `1.5px solid ${srsStats.due > 0 ? C.red + "44" : C.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 26 }}>🃏</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>Ôn tập SRS</div>
                  <div style={{ fontSize: 12, color: C.t3 }}>Hệ thống ghi nhớ thông minh</div>
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

            {/* Gợi ý — dựa trên dữ liệu thật, không giả lập AI chấm điểm */}
            <div style={{ background: `linear-gradient(150deg, ${C.ink}, #2D1B4E)`, borderRadius: 18, padding: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.gold, marginBottom: 10, letterSpacing: .6 }}>
                💡 GỢI Ý CHO BẠN
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,.8)", lineHeight: 1.7 }}>{tip}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
