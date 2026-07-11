-- ============================================================
-- Khóa học mới: Nền tảng tiếng Trung HSK1–HSK3 (khóa flagship,
-- học trước khi vào các khóa chuyên ngành).
-- Cách chạy: psql -U <user> -d elearning -f 009_hsk_foundation_course.sql
-- An toàn khi chạy lại nhiều lần (idempotent theo name_zh).
-- ============================================================

INSERT INTO courses (title, description, industry, icon, accent_color, name_zh, level, sort_order, is_published, intro_content)
SELECT
  'Nền Tảng HSK1-3',
  'Xây dựng nền tảng tiếng Trung vững chắc từ con số 0, sẵn sàng học chuyên ngành hoặc làm việc thực tế.',
  'Foundation', '🎓', '#D4A017', '基础汉语', 'HSK 1-3', 0, true,
  $json$
{
  "description": {
    "intro": "Từ con số 0 đến HSK3 — nền tảng vững chắc để học chuyên ngành và làm việc bằng tiếng Trung.",
    "paragraphs": [
      "Đây là khóa học dành cho người bắt đầu từ con số 0, giúp học viên xây dựng nền tảng tiếng Trung vững chắc trước khi học giao tiếp nâng cao hoặc các khóa chuyên ngành.",
      "Khóa học được thiết kế theo lộ trình từ dễ đến khó, tập trung vào bốn kỹ năng Nghe – Nói – Đọc – Viết kết hợp với phương pháp học thực hành. Học viên không chỉ học từ vựng và ngữ pháp mà còn được luyện phản xạ giao tiếp, phát âm chuẩn, đọc hiểu, viết câu và sử dụng tiếng Trung trong các tình huống thực tế.",
      "Sau khi hoàn thành khóa học, học viên đạt trình độ tương đương HSK3, đủ năng lực tiếp tục học các khóa Tiếng Trung chuyên ngành như Kế toán, Xuất nhập khẩu, Công xưởng, Thu mua, Logistics, Thương mại điện tử và nhiều lĩnh vực khác."
    ]
  },
  "audience": [
    { "title": "Người mới bắt đầu", "desc": "Chưa từng học tiếng Trung, muốn học lại từ con số 0." },
    { "title": "Người mất gốc", "desc": "Từng học nhưng quên hết, muốn học lại bài bản, có hệ thống." },
    { "title": "Sinh viên", "desc": "Chuẩn bị đi thực tập hoặc tìm việc cần tiếng Trung." },
    { "title": "Người đi làm", "desc": "Muốn học tiếng Trung để phục vụ công việc hiện tại." },
    { "title": "Người có kế hoạch làm việc tại doanh nghiệp Trung Quốc/Đài Loan", "desc": "Cần nền tảng giao tiếp cơ bản trước khi vào môi trường làm việc thực tế." },
    { "title": "Học viên định hướng học chuyên ngành", "desc": "Muốn xây nền tảng vững trước khi học các khóa tiếng Trung chuyên ngành." }
  ],
  "outcomes": [
    "Đọc và viết khoảng 600 từ vựng HSK1–HSK3.",
    "Nắm vững hệ thống phiên âm Pinyin và phát âm chuẩn bốn thanh điệu.",
    "Giao tiếp trong các tình huống hằng ngày như chào hỏi, giới thiệu bản thân, mua sắm, hỏi đường, ăn uống, du lịch và làm việc.",
    "Sử dụng các mẫu câu và ngữ pháp cơ bản để diễn đạt ý kiến, đặt câu hỏi và trả lời tự nhiên.",
    "Nghe hiểu các đoạn hội thoại ngắn ở tốc độ thông thường.",
    "Đọc hiểu các đoạn văn đơn giản và viết được đoạn văn ngắn bằng tiếng Trung.",
    "Tự tin học tiếp HSK4 hoặc các khóa tiếng Trung chuyên ngành."
  ],
  "modules": [
    { "title": "Module 1", "subtitle": "Phát âm chuẩn tiếng Trung", "topics": ["Pinyin", "Thanh mẫu", "Vận mẫu", "Thanh điệu", "Quy tắc phát âm", "Quy tắc biến điệu", "Đánh máy tiếng Trung"] },
    { "title": "Module 2", "subtitle": "HSK1 – Từ vựng & Ngữ pháp cơ bản", "topics": ["150 từ vựng HSK1", "Cấu trúc câu đơn", "Đại từ", "Số đếm", "Thời gian", "Hỏi đáp cơ bản"] },
    { "title": "Module 3", "subtitle": "Giao tiếp HSK1", "topics": ["Giới thiệu bản thân", "Gia đình", "Trường học", "Mua sắm", "Ăn uống", "Hỏi đường", "Hội thoại thực tế"] },
    { "title": "Module 4", "subtitle": "HSK2", "topics": ["150 từ vựng HSK2", "Ngữ pháp mở rộng", "Động từ bổ ngữ", "Câu so sánh", "Câu hỏi", "Hội thoại theo chủ đề"] },
    { "title": "Module 5", "subtitle": "Giao tiếp HSK2", "topics": ["Công việc", "Cuộc hẹn", "Sở thích", "Phương tiện", "Thời tiết", "Du lịch", "Giao tiếp với người bản xứ"] },
    { "title": "Module 6", "subtitle": "HSK3", "topics": ["300 từ vựng HSK3", "Ngữ pháp nâng cao", "Liên từ", "Bổ ngữ kết quả", "Bổ ngữ xu hướng", "Câu phức"] },
    { "title": "Module 7", "subtitle": "Giao tiếp HSK3", "topics": ["Văn phòng", "Công việc", "Cuộc sống", "Học tập", "Gọi điện", "Chat tiếng Trung", "Xử lý tình huống thực tế"] },
    { "title": "Module 8", "subtitle": "Luyện nghe – Shadowing – Dictation", "topics": ["Nghe theo chủ đề", "Shadowing", "Dictation", "Luyện phản xạ", "Phát âm chuẩn"] },
    { "title": "Module 9", "subtitle": "Đọc hiểu & Viết", "topics": ["Đọc đoạn văn", "Đọc hội thoại", "Viết câu", "Viết đoạn", "Viết tin nhắn", "Viết Email đơn giản"] },
    { "title": "Module 10", "subtitle": "Ôn tập & Kiểm tra tổng hợp", "topics": ["Ôn tập toàn bộ kiến thức", "Đề kiểm tra từng Module", "Đề thi tổng hợp", "Đánh giá năng lực cuối khóa"] }
  ],
  "methodology": {
    "intro": "Khóa học được thiết kế theo mô hình Học – Hiểu – Luyện – Ứng dụng, giúp học viên tiếp thu kiến thức một cách tự nhiên và ghi nhớ lâu dài.",
    "lesson_includes": ["Video bài giảng ngắn", "Từ vựng kèm phát âm chuẩn", "Giải thích ngữ pháp bằng ví dụ thực tế", "Hội thoại theo chủ đề", "Audio luyện nghe", "Shadowing luyện phát âm", "Dictation luyện nghe viết", "Flashcard ghi nhớ từ vựng", "Bài tập tương tác và kiểm tra cuối bài"],
    "highlight": "Ôn tập theo phương pháp lặp lại ngắt quãng (SRS) giúp học viên ghi nhớ từ vựng lâu dài, không học trước quên sau.",
    "lms_name": "Hệ thống LMS Business Chinese Pro",
    "lms_features": ["Video bài giảng không giới hạn", "AI chấm phát âm", "Flashcard SRS ghi nhớ dài hạn", "Shadowing luyện hội thoại", "Dictation luyện nghe", "Theo dõi tiến độ học tập", "Thi thử và đánh giá năng lực", "Học trên mọi thiết bị", "Mentor đồng hành trong suốt khóa học"]
  },
  "output": [
    "Đạt trình độ tương đương HSK3.",
    "Sở hữu khoảng 600 từ vựng và các cấu trúc ngữ pháp cốt lõi.",
    "Giao tiếp tự tin trong các tình huống thường gặp.",
    "Đọc hiểu và viết các văn bản ngắn bằng tiếng Trung.",
    "Có nền tảng vững chắc để học HSK4 hoặc các khóa tiếng Trung chuyên ngành.",
    "Đủ năng lực tiếp cận môi trường làm việc sử dụng tiếng Trung ở cấp độ cơ bản."
  ],
  "materials": {
    "intro": "Khóa học sử dụng hệ thống giáo trình được biên soạn và chuẩn hóa dựa trên chương trình HSK kết hợp với tài liệu thực tế, giúp học viên vừa đáp ứng yêu cầu thi HSK vừa phát triển khả năng sử dụng tiếng Trung trong cuộc sống và công việc.",
    "items": ["Giáo trình học theo từng Module", "Slide bài giảng", "File PDF từ vựng và ngữ pháp", "Audio luyện nghe", "Flashcard ôn tập", "Bài tập thực hành", "Đề kiểm tra cuối Module", "Đề ôn luyện HSK1–HSK3", "Cập nhật tài liệu và nội dung mới trong suốt thời gian học"]
  }
}
$json$::jsonb
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE name_zh = '基础汉语');
