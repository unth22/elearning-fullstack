-- ============================================================
-- Danh mục ngành nghề (theo thiết kế onboarding): 8 chuyên ngành
-- Cách chạy: psql -U <user> -d elearning -f 002_industry_courses.sql
-- An toàn khi chạy lại nhiều lần (idempotent).
-- ============================================================

-- Ẩn 2 khóa demo cũ không thuộc danh mục ngành nghề trong thiết kế
-- (Nội dung vẫn được giữ trong DB, chỉ không hiển thị ở danh mục.)
UPDATE courses SET is_published = false
WHERE name_zh IN ('法律', '金融商业');

-- Khóa IT đã có sẵn nội dung (12 từ vựng + ngữ pháp) — giữ nguyên,
-- chỉ đổi nhãn + thứ tự cho khớp thiết kế.
UPDATE courses
SET title = 'IT', icon = '💻', sort_order = 6, is_published = true
WHERE name_zh = '信息技术';

-- 7 ngành còn lại (chưa có nội dung học — sẽ bổ sung sau)
INSERT INTO courses (title, description, industry, icon, accent_color, name_zh, level, sort_order, is_published)
SELECT 'Logistics/XNK', 'Vận chuyển, chứng từ, thông quan, đàm phán giá', 'Logistics', '📦', '#E67E22', '物流', 'HSK 4–6', 1, true
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE name_zh = '物流');

INSERT INTO courses (title, description, industry, icon, accent_color, name_zh, level, sort_order, is_published)
SELECT 'Beauty/Spa', 'Tư vấn khách hàng, dịch vụ làm đẹp, mỹ phẩm', 'Beauty', '💄', '#E84393', '美容', 'HSK 4–6', 2, true
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE name_zh = '美容');

INSERT INTO courses (title, description, industry, icon, accent_color, name_zh, level, sort_order, is_published)
SELECT 'Sales', 'Chào hàng, đàm phán, chốt đơn với đối tác Trung Quốc', 'Sales', '💼', '#8E44AD', '销售', 'HSK 4–6', 3, true
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE name_zh = '销售');

INSERT INTO courses (title, description, industry, icon, accent_color, name_zh, level, sort_order, is_published)
SELECT 'Sản xuất', 'QC, bảo trì, làm việc với kỹ sư Trung Quốc', 'Manufacturing', '🏭', '#16A085', '生产', 'HSK 4–6', 4, true
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE name_zh = '生产');

INSERT INTO courses (title, description, industry, icon, accent_color, name_zh, level, sort_order, is_published)
SELECT 'Khách sạn', 'Lễ tân, phục vụ, giao tiếp với khách Trung Quốc', 'Hospitality', '🏨', '#D35400', '酒店', 'HSK 4–6', 5, true
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE name_zh = '酒店');

INSERT INTO courses (title, description, industry, icon, accent_color, name_zh, level, sort_order, is_published)
SELECT 'Thương mại ĐT', 'Sourcing 1688, Taobao, đàm phán với xưởng', 'E-commerce', '🛒', '#2ECC71', '电商', 'HSK 4–6', 7, true
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE name_zh = '电商');

INSERT INTO courses (title, description, industry, icon, accent_color, name_zh, level, sort_order, is_published)
SELECT 'Khác', 'Từ vựng thương mại tổng hợp, dùng chung nhiều ngành', 'General', '📊', '#34495E', '其他', 'HSK 4–6', 8, true
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE name_zh = '其他');
