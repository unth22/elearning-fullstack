-- ============================================================
-- Nội dung trang giới thiệu khóa học (mô tả, đối tượng, đầu ra,
-- lộ trình module, phương pháp học, giáo trình & tài liệu)
-- Cách chạy: psql -U <user> -d elearning -f 008_course_intro.sql
-- ============================================================

ALTER TABLE courses ADD COLUMN IF NOT EXISTS intro_content JSONB;
