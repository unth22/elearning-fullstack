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

module.exports = { search };
