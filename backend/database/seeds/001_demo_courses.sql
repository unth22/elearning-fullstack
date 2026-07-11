-- ============================================================
-- Dữ liệu mẫu: 3 khóa học chuyên ngành + từ vựng/ngữ pháp/câu ví dụ
-- Cách chạy: psql -U <user> -d elearning -f 001_demo_courses.sql
-- (Không bắt buộc — chỉ để có dữ liệu thật hiển thị trên giao diện)
-- ============================================================

INSERT INTO courses (title, description, industry, icon, accent_color, name_zh, level, is_published)
VALUES
  ('Luật & Pháp lý', 'Hợp đồng, tố tụng, luật doanh nghiệp', 'Pháp lý', '⚖️', '#E74C3C', '法律', 'HSK 4–6', true),
  ('Kinh doanh & Tài chính', 'Đầu tư, kế toán, tài chính doanh nghiệp', 'Tài chính', '💹', '#27AE60', '金融商业', 'HSK 4–6', true),
  ('Công nghệ & IT', 'Lập trình, AI, bảo mật, phần mềm', 'Công nghệ', '💻', '#2980B9', '信息技术', 'HSK 4–6', true)
ON CONFLICT DO NOTHING;

-- ---------------- Luật & Pháp lý ----------------
INSERT INTO vocabulary (course_id, zh, pinyin, vi, en, tags, order_index) VALUES
((SELECT id FROM courses WHERE title='Luật & Pháp lý'), '合同', 'hétong', 'hợp đồng', 'contract', ARRAY['cơ bản'], 1),
((SELECT id FROM courses WHERE title='Luật & Pháp lý'), '诉讼', 'sùsòng', 'tố tụng / kiện tụng', 'lawsuit', ARRAY['tòa án'], 2),
((SELECT id FROM courses WHERE title='Luật & Pháp lý'), '法律', 'fǎlǜ', 'pháp luật', 'law', ARRAY['cơ bản'], 3),
((SELECT id FROM courses WHERE title='Luật & Pháp lý'), '律师', 'lǜshī', 'luật sư', 'lawyer', ARRAY['người'], 4),
((SELECT id FROM courses WHERE title='Luật & Pháp lý'), '判决', 'pànjué', 'phán quyết', 'verdict', ARRAY['tòa án'], 5),
((SELECT id FROM courses WHERE title='Luật & Pháp lý'), '违约', 'wéiyuē', 'vi phạm hợp đồng', 'breach of contract', ARRAY['hợp đồng'], 6),
((SELECT id FROM courses WHERE title='Luật & Pháp lý'), '知识产权', 'zhīshi chǎnquán', 'sở hữu trí tuệ', 'intellectual property', ARRAY['IP'], 7),
((SELECT id FROM courses WHERE title='Luật & Pháp lý'), '仲裁', 'zhòngcái', 'trọng tài', 'arbitration', ARRAY['tòa án'], 8),
((SELECT id FROM courses WHERE title='Luật & Pháp lý'), '条款', 'tiáokuǎn', 'điều khoản', 'clause / terms', ARRAY['hợp đồng'], 9),
((SELECT id FROM courses WHERE title='Luật & Pháp lý'), '赔偿', 'péicháng', 'bồi thường thiệt hại', 'compensation', ARRAY['cơ bản'], 10),
((SELECT id FROM courses WHERE title='Luật & Pháp lý'), '法院', 'fǎyuàn', 'tòa án', 'court', ARRAY['tòa án'], 11),
((SELECT id FROM courses WHERE title='Luật & Pháp lý'), '证据', 'zhèngjù', 'bằng chứng', 'evidence', ARRAY['tòa án'], 12);

INSERT INTO grammar_patterns (course_id, pattern, example_zh, example_vi, order_index) VALUES
((SELECT id FROM courses WHERE title='Luật & Pháp lý'), '依据…规定', '依据合同规定，乙方须在30天内完成。', 'Theo quy định của hợp đồng, bên B phải hoàn thành trong 30 ngày.', 1),
((SELECT id FROM courses WHERE title='Luật & Pháp lý'), '不得…', '未经授权，不得转让本合同。', 'Chưa được ủy quyền, không được chuyển nhượng hợp đồng này.', 2);

INSERT INTO example_sentences (course_id, zh, pinyin, vi, order_index) VALUES
((SELECT id FROM courses WHERE title='Luật & Pháp lý'), '合同双方应遵守以下条款。', 'Hétong shuāngfāng yīng zūnshǒu yǐxià tiáokuǎn.', 'Hai bên hợp đồng phải tuân thủ các điều khoản sau đây.', 1),
((SELECT id FROM courses WHERE title='Luật & Pháp lý'), '违约方须承担相应的赔偿责任。', 'Wéiyuē fāng xū chéngdān xiāngyìng de péicháng zérèn.', 'Bên vi phạm hợp đồng phải chịu trách nhiệm bồi thường tương ứng.', 2),
((SELECT id FROM courses WHERE title='Luật & Pháp lý'), '知识产权受到法律的严格保护。', 'Zhīshi chǎnquán shòudào fǎlǜ de yángé bǎohù.', 'Sở hữu trí tuệ được pháp luật bảo vệ nghiêm ngặt.', 3);

