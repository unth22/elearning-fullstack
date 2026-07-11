import { authHeaders } from "./authService";

const BASE_URL = "/api";

export async function getMyNotifications() {
  const res = await fetch(`${BASE_URL}/notifications/me`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Không thể tải thông báo.");
  return res.json();
}

export async function markNotificationRead(id) {
  const res = await fetch(`${BASE_URL}/notifications/${id}/read`, {
    method: "PUT",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Không thể cập nhật thông báo.");
  return res.json();
}

export async function markAllNotificationsRead() {
  const res = await fetch(`${BASE_URL}/notifications/me/read-all`, {
    method: "PUT",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Không thể cập nhật thông báo.");
  return res.json();
}
