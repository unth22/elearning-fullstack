-- ============================================================
-- Gắn nhãn "Chủ đề: Kỹ thuật" cho toàn bộ từ vựng kỹ thuật hiện có
-- của khóa Tiếng Trung Công Xưởng (course_id=7), để tách thành
-- 1 mục tra cứu riêng thay vì trộn vào luyện tập hàng ngày.
-- Cách chạy: psql -U <user> -d elearning -f 007_factory_vocab_tagging.sql
-- An toàn khi chạy lại nhiều lần (idempotent).
-- ============================================================

UPDATE vocabulary
SET tags = array_append(tags, 'Chủ đề: Kỹ thuật')
WHERE course_id = 7
  AND NOT ('Chủ đề: Kỹ thuật' = ANY(tags));
