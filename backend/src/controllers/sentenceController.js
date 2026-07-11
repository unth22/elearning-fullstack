const {
  getSentencesByCourseId,
  getSentenceById,
  createSentence,
  updateSentence,
  deleteSentence,
} = require("../models/sentenceModel");
const { getCourseById } = require("../models/courseModel");

async function listSentences(req, res) {
  try {
    const sentences = await getSentencesByCourseId(req.params.courseId);
    return res.status(200).json(sentences);
  } catch (err) {
    console.error("Lỗi listSentences:", err.message);
    return res.status(500).json({ message: "Không thể tải danh sách câu ví dụ." });
  }
}

async function createSentenceHandler(req, res) {
  try {
    const { courseId } = req.params;
    const course = await getCourseById(courseId);
    if (!course) return res.status(404).json({ message: "Khóa học không tồn tại." });

    const { zh, pinyin, vi, orderIndex } = req.body;
    if (!zh || !pinyin || !vi) {
      return res.status(400).json({ message: "Cần có câu tiếng Trung, pinyin và nghĩa tiếng Việt." });
    }

    const item = await createSentence({ courseId, zh, pinyin, vi, orderIndex });
    return res.status(201).json(item);
  } catch (err) {
    console.error("Lỗi createSentenceHandler:", err.message);
    return res.status(500).json({ message: "Không thể thêm câu ví dụ." });
  }
}

async function updateSentenceHandler(req, res) {
  try {
    const existing = await getSentenceById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Không tìm thấy câu ví dụ." });

    const { zh, pinyin, vi, orderIndex } = req.body;
    const updated = await updateSentence(req.params.id, { zh, pinyin, vi, orderIndex });
    return res.status(200).json(updated);
  } catch (err) {
    console.error("Lỗi updateSentenceHandler:", err.message);
    return res.status(500).json({ message: "Không thể cập nhật câu ví dụ." });
  }
}

async function deleteSentenceHandler(req, res) {
  try {
    const deleted = await deleteSentence(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy câu ví dụ." });
    return res.status(200).json({ message: "Đã xóa câu ví dụ.", id: deleted.id });
  } catch (err) {
    console.error("Lỗi deleteSentenceHandler:", err.message);
    return res.status(500).json({ message: "Không thể xóa câu ví dụ." });
  }
}

module.exports = {
  listSentences,
  createSentenceHandler,
  updateSentenceHandler,
  deleteSentenceHandler,
};