-- ---------------- Kinh doanh & Tài chính ----------------
INSERT INTO vocabulary (course_id, zh, pinyin, vi, en, tags, order_index) VALUES
((SELECT id FROM courses WHERE title='Kinh doanh & Tài chính'), '投资', 'tóuzī', 'đầu tư', 'investment', ARRAY['cơ bản'], 1),
((SELECT id FROM courses WHERE title='Kinh doanh & Tài chính'), '股票', 'gǔpiào', 'cổ phiếu', 'stock / share', ARRAY['chứng khoán'], 2),
((SELECT id FROM courses WHERE title='Kinh doanh & Tài chính'), '利润', 'lìrùn', 'lợi nhuận', 'profit', ARRAY['kế toán'], 3),
((SELECT id FROM courses WHERE title='Kinh doanh & Tài chính'), '资产', 'zīchǎn', 'tài sản', 'assets', ARRAY['kế toán'], 4),
((SELECT id FROM courses WHERE title='Kinh doanh & Tài chính'), '负债', 'fùzhài', 'nợ phải trả', 'liabilities', ARRAY['kế toán'], 5),
((SELECT id FROM courses WHERE title='Kinh doanh & Tài chính'), '融资', 'róngzī', 'huy động vốn', 'financing', ARRAY['vốn'], 6),
((SELECT id FROM courses WHERE title='Kinh doanh & Tài chính'), '市场份额', 'shìchǎng fèn''é', 'thị phần', 'market share', ARRAY['chiến lược'], 7),
((SELECT id FROM courses WHERE title='Kinh doanh & Tài chính'), '现金流', 'xiànjīn liú', 'dòng tiền', 'cash flow', ARRAY['kế toán'], 8),
((SELECT id FROM courses WHERE title='Kinh doanh & Tài chính'), '预算', 'yùsuàn', 'ngân sách', 'budget', ARRAY['kế toán'], 9),
((SELECT id FROM courses WHERE title='Kinh doanh & Tài chính'), '风险', 'fēngxiǎn', 'rủi ro', 'risk', ARRAY['cơ bản'], 10),
((SELECT id FROM courses WHERE title='Kinh doanh & Tài chính'), '并购', 'bìnggòu', 'mua bán & sáp nhập (M&A)', 'merger & acquisition', ARRAY['chiến lược'], 11),
((SELECT id FROM courses WHERE title='Kinh doanh & Tài chính'), '分红', 'fēnhóng', 'cổ tức', 'dividend', ARRAY['chứng khoán'], 12);

INSERT INTO grammar_patterns (course_id, pattern, example_zh, example_vi, order_index) VALUES
((SELECT id FROM courses WHERE title='Kinh doanh & Tài chính'), '在…方面', '在融资方面，该公司取得了显著进展。', 'Về mặt huy động vốn, công ty đã đạt được tiến bộ đáng kể.', 1),
((SELECT id FROM courses WHERE title='Kinh doanh & Tài chính'), '随着…的增长', '随着市场份额的增长，利润也随之提高。', 'Cùng với sự tăng trưởng thị phần, lợi nhuận cũng tăng theo.', 2);

INSERT INTO example_sentences (course_id, zh, pinyin, vi, order_index) VALUES
((SELECT id FROM courses WHERE title='Kinh doanh & Tài chính'), '公司的现金流状况良好，可以支持新项目。', 'Gōngsī de xiànjīn liú zhuàngkuàng liánghǎo, kěyǐ zhīchí xīn xiàngmù.', 'Tình trạng dòng tiền của công ty tốt, có thể hỗ trợ dự án mới.', 1),
((SELECT id FROM courses WHERE title='Kinh doanh & Tài chính'), '本季度的净利润比去年同期增长了15%。', 'Běn jìdù de jìng lìrùn bǐ qùnián tóngqī zēngzhǎng le 15%.', 'Lợi nhuận ròng quý này tăng 15% so với cùng kỳ năm ngoái.', 2),
((SELECT id FROM courses WHERE title='Kinh doanh & Tài chính'), '投资者对该公司的并购计划表示担忧。', 'Tóuzīzhě duì gāi gōngsī de bìnggòu jìhuà biǎoshì dānyōu.', 'Các nhà đầu tư bày tỏ lo ngại về kế hoạch M&A của công ty.', 3);

