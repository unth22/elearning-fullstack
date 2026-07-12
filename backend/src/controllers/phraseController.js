const { getPhrasesByCourseId } = require("../models/phraseModel");

async function listPhrases(req, res) {
  try {
    const phrases = await getPhrasesByCourseId(req.params.courseId);
    return res.status(200).json(phrases);
  } catch (err) {
    console.error("Lỗi listPhrases:", err.message);
    return res.status(500).json({ message: "Không thể tải danh sách cụm từ." });
  }
}

module.exports = { listPhrases };
