-- ============================================================
-- Mục tiêu hoàn thành khóa học do học viên tự đặt: hoàn thành trong
-- bao nhiêu ngày, tính từ lúc đặt mục tiêu (goal_set_at), để hiển thị
-- đếm ngược + thanh tiến độ trên Dashboard.
-- Cách chạy: psql -U <user> -d elearning -f 011_enrollment_goal.sql
-- ============================================================

ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS target_days INTEGER;
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS goal_set_at TIMESTAMP;
