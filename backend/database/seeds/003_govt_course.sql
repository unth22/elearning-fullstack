-- ============================================================
-- 1) Hiện lại 2 khóa demo cũ (Luật & Pháp lý, Kinh doanh & Tài chính)
-- 2) Thêm khóa "Công an & Cán bộ nhà nước" + nội dung demo (từ vựng/ngữ pháp/câu/bài học)
-- Cách chạy: psql -U <user> -d elearning -f 003_govt_course.sql   (idempotent)
-- ============================================================

-- --- 1) Hiện lại 2 khóa cũ, sắp thứ tự sau các ngành ---
UPDATE courses SET is_published = true, sort_order = 9  WHERE name_zh = '金融商业';  -- Kinh doanh & Tài chính
UPDATE courses SET is_published = true, sort_order = 10 WHERE name_zh = '法律';       -- Luật & Pháp lý
UPDATE courses SET sort_order = 20 WHERE name_zh = '其他';                            -- "Khác" xuống cuối

-- --- 2) Khóa mới: Công an & Cán bộ nhà nước ---
INSERT INTO courses (title, description, industry, icon, accent_color, name_zh, level, sort_order, is_published)
SELECT 'Công an & Cán bộ NN', 'Hành chính, xuất nhập cảnh, thực thi pháp luật', 'Government', '👮', '#2C3E50', '公安', 'HSK 4–6', 11, true
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE name_zh = '公安');

-- ---- Từ vựng (12 từ, chia theo chủ đề qua tags) ----
INSERT INTO vocabulary (course_id, zh, pinyin, vi, en, tags, order_index)
SELECT (SELECT id FROM courses WHERE name_zh='公安'), t.zh, t.pinyin, t.vi, t.en, t.tags, t.ord
FROM (VALUES
  ('公安局',  'gōng''ānjú',   'sở công an',              'police bureau',        ARRAY['cảnh sát'],       1),
  ('警察',    'jǐngchá',      'cảnh sát',                'police officer',       ARRAY['cảnh sát'],       2),
  ('治安',    'zhì''ān',      'trị an',                  'public order',         ARRAY['nghiệp vụ'],      3),
  ('执法',    'zhífǎ',        'thực thi pháp luật',      'law enforcement',      ARRAY['nghiệp vụ'],      4),
  ('举报',    'jǔbào',        'tố giác',                 'report a crime',       ARRAY['nghiệp vụ'],      5),
  ('户口',    'hùkǒu',        'hộ khẩu',                 'household registration', ARRAY['hành chính'],   6),
  ('身份证',  'shēnfènzhèng', 'chứng minh thư / CCCD',   'ID card',              ARRAY['hành chính'],     7),
  ('审批',    'shěnpī',       'phê duyệt',               'approval',             ARRAY['hành chính'],     8),
  ('行政',    'xíngzhèng',    'hành chính',              'administration',       ARRAY['hành chính'],     9),
  ('公务员',  'gōngwùyuán',   'công chức',               'civil servant',        ARRAY['cán bộ'],        10),
  ('签证',    'qiānzhèng',    'thị thực (visa)',         'visa',                 ARRAY['xuất nhập cảnh'], 11),
  ('出入境',  'chūrùjìng',    'xuất nhập cảnh',          'immigration',          ARRAY['xuất nhập cảnh'], 12)
) AS t(zh, pinyin, vi, en, tags, ord)
WHERE NOT EXISTS (
  SELECT 1 FROM vocabulary v JOIN courses c ON c.id = v.course_id
  WHERE c.name_zh = '公安' AND v.zh = t.zh
);

-- ---- Ngữ pháp (3 mẫu câu hành chính) ----
INSERT INTO grammar_patterns (course_id, pattern, example_zh, example_vi, order_index)
SELECT (SELECT id FROM courses WHERE name_zh='公安'), t.pattern, t.zh, t.vi, t.ord
FROM (VALUES
  ('依法…',        '依法办理相关手续。',              'Xử lý các thủ tục liên quan theo đúng pháp luật.',  1),
  ('予以…',        '对违法行为予以处罚。',            'Xử phạt đối với hành vi vi phạm.',                  2),
  ('根据…规定',    '根据相关规定，需提交身份证明。',  'Theo quy định liên quan, cần nộp giấy tờ tùy thân.', 3)
) AS t(pattern, zh, vi, ord)
WHERE NOT EXISTS (
  SELECT 1 FROM grammar_patterns g JOIN courses c ON c.id = g.course_id
  WHERE c.name_zh = '公安' AND g.pattern = t.pattern
);

-- ---- Câu ví dụ thực tiễn (3 câu) ----
INSERT INTO example_sentences (course_id, zh, pinyin, vi, order_index)
SELECT (SELECT id FROM courses WHERE name_zh='公安'), t.zh, t.pinyin, t.vi, t.ord
FROM (VALUES
  ('请出示您的身份证和签证。',   'Qǐng chūshì nín de shēnfènzhèng hé qiānzhèng.', 'Vui lòng xuất trình chứng minh thư và thị thực của quý vị.', 1),
  ('办理户口需要哪些材料？',     'Bànlǐ hùkǒu xūyào nǎxiē cáiliào?',              'Làm hộ khẩu cần những giấy tờ gì?',                          2),
  ('公安机关将依法处理此案。',   'Gōng''ān jīguān jiāng yīfǎ chǔlǐ cǐ àn.',       'Cơ quan công an sẽ xử lý vụ án này theo đúng pháp luật.',    3)
) AS t(zh, pinyin, vi, ord)
WHERE NOT EXISTS (
  SELECT 1 FROM example_sentences s JOIN courses c ON c.id = s.course_id
  WHERE c.name_zh = '公安' AND s.zh = t.zh
);

-- ---- Bài học (để "Lộ trình của bạn" có nội dung) ----
INSERT INTO lessons (course_id, title, order_index)
SELECT (SELECT id FROM courses WHERE name_zh='公安'), t.title, t.ord
FROM (VALUES
  ('Bài 1: Thủ tục hành chính cơ bản', 1),
  ('Bài 2: Giao tiếp tại cửa khẩu xuất nhập cảnh', 2)
) AS t(title, ord)
WHERE NOT EXISTS (
  SELECT 1 FROM lessons l JOIN courses c ON c.id = l.course_id
  WHERE c.name_zh = '公安' AND l.order_index = t.ord
);
