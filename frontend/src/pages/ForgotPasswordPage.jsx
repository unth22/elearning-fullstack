import React, { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/authService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8]">
      <Link to="/" className="px-6 py-4 flex items-center gap-2 no-underline">
        <span style={{ fontFamily: "'Noto Serif SC', serif", color: "#F7C948", fontSize: 26, lineHeight: 1 }}>商</span>
        <div>
          <div className="font-bold text-sm text-muc-dem leading-tight">Tiếng Trung Thương Mại</div>
          <div className="text-[9px] text-black/40 tracking-wide">BUSINESS CHINESE &amp; HSK6 WITH AI</div>
        </div>
      </Link>
      <div className="flex-1 flex items-center justify-center px-5 pb-16">
        <div className="w-full max-w-sm bg-white border border-black/5 rounded-xl p-6">
          {sent ? (
            <>
              <h1 className="font-serif text-xl font-semibold text-muc-dem mb-1">Kiểm tra email</h1>
              <p className="text-sm text-black/60 leading-relaxed mb-6">
                Nếu email <span className="font-medium text-muc-dem">{email}</span> đã đăng ký, chúng tôi đã gửi link đặt lại mật khẩu tới hộp thư của bạn. Link có hiệu lực trong 1 giờ.
              </p>
              <Link to="/login" className="block w-full text-center bg-do-han hover:bg-[#a53024] text-white font-medium py-2.5 rounded-md transition-colors no-underline">
                Về trang đăng nhập
              </Link>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <h1 className="font-serif text-xl font-semibold text-muc-dem mb-1">Quên mật khẩu?</h1>
              <p className="text-sm text-black/50 mb-6">
                Nhập email đã đăng ký, chúng tôi sẽ gửi link để bạn đặt lại mật khẩu.
              </p>

              {error && (
                <p className="text-sm text-do-han bg-do-han/10 rounded-md px-3 py-2 mb-4">{error}</p>
              )}

              <label className="block text-sm text-black/70 mb-1">Email</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full border border-black/10 rounded-md px-3 py-2 mb-6 text-sm focus:outline-none focus:ring-2 focus:ring-do-han/30"
              />

              <button
                type="submit" disabled={loading}
                className="w-full bg-do-han hover:bg-[#a53024] text-white font-medium py-2.5 rounded-md transition-colors disabled:opacity-60"
              >
                {loading ? "Đang gửi..." : "Gửi link đặt lại"}
              </button>

              <p className="text-sm text-black/50 text-center mt-4">
                <Link to="/login" className="text-do-han font-medium">← Về trang đăng nhập</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
