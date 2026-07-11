import { authHeaders } from "./authService";

const BASE_URL = "/api";

export async function getDueCards(courseId) {
  const res = await fetch(`${BASE_URL}/srs/due?courseId=${courseId}`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Không thể tải thẻ cần ôn.");
  return res.json();
}

export async function getSrsStats(courseId) {
  const res = await fetch(`${BASE_URL}/srs/stats?courseId=${courseId}`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Không thể tải thống kê ôn tập.");
  return res.json();
}

export async function rateCard(vocabularyId, rating) {
  const res = await fetch(`${BASE_URL}/srs/rate`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ vocabularyId, rating }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Không thể lưu kết quả ôn tập.");
  return data;
}
