import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authService";
import PasswordInput from "../components/PasswordInput";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
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
      const { user, token } = await registerUser(form);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/courses");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] px-5">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white border border-black/5 rounded-xl p-6">
        <h1 className="font-serif text-xl font-semibold text-muc-dem mb-1">Tạo tài khoản</h1>
        <p className="text-sm text-black/50 mb-6">Bắt đầu học thử miễn phí ngay hôm nay.</p>

        {error && (
          <p className="text-sm text-do-han bg-do-han/10 rounded-md px-3 py-2 mb-4">{error}</p>
        )}

        <label className="block text-sm text-black/70 mb-1">Họ và tên</label>
        <input
          type="text" name="fullName" value={form.fullName} onChange={handleChange} required
          className="w-full border border-black/10 rounded-md px-3 py-2 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-do-han/30"
        />

        <label className="block text-sm text-black/70 mb-1">Email</label>
        <input
          type="email" name="email" value={form.email} onChange={handleChange} required
          className="w-full border border-black/10 rounded-md px-3 py-2 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-do-han/30"
        />

        <label className="block text-sm text-black/70 mb-1">Mật khẩu</label>
        <PasswordInput
          name="password" value={form.password} onChange={handleChange} required minLength={6}
          wrapperClassName="mb-6"
          className="w-full border border-black/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-do-han/30"
        />

        <button
          type="submit" disabled={loading}
          className="w-full bg-do-han hover:bg-[#a53024] text-white font-medium py-2.5 rounded-md transition-colors disabled:opacity-60"
        >
          {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
        </button>

        <p className="text-sm text-black/50 text-center mt-4">
          Đã có tài khoản? <Link to="/login" className="text-do-han font-medium">Đăng nhập</Link>
        </p>
      </form>
    </div>
  );
}
