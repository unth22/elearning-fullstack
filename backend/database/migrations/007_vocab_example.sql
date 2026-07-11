-- ============================================================
-- Câu ví dụ riêng cho từng từ vựng (hiển thị dưới thẻ flashcard)
-- Cách chạy: psql -U <user> -d elearning -f 007_vocab_example.sql
-- ============================================================

ALTER TABLE vocabulary ADD COLUMN IF NOT EXISTS example_zh TEXT;
ALTER TABLE vocabulary ADD COLUMN IF NOT EXISTS example_pinyin TEXT;
ALTER TABLE vocabulary ADD COLUMN IF NOT EXISTS example_vi TEXT;
