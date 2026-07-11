// Dùng đường dẫn tương đối "/api/..." — Vite proxy (vite.config.js) sẽ tự
// chuyển tiếp sang backend, không cần hardcode "http://localhost:5000".
const BASE_URL = "/api/auth";

export async function registerUser({ fullName, email, password }) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fullName, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Đăng ký thất bại.");
  return data;
}

export async function loginUser({ email, password }) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Đăng nhập thất bại.");
  return data;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function getCurrentUser() {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}

// Cập nhật lại thông tin người dùng trong localStorage sau khi sửa hồ sơ
// (đổi tên, đổi avatar) để nav hiện đúng ngay mà không cần đăng nhập lại.
export function setCurrentUser(partial) {
  const updated = { ...(getCurrentUser() || {}), ...partial };
  localStorage.setItem("user", JSON.stringify(updated));
  return updated;
}

export function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}
