-- ============================================================
-- Mở rộng schema: giao diện học tập (flashcard/quiz/hanzi/...)
-- Cách chạy: psql -U <user> -d elearning -f 002_course_content.sql
-- ============================================================

ALTER TABLE courses ADD COLUMN IF NOT EXISTS icon VARCHAR(10);
ALTER TABLE courses ADD COLUMN IF NOT EXISTS accent_color VARCHAR(20);
ALTER TABLE courses ADD COLUMN IF NOT EXISTS name_zh VARCHAR(100);
ALTER TABLE courses ADD COLUMN IF NOT EXISTS level VARCHAR(50);


CREATE TABLE IF NOT EXISTS vocabulary (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    zh VARCHAR(50) NOT NULL,
    pinyin VARCHAR(100) NOT NULL,
    vi VARCHAR(200) NOT NULL,
    en VARCHAR(200),
    tags TEXT[] DEFAULT '{}',
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_vocabulary_course_id ON vocabulary(course_id);


CREATE TABLE IF NOT EXISTS grammar_patterns (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    pattern VARCHAR(200) NOT NULL,
    example_zh TEXT NOT NULL,
    example_vi TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_grammar_patterns_course_id ON grammar_patterns(course_id);


CREATE TABLE IF NOT EXISTS example_sentences (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    zh TEXT NOT NULL,
    pinyin TEXT NOT NULL,
    vi TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_example_sentences_course_id ON example_sentences(course_id);
