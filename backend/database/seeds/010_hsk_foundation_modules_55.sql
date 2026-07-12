-- ============================================================
-- Cập nhật khóa "Nền Tảng HSK1-3" (name_zh = 基础汉语):
-- Thay 10 module đề cương chung bằng 55 module tương ứng 1:1
-- với 55 bài học thật trong 2 quyển giáo trình 发展汉语·初级综合 I & II
-- (Quyển 1: bài 1-30 -> Module 1-30, Quyển 2: bài 1-25 -> Module 31-55).
-- An toàn khi chạy lại nhiều lần (idempotent - luôn ghi đè key "modules").
-- Cách chạy: psql -U <user> -d elearning -f 010_hsk_foundation_modules_55.sql
-- ============================================================

UPDATE courses
SET intro_content = jsonb_set(
  intro_content,
  '{modules}',
  $json$
[
  { "title": "Module 1", "subtitle": "Quyển I - Bài 1: Xin chào (你好)", "topics": ["Âm tiết, thanh mẫu, vận mẫu", "Bốn thanh điệu", "Đại từ xưng hô lịch sự 您", "Chào hỏi cơ bản"] },
  { "title": "Module 2", "subtitle": "Quyển I - Bài 2: Bạn là người nước nào (你是哪国人)", "topics": ["Thanh mẫu, vận mẫu (tiếp)", "Thanh nhẹ (khinh thanh)", "Trợ từ nghi vấn 呢", "Hỏi quốc tịch"] },
  { "title": "Module 3", "subtitle": "Quyển I - Bài 3: Bạn tên là gì (你叫什么名字)", "topics": ["Thanh mẫu, vận mẫu (tiếp)", "Xưng hô lịch sự 贵姓", "Hỏi tên"] },
  { "title": "Module 4", "subtitle": "Quyển I - Bài 4: Bạn có học tiếng Pháp không (你学习法语吗)", "topics": ["Quy tắc ghép vần (1)", "Biến điệu thanh 3", "Biến điệu chữ 不", "Câu vị ngữ động từ", "Câu hỏi với 吗"] },
  { "title": "Module 5", "subtitle": "Quyển I - Bài 5: Nhà bạn có mấy người (你家有几口人)", "topics": ["Quy tắc ghép vần (2)", "Lượng từ 口", "几 và 多少", "Lượng từ 个", "Cách đếm số 1-100", "二 và 两"] },
  { "title": "Module 6", "subtitle": "Quyển I - Bài 6: Chuối bao nhiêu tiền một cân (香蕉多少钱一斤)", "topics": ["Quy tắc ghép vần (3)", "Biến điệu chữ 一", "Trợ động từ 想 (muốn)", "Cách đếm số trên 100", "Cách nói tiền tệ (RMB)", "...多少钱+一+lượng từ"] },
  { "title": "Module 7", "subtitle": "Quyển I - Bài 7: Ngân hàng Trung Quốc ở đâu (中国银行在哪儿)", "topics": ["Quy tắc ghép vần (4)", "儿 hóa (erhua)", "Câu tồn tại (1)", "Từ chỉ phương vị", "Phó từ 还", "哪儿 và ...在什么地方", "Trợ từ 吧 (1)"] },
  { "title": "Module 8", "subtitle": "Quyển I - Bài 8: Hôm nay ngày mấy (今天几号)", "topics": ["Quy tắc ghép vần (5)", "Câu vị ngữ danh từ", "Cách nói ngày tháng", "Câu hỏi với 对吗?", "怎么样 (1)", "Định ngữ (1)"] },
  { "title": "Module 9", "subtitle": "Quyển I - Bài 9: Hôm nay bạn có kế hoạch gì (你今天有什么安排)", "topics": ["Cách ghi thanh điệu", "先...然后... (trước...sau...)", "来/去+(O1)+V+O2", "Trạng ngữ thời gian", "Cách nói thời gian"] },
  { "title": "Module 10", "subtitle": "Quyển I - Bài 10: Chủ nhật này bạn có bận không (这个星期天你忙不忙)", "topics": ["Câu vị ngữ tính từ", "Câu hỏi chính phản (1)(2)", "一下 (một chút, thử xem)", "一点儿 (1) (một chút)"] },
  { "title": "Module 11", "subtitle": "Quyển I - Bài 11: Tôi ăn ở căng-tin trường (我在学校食堂吃饭)", "topics": ["Trạng ngữ nơi chốn 在+địa điểm", "从...到... (từ...đến...)", "Thứ tự trạng ngữ thời gian & nơi chốn", "Cách đọc số điện thoại", "不用谢"] },
  { "title": "Module 12", "subtitle": "Quyển I - Bài 12: Bạn muốn trà hay cà phê (你要茶还是咖啡)", "topics": ["对...+V/Adj (đối với...)", "Trợ từ 呢 (2)", "Câu hỏi lựa chọn A还是B"] },
  { "title": "Module 13", "subtitle": "Quyển I - Bài 13: Tôi chuyển nhà rồi (我已经搬家了)", "topics": ["Phó từ 又 (lại)", "Trợ từ 了 (1)", "怎么样 (2)", "怎么 (1) (tại sao)"] },
  { "title": "Module 14", "subtitle": "Quyển I - Bài 14: Tôi đã mua một cái áo len (我买了一件毛衣)", "topics": ["了 (2)", "一...就... (vừa...thì...)", "Phó từ 就", "Đại từ 这么", "Phó từ 还 (2)"] },
  { "title": "Module 15", "subtitle": "Quyển I - Bài 15: Sinh viên có thể đi làm thêm không (大学生可以打工吗)", "topics": ["Trợ động từ 要 (1)", "Trợ động từ 可以 (1)(2)", "Trợ động từ 能", "Trợ động từ 会"] },
  { "title": "Module 16", "subtitle": "Quyển I - Bài 16: Tôi muốn tặng anh ấy một món quà (我想送他一件礼物)", "topics": ["Câu song tân ngữ", "Trợ động từ 要 (2)", "Phó từ 还是 (hay là)", "Trợ động từ 可以 (3)"] },
  { "title": "Module 17", "subtitle": "Quyển I - Bài 17: Nói và nghe của tôi đều tốt (我口语和听力都很好)", "topics": ["Phó từ 才 (1) (mới)", "Câu chủ - vị làm vị ngữ", "Tính từ làm trạng ngữ", "怎么 (2)", "好 (bổ nghĩa)"] },
  { "title": "Module 18", "subtitle": "Quyển I - Bài 18: Tôi lên mạng bốn tiếng (我上了四个小时的网)", "topics": ["Cách nói khoảng thời gian", "Bổ ngữ thời lượng", "Động từ trùng điệp", "Câu hỏi với 是不是", "Tính từ trùng điệp"] },
  { "title": "Module 19", "subtitle": "Quyển I - Bài 19: Lò sưởi vẫn chưa sửa xong (暖气还没有修好)", "topics": ["Phó từ 只好 (đành phải)", "给...+V", "Bổ ngữ kết quả (1): V+好/上/见/开/完/给", "Lượng từ động lượng 遍"] },
  { "title": "Module 20", "subtitle": "Quyển I - Bài 20: Đồ ăn nhanh có thể giao tận nhà (快餐可以送到家里)", "topics": ["Bổ ngữ kết quả (2): V+到/在/走/满", "又...又... (vừa...vừa...)", "Số phỏng chừng (1)", "对了 (à đúng rồi)", "吧 (2)"] },
  { "title": "Module 21", "subtitle": "Quyển I - Bài 21: Tôi đã đặt túi lên bàn (我把袋子放在桌子上了)", "topics": ["A跟(和)B不一样/一样", "Câu hỏi với 好吗", "Câu chữ 把 (1)"] },
  { "title": "Module 22", "subtitle": "Quyển I - Bài 22: Xe đạp của tôi màu đỏ (我的自行车是红色的)", "topics": ["Cụm từ với 的", "Phó từ 有点儿 (hơi)", "一点儿 (2)", "Phó từ 才 (2)", "算了 (thôi bỏ đi)"] },
  { "title": "Module 23", "subtitle": "Quyển I - Bài 23: Mùa đông năm nay lạnh hơn (今年冬天变冷了)", "topics": ["Số phỏng chừng (2)", "Phó từ 才 (3)", "Phó từ 差不多 (gần như)", "了 (3)", "还可以 (cũng tạm được)"] },
  { "title": "Module 24", "subtitle": "Quyển I - Bài 24: Mẹ gửi quà cho tôi (妈妈给我寄来了礼物)", "topics": ["为了 (để, vì)", "如果 (nếu)", "Câu tồn tại (2)", "Bổ ngữ xu hướng đơn giản", "Câu chữ 把 (2)"] },
  { "title": "Module 25", "subtitle": "Quyển I - Bài 25: Tôi không hiểu họ nói gì (我听不懂他们说的话)", "topics": ["Định ngữ (2)", "听不懂 (nghe không hiểu)", "虽然...但是/可是/还是...", "Phó từ 好好儿"] },
  { "title": "Module 26", "subtitle": "Quyển I - Bài 26: Giáng sinh sắp đến (圣诞节快到了)", "topics": ["快要...了/要...了/快...了/就要...了 (sắp...rồi)", "特别是 (đặc biệt là)", "Từ ly hợp (离合词)", "要是 (nếu như)"] },
  { "title": "Module 27", "subtitle": "Quyển I - Bài 27: Tôi đang xem TV (我正在看电视呢)", "topics": ["一边...一边... (vừa...vừa...)", "正在.../在.../正...+呢 (đang...)", "Đại từ/danh từ+那儿/这儿 chỉ nơi chốn"] },
  { "title": "Module 28", "subtitle": "Quyển I - Bài 28: Vạn Lý Trường Thành dài hơn 8850km (长城有八千八百五十多公里)", "topics": ["Số phỏng chừng (3)", "Giới từ 通过 (thông qua)", "Phó từ 多 (hơn)", "Phó từ 原来 (hóa ra)"] },
  { "title": "Module 29", "subtitle": "Quyển I - Bài 29: Buổi tiệc rất thành công (晚会开得非常成功)", "topics": ["Bổ ngữ trạng thái (tình thái bổ ngữ)", "Động từ 爱 (yêu, thích)", "Phó từ 可能 (có thể)"] },
  { "title": "Module 30", "subtitle": "Quyển I - Bài 30: Tôi từng là giáo viên tiếng Anh (我当过英语老师)", "topics": ["Adj/V+极了 (cực kỳ...)", "V+过 (đã từng)", "当...的时候 (khi...)"] },
  { "title": "Module 31", "subtitle": "Quyển II - Bài 1: Nhập gia tùy tục (入乡随俗)", "topics": ["V+着 (duy trì hành động/trạng thái)", "不/没...不/没... (song phủ định)", "不是A，而是B"] },
  { "title": "Module 32", "subtitle": "Quyển II - Bài 2: Con trai muốn về nhà (儿子要回家)", "topics": ["从来 (từ trước đến nay)", "不A不B", "Nơi chốn+V+着+N (câu tồn tại)"] },
  { "title": "Module 33", "subtitle": "Quyển II - Bài 3: Cô gái bán ớt (卖辣椒的女孩儿)", "topics": ["Bổ ngữ xu hướng phức hợp", "一+lượng từ(+N)+都/也+不/没...", "既...也/又...", "把+O+V+bổ ngữ xu hướng"] },
  { "title": "Module 34", "subtitle": "Quyển II - Bài 4: Tôi có một cuộc hẹn với Trung Quốc (我和中国有个约会)", "topics": ["Câu 是...的 (1)", "不但...而且...", "其实 (thực ra)"] },
  { "title": "Module 35", "subtitle": "Quyển II - Bài 5: Vì sao tôi đứng ăn một mình (为什么我一个人站着吃)", "topics": ["V1+着+V2 (vừa...vừa...)", "Từ nghi vấn+也/都... (bất kể)"] },
  { "title": "Module 36", "subtitle": "Quyển II - Bài 6: Mọi thứ ở đây đều ổn (我这里一切都好)", "topics": ["越A越B (càng...càng...)", "V+得/不+kết quả/xu hướng (khả năng bổ ngữ 1)"] },
  { "title": "Module 37", "subtitle": "Quyển II - Bài 7: Tôi sẽ đi Ai Cập (我要去埃及)", "topics": ["V/Adj+起来 (bắt đầu...)", "V/Adj+下去 (tiếp tục...)", "V+什么 (ngăn cản, khuyên bảo)", "V得了/不了 (khả năng bổ ngữ 2)"] },
  { "title": "Module 38", "subtitle": "Quyển II - Bài 8: Giấc mơ cũ (旧梦)", "topics": ["A比B+Adj/VP (so sánh hơn)", "A比B+Adj/VP+mức độ", "A比B+还/更+Adj/VP"] },
  { "title": "Module 39", "subtitle": "Quyển II - Bài 9: Giáo dục tình yêu thương (爱的教育)", "topics": ["N1让/叫N2+V", "..., đặc biệt là...", "A不如B (A không bằng B)", "A有(没有)B(这么/那么)+Adj/VP"] },
  { "title": "Module 40", "subtitle": "Quyển II - Bài 10: Hạnh phúc thực ra rất đơn giản (快乐，其实很简单)", "topics": ["一+lượng từ(N)一+lượng từ(N) (trùng điệp)", "Bổ ngữ động lượng", "一lượng từ比一lượng từ+Adj/VP"] },
  { "title": "Module 41", "subtitle": "Quyển II - Bài 11: Con kiến trong sách (书本里的蚂蚁)", "topics": ["Từ nghi vấn phiếm chỉ (không xác định)", "Từ nghi vấn phiếm chỉ (bất kỳ)", "V+出来 (bổ ngữ xu hướng mở rộng)"] },
  { "title": "Module 42", "subtitle": "Quyển II - Bài 12: Là “gối”, không phải “đầu kim” (是“枕头”，不是“针头”)", "topics": ["对...来说 (đối với...mà nói)", "把+A+V成+B (biến A thành B)", "Câu phản vấn (1)"] },
  { "title": "Module 43", "subtitle": "Quyển II - Bài 13: Lá thư từ Trung Quốc đã thay đổi cuộc đời tôi (中国来信改变了我的生活)", "topics": ["除了...(以外)，...", "不是A就是B", "Danh từ/lượng từ trùng điệp"] },
  { "title": "Module 44", "subtitle": "Quyển II - Bài 14: Lần đầu đi taxi (第一次打的)", "topics": ["Cách đọc số trăm, nghìn, vạn", "Câu chữ 被 (bị động)", "幸好 (may mà)"] },
  { "title": "Module 45", "subtitle": "Quyển II - Bài 15: Chim bồ câu đưa thư bay về (飞回来的信鸽)", "topics": ["A是A,但(是)/可(是)/就是... ", "Câu bị động không dấu hiệu", "当...的时候 (khi...)"] },
  { "title": "Module 46", "subtitle": "Quyển II - Bài 16: Vặn đồng hồ nhanh ba phút (把表拨快三分钟)", "topics": ["把+O+V/VP+số lượng thời gian", "Câu phản vấn (2)", "难道 (chẳng lẽ)"] },
  { "title": "Module 47", "subtitle": "Quyển II - Bài 17: Cuộc hẹn (约会)", "topics": ["尽管...,但(是)/可(是)/却...", "到底... (rốt cuộc)"] },
  { "title": "Module 48", "subtitle": "Quyển II - Bài 18: Nghe phim (听电影)", "topics": ["即使...,也/还... (dù cho...cũng...)", "(好)像...似的 (giống như...)", "来 biểu thị số phỏng chừng"] },
  { "title": "Module 49", "subtitle": "Quyển II - Bài 19: Bạn qua thư (笔友)", "topics": ["只有...才... (chỉ có...mới...)", "Câu 是...的 (2)", "好在 (may mà, may thay)"] },
  { "title": "Module 50", "subtitle": "Quyển II - Bài 20: Nhân cách bậc nhất (第一人格)", "topics": ["把+O+V(一/了)V/V一下", "从...起 (kể từ...)", "千万 (nhất định)"] },
  { "title": "Module 51", "subtitle": "Quyển II - Bài 21: Ngu Công dời núi (愚公移山)", "topics": ["不管...都/也... (bất kể...đều...)", "..., 再说... (huống chi)", "V+到底 (làm đến cùng)"] },
  { "title": "Module 52", "subtitle": "Quyển II - Bài 22: Thẻ (卡)", "topics": ["不必 (không cần)", "只要...就... (chỉ cần...thì...)", "既然...就... (đã như vậy thì...)"] },
  { "title": "Module 53", "subtitle": "Quyển II - Bài 23: Cuộc sống “ít carbon” của tôi (我的“低碳生活”)", "topics": ["V+起来+đánh giá", "怎么也/都+V+不+kết quả", "Cách nói phân số & bội số", "连...都/也..."] },
  { "title": "Module 54", "subtitle": "Quyển II - Bài 24: Cha con và Trường Thành (父子长城)", "topics": ["哪怕...也... (dù cho...cũng...)", "万一 (lỡ như, nhỡ đâu)", "用不着 (không cần đến)"] },
  { "title": "Module 55", "subtitle": "Quyển II - Bài 25: Đi nhờ xe đến Berlin (搭车去柏林)", "topics": ["竟然 (thế mà, lại)", "Câu chữ 由 (do, bởi)", "一+V/Adj (vừa mới...)"] }
]
$json$::jsonb
)
WHERE name_zh = '基础汉语';
