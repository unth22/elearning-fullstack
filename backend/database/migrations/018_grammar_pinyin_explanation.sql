-- ============================================================
-- Thêm pinyin + giải thích chi tiết cho ngữ pháp (dễ hiểu hơn cho
-- người mới học, thay vì chỉ có mẫu câu suông).
-- Cách chạy: psql -U <user> -d elearning -f 018_grammar_pinyin_explanation.sql
-- ============================================================

ALTER TABLE grammar_patterns ADD COLUMN IF NOT EXISTS pinyin TEXT;
ALTER TABLE grammar_patterns ADD COLUMN IF NOT EXISTS explanation TEXT;
