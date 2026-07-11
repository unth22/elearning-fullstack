import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/authService";
import { getMyLatestEnrollment } from "../services/enrollmentService";
import { C, Pill, Btn } from "../styles/theme";

// Khóa học chuyên ngành theo giáo trình sách — bao gồm 5 khóa gốc
// + toàn bộ chuyên ngành thực tế đang có trong backend (courses.industry).
const COURSES = [
  {
    id: "hsk6", hanzi: "六级", level: "★ Phổ biến nhất", featured: true,
    name: "HSK 6 Tiêu Chuẩn",
    desc: "Giáo trình chuẩn thi HSK 6 chính thức. 5000+ từ vựng theo 15 chủ đề, 30 điểm ngữ pháp nâng cao, luyện đề thực chiến.",
    features: ["5000+ từ vựng học thuật & xã hội", "30 cấu trúc ngữ pháp nâng cao", "Luyện nghe bản tin, phỏng vấn", "Kỹ năng viết tóm tắt 400 chữ", "4 đề thi thử HSK 6 chuẩn thức"],
    price: "18.500.000", note: "/ 95 buổi",
  },
  {
    id: "biz", hanzi: "商务", level: "Chuyên ngành", featured: false,
    name: "Tiếng Trung Thương Mại",
    desc: "Đàm phán, hợp đồng, email thương mại, giao thương quốc tế. Roleplay tình huống thực tế từ doanh nghiệp.",
    features: ["Kỹ thuật đàm phán giá & điều khoản", "Đọc & soạn hợp đồng song ngữ", "Văn hóa kinh doanh Trung Quốc", "AI Practice Partner 24/7"],
    price: "15.900.000", note: "/ 60 buổi",
  },
  {
    id: "factory", hanzi: "工厂", level: "Chuyên ngành", featured: false,
    name: "Tiếng Trung Công Xưởng",
    desc: "Sản xuất, kỹ thuật, quản lý xưởng, an toàn lao động. Giao tiếp trực tiếp với kỹ sư và quản lý Trung Quốc.",
    features: ["Từ vựng kỹ thuật & sản xuất", "Giao tiếp ca làm việc, kiểm tra chất lượng", "Xử lý sự cố & báo cáo sự kiện", "Tình huống thực tế nhà máy"],
    price: "12.500.000", note: "/ 50 buổi",
  },
  {
    id: "office", hanzi: "办公", level: "Chuyên ngành", featured: false,
    name: "Tiếng Trung Văn Phòng",
    desc: "Email công việc, họp hành, báo cáo, thuyết trình. Giao tiếp chuyên nghiệp trong môi trường doanh nghiệp.",
    features: ["Viết email & báo cáo chuyên nghiệp", "Kỹ năng thuyết trình bằng tiếng Trung", "Giao tiếp nội bộ với sếp Trung Quốc", "Luyện nghe thực tế cuộc họp"],
    price: "12.500.000", note: "/ 50 buổi",
  },
  {
    id: "hospitality", hanzi: "酒店", level: "Chuyên ngành", featured: false,
    name: "Nhà Hàng – Khách Sạn",
    desc: "Lễ tân, phục vụ, F&B, check-in/out, xử lý khiếu nại. Ngành dịch vụ chuyên nghiệp tiêu chuẩn quốc tế.",
    features: ["Giao tiếp lễ tân & đặt phòng", "Phục vụ nhà hàng & tiệc sự kiện", "Xử lý phàn nàn chuyên nghiệp", "Từ vựng F&B thực tế"],
    price: "11.500.000", note: "/ 45 buổi",
  },
  {
    id: "logistics", hanzi: "物流", level: "Chuyên ngành", featured: false,
    name: "Xuất Nhập Khẩu & Logistics",
    desc: "Chứng từ xuất nhập khẩu, thủ tục hải quan, đàm phán vận chuyển với nhà cung cấp và forwarder Trung Quốc.",
    features: ["Từ vựng hải quan & chứng từ (Bill of Lading, L/C)", "Đàm phán giá vận chuyển & điều khoản Incoterms", "Xử lý sự cố thông quan", "Email giao dịch với forwarder"],
    price: "13.900.000", note: "/ 55 buổi",
  },
  {
    id: "beauty", hanzi: "美容", level: "Chuyên ngành", featured: false,
    name: "Làm Đẹp & Spa",
    desc: "Tư vấn khách hàng, dịch vụ làm đẹp và mỹ phẩm, giao tiếp với đối tác/nhà cung cấp Trung Quốc trong ngành beauty.",
    features: ["Từ vựng mỹ phẩm & liệu trình làm đẹp", "Tư vấn khách hàng chuyên nghiệp", "Đàm phán nhập mỹ phẩm từ Trung Quốc", "Xử lý phản hồi & khiếu nại khách hàng"],
    price: "11.900.000", note: "/ 45 buổi",
  },
  {
    id: "sales", hanzi: "销售", level: "Chuyên ngành", featured: false,
    name: "Bán Hàng & Kinh Doanh",
    desc: "Chào hàng, đàm phán, chốt đơn với đối tác Trung Quốc — kỹ năng bán hàng chuyên nghiệp bằng tiếng Trung.",
    features: ["Kịch bản chào hàng & giới thiệu sản phẩm", "Kỹ thuật đàm phán & chốt đơn", "Xử lý từ chối của khách hàng", "Chăm sóc khách hàng sau bán"],
    price: "12.900.000", note: "/ 50 buổi",
  },
  {
    id: "it", hanzi: "信息技术", level: "Chuyên ngành", featured: false,
    name: "Công Nghệ Thông Tin",
    desc: "Lập trình, AI, bảo mật, phần mềm — giao tiếp kỹ thuật với đội ngũ phát triển và đối tác công nghệ Trung Quốc.",
    features: ["Từ vựng lập trình & phát triển phần mềm", "Giao tiếp trong họp kỹ thuật (standup, sprint)", "Đọc tài liệu kỹ thuật song ngữ", "Trao đổi với đối tác AI/công nghệ Trung Quốc"],
    price: "14.500.000", note: "/ 55 buổi",
  },
  {
    id: "ecommerce", hanzi: "电商", level: "Chuyên ngành", featured: false,
    name: "Thương Mại Điện Tử",
    desc: "Sourcing trên 1688, Taobao, đàm phán với xưởng sản xuất — làm chủ chuỗi cung ứng thương mại điện tử.",
    features: ["Chat & đàm phán trên 1688/Taobao", "Kiểm tra chất lượng & MOQ", "Quản lý đơn hàng & vận chuyển", "Xây dựng quan hệ nhà cung cấp lâu dài"],
    price: "13.500.000", note: "/ 50 buổi",
  },
  {
    id: "finance", hanzi: "金融商业", level: "Chuyên ngành", featured: false,
    name: "Kinh Doanh & Tài Chính",
    desc: "Đầu tư, kế toán, tài chính doanh nghiệp — đọc hiểu báo cáo và đàm phán tài chính với đối tác Trung Quốc.",
    features: ["Đọc báo cáo tài chính song ngữ", "Từ vựng đầu tư & kế toán", "Đàm phán điều khoản thanh toán", "Họp ngân sách với tập đoàn mẹ"],
    price: "15.900.000", note: "/ 60 buổi",
  },
  {
    id: "law", hanzi: "法律", level: "Chuyên ngành", featured: false,
    name: "Luật & Pháp Lý",
    desc: "Hợp đồng, tố tụng, luật doanh nghiệp — thuật ngữ pháp lý chuyên sâu cho công việc liên quan đối tác Trung Quốc.",
    features: ["Đọc & soạn thảo hợp đồng song ngữ", "Thuật ngữ pháp lý & tố tụng", "Tư vấn luật doanh nghiệp", "Xử lý tranh chấp thương mại"],
    price: "16.500.000", note: "/ 60 buổi",
  },
  {
    id: "government", hanzi: "公安", level: "Chuyên ngành", featured: false,
    name: "Hành Chính & Công Vụ",
    desc: "Hành chính, xuất nhập cảnh, thực thi pháp luật — tiếng Trung chuyên ngành cho cán bộ, công chức nhà nước.",
    features: ["Thủ tục hành chính & xuất nhập cảnh", "Thuật ngữ thực thi pháp luật", "Giao tiếp tại cửa khẩu", "Xử lý hồ sơ & phê duyệt"],
    price: "12.500.000", note: "/ 45 buổi",
  },
  {
    id: "general", hanzi: "其他", level: "Tổng hợp", featured: false,
    name: "Tiếng Trung Thương Mại Tổng Hợp",
    desc: "Từ vựng thương mại tổng hợp dùng chung nhiều ngành — lựa chọn linh hoạt cho người chưa xác định rõ chuyên ngành.",
    features: ["Từ vựng thương mại đa ngành", "Giao tiếp công việc cơ bản", "Phù hợp người mới bắt đầu chuyên ngành", "Có thể chuyển đổi sang khóa chuyên sâu sau"],
    price: "9.900.000", note: "/ 40 buổi",
  },
];

