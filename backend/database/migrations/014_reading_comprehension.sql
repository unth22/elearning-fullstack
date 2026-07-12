-- ============================================================
-- Phần "đọc hiểu": bài khóa (đoạn văn) + trắc nghiệm câu hỏi
-- liên quan đến nội dung bài khóa đó, gắn theo module_index
-- (khác với QuizMode cũ vốn chỉ đoán nghĩa từ vựng rời rạc).
-- Cách chạy: psql -U <user> -d elearning -f 014_reading_comprehension.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS reading_passages (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    module_index INTEGER,
    title VARCHAR(200) NOT NULL,
    content_zh TEXT NOT NULL,
    content_pinyin TEXT,
    content_vi TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_reading_passages_module ON reading_passages(course_id, module_index);

CREATE TABLE IF NOT EXISTS comprehension_questions (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    module_index INTEGER,
    question TEXT NOT NULL,
    options TEXT[] NOT NULL,
    correct_index INTEGER NOT NULL DEFAULT 0,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_comprehension_questions_module ON comprehension_questions(course_id, module_index);
