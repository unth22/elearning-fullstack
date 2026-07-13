import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import { getMyLatestEnrollment } from "../services/enrollmentService";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { user, token } = await loginUser(form);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      const enrollment = await getMyLatestEnrollment().catch(() => null);
      navigate(enrollment ? "/dashboard" : "/courses");
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
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white border border-black/5 rounded-xl p-6">
        <h1 className="font-serif text-xl font-semibold text-muc-dem mb-1">Đăng nhập</h1>
        <p className="text-sm text-black/50 mb-6">
          Tiếp tục lộ trình tiếng Trung thương mại của bạn.
        </p>

        {error && (
          <p className="text-sm text-do-han bg-do-han/10 rounded-md px-3 py-2 mb-4">{error}</p>
        )}

        <label className="block text-sm text-black/70 mb-1">Email</label>
        <input
          type="email" name="email" value={form.email} onChange={handleChange} required
          className="w-full border border-black/10 rounded-md px-3 py-2 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-do-han/30"
        />

        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm text-black/70">Mật khẩu</label>
          <Link to="/forgot-password" className="text-xs text-do-han font-medium">Quên mật khẩu?</Link>
        </div>
        <input
          type="password" name="password" value={form.password} onChange={handleChange} required
          className="w-full border border-black/10 rounded-md px-3 py-2 mb-6 text-sm focus:outline-none focus:ring-2 focus:ring-do-han/30"
        />

        <button
          type="submit" disabled={loading}
          className="w-full bg-do-han hover:bg-[#a53024] text-white font-medium py-2.5 rounded-md transition-colors disabled:opacity-60"
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>

        <p className="text-sm text-black/50 text-center mt-4">
          Chưa có tài khoản? <Link to="/register" className="text-do-han font-medium">Đăng ký</Link>
        </p>
      </form>
      </div>
    </div>
  );
}
