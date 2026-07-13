-- ============================================================
-- Thêm pinyin + nghĩa tiếng Việt cho câu hỏi & đáp án trắc nghiệm
-- đọc hiểu, cùng phần giải thích lí do đáp án đúng — tất cả chỉ
-- hiện ra SAU khi học viên đã chọn đáp án (ẩn trước đó).
-- Cách chạy: psql -U postgres -d elearning -f 019_comprehension_pinyin_vi_explanation.sql
-- ============================================================

ALTER TABLE comprehension_questions ADD COLUMN IF NOT EXISTS question_pinyin TEXT;
ALTER TABLE comprehension_questions ADD COLUMN IF NOT EXISTS question_vi TEXT;
ALTER TABLE comprehension_questions ADD COLUMN IF NOT EXISTS option_pinyin TEXT[];
ALTER TABLE comprehension_questions ADD COLUMN IF NOT EXISTS option_vi TEXT[];
ALTER TABLE comprehension_questions ADD COLUMN IF NOT EXISTS explanation TEXT;
