import { authHeaders } from "./authService";

const BASE_URL = "/api";

export async function getNotesByCourse(courseId) {
  const res = await fetch(`${BASE_URL}/notes/me/${courseId}`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Không thể tải ghi chú.");
  return res.json();
}

export async function createNote({ courseId, selectedText, note, color }) {
  const res = await fetch(`${BASE_URL}/notes/me`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ courseId, selectedText, note, color }),
  });
  if (!res.ok) throw new Error("Không thể lưu ghi chú.");
  return res.json();
}

export async function deleteNote(id) {
  const res = await fetch(`${BASE_URL}/notes/${id}`, { method: "DELETE", headers: authHeaders() });
  if (!res.ok) throw new Error("Không thể xóa ghi chú.");
  return res.json();
}
