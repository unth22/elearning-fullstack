import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../services/authService";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Mật khẩu nhập lại không khớp.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword({ token, password });
      setDone(true);
      setTimeout(() => navigate("/login"), 2000);
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
          {!token ? (
            <>
              <h1 className="font-serif text-xl font-semibold text-muc-dem mb-1">Link không hợp lệ</h1>
              <p className="text-sm text-black/60 leading-relaxed mb-6">
                Link đặt lại mật khẩu bị thiếu hoặc không hợp lệ. Hãy yêu cầu gửi lại link mới.
              </p>
              <Link to="/forgot-password" className="block w-full text-center bg-do-han hover:bg-[#a53024] text-white font-medium py-2.5 rounded-md transition-colors no-underline">
                Yêu cầu link mới
              </Link>
            </>
          ) : done ? (
            <>
              <h1 className="font-serif text-xl font-semibold text-muc-dem mb-1">Thành công!</h1>
              <p className="text-sm text-black/60 leading-relaxed">
                Mật khẩu đã được đặt lại. Đang chuyển tới trang đăng nhập...
              </p>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <h1 className="font-serif text-xl font-semibold text-muc-dem mb-1">Đặt lại mật khẩu</h1>
              <p className="text-sm text-black/50 mb-6">
                Nhập mật khẩu mới cho tài khoản của bạn.
              </p>

              {error && (
                <p className="text-sm text-do-han bg-do-han/10 rounded-md px-3 py-2 mb-4">{error}</p>
              )}

              <label className="block text-sm text-black/70 mb-1">Mật khẩu mới</label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                className="w-full border border-black/10 rounded-md px-3 py-2 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-do-han/30"
              />

              <label className="block text-sm text-black/70 mb-1">Nhập lại mật khẩu mới</label>
              <input
                type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={6}
                className="w-full border border-black/10 rounded-md px-3 py-2 mb-6 text-sm focus:outline-none focus:ring-2 focus:ring-do-han/30"
              />

              <button
                type="submit" disabled={loading}
                className="w-full bg-do-han hover:bg-[#a53024] text-white font-medium py-2.5 rounded-md transition-colors disabled:opacity-60"
              >
                {loading ? "Đang lưu..." : "Đặt lại mật khẩu"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
