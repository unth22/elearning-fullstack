const {
  getGrammarByCourseId,
  getGrammarById,
  createGrammar,
  updateGrammar,
  deleteGrammar,
} = require("../models/grammarModel");
const { getCourseById } = require("../models/courseModel");

async function listGrammar(req, res) {
  try {
    const grammar = await getGrammarByCourseId(req.params.courseId);
    return res.status(200).json(grammar);
  } catch (err) {
    console.error("Lỗi listGrammar:", err.message);
    return res.status(500).json({ message: "Không thể tải danh sách ngữ pháp." });
  }
}

async function createGrammarHandler(req, res) {
  try {
    const { courseId } = req.params;
    const course = await getCourseById(courseId);
    if (!course) return res.status(404).json({ message: "Khóa học không tồn tại." });

    const { pattern, exampleZh, exampleVi, orderIndex } = req.body;
    if (!pattern || !exampleZh || !exampleVi) {
      return res.status(400).json({ message: "Cần có mẫu câu, ví dụ tiếng Trung và nghĩa tiếng Việt." });
    }

    const item = await createGrammar({ courseId, pattern, exampleZh, exampleVi, orderIndex });
    return res.status(201).json(item);
  } catch (err) {
    console.error("Lỗi createGrammarHandler:", err.message);
    return res.status(500).json({ message: "Không thể thêm ngữ pháp." });
  }
}

async function updateGrammarHandler(req, res) {
  try {
    const existing = await getGrammarById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Không tìm thấy ngữ pháp." });

    const { pattern, exampleZh, exampleVi, orderIndex } = req.body;
    const updated = await updateGrammar(req.params.id, { pattern, exampleZh, exampleVi, orderIndex });
    return res.status(200).json(updated);
  } catch (err) {
    console.error("Lỗi updateGrammarHandler:", err.message);
    return res.status(500).json({ message: "Không thể cập nhật ngữ pháp." });
  }
}

async function deleteGrammarHandler(req, res) {
  try {
    const deleted = await deleteGrammar(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy ngữ pháp." });
    return res.status(200).json({ message: "Đã xóa ngữ pháp.", id: deleted.id });
  } catch (err) {
    console.error("Lỗi deleteGrammarHandler:", err.message);
    return res.status(500).json({ message: "Không thể xóa ngữ pháp." });
  }
}

module.exports = {
  listGrammar,
  createGrammarHandler,
  updateGrammarHandler,
  deleteGrammarHandler,
};
