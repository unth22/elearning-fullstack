import { authHeaders } from "./authService";

const BASE_URL = "/api";

export async function getModuleProgress(courseId) {
  const res = await fetch(`${BASE_URL}/module-progress/me/${courseId}`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Không thể tải tiến độ học.");
  return res.json();
}

export async function markModuleStep(courseId, moduleIndex, stepId) {
  const res = await fetch(`${BASE_URL}/module-progress/me`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ courseId, moduleIndex, stepId }),
  });
  if (!res.ok) throw new Error("Không thể lưu tiến độ học.");
  return res.json();
}