// Ánh xạ id khóa học (marketing) → id khóa học thật trong DB (đã có nội dung/trang chi tiết).
// Khóa nào chưa có bản ghi DB tương ứng (hsk6, biz, office) thì chưa hiện nút "Xem chi tiết".
const COURSE_DETAIL_MAP = {
  factory: 7, ecommerce: 9, law: 1, finance: 2, it: 3,
  logistics: 4, beauty: 5, sales: 6, hospitality: 8, general: 10, government: 11,
};

// Kiến thức chuyên sâu: bài giảng về quy trình nghiệp vụ & ứng dụng thực tế,
// bổ sung cho các khóa học chuyên ngành ở trên.
const TRACKS = [
  { id: "xnk", icon: "📦", hanzi: "进出口", name: "Xuất Nhập Khẩu & Logistics", desc: "Từ vựng hải quan, chứng từ, Incoterms, email với forwarder, đàm phán vận chuyển.", tags: ["Bill of Lading", "L/C & T/T", "Hải quan"] },
  { id: "mfg", icon: "🏭", hanzi: "制造业", name: "Sản Xuất & Kỹ Thuật", desc: "Giao tiếp nhà máy, đọc bản vẽ kỹ thuật, họp sản xuất, kiểm soát chất lượng.", tags: ["QC / QA", "Kỹ thuật", "Vận hành"] },
  { id: "hr", icon: "👥", hanzi: "人力资源", name: "HR & Quản Lý Nhân Sự", desc: "Phỏng vấn, đánh giá nhân sự, họp ban lãnh đạo, thương lượng lương & phúc lợi.", tags: ["Tuyển dụng", "C&B", "L&D"] },
  { id: "fin", icon: "💰", hanzi: "财务金融", name: "Tài Chính & Kế Toán", desc: "Đọc báo cáo tài chính, điều khoản thanh toán, họp ngân sách với tập đoàn mẹ.", tags: ["Kế toán", "Báo cáo", "Kiểm toán"] },
  { id: "ecom", icon: "🛒", hanzi: "电商贸易", name: "Thương Mại Điện Tử & Nguồn Hàng", desc: "Chat với xưởng trên 1688/Alibaba, đàm phán giá & MOQ, quản lý đơn hàng.", tags: ["1688", "Nguồn hàng", "Đàm phán"] },
];

