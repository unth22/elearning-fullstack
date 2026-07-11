import { C, Btn } from "../../styles/theme";

const BENEFITS = [
  { title: "Xem toàn bộ bài giảng của khóa học.", desc: "Video bài giảng, flashcard, luyện tập tương tác và nhiều hơn nữa." },
  { title: "Hủy bất cứ lúc nào.", desc: "Không ràng buộc — chỉ cần ngừng học nếu khóa không phù hợp với bạn." },
  { title: "Sau 3 ngày dùng thử, bài giảng sẽ bị khóa.", desc: "Vẫn xem được danh sách module; nâng cấp để tiếp tục xem bài giảng." },
];

export default function TrialModal({ courseTitle, onStart, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 400,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20,
        width: "100%", maxWidth: 480, padding: "32px 30px", position: "relative",
        boxShadow: "0 20px 60px rgba(0,0,0,.25)" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 24, right: 24, background: "none",
          border: "none", cursor: "pointer", fontSize: 20, color: C.t1 }}>✕</button>

        <h2 style={{ fontFamily: C.serif, fontSize: 26, fontWeight: 800, color: C.t1, marginBottom: 14 }}>
          Bắt đầu dùng thử 3 ngày miễn phí
        </h2>
        <p style={{ fontSize: 14, color: C.t2, lineHeight: 1.7, marginBottom: 24 }}>
          {courseTitle ? <>Khóa <b>{courseTitle}</b> mở</> : "Mở"} miễn phí cho bạn dùng thử trong 3 ngày. Sau đó:
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 28 }}>
          {BENEFITS.map((b, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ color: C.blue, fontWeight: 800, marginTop: 2 }}>✓</span>
              <div>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: C.t1 }}>{b.title}</div>
                <div style={{ fontSize: 13, color: C.t3, marginTop: 2 }}>{b.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <Btn size="lg" style={{ width: "100%" }} onClick={onStart}>
          Bắt đầu học thử
        </Btn>
      </div>
    </div>
  );
}
