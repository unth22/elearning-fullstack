import { useState } from "react";

// Ô nhập mật khẩu kèm icon con mắt để bật/tắt hiện chữ — dùng chung cho các
// form đăng nhập/đăng ký/đổi mật khẩu.
export default function PasswordInput({ className = "", wrapperClassName = "", style, wrapperStyle, ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={wrapperClassName} style={{ position: "relative", ...wrapperStyle }}>
      <input
        type={visible ? "text" : "password"}
        className={className}
        style={{ paddingRight: 38, boxSizing: "border-box", ...style }}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        style={{
          position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
          background: "transparent", border: "none", cursor: "pointer", padding: 4,
          display: "flex", alignItems: "center", color: "#9CA3AF",
        }}
      >
        {visible ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </div>
  );
}
