-- ============================================================
-- Tiến độ học theo từng bước của module (Bài giảng, Trắc nghiệm,
-- Flashcard, Cụm từ, Ngữ pháp, Câu hội thoại, Nghe chép, Shadowing).
-- Trước đây chỉ lưu tạm ở client (mất khi tải lại trang) — giờ lưu
-- thật để Dashboard hiển thị lộ trình chính xác.
-- Cách chạy: psql -U <user> -d elearning -f 010_module_progress.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS module_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  module_index INTEGER NOT NULL,
  step_id VARCHAR(30) NOT NULL,
  completed_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (user_id, course_id, module_index, step_id)
);

CREATE INDEX IF NOT EXISTS idx_module_progress_user_course
  ON module_progress(user_id, course_id);