const TESTIMONIALS = [
  { name: "Nguyễn Minh Tuấn", role: "Nhân viên công ty thương mại Việt–Trung", avatar: "明",
    text: "Sau 3 tháng học khóa HSK 6, tôi thi đạt 213/300. Giáo trình rất có hệ thống, đặc biệt phần từ vựng theo chủ đề giúp tôi nhớ rất lâu và áp dụng được ngay." },
  { name: "Trần Thị Hoa", role: "Regional Director, Hà Nội", avatar: "华",
    text: "Sau 6 tháng học khóa Thương Mại, tôi tự đàm phán trực tiếp với xưởng Thâm Quyến — tiết kiệm 18% chi phí so với qua trung gian." },
  { name: "Lê Văn Cường", role: "Quản lý sản xuất, KCN Bình Dương", avatar: "强",
    text: "Khóa Công Xưởng rất thực tế. Tôi có thể giao tiếp trực tiếp với kỹ sư Trung Quốc sau 2 tháng học, không cần phiên dịch nữa — sếp rất ấn tượng." },
  { name: "Đỗ Thị Ngọc Anh", role: "Trưởng phòng Kinh doanh Quốc tế, TP.HCM", avatar: "玉",
    text: "Khóa HSK 6 Mastery với AI là khoản đầu tư tốt nhất tôi từng chi. Không chỉ đậu chứng chỉ — tôi còn được thăng chức ngay sau khi có kết quả." },
  { name: "Hoàng Văn Nam", role: "Chủ kinh doanh online, Đồng Nai", avatar: "南",
    text: "Tôi học buổi tối sau giờ làm, 1-2 tiếng mỗi ngày. AI Partner giúp tôi luyện tập ngay cả khi không có lớp — sau 8 tháng tự nhập được lô hàng đầu tiên từ Quảng Châu." },
];

const CURRICULUM = [
  { module: "Module 1 · Khởi động", lessons: ["Chào hỏi đối tác chuẩn thương mại", "Giới thiệu công ty & sản phẩm", "Small talk xây dựng quan hệ"], free: true },
  { module: "Module 2 · Giao dịch", lessons: ["Hỏi & nhận báo giá", "So sánh nhà cung cấp", "Thương lượng giá lần 1"], free: false },
  { module: "Module 3 · Đàm phán sâu", lessons: ["Kỹ thuật ép giá có văn hóa", "Điều khoản thanh toán", "Xử lý từ chối & bế tắc"], free: false },
  { module: "Module 4 · Hợp đồng & Vận hành", lessons: ["Đọc hiểu hợp đồng thương mại", "Theo dõi đơn hàng & giao nhận", "Xử lý khiếu nại, đòi bồi thường"], free: false },
];

const AI_FEATURES = [
  { icon: "🗣️", title: "Luyện hội thoại thực tế", desc: "Roleplay đàm phán, họp nhóm, thuyết trình với AI đóng vai đối tác Trung Quốc." },
  { icon: "✍️", title: "Sửa văn viết tức thì", desc: "Nhập email, báo cáo của bạn — AI sửa lỗi ngữ pháp, từ vựng và chỉnh tông văn phong chuyên nghiệp." },
  { icon: "📊", title: "Theo dõi tiến độ chi tiết", desc: "Dashboard cá nhân hiển thị điểm mạnh, vùng cần cải thiện và dự đoán ngày đạt mục tiêu." },
];

const MARQUEE_ITEMS = ["HSK 6 Tiêu Chuẩn", "Tiếng Trung Thương Mại", "Xuất Nhập Khẩu & Logistics", "Công Xưởng & Kỹ Thuật", "Văn Phòng Chuyên Nghiệp", "Nhà Hàng – Khách Sạn", "Tài Chính & Kế Toán", "HR & Nhân Sự", "Thương Mại Điện Tử", "AI Practice Partner 24/7", "Đàm Phán Quốc Tế"];

