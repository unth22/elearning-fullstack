// Design tokens dùng chung cho Landing/Dashboard/SRS — tách từ file gốc
// "TiengTrungThuongMai_Website Landing Page.jsx" để tái sử dụng nhiều trang.
export const C = {
  red: "#C0392B",
  redSoft: "#FDECEA",
  redBright: "#E74C3C",
  ink: "#1A1A2E",
  inkMid: "#232345",
  gold: "#F7C948",
  goldSoft: "#FFF8E1",
  blue: "#2E86AB",
  blueSoft: "#EBF5FB",
  green: "#27AE60",
  greenSoft: "#EAFAF1",
  bg: "#F7F7FA",
  card: "#FFFFFF",
  border: "#E5E5EC",
  t1: "#1A1A2E",
  t2: "#44445A",
  t3: "#8E8E9C",
  hanzi: "'Noto Serif SC','STSong',serif",
  body: "'Inter',system-ui,sans-serif",
  // Dark theme (Landing page — deep black + red/gold, Playfair Display headlines)
  serif: "'Playfair Display',serif",
  black: "#0A0A0A",
  deep: "#111114",
  panel: "#18181C",
  cardDark: "#1E1E23",
  borderGold: "rgba(240,165,0,0.15)",
};

export const Pill = ({ children, color = C.red, style: sx }) => (
  <span style={{ background: color + "18", color, borderRadius: 99,
    padding: "3px 12px", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap",
    display: "inline-block", ...sx }}>{children}</span>
);

export const Btn = ({ children, onClick, variant = "primary", size = "md", style: sx, disabled }) => {
  const variants = {
    primary: { background: C.red, color: "#fff" },
    gold: { background: C.gold, color: "#fff" },
    ghost: { background: "transparent", color: C.t2, border: `1.5px solid ${C.border}` },
    dark: { background: C.ink, color: "#fff" },
    white: { background: "#fff", color: C.red },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      border: "none", borderRadius: 12, fontWeight: 700, cursor: disabled ? "default" : "pointer",
      opacity: disabled ? 0.6 : 1,
      fontFamily: "inherit", transition: "transform .12s, opacity .15s",
      padding: size === "lg" ? "16px 32px" : size === "sm" ? "8px 16px" : "12px 24px",
      fontSize: size === "lg" ? 16 : size === "sm" ? 13 : 14,
      ...variants[variant], ...sx }}
      onMouseEnter={(e) => !disabled && (e.currentTarget.style.transform = "translateY(-1px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "")}>
      {children}
    </button>
  );
};

export const PBar = ({ value, max = 100, color = C.red, h = 6 }) => (
  <div style={{ background: C.border, borderRadius: 99, height: h, overflow: "hidden" }}>
    <div style={{ width: `${max > 0 ? Math.min(100, (value / max) * 100) : 0}%`, height: "100%",
      background: color, borderRadius: 99, transition: "width .4s" }} />
  </div>
);

export function speak(text, rate = 0.85) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "zh-CN";
  u.rate = rate;
  const v = window.speechSynthesis.getVoices().find((v) => v.lang.startsWith("zh"));
  if (v) u.voice = v;
  window.speechSynthesis.speak(u);
}
