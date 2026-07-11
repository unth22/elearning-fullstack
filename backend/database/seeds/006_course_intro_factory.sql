-- ============================================================
-- Nội dung trang giới thiệu cho khóa "Tiếng Trung Công Xưởng"
-- (đổi tên từ "Sản xuất" cho khớp thương hiệu trên landing page)
-- Cách chạy: psql -U <user> -d elearning -f 006_course_intro_factory.sql
-- An toàn khi chạy lại nhiều lần (idempotent).
-- ============================================================

UPDATE courses
SET title = 'Tiếng Trung Công Xưởng',
    intro_content = $json$
{
  "description": {
    "intro": "Làm chủ tiếng Trung trong môi trường nhà máy chỉ với một lộ trình thực chiến.",
    "paragraphs": [
      "Khóa học Tiếng Trung Công Xưởng được thiết kế dành riêng cho người đang làm việc hoặc chuẩn bị làm việc tại các doanh nghiệp Trung Quốc, Đài Loan và các khu công nghiệp có vốn đầu tư nước ngoài.",
      "Không chỉ học từ vựng hay mẫu câu, học viên được luyện tập theo đúng quy trình làm việc thực tế: từ phỏng vấn xin việc, giao tiếp với quản lý, vận hành máy móc, kiểm tra chất lượng sản phẩm (QC), báo cáo sự cố, cho đến trao đổi trong nhà ăn và ký túc xá.",
      "Toàn bộ bài học đều được xây dựng dựa trên các tình huống doanh nghiệp thường gặp, giúp bạn nghe được – nói được – làm được, thay vì chỉ học để ghi nhớ.",
      "Sau khóa học, bạn có thể tự tin giao tiếp với quản lý người Trung Quốc, phối hợp với đồng nghiệp, hiểu yêu cầu công việc và mở ra nhiều cơ hội thăng tiến trong môi trường sản xuất."
    ]
  },
  "audience": [
    { "title": "Người mới bắt đầu", "desc": "Chưa biết tiếng Trung nhưng muốn làm việc tại các công ty Trung Quốc hoặc Đài Loan." },
    { "title": "Công nhân và kỹ thuật viên", "desc": "Muốn hiểu hướng dẫn sản xuất, giao tiếp với quản lý và hạn chế sai sót trong quá trình làm việc." },
    { "title": "QC – QA – Kho vận", "desc": "Cần sử dụng tiếng Trung trong kiểm hàng, báo lỗi, đóng gói và trao đổi với các bộ phận liên quan." },
    { "title": "Tổ trưởng – Chuyền trưởng", "desc": "Muốn nâng cao khả năng điều phối công việc, phổ biến quy trình và giao tiếp với cấp trên người Trung Quốc." },
    { "title": "Người chuẩn bị phỏng vấn", "desc": "Muốn tăng cơ hội trúng tuyển vào các doanh nghiệp có vốn đầu tư Trung Quốc." }
  ],
  "outcomes": [
    "Giao tiếp thành thạo trong hơn 30 tình huống thực tế tại nhà máy.",
    "Hiểu và thực hiện chính xác các chỉ đạo từ quản lý.",
    "Trao đổi công việc với đồng nghiệp bằng tiếng Trung.",
    "Báo cáo tiến độ, lỗi sản phẩm và sự cố máy móc.",
    "Xin nghỉ phép, đăng ký tăng ca và xử lý các thủ tục nhân sự.",
    "Hiểu các thuật ngữ về sản xuất, QC, 5S và an toàn lao động.",
    "Tự tin tham gia phỏng vấn và làm việc trong môi trường doanh nghiệp Trung Quốc."
  ],
  "modules": [
    { "title": "Module 1", "subtitle": "Làm chủ phát âm và phản xạ giao tiếp cơ bản", "topics": ["Pinyin", "Thanh điệu", "Giới thiệu bản thân", "Chào hỏi"] },
    { "title": "Module 2", "subtitle": "Làm quen với môi trường công xưởng", "topics": ["Bộ phận trong nhà máy", "Ca làm việc", "Đồng phục", "Nội quy"] },
    { "title": "Module 3", "subtitle": "Giao tiếp trong quá trình sản xuất", "topics": ["Vận hành máy", "Chuẩn bị nguyên liệu", "Kiểm tra chất lượng", "Đóng gói"] },
    { "title": "Module 4", "subtitle": "Báo cáo và xử lý sự cố", "topics": ["Máy hỏng", "Thiếu nguyên liệu", "Hàng lỗi", "Báo cáo cấp trên"] },
    { "title": "Module 5", "subtitle": "Giao tiếp trong sinh hoạt", "topics": ["Nhà ăn", "Ký túc xá", "Đi khám bệnh", "Xin nghỉ"] },
    { "title": "Module 6", "subtitle": "An toàn lao động", "topics": ["Quy trình 5S", "Phòng cháy chữa cháy", "Thiết bị bảo hộ", "Tai nạn lao động"] },
    { "title": "Module 7", "subtitle": "Phỏng vấn và phát triển nghề nghiệp", "topics": ["Phỏng vấn", "Tăng lương", "Đánh giá nhân viên", "Thăng chức"] },
    { "title": "Module 8", "subtitle": "Dự án thực chiến", "topics": ["Đóng vai toàn bộ quy trình làm việc tại một nhà máy Trung Quốc."] }
  ],
  "methodology": {
    "intro": "Khóa học áp dụng mô hình Learning by Doing, giúp học viên học thông qua công việc thực tế thay vì ghi nhớ lý thuyết.",
    "lesson_includes": ["Video bài giảng ngắn", "Hội thoại mô phỏng doanh nghiệp", "Shadowing luyện phản xạ", "Dictation luyện nghe", "Flashcard thông minh", "AI Speaking sửa phát âm", "Bài tập tình huống", "Mini Quiz sau mỗi bài", "Case Study doanh nghiệp"],
    "highlight": "Hơn 70% thời lượng khóa học dành cho luyện nghe – nói và xử lý tình huống, giúp học viên nhanh chóng hình thành phản xạ giao tiếp trong môi trường làm việc.",
    "lms_name": "Hệ thống LMS Business Chinese Pro",
    "lms_features": ["Video bài giảng không giới hạn", "AI chấm phát âm", "Flashcard SRS ghi nhớ dài hạn", "Shadowing luyện hội thoại", "Dictation luyện nghe", "Theo dõi tiến độ học tập", "Thi thử và đánh giá năng lực", "Học trên mọi thiết bị", "Mentor đồng hành trong suốt khóa học"]
  },
  "output": [
    "Giao tiếp hiệu quả trong môi trường công xưởng.",
    "Hiểu và phản hồi các yêu cầu công việc bằng tiếng Trung.",
    "Báo cáo, trao đổi và xử lý các tình huống thường gặp tại nhà máy.",
    "Đọc hiểu các hướng dẫn sản xuất cơ bản.",
    "Tự tin ứng tuyển vào doanh nghiệp Trung Quốc hoặc Đài Loan.",
    "Đủ năng lực học tiếp các khóa chuyên ngành nâng cao của Business Chinese Pro."
  ],
  "materials": {
    "intro": "Khóa học sử dụng bộ giáo trình độc quyền Business Chinese Pro, được phát triển từ kinh nghiệm thực tế tại các doanh nghiệp sản xuất, kết hợp với giáo trình tiếng Trung chuyên ngành và tài liệu doanh nghiệp.",
    "items": ["Giáo trình điện tử", "File PDF", "Audio chuẩn bản ngữ", "Video minh họa", "Bộ từ vựng chuyên ngành", "Mẫu hội thoại thực tế", "Biểu mẫu và tài liệu doanh nghiệp", "Kho bài tập thực hành và kiểm tra định kỳ"]
  }
}
$json$::jsonb
WHERE name_zh = '生产';
