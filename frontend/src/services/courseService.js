const BASE_URL = "/api";

export async function getCourses() {
  const res = await fetch(`${BASE_URL}/courses`);
  if (!res.ok) throw new Error("Không thể tải danh sách khóa học.");
  return res.json();
}

export async function getCourseById(id) {
  const res = await fetch(`${BASE_URL}/courses/${id}`);
  if (!res.ok) throw new Error("Không thể tải khóa học.");
  return res.json();
}

export async function getLessonsByCourse(courseId) {
  const res = await fetch(`${BASE_URL}/courses/${courseId}/lessons`);
  if (!res.ok) throw new Error("Không thể tải danh sách bài học.");
  return res.json();
}

export async function getVocabulary(courseId) {
  const res = await fetch(`${BASE_URL}/courses/${courseId}/vocabulary`);
  if (!res.ok) throw new Error("Không thể tải danh sách từ vựng.");
  return res.json();
}

export async function getGrammar(courseId) {
  const res = await fetch(`${BASE_URL}/courses/${courseId}/grammar`);
  if (!res.ok) throw new Error("Không thể tải danh sách ngữ pháp.");
  return res.json();
}

export async function getSentences(courseId) {
  const res = await fetch(`${BASE_URL}/courses/${courseId}/sentences`);
  if (!res.ok) throw new Error("Không thể tải danh sách câu ví dụ.");
  return res.json();
}
