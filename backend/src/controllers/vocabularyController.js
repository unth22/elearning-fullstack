const {
  getVocabularyByCourseId,
  getVocabularyById,
  createVocabulary,
  updateVocabulary,
  deleteVocabulary,
} = require("../models/vocabularyModel");
const { getCourseById } = require("../models/courseModel");

async function listVocabulary(req, res) {
  try {
    const vocabulary = await getVocabularyByCourseId(req.params.courseId);
    return res.status(200).json(vocabulary);
  } catch (err) {
    console.error("Lỗi listVocabulary:", err.message);
    return res.status(500).json({ message: "Không thể tải danh sách từ vựng." });
  }
}

async function createVocabularyHandler(req, res) {
  try {
    const { courseId } = req.params;
    const course = await getCourseById(courseId);
    if (!course) return res.status(404).json({ message: "Khóa học không tồn tại." });

    const { zh, pinyin, vi, en, tags, orderIndex } = req.body;
    if (!zh || !pinyin || !vi) {
      return res.status(400).json({ message: "Cần có chữ Hán, pinyin và nghĩa tiếng Việt." });
    }

    const item = await createVocabulary({ courseId, zh, pinyin, vi, en, tags, orderIndex });
    return res.status(201).json(item);
  } catch (err) {
    console.error("Lỗi createVocabularyHandler:", err.message);
    return res.status(500).json({ message: "Không thể thêm từ vựng." });
  }
}

async function updateVocabularyHandler(req, res) {
  try {
    const existing = await getVocabularyById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Không tìm thấy từ vựng." });

    const { zh, pinyin, vi, en, tags, orderIndex } = req.body;
    const updated = await updateVocabulary(req.params.id, { zh, pinyin, vi, en, tags, orderIndex });
    return res.status(200).json(updated);
  } catch (err) {
    console.error("Lỗi updateVocabularyHandler:", err.message);
    return res.status(500).json({ message: "Không thể cập nhật từ vựng." });
  }
}

async function deleteVocabularyHandler(req, res) {
  try {
    const deleted = await deleteVocabulary(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy từ vựng." });
    return res.status(200).json({ message: "Đã xóa từ vựng.", id: deleted.id });
  } catch (err) {
    console.error("Lỗi deleteVocabularyHandler:", err.message);
    return res.status(500).json({ message: "Không thể xóa từ vựng." });
  }
}

module.exports = {
  listVocabulary,
  createVocabularyHandler,
  updateVocabularyHandler,
  deleteVocabularyHandler,
};
