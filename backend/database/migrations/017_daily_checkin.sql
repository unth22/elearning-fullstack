-- ============================================================
-- Điểm danh hàng ngày để tích điểm (gamification, tách riêng khỏi
-- study_activity vốn tự ghi nhận ngầm khi học — đây là hành động
-- người dùng chủ động bấm để nhận thưởng điểm mỗi ngày).
-- Cách chạy: psql -U <user> -d elearning -f 017_daily_checkin.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS daily_checkins (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    checkin_date DATE NOT NULL,
    points INTEGER NOT NULL DEFAULT 10,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (user_id, checkin_date)
);
CREATE INDEX IF NOT EXISTS idx_daily_checkins_user_id ON daily_checkins(user_id);
