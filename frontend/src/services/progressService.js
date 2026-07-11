import { authHeaders } from "./authService";

const BASE_URL = "/api";

export async function getMyProgress(courseId) {
  const res = await fetch(`${BASE_URL}/progress/me?courseId=${courseId}`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Không thể tải tiến độ học tập.");
  return res.json();
}

export async function setLessonProgress(lessonId, isCompleted) {
  const res = await fetch(`${BASE_URL}/progress`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ lessonId, isCompleted }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Không thể cập nhật tiến độ.");
  return data;
}
