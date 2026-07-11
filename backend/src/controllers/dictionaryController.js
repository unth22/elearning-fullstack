const { searchVocabulary } = require("../models/dictionaryModel");

async function search(req, res) {
  try {
    const q = (req.query.q || "").trim();
    if (!q) return res.status(200).json([]);

    const results = await searchVocabulary(q);
    return res.status(200).json(results);
  } catch (err) {
    console.error("Lỗi tra cứu từ vựng:", err.message);
    return res.status(500).json({ message: "Không thể tra cứu từ vựng." });
  }
}

const EXPLAIN_SYSTEM_PROMPT = `Bạn là từ điển Hán-Việt chuyên ngành thương mại. Người dùng gửi 1 từ/cụm từ
tiếng Trung (có thể kèm nghĩa tiếng Việt tham khảo). Trả lời DUY NHẤT bằng JSON hợp lệ (không thêm
chữ nào khác, không markdown code fence) theo đúng schema:
{
  "word": "chữ Hán gốc",
  "pinyin": "pinyin có dấu thanh",
  "word_type": "loại từ (danh từ/động từ/tính từ/lượng từ/...)",
  "meanings": [{ "vi": "nghĩa tiếng Việt", "en": "nghĩa tiếng Anh" }],
  "examples": [{ "zh": "câu ví dụ", "pinyin": "pinyin câu", "vi": "dịch nghĩa" }],
  "phrases": ["cụm từ hay dùng kèm nghĩa Việt trong ngoặc"],
  "compounds": ["từ ghép có chứa từ này, kèm nghĩa Việt trong ngoặc"],
  "synonyms": ["từ đồng nghĩa kèm pinyin"],
  "antonyms": ["từ trái nghĩa kèm pinyin"],
  "idioms": ["thành ngữ liên quan kèm nghĩa Việt, nếu có — mảng rỗng nếu không có"]
}
Chỉ điền thông tin có thật, chính xác về mặt ngôn ngữ học. Nếu một mục không có dữ liệu phù hợp
(vd không có thành ngữ liên quan), trả về mảng rỗng [] cho mục đó thay vì bịa ra.`;

async function explain(req, res) {
  try {
    const word = (req.body.word || "").trim();
    if (!word) return res.status(400).json({ message: "Thiếu từ cần giải thích." });

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ message: "Tính năng giải thích AI chưa được cấu hình (thiếu ANTHROPIC_API_KEY)." });
    }

    const aiRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1200,
        system: EXPLAIN_SYSTEM_PROMPT,
        messages: [{ role: "user", content: word }],
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error("Lỗi gọi Anthropic API:", aiRes.status, errText);
      return res.status(502).json({ message: "Không thể lấy giải thích từ AI lúc này." });
    }

    const aiData = await aiRes.json();
    const raw = aiData.content?.[0]?.text || "";
    const parsed = JSON.parse(raw);
    return res.status(200).json(parsed);
  } catch (err) {
    console.error("Lỗi explain:", err.message);
    return res.status(500).json({ message: "Không thể giải thích từ này lúc này." });
  }
}

module.exports = { search, explain };
