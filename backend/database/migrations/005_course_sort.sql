-- ============================================================
-- Thêm thứ tự hiển thị cho khóa học (để danh mục ngành nghề đúng thứ tự thiết kế)
-- Cách chạy: psql -U <user> -d elearning -f 005_course_sort.sql
-- ============================================================

ALTER TABLE courses ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;
