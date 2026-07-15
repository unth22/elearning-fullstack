import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, setCurrentUser, logout } from "../services/authService";
import { getMyProfile, updateMyProfile, uploadAvatar, changeMyPassword } from "../services/profileService";
import { getMyEnrollments, enrollInCourse } from "../services/enrollmentService";
import { getMyProgress } from "../services/progressService";
import {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../services/notificationService";
import { LEVELS, GOALS } from "../data/learningOptions";
import { C, Pill, Btn } from "../styles/theme";
import PasswordInput from "../components/PasswordInput";

const SECTIONS = [
  { id: "info", icon: "👤", label: "Thông tin cá nhân" },
  { id: "password", icon: "🔒", label: "Đổi mật khẩu" },
  { id: "courses", icon: "📚", label: "Khóa học của tôi" },
  { id: "plan", icon: "🎯", label: "Kế hoạch học tập" },
  { id: "notifications", icon: "🔔", label: "Thông báo" },
];

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "vừa xong";
  if (mins < 60) return `${mins} phút trước`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  return `${days} ngày trước`;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [section, setSection] = useState("info");
  const [profile, setProfile] = useState(getCurrentUser());
  const [enrollments, setEnrollments] = useState([]);
  const [courseProgress, setCourseProgress] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [fullNameInput, setFullNameInput] = useState("");
  const [savingInfo, setSavingInfo] = useState(false);
  const [infoMsg, setInfoMsg] = useState("");

  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [pwError, setPwError] = useState("");
  const [savingPw, setSavingPw] = useState(false);

  const [editingPlanFor, setEditingPlanFor] = useState(null);
  const [planLevel, setPlanLevel] = useState(null);
  const [planGoal, setPlanGoal] = useState(null);
  const [planCustomGoal, setPlanCustomGoal] = useState("");
  const [savingPlan, setSavingPlan] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getMyProfile(), getMyEnrollments(), getMyNotifications()])
      .then(async ([p, enrs, notifs]) => {
        if (cancelled) return;
        setProfile(p);
        setFullNameInput(p.fullName);
        setEnrollments(enrs);
        setNotifications(notifs);
        const progressEntries = await Promise.all(
          enrs.map((e) =>
            getMyProgress(e.course_id)
              .then((list) => [e.course_id, list])
              .catch(() => [e.course_id, []])
          )
        );
        if (cancelled) return;
        setCourseProgress(Object.fromEntries(progressEntries));
      })
      .catch((err) => setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, []);

  async function handleSaveInfo() {
    setSavingInfo(true);
    setInfoMsg("");
    try {
      const updated = await updateMyProfile({ fullName: fullNameInput });
      setProfile(updated);
      setCurrentUser({ fullName: updated.fullName });
      setInfoMsg("Đã lưu thay đổi.");
    } catch (err) {
      setInfoMsg(err.message);
    } finally {
      setSavingInfo(false);
    }
  }

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Hiện ngay ảnh vừa chọn từ máy trong lúc chờ tải lên xong, để người dùng
    // thấy ảnh thay đổi tức thì thay vì phải đợi phản hồi từ server.
    const localPreview = URL.createObjectURL(file);
    setAvatarPreview(localPreview);
    setUploadingAvatar(true);
    try {
      const updated = await uploadAvatar(file);
      setProfile(updated);
      setCurrentUser({ avatarUrl: updated.avatarUrl });
    } catch (err) {
      setInfoMsg(err.message);
    } finally {
      setUploadingAvatar(false);
      URL.revokeObjectURL(localPreview);
      setAvatarPreview(null);
    }
  }

  async function handleChangePassword() {
    setPwError(""); setPwMsg("");
    if (pwNew.length < 6) { setPwError("Mật khẩu mới phải có ít nhất 6 ký tự."); return; }
    if (pwNew !== pwConfirm) { setPwError("Xác nhận mật khẩu không khớp."); return; }
    setSavingPw(true);
    try {
      await changeMyPassword(pwCurrent, pwNew);
      setPwMsg("Đổi mật khẩu thành công.");
      setPwCurrent(""); setPwNew(""); setPwConfirm("");
    } catch (err) {
      setPwError(err.message);
    } finally {
      setSavingPw(false);
    }
  }

  async function handleMarkRead(id) {
    await markNotificationRead(id);
    setNotifications((list) => list.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
  }

  async function handleMarkAllRead() {
    await markAllNotificationsRead();
    setNotifications((list) => list.map((n) => ({ ...n, is_read: true })));
  }

  function startEditPlan(enr) {
    setEditingPlanFor(enr.course_id);
    setPlanLevel(LEVELS.find((l) => l.label === enr.start_level)?.id || null);
    const matchedGoal = GOALS.find((g) => g.label === enr.goal && !g.isCustom);
    if (matchedGoal) {
      setPlanGoal(matchedGoal.id);
      setPlanCustomGoal("");
    } else if (enr.goal) {
      setPlanGoal("other");
      setPlanCustomGoal(enr.goal);
    } else {
      setPlanGoal(null);
      setPlanCustomGoal("");
    }
  }

  async function handleSavePlan(courseId) {
    setSavingPlan(true);
    try {
      const startLevel = LEVELS.find((l) => l.id === planLevel)?.label;
      const goal = planGoal === "other" ? planCustomGoal.trim() : GOALS.find((g) => g.id === planGoal)?.label;
      await enrollInCourse(courseId, { startLevel, goal });
      const enrs = await getMyEnrollments();
      setEnrollments(enrs);
      setEditingPlanFor(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingPlan(false);
    }
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (loading) {
    return <div style={{ minHeight: "100vh", background: C.bg, display: "flex",
      alignItems: "center", justifyContent: "center", fontFamily: C.body, color: C.t3 }}>Đang tải...</div>;
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: C.body }}>
      {/* Nav */}
      <div style={{ background: C.ink, padding: "0 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", height: 60,
          display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontFamily: C.hanzi, fontSize: 24, color: C.gold }}>商</span>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>Tiếng Trung Thương Mại</div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 16, alignItems: "center" }}>
            <Link to="/dashboard" style={{ color: "rgba(255,255,255,.6)", fontSize: 13, textDecoration: "none" }}>
              ← Dashboard
            </Link>
            <button onClick={() => { logout(); navigate("/"); }} style={{ background: "none",
              border: "none", color: "rgba(255,255,255,.6)", fontSize: 13, cursor: "pointer" }}>
              Đăng xuất
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>Hồ sơ của tôi</h1>

        {error && <p style={{ color: C.red, marginBottom: 16 }}>{error}</p>}

        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 20, alignItems: "start" }}>
          {/* Sidebar */}
          <div style={{ background: "#fff", borderRadius: 18, border: `1px solid ${C.border}`, padding: 10 }}>
            {SECTIONS.map((s) => (
              <button key={s.id} onClick={() => setSection(s.id)} style={{
                width: "100%", textAlign: "left", padding: "10px 12px", borderRadius: 10, marginBottom: 4,
                border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                background: section === s.id ? C.redSoft : "transparent",
                color: section === s.id ? C.red : C.t2, fontSize: 14, fontWeight: 600 }}>
                <span>{s.icon}</span> {s.label}
                {s.id === "notifications" && unreadCount > 0 && (
                  <span style={{ marginLeft: "auto", background: C.red, color: "#fff", borderRadius: 99,
                    fontSize: 11, padding: "1px 7px", fontWeight: 700 }}>{unreadCount}</span>
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ background: "#fff", borderRadius: 18, border: `1px solid ${C.border}`, padding: 24 }}>

            {section === "info" && (
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 18 }}>Thông tin cá nhân</h2>
                <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 24 }}>
                  <div onClick={() => fileInputRef.current?.click()} style={{
                    width: 76, height: 76, borderRadius: 38, background: C.red, color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 28, fontWeight: 700, cursor: "pointer", overflow: "hidden", flexShrink: 0 }}>
                    {avatarPreview || profile?.avatarUrl
                      ? <img src={avatarPreview || profile.avatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : (profile?.fullName || "?")[0].toUpperCase()}
                  </div>
                  <div>
                    <Btn variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploadingAvatar}>
                      {uploadingAvatar ? "Đang tải lên..." : "Đổi ảnh đại diện"}
                    </Btn>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: "none" }} />
                  </div>
                </div>

                <label style={{ fontSize: 13, fontWeight: 700, color: C.t2, display: "block", marginBottom: 6 }}>Họ và tên</label>
                <input value={fullNameInput} onChange={(e) => setFullNameInput(e.target.value)} style={{
                  width: "100%", padding: "10px 14px", border: `1.5px solid ${C.border}`, borderRadius: 11,
                  fontSize: 14, marginBottom: 16, boxSizing: "border-box", fontFamily: "inherit" }} />

                <label style={{ fontSize: 13, fontWeight: 700, color: C.t2, display: "block", marginBottom: 6 }}>Email</label>
                <input value={profile?.email || ""} disabled style={{
                  width: "100%", padding: "10px 14px", border: `1.5px solid ${C.border}`, borderRadius: 11,
                  fontSize: 14, marginBottom: 20, boxSizing: "border-box", background: C.bg, color: C.t3 }} />

                <Btn onClick={handleSaveInfo} disabled={savingInfo}>{savingInfo ? "Đang lưu..." : "Lưu thay đổi"}</Btn>
                {infoMsg && <span style={{ marginLeft: 12, fontSize: 13, color: C.green }}>{infoMsg}</span>}
              </div>
            )}

            {section === "password" && (
              <div style={{ maxWidth: 360 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 18 }}>Đổi mật khẩu</h2>
                {["Mật khẩu hiện tại", "Mật khẩu mới", "Xác nhận mật khẩu mới"].map((label, i) => (
                  <div key={label} style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 13, fontWeight: 700, color: C.t2, display: "block", marginBottom: 6 }}>{label}</label>
                    <PasswordInput
                      value={[pwCurrent, pwNew, pwConfirm][i]}
                      onChange={(e) => [setPwCurrent, setPwNew, setPwConfirm][i](e.target.value)}
                      style={{ width: "100%", padding: "10px 14px", border: `1.5px solid ${C.border}`,
                        borderRadius: 11, fontSize: 14 }} />
                  </div>
                ))}
                {pwError && <p style={{ color: C.red, fontSize: 13, marginBottom: 12 }}>{pwError}</p>}
                {pwMsg && <p style={{ color: C.green, fontSize: 13, marginBottom: 12 }}>{pwMsg}</p>}
                <Btn onClick={handleChangePassword} disabled={savingPw} style={{ width: "100%" }}>
                  {savingPw ? "Đang lưu..." : "Đổi mật khẩu"}
                </Btn>
              </div>
            )}

            {section === "courses" && (
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 18 }}>Khóa học của tôi</h2>
                {enrollments.length === 0 && <p style={{ color: C.t3 }}>Bạn chưa đăng ký khóa học nào.</p>}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {enrollments.map((e) => {
                    const progress = courseProgress[e.course_id] || [];
                    const total = progress.length;
                    const done = progress.filter((p) => p.is_completed).length;
                    const accent = e.accent_color || C.red;
                    return (
                      <div key={e.course_id} style={{ border: `1px solid ${C.border}`, borderRadius: 14, padding: 16,
                        display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{ fontSize: 28 }}>{e.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 15 }}>{e.title}</div>
                          <div style={{ fontSize: 12, color: C.t3 }}>
                            {total > 0 ? `${done}/${total} bài hoàn thành` : "Chưa có bài học"}
                          </div>
                        </div>
                        <Link to={`/course/${e.course_id}`} style={{ color: accent, fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
                          Học tiếp →
                        </Link>
                      </div>
                    );
                  })}
                  <Link to="/courses" style={{
                    border: `1.5px dashed ${C.border}`, borderRadius: 14, padding: 16,
                    display: "flex", alignItems: "center", gap: 14, textDecoration: "none", color: C.t3 }}>
                    <div style={{ fontSize: 28 }}>+</div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>Đăng ký khóa học khác</div>
                  </Link>
                </div>
              </div>
            )}

            {section === "notifications" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 700 }}>Thông báo</h2>
                  {unreadCount > 0 && (
                    <button onClick={handleMarkAllRead} style={{ background: "none", border: "none",
                      color: C.red, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                      Đánh dấu tất cả đã đọc
                    </button>
                  )}
                </div>
                {notifications.length === 0 && <p style={{ color: C.t3 }}>Chưa có thông báo nào.</p>}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {notifications.map((n) => (
                    <div key={n.id} onClick={() => !n.is_read && handleMarkRead(n.id)} style={{
                      border: `1px solid ${n.is_read ? C.border : C.red + "44"}`,
                      background: n.is_read ? "#fff" : C.redSoft,
                      borderRadius: 12, padding: 14, cursor: n.is_read ? "default" : "pointer" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{n.title}</div>
                        <div style={{ fontSize: 11, color: C.t3, whiteSpace: "nowrap" }}>{timeAgo(n.created_at)}</div>
                      </div>
                      <div style={{ fontSize: 13, color: C.t2, marginTop: 4 }}>{n.message}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {section === "plan" && (
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Kế hoạch học tập</h2>
                <p style={{ fontSize: 13, color: C.t3, marginBottom: 18 }}>
                  Điều chỉnh lại trình độ hiện tại và mục tiêu cho từng khóa học bất cứ lúc nào.
                </p>
                {enrollments.length === 0 && <p style={{ color: C.t3 }}>Bạn chưa đăng ký khóa học nào.</p>}
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {enrollments.map((e) => (
                    <div key={e.course_id} style={{ border: `1px solid ${C.border}`, borderRadius: 14, padding: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                        <span style={{ fontSize: 22 }}>{e.icon}</span>
                        <span style={{ fontWeight: 700, fontSize: 15 }}>{e.title}</span>
                      </div>

                      {editingPlanFor !== e.course_id ? (
                        <>
                          <div style={{ fontSize: 13, color: C.t2, marginBottom: 2 }}>
                            Trình độ: <strong>{e.start_level || "Chưa chọn"}</strong>
                          </div>
                          <div style={{ fontSize: 13, color: C.t2, marginBottom: 10 }}>
                            Mục tiêu: <strong>{e.goal || "Chưa chọn"}</strong>
                          </div>
                          <button onClick={() => startEditPlan(e)} style={{ background: "none", border: "none",
                            color: C.red, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Chỉnh sửa</button>
                        </>
                      ) : (
                        <>
                          <div style={{ fontSize: 12, fontWeight: 700, color: C.t3, marginBottom: 6 }}>TRÌNH ĐỘ</div>
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                            {LEVELS.map((l) => (
                              <button key={l.id} onClick={() => setPlanLevel(l.id)} style={{
                                padding: "6px 12px", borderRadius: 20, fontSize: 12, cursor: "pointer",
                                border: `1.5px solid ${planLevel === l.id ? C.red : C.border}`,
                                background: planLevel === l.id ? C.redSoft : "transparent",
                                color: planLevel === l.id ? C.red : C.t2 }}>
                                {l.icon} {l.label}
                              </button>
                            ))}
                          </div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: C.t3, marginBottom: 6 }}>MỤC TIÊU</div>
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                            {GOALS.map((g) => (
                              <button key={g.id} onClick={() => setPlanGoal(g.id)} style={{
                                padding: "6px 12px", borderRadius: 20, fontSize: 12, cursor: "pointer",
                                border: `1.5px solid ${planGoal === g.id ? C.red : C.border}`,
                                background: planGoal === g.id ? C.redSoft : "transparent",
                                color: planGoal === g.id ? C.red : C.t2 }}>
                                {g.icon} {g.label}
                              </button>
                            ))}
                          </div>
                          {planGoal === "other" && (
                            <input
                              autoFocus
                              value={planCustomGoal}
                              onChange={(ev) => setPlanCustomGoal(ev.target.value)}
                              placeholder="Nhập mục tiêu của bạn..."
                              style={{ width: "100%", marginBottom: 14, padding: "9px 12px", borderRadius: 10,
                                border: `1.5px solid ${C.border}`, fontSize: 13, boxSizing: "border-box",
                                fontFamily: "inherit" }}
                            />
                          )}
                          <div style={{ display: "flex", gap: 10 }}>
                            <Btn size="sm" onClick={() => handleSavePlan(e.course_id)}
                              disabled={savingPlan || (planGoal === "other" && !planCustomGoal.trim())}>
                              {savingPlan ? "Đang lưu..." : "Lưu"}
                            </Btn>
                            <Btn size="sm" variant="ghost" onClick={() => setEditingPlanFor(null)}>Hủy</Btn>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
