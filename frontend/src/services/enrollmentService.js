import { authHeaders } from "./authService";

const BASE_URL = "/api";

export async function enrollInCourse(courseId, { startLevel, goal } = {}) {
  const res = await fetch(`${BASE_URL}/enrollments`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ courseId, startLevel, goal }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Không thể đăng ký khóa học.");
  return data;
}

export async function getMyEnrollments() {
  const res = await fetch(`${BASE_URL}/enrollments/me`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Không thể tải danh sách khóa học đã đăng ký.");
  return res.json();
}

export async function getMyLatestEnrollment() {
  const res = await fetch(`${BASE_URL}/enrollments/me/latest`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Không thể tải khóa học gần nhất.");
  return res.json();
}

export async function setEnrollmentGoal(courseId, targetDays) {
  const res = await fetch(`${BASE_URL}/enrollments/goal`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ courseId, targetDays }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Không thể lưu mục tiêu.");
  return data;
}