export default function LandingPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", course: "" });
  const [submitted, setSubmitted] = useState(false);
  const [navSolid, setNavSolid] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setNavSolid(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Người đã đăng nhập bấm "Vào học" thì vào thẳng danh sách khóa học,
  // chưa đăng nhập thì phải qua trang đăng nhập trước.
  const goToStudy = async () => {
    if (!getCurrentUser()) { navigate("/login"); return; }
    const enrollment = await getMyLatestEnrollment().catch(() => null);
    navigate(enrollment ? "/dashboard" : "/courses");
  };
  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth" });

  const handleSubmit = () => {
    if (!form.name.trim() || !form.phone.trim()) return;
    setSubmitted(true);
  };

  return (
    <div style={{ fontFamily: C.body, color: C.t1, background: C.black }}>
      <style>{`
        @keyframes lpMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes lpPulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: .5; transform: scale(.8); } }
        .lp-course-card { transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease; }
        .lp-course-card:hover { transform: translateY(-6px); border-color: ${C.gold} !important; box-shadow: 0 16px 40px rgba(240,165,0,.18); }
        .lp-course-btn { background: transparent; color: #fff; border: 1.5px solid rgba(255,255,255,.25); transition: background .2s ease, border-color .2s ease; }
        .lp-course-card:hover .lp-course-btn { background: ${C.red}; border-color: ${C.red}; }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: navSolid ? "rgba(10,10,10,.92)" : "transparent",
        backdropFilter: navSolid ? "blur(12px)" : "none",
        borderBottom: navSolid ? `1px solid ${C.borderGold}` : "1px solid transparent",
        transition: "background .3s, border-color .3s", padding: "0 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", height: 64,
          display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: C.hanzi, fontSize: 26, color: C.gold }}>商</span>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", lineHeight: 1.1 }}>
                Tiếng Trung Thương Mại
              </div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,.5)", letterSpacing: .8 }}>
                BUSINESS CHINESE & HSK6 WITH AI
              </div>
            </div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 20, alignItems: "center" }}>
            {[["Khóa học", "#courses"], ["Phương pháp", "#method"], ["AI Learning", "#ai"]].map(([l, href]) => (
              <a key={l} href={href} style={{
                color: "rgba(255,255,255,.75)", fontSize: 13, fontWeight: 600,
                textDecoration: "none" }}>{l}</a>
            ))}
            <Btn size="sm" onClick={goToStudy}>Vào học ngay</Btn>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ background: `linear-gradient(160deg, ${C.black} 0%, ${C.deep} 100%)`,
        padding: "130px 24px 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: 40, top: 320, width: 480, height: 480,
          background: `radial-gradient(circle, ${C.red}40 0%, transparent 70%)`,
          filter: "blur(50px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: -30, top: 240, fontFamily: C.hanzi,
          fontSize: 340, lineHeight: 1, userSelect: "none", display: "flex",
          color: "rgba(240,165,0,.06)" }}>
          <span>商</span><span>务</span>
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <div style={{ maxWidth: 720 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10,
              background: "rgba(240,165,0,0.08)", border: `1px solid ${C.gold}55`,
              borderRadius: 8, padding: "10px 18px", marginBottom: 20 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.gold, flexShrink: 0 }} />
              <span style={{ color: C.gold, fontSize: 13, fontWeight: 400,
                letterSpacing: 1, textTransform: "uppercase" }}>
                Dành cho nhân sự đi làm, quản lý & doanh nhân
              </span>
            </div>
            <h1 style={{ fontFamily: C.serif, fontSize: 56, fontWeight: 900, color: "#fff",
              lineHeight: 1.08, marginBottom: 24, letterSpacing: -1.5 }}>
              Thành thạo<br />
              <span style={{ color: C.red }}>Tiếng Trung Thương Mại</span><br />
              <span style={{ color: C.gold }}>Mở rộng cánh cửa tương lai</span>
            </h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,.75)",
              lineHeight: 1.7, marginBottom: 12 }}>
              Nền tảng học tiếng Trung <strong style={{ color: "#fff" }}>theo đúng lĩnh vực ngành nghề bạn quan tâm</strong> —
              từ <strong style={{ color: "#fff" }}>HSK 6 học thuật</strong> đến thương mại, công xưởng, văn phòng.
              Học 15 phút/ngày, AI chấm phát âm, sau 6 tháng tự tin đàm phán trực tiếp với đối tác Trung Quốc.
            </p>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,.5)",
              marginBottom: 28, fontStyle: "italic" }}>
              "Không dạy 'con mèo ngồi trên bàn'. Chỉ dạy những gì bạn dùng được ngay ngày mai tại công ty."
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Btn size="lg" onClick={scrollToForm} style={{ borderRadius: 8,
                textTransform: "uppercase", letterSpacing: 1, fontSize: 14 }}>
                Nhận tư vấn lộ trình miễn phí →
              </Btn>
              <Btn size="lg" variant="ghost" style={{ color: "rgba(255,255,255,.7)",
                borderColor: "rgba(255,255,255,.2)", borderRadius: 8,
                textTransform: "uppercase", letterSpacing: 1, fontSize: 14 }} onClick={goToStudy}>
                ▶ Học thử ngay
              </Btn>
            </div>

            <div style={{ display: "flex", gap: 20, marginTop: 44, flexWrap: "nowrap" }}>
              {[["500+", "Học viên đã học"], ["92%", "Đạt mục tiêu nghề nghiệp"], ["10+", "Khóa chuyên ngành"], ["AI", "Công nghệ học tập"]].map(([n, l]) => (
                <div key={l} style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: C.serif, fontSize: 24, fontWeight: 800, color: C.gold, whiteSpace: "nowrap" }}>{n}</div>
                  <div style={{ fontSize: 10.5, color: "rgba(255,255,255,.5)", textTransform: "uppercase",
                    letterSpacing: .5, whiteSpace: "nowrap" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div style={{ background: C.red, padding: "13px 0", overflow: "hidden" }}>
        <div style={{ display: "flex", whiteSpace: "nowrap", animation: "lpMarquee 32s linear infinite", width: "max-content" }}>
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 20,
              padding: "0 40px", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700 }}>
              {item} <span style={{ color: C.gold, fontSize: 15 }}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── PAIN POINTS ── */}
      <section style={{ padding: "72px 24px", background: C.deep }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 60, alignItems: "start" }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2,
                textTransform: "uppercase", color: C.gold, marginBottom: 14 }}>
                Bạn có thấy hình ảnh mình trong này?
              </div>
              <h2 style={{ fontFamily: C.serif, fontSize: 36, fontWeight: 800, color: "#fff",
                lineHeight: 1.2, letterSpacing: -.5, marginBottom: 20 }}>
                Những điều khiến bạn<br />
                <span style={{ color: C.red }}>trằn trọc mỗi đêm</span>
              </h2>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,.6)", lineHeight: 1.7 }}>
                Bạn có kinh nghiệm, có tư duy — nhưng rào cản ngôn ngữ đang khóa chặt
                con đường thăng tiến và cơ hội kinh doanh của bạn.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { n: "01", quote: "\"Bạn bè cùng thời đã lên quản lý, ra làm chủ — còn mình vẫn dậm chân tại chỗ vì thiếu kỹ năng giao tiếp với đối tác Trung Quốc.\"" },
                { n: "02", quote: "\"Trong cuộc họp quan trọng, mình phải qua thông dịch viên — mất đi sự chủ động và uy tín của người quản lý chuyên nghiệp.\"" },
                { n: "03", quote: "\"Mình thấy cơ hội nhập hàng, tự kinh doanh rõ ràng — nhưng bất lực vì không hiểu ngôn ngữ và văn hóa đàm phán Trung Quốc.\"" },
              ].map((p) => (
                <div key={p.n} style={{ background: C.panel, borderLeft: `3px solid ${C.red}`,
                  borderRadius: 8, padding: "20px 24px" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: C.red, marginBottom: 10 }}>
                    NỖI LO {p.n}
                  </div>
                  <div style={{ fontSize: 15, color: "rgba(255,255,255,.75)", lineHeight: 1.7, fontStyle: "italic" }}>
                    {p.quote}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── COURSES ── */}
      <section id="courses" style={{ padding: "72px 24px", background: C.black }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
            gap: 40, alignItems: "end", marginBottom: 48 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2,
                textTransform: "uppercase", color: C.gold, marginBottom: 14 }}>
                Hệ thống khóa học
              </div>
              <h2 style={{ fontFamily: C.serif, fontSize: 36, fontWeight: 800, color: "#fff",
                lineHeight: 1.2, letterSpacing: -.5 }}>
                Chọn lộ trình phù hợp với bạn
              </h2>
            </div>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,.55)", lineHeight: 1.7 }}>
              Từ học thuật đến chuyên ngành nghề nghiệp — mỗi khoá được xây dựng
              sát thực tế, dành cho người đã có nền tảng HSK 3-5.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20 }}>
            {COURSES.map((c) => (
              <div key={c.id} className="lp-course-card" style={{ background: C.panel, borderRadius: 18,
                border: `1.5px solid ${c.featured ? C.red : C.borderGold}`, overflow: "hidden",
                position: "relative", display: "flex", flexDirection: "column" }}>
                {c.featured && (
                  <span style={{ position: "absolute", top: 18, right: 18, background: C.red,
                    color: "#fff", fontSize: 9, letterSpacing: 2, padding: "4px 10px",
                    borderRadius: 2, fontWeight: 700 }}>TIÊU BIỂU</span>
                )}
                <div style={{ padding: "28px 24px 20px", borderBottom: `1px solid rgba(255,255,255,.06)` }}>
                  <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: C.gold, fontWeight: 400, marginBottom: 12 }}>{c.level}</div>
                  <div style={{ fontFamily: C.hanzi, fontSize: 34, color: "rgba(240,165,0,.45)", marginBottom: 10, lineHeight: 1 }}>{c.hanzi}</div>
                  <div style={{ fontFamily: C.serif, fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 10 }}>{c.name}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,.55)", lineHeight: 1.6 }}>{c.desc}</div>
                </div>
                <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 7, flex: 1 }}>
                    {c.features.map((f) => (
                      <li key={f} style={{ fontSize: 12.5, color: "rgba(255,255,255,.65)", display: "flex", gap: 8 }}>
                        <span style={{ color: C.gold, fontSize: 9, marginTop: 4 }}>✦</span> {f}
                      </li>
                    ))}
                  </ul>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                    <span style={{ fontFamily: C.serif, fontSize: 24, fontWeight: 700, color: C.gold }}>{c.price}đ</span>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,.45)" }}>{c.note}</span>
                  </div>
                  <button onClick={scrollToForm} className="lp-course-btn" style={{ width: "100%",
                    borderRadius: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                    padding: "12px 24px", fontSize: 14 }}>
                    Đăng ký khóa học
                  </button>
                  {COURSE_DETAIL_MAP[c.id] && (
                    <button onClick={() => navigate(`/course/${COURSE_DETAIL_MAP[c.id]}/detail`)}
                      style={{ width: "100%", background: "none", border: "none", cursor: "pointer",
                        fontFamily: "inherit", fontSize: 13, color: "rgba(255,255,255,.55)",
                        textDecoration: "underline", padding: "2px 0" }}>
                      Xem chi tiết khóa học
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INDUSTRY TRACKS ── */}
      <section style={{ padding: "72px 24px", background: C.deep }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <Pill color={C.gold}>Kiến thức chuyên sâu</Pill>
            <h2 style={{ fontFamily: C.serif, fontSize: 32, fontWeight: 800, color: "#fff", marginTop: 14, letterSpacing: -.5 }}>
              Chọn kiến thức tiếng Trung chuyên sâu
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,.55)", marginTop: 10, maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
              Các bài giảng chuyên đề đi sâu vào kiến thức chuyên môn, quy trình nghiệp vụ và tình huống ứng dụng thực tế — bổ sung cho khóa học chuyên ngành theo giáo trình.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 18 }}>
            {TRACKS.map((t) => (
              <div key={t.id} style={{ background: C.cardDark, borderRadius: 18,
                padding: "24px 24px", border: `1.5px solid ${C.borderGold}`,
                transition: "all .2s", cursor: "default" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.gold; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.borderGold; }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{t.icon}</div>
                <div style={{ fontFamily: C.hanzi, fontSize: 18, color: "rgba(240,165,0,.4)", marginBottom: 8 }}>{t.hanzi}</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{t.name}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,.55)", marginBottom: 14, lineHeight: 1.6 }}>{t.desc}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {t.tags.map((tag) => (
                    <span key={tag} style={{ fontSize: 11, background: "rgba(240,165,0,.1)",
                      border: `1px solid ${C.borderGold}`, color: C.gold, padding: "4px 10px", borderRadius: 2 }}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
            <div style={{ background: "linear-gradient(135deg, rgba(192,57,43,.15), rgba(240,165,0,.08))",
              border: `1px solid ${C.red}`, borderRadius: 18, padding: 32, display: "flex",
              flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", gap: 14 }}>
              <div style={{ fontSize: 28 }}>✦</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>Không thấy ngành của bạn?</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,.55)", lineHeight: 1.6 }}>Chúng tôi xây dựng chuyên đề theo yêu cầu — chỉ cần cho chúng tôi biết công việc của bạn.</div>
              <Btn size="sm" onClick={scrollToForm}>Tư vấn chuyên đề riêng →</Btn>
            </div>
          </div>
        </div>
      </section>

      {/* ── METHOD ── */}
      <section id="method" style={{ padding: "72px 24px", background: C.black, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: "50%", top: "50%",
          transform: "translate(-50%,-50%)", fontFamily: C.hanzi, fontSize: 400,
          color: "rgba(255,255,255,.02)", userSelect: "none" }}>學</div>
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <Pill color={C.gold}>Phương pháp 4 bước</Pill>
            <h2 style={{ fontFamily: C.serif, fontSize: 32, fontWeight: 800, marginTop: 14, color: "#fff", letterSpacing: -.5 }}>
              15 phút mỗi ngày — biến thời gian rảnh thành lợi thế
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 18 }}>
            {[
              { n: "01", icon: "🎬", title: "Video tình huống thật", desc: "Video AI mô phỏng đúng bối cảnh công việc: đàm phán xưởng, họp QC, email báo giá..." },
              { n: "02", icon: "🗣", title: "AI chấm phát âm", desc: "Shadowing từng câu, AI phân tích thanh điệu & độ lưu loát, chỉ rõ chỗ cần sửa." },
              { n: "03", icon: "🃏", title: "SRS ghi nhớ dài hạn", desc: "Hệ thống flashcard thông minh tự lên lịch ôn đúng lúc bạn sắp quên — nhớ 90% sau 3 tháng." },
              { n: "04", icon: "💼", title: "Ứng dụng ngay ngày mai", desc: "Mỗi bài kết thúc bằng template thực chiến: mẫu câu email, kịch bản đàm phán, thuật ngữ hợp đồng." },
            ].map((s) => (
              <div key={s.n} style={{ background: "rgba(255,255,255,.05)",
                border: "1px solid rgba(255,255,255,.1)", borderRadius: 18, padding: "26px 22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                  <span style={{ fontSize: 32 }}>{s.icon}</span>
                  <span style={{ fontFamily: C.serif, fontSize: 26, fontWeight: 800, color: "rgba(240,165,0,.35)" }}>{s.n}</span>
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)", lineHeight: 1.7 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CURRICULUM PREVIEW ── */}
      <section style={{ padding: "72px 24px", background: C.deep }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <Pill color={C.gold}>Xem trước nội dung</Pill>
            <h2 style={{ fontFamily: C.serif, fontSize: 30, fontWeight: 800, color: "#fff", marginTop: 14, letterSpacing: -.5 }}>
              Lộ trình mẫu: Xuất Nhập Khẩu & Logistics
            </h2>
          </div>
          {CURRICULUM.map((m, i) => (
            <div key={i} style={{ background: C.panel, borderRadius: 16,
              border: `1px solid ${C.borderGold}`, marginBottom: 12, overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", display: "flex",
                alignItems: "center", gap: 12, borderBottom: `1px solid ${C.borderGold}` }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: C.red,
                  color: "#fff", display: "flex", alignItems: "center",
                  justifyContent: "center", fontWeight: 800, fontSize: 14 }}>{i + 1}</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#fff" }}>{m.module}</div>
                {m.free && <Pill color={C.gold}>Học thử miễn phí</Pill>}
              </div>
              {m.lessons.map((l, j) => (
                <div key={j} style={{ padding: "12px 20px 12px 66px", fontSize: 14,
                  color: "rgba(255,255,255,.65)", display: "flex", alignItems: "center", gap: 10,
                  borderBottom: j < m.lessons.length - 1 ? `1px solid rgba(255,255,255,.06)` : "none" }}>
                  <span style={{ color: m.free ? C.green : "rgba(255,255,255,.35)" }}>{m.free ? "▶" : "🔒"}</span> {l}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── AI SECTION ── */}
      <section id="ai" style={{ padding: "72px 24px", background: C.black, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -40, bottom: -30, fontFamily: C.serif,
          fontSize: 260, fontWeight: 900, color: "rgba(192,57,43,.03)", lineHeight: 1, userSelect: "none" }}>AI</div>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(360px,1fr))", gap: 56, alignItems: "center", position: "relative" }}>
          <div>
            <Pill color={C.gold}>Công nghệ AI</Pill>
            <h2 style={{ fontFamily: C.serif, fontSize: 30, fontWeight: 800, color: "#fff", marginTop: 14, marginBottom: 16, letterSpacing: -.5 }}>
              Học cùng AI Partner thông minh
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,.6)", lineHeight: 1.7, marginBottom: 28 }}>
              Không chỉ là phần mềm — AI được huấn luyện đặc biệt cho ngữ cảnh thương mại Việt–Trung, giúp bạn luyện tập mọi lúc mọi nơi.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {AI_FEATURES.map((f) => (
                <div key={f.title} style={{ background: C.panel, border: `1px solid ${C.borderGold}`,
                  padding: "20px 22px", borderRadius: 14, display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ fontSize: 22 }}>{f.icon}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#fff", marginBottom: 4 }}>{f.title}</div>
                    <div style={{ fontSize: 12.5, color: "rgba(255,255,255,.55)", lineHeight: 1.6 }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: C.panel, border: `1px solid ${C.borderGold}`, borderRadius: 16, padding: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${C.borderGold}` }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#febc2e", display: "inline-block" }} />
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
              <span style={{ marginLeft: 8, fontSize: 12, color: "rgba(255,255,255,.5)" }}>AI Practice Partner — Phiên luyện tập</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ alignSelf: "flex-end", maxWidth: "80%", background: C.red, color: "#fff", padding: "10px 14px", borderRadius: 8, fontSize: 13 }}>
                你好，我想谈谈这批货物的价格。
              </div>
              <div style={{ alignSelf: "flex-start", maxWidth: "85%", background: C.cardDark, border: `1px solid ${C.borderGold}`, color: "rgba(255,255,255,.75)", padding: "10px 14px", borderRadius: 8, fontSize: 13 }}>
                您好！很高兴和您合作。目前这批货的报价是每件150元，如果量大的话，我们可以商量优惠。
              </div>
              <div style={{ alignSelf: "flex-end", maxWidth: "80%", background: C.red, color: "#fff", padding: "10px 14px", borderRadius: 8, fontSize: 13 }}>
                如果我们订购500件以上，能给什么折扣？
              </div>
              <div style={{ alignSelf: "flex-start", maxWidth: "85%", background: C.cardDark, border: `1px solid ${C.borderGold}`, color: "rgba(255,255,255,.75)", padding: "10px 14px", borderRadius: 8, fontSize: 13 }}>
                ✅ <strong>Câu rất tốt!</strong> Cấu trúc điều kiện chính xác.<br /><br />
                💡 <strong>Mẹo nâng cao:</strong> thêm "我们长期合作的诚意" để tăng sức thuyết phục.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: "72px 24px", background: C.deep }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <Pill color={C.gold}>Học viên nói gì</Pill>
            <h2 style={{ fontFamily: C.serif, fontSize: 32, fontWeight: 800, color: "#fff", marginTop: 14, letterSpacing: -.5 }}>
              Học viên đã thay đổi<br />
              <span style={{ color: C.gold }}>sự nghiệp như thế nào</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20 }}>
            {TESTIMONIALS.map((t) => (
              <div key={t.name} style={{ background: C.panel, borderRadius: 20,
                padding: "26px 24px", border: `1px solid ${C.borderGold}` }}>
                <div style={{ fontSize: 20, color: C.gold, marginBottom: 12 }}>★★★★★</div>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,.7)", lineHeight: 1.8, marginBottom: 18, fontStyle: "italic" }}>
                  "{t.text}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 21, background: `linear-gradient(135deg, ${C.red}, ${C.gold})`,
                    color: "#fff", display: "flex", alignItems: "center",
                    justifyContent: "center", fontFamily: C.hanzi, fontWeight: 700 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REGISTRATION FORM (lead capture) ── */}
      <section ref={formRef} id="cta" style={{ padding: "72px 24px",
        background: `linear-gradient(160deg, ${C.deep} 0%, #2D1B4E 100%)` }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          {!submitted ? (
            <>
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <div style={{ fontFamily: C.hanzi, fontSize: 44, color: C.gold, marginBottom: 8 }}>商</div>
                <h2 style={{ fontFamily: C.serif, fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 10 }}>
                  Nhận tư vấn lộ trình miễn phí
                </h2>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,.6)" }}>
                  Để lại thông tin — đội ngũ tư vấn sẽ gọi trong 24h,
                  phân tích trình độ & thiết kế lộ trình riêng cho ngành của bạn
                </p>
              </div>
              <div style={{ background: C.panel, border: `1px solid ${C.borderGold}`, borderRadius: 22, padding: "28px 26px" }}>
                {[
                  { k: "name", label: "Họ và tên", ph: "Nguyễn Văn A" },
                  { k: "phone", label: "Số điện thoại / Zalo", ph: "09xx xxx xxx" },
                ].map((f) => (
                  <div key={f.k} style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,.7)",
                      display: "block", marginBottom: 6 }}>{f.label} *</label>
                    <input value={form[f.k]} onChange={(e) => setForm({ ...form, [f.k]: e.target.value })}
                      placeholder={f.ph} style={{ width: "100%", padding: "12px 14px",
                        border: `1.5px solid ${C.borderGold}`, borderRadius: 11, background: C.cardDark, color: "#fff",
                        fontSize: 14, outline: "none", fontFamily: C.body,
                        boxSizing: "border-box" }} />
                  </div>
                ))}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,.7)",
                    display: "block", marginBottom: 6 }}>Khóa học quan tâm</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {COURSES.map((c) => (
                      <button key={c.id} onClick={() => setForm({ ...form, course: c.id })}
                        style={{ padding: "7px 13px", borderRadius: 9,
                          border: `1.5px solid ${form.course === c.id ? C.red : C.borderGold}`,
                          background: form.course === c.id ? C.redSoft : "transparent",
                          color: form.course === c.id ? C.red : "rgba(255,255,255,.7)",
                          fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
                <Btn size="lg" style={{ width: "100%" }} onClick={handleSubmit}>
                  Nhận tư vấn miễn phí →
                </Btn>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,.4)", textAlign: "center", marginTop: 12 }}>
                  🔒 Thông tin được bảo mật · Không spam
                </p>
              </div>
            </>
          ) : (
            <div style={{ background: C.panel, border: `1px solid ${C.borderGold}`, borderRadius: 22, padding: "44px 32px",
              textAlign: "center" }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
              <h2 style={{ fontFamily: C.serif, fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 10 }}>
                Đăng ký thành công!
              </h2>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,.6)", marginBottom: 24, lineHeight: 1.7 }}>
                Cảm ơn <strong style={{ color: "#fff" }}>{form.name}</strong>! Đội ngũ tư vấn sẽ liên hệ số{" "}
                <strong style={{ color: "#fff" }}>{form.phone}</strong> trong 24h tới.<br />
                Trong lúc chờ, bạn có thể học thử miễn phí ngay:
              </p>
              <Btn size="lg" onClick={goToStudy}>▶ Vào học thử ngay</Btn>
            </div>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#070707", padding: "56px 24px 32px", borderTop: `1px solid ${C.borderGold}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr", gap: 40, marginBottom: 32 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <span style={{ fontFamily: C.hanzi, fontSize: 24, color: C.gold }}>商</span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", lineHeight: 1.1 }}>Tiếng Trung Thương Mại</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,.5)", letterSpacing: .8 }}>
                  BUSINESS CHINESE & HSK6 WITH AI
                </div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,.5)", lineHeight: 1.7, maxWidth: 280 }}>
              Hệ thống khóa học tiếng Trung chuyên sâu — từ học thuật đến chuyên ngành nghề nghiệp, ứng dụng AI.
            </p>
          </div>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: C.gold, fontWeight: 700, marginBottom: 16 }}>Khóa học</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {COURSES.map((c) => (
                <a key={c.id} href="#courses" style={{ fontSize: 13, color: "rgba(255,255,255,.55)", textDecoration: "none" }}>{c.name}</a>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: C.gold, fontWeight: 700, marginBottom: 16 }}>Về chúng tôi</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <a href="#method" style={{ fontSize: 13, color: "rgba(255,255,255,.55)", textDecoration: "none" }}>Phương pháp</a>
              <a href="#ai" style={{ fontSize: 13, color: "rgba(255,255,255,.55)", textDecoration: "none" }}>AI Learning</a>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 1100, margin: "0 auto", paddingTop: 24, borderTop: "1px solid rgba(255,255,255,.06)",
          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.35)" }}>
            © 2025 · Tiếng Trung Thương Mại
          </div>
          <div style={{ fontFamily: C.hanzi, fontSize: 13, color: C.gold }}>学无止境</div>
        </div>
      </footer>
    </div>
  );
}
