-- ============================================================
-- Cho phép đặt lại mật khẩu qua link gửi email — lưu token tạm
-- thời (1 giờ) trực tiếp trên bảng users, đơn giản hơn 1 bảng
-- riêng vì mỗi user chỉ cần 1 yêu cầu đặt lại hiệu lực tại 1 thời điểm.
-- Cách chạy: psql -U postgres -d elearning -f 020_password_reset.sql
-- ============================================================

ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token_expires TIMESTAMP;
