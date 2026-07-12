-- ============================================================
-- Cho phép từ vựng/ngữ pháp/câu ví dụ gắn với 1 module (bài học)
-- cụ thể trong khóa học, thay vì chỉ gắn chung course_id.
-- module_index NULL nghĩa là dùng chung toàn khóa (tương thích ngược
-- với các khóa học cũ như Công Xưởng, Thương mại điện tử).
-- Đồng thời thêm 2 bảng mới: phrases (cụm từ trong bài) và
-- dialogue_lines (câu hội thoại trong bài).
-- Cách chạy: psql -U <user> -d elearning -f 012_module_scoped_content.sql
-- ============================================================

ALTER TABLE vocabulary ADD COLUMN IF NOT EXISTS module_index INTEGER;
ALTER TABLE grammar_patterns ADD COLUMN IF NOT EXISTS module_index INTEGER;
ALTER TABLE example_sentences ADD COLUMN IF NOT EXISTS module_index INTEGER;

CREATE INDEX IF NOT EXISTS idx_vocabulary_module ON vocabulary(course_id, module_index);
CREATE INDEX IF NOT EXISTS idx_grammar_patterns_module ON grammar_patterns(course_id, module_index);
CREATE INDEX IF NOT EXISTS idx_example_sentences_module ON example_sentences(course_id, module_index);

CREATE TABLE IF NOT EXISTS phrases (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    module_index INTEGER,
    zh VARCHAR(100) NOT NULL,
    pinyin VARCHAR(150) NOT NULL,
    vi VARCHAR(300) NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_phrases_module ON phrases(course_id, module_index);

CREATE TABLE IF NOT EXISTS dialogue_lines (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    module_index INTEGER,
    dialogue_group INTEGER NOT NULL DEFAULT 1,
    speaker VARCHAR(50) NOT NULL,
    zh TEXT NOT NULL,
    pinyin TEXT NOT NULL,
    vi TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_dialogue_lines_module ON dialogue_lines(course_id, module_index);
