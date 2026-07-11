-- ============================================================
-- Từ vựng + câu mẫu cho khóa Thương Mại Điện Tử (course_id=9)
-- Nguồn: THƯƠNG MẠI ĐIỆN TỬ.pdf (mẫu câu giao dịch trên các sàn TMĐT Trung Quốc)
-- Cách chạy: psql -U <user> -d elearning -f 008_ecommerce_vocab.sql
-- An toàn khi chạy lại nhiều lần (idempotent, theo cặp course_id+zh).
-- ============================================================

INSERT INTO vocabulary (course_id, zh, pinyin, vi, en, tags, order_index, example_zh, example_pinyin, example_vi)
SELECT * FROM (VALUES
  (9, '订单', 'dìngdān', 'đơn đặt hàng', 'order', ARRAY['giao dịch'], 1,
    '麻烦你一下，给我检查我刚订购的订单？', 'Máfan nǐ yíxià, gěi wǒ jiǎnchá wǒ gāng dìnggòu de dìngdān?', 'Phiền bạn một chút, kiểm tra cho tôi đơn đặt hàng tôi vừa đặt?'),
  (9, '货物', 'huòwù', 'hàng hóa', 'goods', ARRAY['giao dịch'], 2,
    '货物齐备了没？', 'Huòwù qíbèi le méi?', 'Hàng hóa đầy đủ hết chưa?'),
  (9, '产品', 'chǎnpǐn', 'sản phẩm', 'product', ARRAY['giao dịch'], 3,
    '你们有这款产品吗？', 'Nǐmen yǒu zhè kuǎn chǎnpǐn ma?', 'Loại hàng này bạn có chứ?'),
  (9, '缺少', 'quēshǎo', 'thiếu, thiếu sót', 'to be missing/lacking', ARRAY['tình trạng hàng hóa'], 4,
    '我们所订购的货品，有哪款缺少吗？', 'Wǒmen suǒ dìnggòu de huòpǐn, yǒu nǎ kuǎn quēshǎo ma?', 'Hàng tôi đặt có thiếu loại nào không?'),
  (9, '检查', 'jiǎnchá', 'kiểm tra', 'to check/inspect', ARRAY['giao dịch'], 5,
    '不好意思，请帮我检查我的订单？', 'Bù hǎoyìsi, qǐng bāng wǒ jiǎnchá wǒ de dìngdān?', 'Cảm phiền giúp tôi kiểm tra đơn đặt hàng?'),
  (9, '付款', 'fùkuǎn', 'thanh toán, trả tiền', 'to pay/payment', ARRAY['thanh toán'], 6,
    '我们已经付款了。', 'Wǒmen yǐjīng fùkuǎn le.', 'Chúng tôi đã trả tiền xong rồi.'),
  (9, '转账', 'zhuǎnzhàng', 'chuyển khoản', 'bank transfer', ARRAY['thanh toán'], 7,
    '你看一下，我们刚给你转账了。', 'Nǐ kàn yíxià, wǒmen gāng gěi nǐ zhuǎnzhàng le.', 'Bạn kiểm tra một chút đi, chúng tôi vừa chuyển khoản cho bạn rồi.'),
  (9, '货款', 'huòkuǎn', 'tiền hàng', 'payment for goods', ARRAY['thanh toán'], 8,
    '货款我们已经结算好了。', 'Huòkuǎn wǒmen yǐjīng jiésuàn hǎo le.', 'Tiền hàng chúng tôi đã thanh toán xong rồi.'),
  (9, '结算', 'jiésuàn', 'thanh toán, quyết toán', 'to settle payment', ARRAY['thanh toán'], 9,
    '货款我们已经结算好了。', 'Huòkuǎn wǒmen yǐjīng jiésuàn hǎo le.', 'Tiền hàng chúng tôi đã thanh toán xong rồi.'),
  (9, '发货', 'fāhuò', 'gửi hàng, giao hàng', 'to ship/dispatch goods', ARRAY['giao hàng'], 10,
    '帮我尽快发货。', 'Bāng wǒ jǐnkuài fāhuò.', 'Giúp tôi nhanh gửi hàng.'),
  (9, '交货', 'jiāohuò', 'giao hàng', 'to deliver goods', ARRAY['giao hàng'], 11,
    '麻烦你们尽快交货。', 'Máfan nǐmen jǐnkuài jiāohuò.', 'Phiền bạn gửi hàng càng nhanh càng tốt.'),
  (9, '易碎', 'yìsuì', 'dễ vỡ', 'fragile', ARRAY['giao hàng'], 12,
    '货物易碎，麻烦你包装好一点？', 'Huòwù yìsuì, máfan nǐ bāozhuāng hǎo yìdiǎn?', 'Hàng dễ vỡ, cảm phiền bạn đóng gói cẩn thận chút.'),
  (9, '包装', 'bāozhuāng', 'đóng gói', 'packaging', ARRAY['giao hàng'], 13,
    '货物易碎，麻烦你包装好一点？确保货物没受损害。', 'Huòwù yìsuì, máfan nǐ bāozhuāng hǎo yìdiǎn? Quèbǎo huòwù méi shòu sǔnhài.', 'Hàng dễ vỡ, cảm phiền bạn đóng gói cẩn thận chút, đảm bảo hàng hóa không bị hư hại.'),
  (9, '安排', 'ānpái', 'sắp xếp', 'to arrange', ARRAY['giao hàng'], 14,
    '请安排时间发货！', 'Qǐng ānpái shíjiān fāhuò!', 'Phiền bạn sắp xếp thời gian gửi hàng.'),
  (9, '顾客', 'gùkè', 'khách hàng', 'customer', ARRAY['giao dịch'], 15,
    '我们这边的顾客已经催我们了。', 'Wǒmen zhè biān de gùkè yǐjīng cuī wǒmen le.', 'Khách hàng bên chúng tôi đã thúc giục rồi.'),
  (9, '催', 'cuī', 'thúc giục', 'to urge/press', ARRAY['giao dịch'], 16,
    '我们这边的顾客已经催我们了。', 'Wǒmen zhè biān de gùkè yǐjīng cuī wǒmen le.', 'Khách hàng bên chúng tôi đã thúc giục rồi.'),
  (9, '运费', 'yùnfèi', 'phí vận chuyển', 'shipping fee', ARRAY['vận chuyển'], 17,
    '运费太高，给我减少运费吧？', 'Yùnfèi tài gāo, gěi wǒ jiǎnshǎo yùnfèi ba?', 'Phí vận chuyển cao quá, bạn giảm phí vận chuyển giúp tôi.'),
  (9, '大量', 'dàliàng', 'số lượng lớn', 'large quantity/bulk', ARRAY['trả giá'], 18,
    '如果我方大量订购的话，你方有没有给我免运费？', 'Rúguǒ wǒfāng dàliàng dìnggòu dehuà, nǐfāng yǒuméiyǒu gěi wǒ miǎn yùnfèi?', 'Bên tôi đặt hàng nhiều có được miễn phí vận chuyển không?'),
  (9, '免运费', 'miǎn yùnfèi', 'miễn phí vận chuyển', 'free shipping', ARRAY['trả giá'], 19,
    '如果我方大量订购的话，你方有没有给我免运费？', 'Rúguǒ wǒfāng dàliàng dìnggòu dehuà, nǐfāng yǒuméiyǒu gěi wǒ miǎn yùnfèi?', 'Bên tôi đặt hàng nhiều có được miễn phí vận chuyển không?'),
  (9, '优惠', 'yōuhuì', 'ưu đãi, khuyến mãi', 'preferential/discount', ARRAY['trả giá'], 20,
    '如果我方大量订购的话，你方能不能给我提供优惠？', 'Rúguǒ wǒfāng dàliàng dìnggòu dehuà, nǐfāng néng bùnéng gěi wǒ tígōng yōuhuì?', 'Bên tôi đặt hàng nhiều có được ưu đãi/khuyến mãi/giảm giá không?'),
  (9, '折扣', 'zhékòu', 'chiết khấu, giảm giá', 'discount', ARRAY['trả giá'], 21,
    '这单可以打……%折扣吗？', 'Zhè dān kěyǐ dǎ……%zhékòu ma?', 'Bạn giảm cho tôi ...% đơn hàng này được không?'),
  (9, '减价', 'jiǎnjià', 'giảm giá', 'price reduction', ARRAY['trả giá'], 22,
    '如果大量订购这款产品，你方有没有减价？', 'Rúguǒ dàliàng dìnggòu zhè kuǎn chǎnpǐn, nǐfāng yǒuméiyǒu jiǎnjià?', 'Hàng này đặt nhiều có được giảm giá không?'),
  (9, '退款', 'tuìkuǎn', 'hoàn tiền', 'refund', ARRAY['hoàn tiền'], 23,
    '真对不起，我拍错了，请退款。谢谢', 'Zhēn duìbùqǐ, wǒ pāi cuò le, qǐng tuìkuǎn. Xièxie', 'Xin lỗi bạn! Tôi thực hiện sai lệnh mua, vui lòng hoàn tiền! Cảm ơn bạn!'),
  (9, '投诉', 'tóusù', 'khiếu nại', 'to complain/file a complaint', ARRAY['hoàn tiền'], 24,
    '如果你不给我退款，赔偿，我一定向阿里巴巴投诉你。', 'Rúguǒ nǐ bù gěi wǒ tuìkuǎn, péicháng, wǒ yídìng xiàng Ālǐbābā tóusù nǐ.', 'Bạn không trả tôi tiền, bồi thường, tôi làm đơn kiện lên Alibaba.'),
  (9, '赔偿', 'péicháng', 'bồi thường', 'compensation', ARRAY['hoàn tiền'], 25,
    '如果你不给我退款，赔偿，我一定向阿里巴巴投诉你。', 'Rúguǒ nǐ bù gěi wǒ tuìkuǎn, péicháng, wǒ yídìng xiàng Ālǐbābā tóusù nǐ.', 'Bạn không trả tôi tiền, bồi thường, tôi làm đơn kiện lên Alibaba.'),
  (9, '重量', 'zhòngliàng', 'trọng lượng', 'weight', ARRAY['vận chuyển'], 26,
    '这种产品，每个重量多少？', 'Zhè zhǒng chǎnpǐn, měige zhòngliàng duōshao?', 'Sản phẩm này trọng lượng mỗi cái là bao nhiêu?'),
  (9, '尺寸', 'chǐcùn', 'kích cỡ, kích thước', 'size/dimension', ARRAY['vận chuyển'], 27,
    '这款尺寸如何？', 'Zhè kuǎn chǐcùn rúhé?', 'Kích cỡ sản phẩm này thế nào?'),
  (9, '快递', 'kuàidì', 'chuyển phát nhanh', 'express delivery', ARRAY['vận chuyển'], 28,
    '如果是快递那要付多少钱？', 'Rúguǒ shì kuàidì nà yào fù duōshao qián?', 'Phí chuyển phát nhanh (hàng chuyển tới cửa) là bao nhiêu?'),
  (9, '物流', 'wùliú', 'logistics, vận chuyển hàng hóa', 'logistics', ARRAY['vận chuyển'], 29,
    '如果是物流那要付多少钱？', 'Rúguǒ shì wùliú nà yào fù duōshao qián?', 'Phí chuyển logistics (hàng chuyển tới kho) là bao nhiêu?'),
  (9, '款式', 'kuǎnshì', 'kiểu dáng', 'style', ARRAY['tình trạng hàng hóa'], 30,
    '麻烦你注意一下货物的款式，尺寸，颜色，数量……确保不发生疏漏，意外。', 'Máfan nǐ zhùyì yíxià huòwù de kuǎnshì, chǐcùn, yánsè, shùliàng……quèbǎo bù fāshēng shūlòu, yìwài.', 'Phiền bạn chú ý một chút, kiểu dáng, kích thước, màu sắc, số lượng…hàng hóa đảm bảo không có sai sót, ngoài ý muốn.')
) AS v(course_id, zh, pinyin, vi, en, tags, order_index, example_zh, example_pinyin, example_vi)
WHERE NOT EXISTS (
  SELECT 1 FROM vocabulary existing WHERE existing.course_id = v.course_id AND existing.zh = v.zh
);
