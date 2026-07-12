-- ============================================================
-- Gộp 55 module (1 module/bài) của khóa "Nền Tảng HSK1-3" thành
-- 11 module (5 bài/module): module 1 = bài 1-5, module 2 = bài 6-10,
-- ... module 11 = bài 51-55 (Quyển I 30 bài -> 6 module, Quyển II
-- 25 bài -> 5 module). CHỈ chạy được MỘT LẦN trên dữ liệu 55-module
-- gốc (seed 010 + 013) — không idempotent, vì phép chia module_index/5
-- không thể đảo ngược lại nếu chạy lần hai.
-- Cách chạy: psql -U <user> -d elearning -f 016_hsk_regroup_5_lessons.sql
-- ============================================================

BEGIN;

-- 1) Gộp module_index (0-54 -> 0-10) và đánh lại order_index liên tục
--    theo đúng thứ tự bài gốc trong từng module mới, cho từng bảng nội dung.
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY['vocabulary', 'grammar_patterns', 'example_sentences', 'phrases', 'dialogue_lines']
  LOOP
    EXECUTE format($f$
      WITH renumbered AS (
        SELECT id,
          (module_index / 5) AS new_module_index,
          ROW_NUMBER() OVER (PARTITION BY (module_index / 5) ORDER BY module_index, order_index, id) - 1 AS new_order_index
        FROM %I
        WHERE course_id = 12 AND module_index IS NOT NULL
      )
      UPDATE %I t SET module_index = r.new_module_index, order_index = r.new_order_index
      FROM renumbered r WHERE t.id = r.id
    $f$, tbl, tbl);
  END LOOP;
END $$;

-- 1b) module_progress cũng gộp theo — xóa bản ghi trùng trước (2 bài cũ có thể
--     rơi vào cùng 1 module mới với cùng step_id) rồi mới đổi module_index,
--     để không vi phạm UNIQUE(user_id, course_id, module_index, step_id).
WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (
    PARTITION BY user_id, course_id, (module_index / 5), step_id
    ORDER BY completed_at
  ) AS rn
  FROM module_progress WHERE course_id = 12
)
DELETE FROM module_progress WHERE id IN (SELECT id FROM ranked WHERE rn > 1);

UPDATE module_progress SET module_index = module_index / 5 WHERE course_id = 12;

