import { authHeaders } from "./authService";

const BASE_URL = "/api";

export async function getMyCheckin() {
  const res = await fetch(`${BASE_URL}/checkin/me`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Không thể tải dữ liệu điểm danh.");
  return res.json();
}

export async function postCheckin() {
  const res = await fetch(`${BASE_URL}/checkin/me`, { method: "POST", headers: authHeaders() });
  if (!res.ok) throw new Error("Không thể điểm danh.");
  return res.json();
}
