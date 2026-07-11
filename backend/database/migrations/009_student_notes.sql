-- ============================================================
-- Ghi chú & highlight của học viên trong trang học (sticker note).
-- 1 bản ghi có thể là highlight thuần (note NULL) hoặc ghi chú có
-- kèm đoạn text đã chọn (selected_text + note).
-- Cách chạy: psql -U <user> -d elearning -f 009_student_notes.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS student_notes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  selected_text TEXT NOT NULL,
  note TEXT,
  color VARCHAR(20) NOT NULL DEFAULT 'yellow',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_student_notes_user_course
  ON student_notes(user_id, course_id);
