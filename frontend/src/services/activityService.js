import { authHeaders } from "./authService";

const BASE_URL = "/api";

export async function getMyActivity() {
  const res = await fetch(`${BASE_URL}/activity/me`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Không thể tải hoạt động học tập.");
  return res.json();
}
