-- ============================================================
-- Onboarding: lưu trình độ hiện tại + mục tiêu của học viên khi đăng ký khóa học
-- Cách chạy: psql -U <user> -d elearning -f 004_onboarding.sql
-- ============================================================

ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS start_level VARCHAR(50);
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS goal VARCHAR(100);