-- ---------------- Công nghệ & IT ----------------
INSERT INTO vocabulary (course_id, zh, pinyin, vi, en, tags, order_index) VALUES
((SELECT id FROM courses WHERE title='Công nghệ & IT'), '人工智能', 'réngōng zhìnéng', 'trí tuệ nhân tạo', 'artificial intelligence', ARRAY['AI'], 1),
((SELECT id FROM courses WHERE title='Công nghệ & IT'), '数据库', 'shùjùkù', 'cơ sở dữ liệu', 'database', ARRAY['hệ thống'], 2),
((SELECT id FROM courses WHERE title='Công nghệ & IT'), '算法', 'suànfǎ', 'thuật toán', 'algorithm', ARRAY['lập trình'], 3),
((SELECT id FROM courses WHERE title='Công nghệ & IT'), '云计算', 'yún jìsuàn', 'điện toán đám mây', 'cloud computing', ARRAY['hạ tầng'], 4),
((SELECT id FROM courses WHERE title='Công nghệ & IT'), '网络安全', 'wǎngluò ānquán', 'an ninh mạng', 'cybersecurity', ARRAY['bảo mật'], 5),
((SELECT id FROM courses WHERE title='Công nghệ & IT'), '开发者', 'kāifāzhě', 'nhà phát triển / lập trình viên', 'developer', ARRAY['người'], 6),
((SELECT id FROM courses WHERE title='Công nghệ & IT'), '服务器', 'fúwùqì', 'máy chủ', 'server', ARRAY['hạ tầng'], 7),
((SELECT id FROM courses WHERE title='Công nghệ & IT'), '接口', 'jiēkǒu', 'giao diện / API', 'interface / API', ARRAY['lập trình'], 8),
((SELECT id FROM courses WHERE title='Công nghệ & IT'), '开源', 'kāiyuán', 'mã nguồn mở', 'open source', ARRAY['lập trình'], 9),
((SELECT id FROM courses WHERE title='Công nghệ & IT'), '大数据', 'dà shùjù', 'dữ liệu lớn', 'big data', ARRAY['dữ liệu'], 10),
((SELECT id FROM courses WHERE title='Công nghệ & IT'), '加密', 'jiāmì', 'mã hóa', 'encryption', ARRAY['bảo mật'], 11),
((SELECT id FROM courses WHERE title='Công nghệ & IT'), '软件', 'ruǎnjiàn', 'phần mềm', 'software', ARRAY['cơ bản'], 12);

INSERT INTO grammar_patterns (course_id, pattern, example_zh, example_vi, order_index) VALUES
((SELECT id FROM courses WHERE title='Công nghệ & IT'), '通过…实现', '通过云计算实现数据的高效存储。', 'Thông qua điện toán đám mây thực hiện lưu trữ dữ liệu hiệu quả.', 1),
((SELECT id FROM courses WHERE title='Công nghệ & IT'), '基于…技术', '该产品基于人工智能技术开发。', 'Sản phẩm này được phát triển dựa trên công nghệ trí tuệ nhân tạo.', 2);

INSERT INTO example_sentences (course_id, zh, pinyin, vi, order_index) VALUES
((SELECT id FROM courses WHERE title='Công nghệ & IT'), '人工智能正在改变各行各业的工作方式。', 'Réngōng zhìnéng zhèngzài gǎibiàn gè háng gè yè de gōngzuò fāngshì.', 'Trí tuệ nhân tạo đang thay đổi cách làm việc của mọi ngành nghề.', 1),
((SELECT id FROM courses WHERE title='Công nghệ & IT'), '开发者需要了解基本的网络安全知识。', 'Kāifāzhě xūyào liǎojiě jīběn de wǎngluò ānquán zhīshì.', 'Nhà phát triển cần nắm vững kiến thức cơ bản về an ninh mạng.', 2),
((SELECT id FROM courses WHERE title='Công nghệ & IT'), '云计算大大降低了企业的IT基础设施成本。', 'Yún jìsuàn dàdà jiàngdī le qǐyè de IT jīchǔ shèshī chéngběn.', 'Điện toán đám mây đã giảm đáng kể chi phí hạ tầng IT của doanh nghiệp.', 3);

-- ---------------- Bài học mẫu (để trang chi tiết có nội dung) ----------------
INSERT INTO lessons (course_id, title, order_index) VALUES
((SELECT id FROM courses WHERE title='Luật & Pháp lý'), 'Nhập môn thuật ngữ hợp đồng', 1),
((SELECT id FROM courses WHERE title='Luật & Pháp lý'), 'Tố tụng & trọng tài thương mại', 2),
((SELECT id FROM courses WHERE title='Kinh doanh & Tài chính'), 'Đọc hiểu báo cáo tài chính', 1),
((SELECT id FROM courses WHERE title='Kinh doanh & Tài chính'), 'Đàm phán đầu tư & M&A', 2),
((SELECT id FROM courses WHERE title='Công nghệ & IT'), 'Từ vựng phát triển phần mềm', 1),
((SELECT id FROM courses WHERE title='Công nghệ & IT'), 'Thuyết trình sản phẩm AI', 2)
ON CONFLICT DO NOTHING;