-- 2) Thay intro_content.modules bằng 11 module gộp (tiêu đề tổng hợp 5 bài/module)
UPDATE courses
SET intro_content = jsonb_set(intro_content, '{modules}', $json$
[
  { "title": "Module 1", "subtitle": "Quyển I - Bài 1-5: Chào hỏi và giới thiệu bản thân", "topics": ["Xin chào (你好)", "Bạn là người nước nào (你是哪国人)", "Bạn tên là gì (你叫什么名字)", "Bạn có học tiếng Pháp không (你学习法语吗)", "Nhà bạn có mấy người (你家有几口人)"] },
  { "title": "Module 2", "subtitle": "Quyển I - Bài 6-10: Mua sắm, ngân hàng và thời gian", "topics": ["Chuối bao nhiêu tiền một cân (香蕉多少钱一斤)", "Ngân hàng Trung Quốc ở đâu (中国银行在哪儿)", "Hôm nay ngày mấy (今天几号)", "Hôm nay bạn có kế hoạch gì (你今天有什么安排)", "Chủ nhật này bạn có bận không (这个星期天你忙不忙)"] },
  { "title": "Module 3", "subtitle": "Quyển I - Bài 11-15: Ăn uống, nhà ở và công việc làm thêm", "topics": ["Tôi ăn ở căng-tin trường (我在学校食堂吃饭)", "Bạn muốn trà hay cà phê (你要茶还是咖啡)", "Tôi chuyển nhà rồi (我已经搬家了)", "Tôi đã mua một cái áo len (我买了一件毛衣)", "Sinh viên có thể đi làm thêm không (大学生可以打工吗)"] },
  { "title": "Module 4", "subtitle": "Quyển I - Bài 16-20: Quà tặng, học tập và cuộc sống hằng ngày", "topics": ["Tôi muốn tặng anh ấy một món quà (我想送他一件礼物)", "Nói và nghe của tôi đều tốt (我口语和听力都很好)", "Tôi lên mạng bốn tiếng (我上了四个小时的网)", "Lò sưởi vẫn chưa sửa xong (暖气还没有修好)", "Đồ ăn nhanh có thể giao tận nhà (快餐可以送到家里)"] },
  { "title": "Module 5", "subtitle": "Quyển I - Bài 21-25: Đồ vật, thời tiết và cảm xúc", "topics": ["Tôi đã đặt túi lên bàn (我把袋子放在桌子上了)", "Xe đạp của tôi màu đỏ (我的自行车是红色的)", "Mùa đông năm nay lạnh hơn (今年冬天变冷了)", "Mẹ gửi quà cho tôi (妈妈给我寄来了礼物)", "Tôi không hiểu họ nói gì (我听不懂他们说的话)"] },
  { "title": "Module 6", "subtitle": "Quyển I - Bài 26-30: Lễ hội, giải trí và trải nghiệm cá nhân", "topics": ["Giáng sinh sắp đến (圣诞节快到了)", "Tôi đang xem TV (我正在看电视呢)", "Vạn Lý Trường Thành dài hơn 8850km (长城有八千八百五十多公里)", "Buổi tiệc rất thành công (晚会开得非常成功)", "Tôi từng là giáo viên tiếng Anh (我当过英语老师)"] },
  { "title": "Module 7", "subtitle": "Quyển II - Bài 1-5: Hòa nhập văn hóa và cuộc sống mới", "topics": ["Nhập gia tùy tục (入乡随俗)", "Con trai muốn về nhà (儿子要回家)", "Cô gái bán ớt (卖辣椒的女孩儿)", "Tôi có một cuộc hẹn với Trung Quốc (我和中国有个约会)", "Vì sao tôi đứng ăn một mình (为什么我一个人站着吃)"] },
  { "title": "Module 8", "subtitle": "Quyển II - Bài 6-10: Cuộc sống, ước mơ và hạnh phúc", "topics": ["Mọi thứ ở đây đều ổn (我这里一切都好)", "Tôi sẽ đi Ai Cập (我要去埃及)", "Giấc mơ cũ (旧梦)", "Giáo dục tình yêu thương (爱的教育)", "Hạnh phúc thực ra rất đơn giản (快乐，其实很简单)"] },
  { "title": "Module 9", "subtitle": "Quyển II - Bài 11-15: Những câu chuyện đáng suy ngẫm", "topics": ["Con kiến trong sách (书本里的蚂蚁)", "Là “gối”, không phải “đầu kim” (是“枕头”，不是“针头”)", "Lá thư từ Trung Quốc đã thay đổi cuộc đời tôi (中国来信改变了我的生活)", "Lần đầu đi taxi (第一次打的)", "Chim bồ câu đưa thư bay về (飞回来的信鸽)"] },
  { "title": "Module 10", "subtitle": "Quyển II - Bài 16-20: Hẹn hò, giao tiếp và kết bạn", "topics": ["Vặn đồng hồ nhanh ba phút (把表拨快三分钟)", "Cuộc hẹn (约会)", "Nghe phim (听电影)", "Bạn qua thư (笔友)", "Nhân cách bậc nhất (第一人格)"] },
  { "title": "Module 11", "subtitle": "Quyển II - Bài 21-25: Ý chí, lối sống và trải nghiệm", "topics": ["Ngu Công dời núi (愚公移山)", "Thẻ (卡)", "Cuộc sống “ít carbon” của tôi (我的“低碳生活”)", "Cha con và Trường Thành (父子长城)", "Đi nhờ xe đến Berlin (搭车去柏林)"] }
]
$json$::jsonb)
WHERE id = 12;

COMMIT;
