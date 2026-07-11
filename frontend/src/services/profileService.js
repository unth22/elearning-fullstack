import { authHeaders } from "./authService";

const BASE_URL = "/api";

export async function getMyProfile() {
  const res = await fetch(`${BASE_URL}/profile/me`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Không thể tải hồ sơ.");
  return res.json();
}

export async function updateMyProfile({ fullName }) {
  const res = await fetch(`${BASE_URL}/profile/me`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ fullName }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Không thể cập nhật hồ sơ.");
  return data;
}

export async function uploadAvatar(file) {
  const formData = new FormData();
  formData.append("avatar", file);
  const res = await fetch(`${BASE_URL}/profile/avatar`, {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Không thể tải ảnh đại diện lên.");
  return data;
}

export async function changeMyPassword(currentPassword, newPassword) {
  const res = await fetch(`${BASE_URL}/profile/password`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Không thể đổi mật khẩu.");
  return data;
}
